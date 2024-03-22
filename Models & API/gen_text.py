
from flask import Flask, request, render_template,jsonify
from flask_cors import CORS
from io import BytesIO
from PIL import Image

import tensorflow as tf
from CNN_encoder import CNN_Encoder
from gpt2.gpt2_model import TFGPT2LMHeadModel
from tokenizer_wrapper import TokenizerWrapper
import numpy as np
from skimage.transform import resize
import re
import os
import pandas as pd
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
from nltk import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import pickle







app = Flask(__name__)
CORS(app)


tokenizer_wrapper = None
encoder = None
decoder = None
ckpt_manager = None
csv_data = None
csv_path = 'all_data.csv'
embeddings_file = 'saved_embeddings.pickle'
csv_data = pd.read_csv(csv_path)

def initialize_models():
    embeddings_file = 'saved_embeddings.pickle'
    global tokenizer_wrapper, encoder, decoder, ckpt_manager

    print("Initializing models...")
    if(encoder == None):
        tokenizer_wrapper = TokenizerWrapper(200, 1001)
        encoder = CNN_Encoder('pretrained_visual_model', 'fine_tuned_chexnet', 2,
                            encoder_layers=[0.4], tags_threshold=-1, num_tags=105)
        decoder = TFGPT2LMHeadModel.from_pretrained('distilgpt2', from_pt=True, resume_download=True)
        optimizer = tf.keras.optimizers.Adam()
        ckpt = tf.train.Checkpoint(encoder=encoder, decoder=decoder, optimizer=optimizer)
        ckpt_manager = tf.train.CheckpointManager(ckpt, './ckpts/CDGPT2/', max_to_keep=1)

        if ckpt_manager.latest_checkpoint:
            start_epoch = int(ckpt_manager.latest_checkpoint.split('-')[-1])
            ckpt.restore(ckpt_manager.latest_checkpoint)
            print("Restored from checkpoint: {}".format(ckpt_manager.latest_checkpoint))
        csv_path = 'all_data.csv'
        csv_data = pd.read_csv(csv_path)

def calculate_bleu_scores(actual, predicted, n):
    actual_tokens = word_tokenize(actual)
    predicted_tokens = word_tokenize(predicted)
    smoothie = SmoothingFunction().method1  # Choose a smoothing function

    return sentence_bleu([actual_tokens], predicted_tokens, weights=(1.0 / n, ) * n, smoothing_function=smoothie)

def calculate_average_bleu_scores(actual,predicted):
    bleu_1_scores = []
    bleu_2_scores = []
    bleu_3_scores = []
    bleu_4_scores = []

    bleu_2 = calculate_bleu_scores(actual, predicted, 2)
    bleu_3 = calculate_bleu_scores(actual, predicted, 3)
    bleu_1 = calculate_bleu_scores(actual, predicted, 1)
    bleu_4 = calculate_bleu_scores(actual, predicted, 4)


    return bleu_1, bleu_2, bleu_3, bleu_4

def get_sentence_embeddings(sentence, word_embeddings):
    words = sentence.lower().split()  # Assuming the words are lowercase in your word_embedding dictionary

    # Filter out words that are not in the word_embedding dictionary
    valid_words = [word for word in words if word in word_embeddings]

    if not valid_words:
        # If no valid words are found in the word_embedding dictionary, return a zero vector
        return np.zeros(len(word_embeddings[next(iter(word_embeddings))]))

    # Calculate the mean of word embeddings for the valid words
    embedding_matrix = [word_embeddings[word] for word in valid_words]
    sentence_embedding = np.mean(embedding_matrix, axis=0)

    return sentence_embedding

def load_word_embeddings(embeddings_file):
    with open(embeddings_file, 'rb') as f:
        word_embeddings = pickle.load(f)
    return word_embeddings

def calculate_cosine_similarity_from_csv(actual,predicted,embeddings_file):
    word_embeddings = load_word_embeddings(embeddings_file)


    ground_truth_embedding = get_sentence_embeddings(actual, word_embeddings)
    predicted_embedding = get_sentence_embeddings(predicted, word_embeddings)

    # Reshape the vectors to 2D arrays
    ground_truth_embedding = ground_truth_embedding.reshape(1, -1)

    predicted_embedding = predicted_embedding.reshape(1, -1)
    
    # Calculate cosine similarity between the reshaped vectors
    similarity_score = cosine_similarity(ground_truth_embedding, predicted_embedding)

    return similarity_score

# Initialize models when the server starts
initialize_models()







@app.route('/')
def index():
    return "<h1>Hello World</h1>"

@app.route('/upload', methods=['POST'])
def upload():
    global encoder,decoder,optimizer,ckpt,ckpt_manager
    if 'image' in request.files:
        image_file = request.files['image']
        image_data = image_file.read()
        filename = request.form.get('filename')  # Get the filename from the form data

        # Open the image using Pillow
        image = Image.open(BytesIO(image_data))

        image_array = np.asarray(image.convert("RGB"))
        image_array = image_array / 255.
        image_array = resize(image_array, (224,224))
        images = np.asarray([image_array])

        # Process the image (you can perform additional processing here)


        visual_features, tags_embeddings = encoder(images)
        dec_input = tf.expand_dims(tokenizer_wrapper.GPT2_encode("startseq", pad=False), 0)
        num_beams = 7
        visual_features = tf.tile(visual_features, [num_beams, 1, 1])
        tags_embeddings = tf.tile(tags_embeddings, [num_beams, 1, 1])




        tokens = decoder.generate(dec_input, max_length=200, num_beams=num_beams, min_length=3,
                                    eos_token_ids=tokenizer_wrapper.GPT2_eos_token_id(), no_repeat_ngram_size=0,
                                    visual_features=visual_features,
                                    tags_embedding=tags_embeddings, do_sample=False, early_stopping=True)
        sentence = tokenizer_wrapper.GPT2_decode(tokens[0])
        sentence = tokenizer_wrapper.filter_special_words(sentence)



        matching_row = csv_data[csv_data['Image_Index'] == filename]
        caption_value=""
        b1=-1
        b2=-1
        b3=-1
        b4=-1
        similarity_score=-1

        if not matching_row.empty:
                # Filename found, return the corresponding 'Caption' value
                caption_value = matching_row['Caption'].values[0]
                similarity_score = calculate_cosine_similarity_from_csv(caption_value,sentence, embeddings_file)[0][0]
                b1,b2,b3,b4 = calculate_average_bleu_scores(caption_value,sentence)

                response_data = {
                    'Predicted': sentence,
                    'Filename': filename,
                    'Caption': caption_value,
                    'b1':b1,
                    'b2':b2,
                    'b3':b3,
                    'b4':b4,
                    'cos':similarity_score,
                }
                return jsonify(response_data)





        # Return the image along with its size as JSON
        response_data = {
            'Predicted': sentence,
            'Filename' : filename,
        }

        return jsonify(response_data)
    else:
        return 'No file provided.'

if __name__ == '__main__':
    app.run(debug=True)

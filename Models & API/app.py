from flask import Flask, request, jsonify
import os
import numpy as np
import torch
import torch.nn as nn
import torch.backends.cudnn as cudnn
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from read_data import ChestXrayDataSet
from sklearn.metrics import roc_auc_score
from PIL import Image
from flask import Flask, request, jsonify, send_file
import os
import PIL
import numpy as np
import torch
import torch.nn.functional as F
import torchvision.models as models
from torchvision import transforms
from torchvision.utils import make_grid, save_image
from gradcam.utils import visualize_cam
from gradcam import GradCAM, GradCAMpp
import matplotlib.pyplot as plt



app = Flask(__name__)

CKPT_PATH = 'your.pth.tar'
N_CLASSES = 14
CLASS_NAMES = [ 'Atelectasis', 'Cardiomegaly', 'Effusion', 'Infiltration', 'Mass', 'Nodule', 'Pneumonia',
                'Pneumothorax', 'Consolidation', 'Edema', 'Emphysema', 'Fibrosis', 'Pleural_Thickening', 'Hernia']

class DenseNet121(nn.Module):
    """Model modified.

    The architecture of our model is the same as standard DenseNet121
    except the classifier layer which has an additional sigmoid function.

    """
    def __init__(self, out_size):
        super(DenseNet121, self).__init__()
        self.densenet121 = torchvision.models.densenet121(pretrained=True)
        num_ftrs = self.densenet121.classifier.in_features
        self.densenet121.classifier = nn.Sequential(
            nn.Linear(num_ftrs, out_size),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.densenet121(x)
        return x

# Load the model
cudnn.benchmark = True
model = DenseNet121(N_CLASSES).cuda()
model = torch.nn.DataParallel(model).cuda()

if os.path.isfile(CKPT_PATH):
        print("=> loading checkpoint")
        checkpoint = torch.load(CKPT_PATH)
        model.load_state_dict(checkpoint['model_state_dict'], strict=False )
        print("=> loaded checkpoint")
else:
        print("=> no checkpoint found")

# Define the transformations for preprocessing
normalize = transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
preprocess = transforms.Compose([
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    normalize
])
model.eval()

# Define a function to get predictions
def getPrediction(image_path):
    image = Image.open(image_path).convert('RGB')
    input_tensor = preprocess(image)
    input_tensor = input_tensor.unsqueeze(0)  # Add batch dimension
    with torch.no_grad():
        output = model(input_tensor)  # Assuming you want to use CPU for inference
    return output.squeeze().tolist()  # Convert tensor to list and squeeze to remove batch dimension

# Define the route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    # Save the uploaded image temporarily
    image_path = 'temp_image.png'
    image_file.save(image_path)

    # Get predictions
    probabilities = getPrediction(image_path)

    # Map class names to probabilities
    result = {CLASS_NAMES[i]: probabilities[i] for i in range(len(probabilities))}

    # Remove the temporary image file
    os.remove(image_path)

    # Create bar graph
    plt.figure(figsize=(10, 6))
    plt.bar(result.keys(), result.values(), color='blue')
    plt.xlabel('Class')
    plt.ylabel('Probability')
    plt.title('Predicted probabilities')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    # Save the plot to a temporary file
    plot_path = 'temp_plot.png'
    plt.savefig(plot_path)

    # Return the plot as a file
    return send_file(plot_path, mimetype='image/png'), 200


@app.route('/process_image', methods=['POST'])
def process_image():
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    if 'image' not in request.files:
        return jsonify({'error': 'No image sent'}), 400

    img = request.files['image']
    pil_img = PIL.Image.open(img)

    # Convert the image to RGB format and resize it
    pil_img = pil_img.convert("RGB")
    pil_img = pil_img.resize((224, 224))

    torch_img = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])(pil_img).to(device)
    torch_img = torch.unsqueeze(torch_img, 0)
    normed_torch_img = transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])(torch_img)

    densenet = models.densenet161(pretrained=True)
    densenet.load_state_dict(torch.load("your.pth.tar"), strict=False)

    configs = [
        dict(model_type='densenet', arch=densenet, layer_name='features_norm5'),
    ]

    for config in configs:
        config['arch'].to(device).eval()

    cams = [
        [cls.from_config(**config) for cls in (GradCAM, GradCAMpp)]
        for config in configs
    ]

    images = []
    for gradcam, gradcam_pp in cams:
        mask, _ = gradcam(normed_torch_img)
        heatmap, result = visualize_cam(mask, torch_img)

        mask_pp, _ = gradcam_pp(normed_torch_img)
        heatmap_pp, result_pp = visualize_cam(mask_pp, torch_img)

        # Remove the batch dimension for visualization tensors
        heatmap = heatmap.squeeze(0)
        result = result.squeeze(0)
        heatmap_pp = heatmap_pp.squeeze(0)
        result_pp = result_pp.squeeze(0)

        # Remove the batch dimension for input image tensor
        torch_img_cpu = torch_img.cpu().squeeze(0)

        images.extend([torch_img_cpu, heatmap, heatmap_pp, result, result_pp])

    grid_image = make_grid(images[3:], nrow=5)
    save_image(grid_image, 'grid_image.png')

    return send_file('grid_image.png', mimetype='image/png')





























if __name__ == '__main__':
    app.run(debug=True)
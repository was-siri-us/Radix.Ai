const mongoose = require('mongoose')

const Image = new mongoose.Schema(
	{
		username: { type: String, required: true },
        img: { type: String, required: true },
        prediction: { type: String, required: true },
        truth: { type: String, required: true },
	},
	{ collection: 'image' }
)

const model = mongoose.model('image', Image)

module.exports = model
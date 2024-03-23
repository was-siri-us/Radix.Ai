// Express server
const dotenv = require('dotenv');
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./models/user.model')
const Image = require('./models/image.model')

const app = express()
app.use(cors());
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
app.use(express.json())

dotenv.config('./.env');

const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        res.json({
            status: 'user created'
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: 'Error', error: 'duplicate-email'
        })
    }

})

app.post('/api/login', async (req, res) => {
    console.log("login called")
    const user = await User.findOne({
        email: req.body.email,
    })

    if (!user) {
        return { status: 'error', error: 'Invalid login' }
    }

    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    )

    if (isPasswordValid) {
        const token = jwt.sign(
            {
                status: true,
                name: user.name,
                email: user.email,
            },
            secretKey
        )

        return res.json({ status: true, user: token })
    } else {
        return res.json({ status: false, user: 'error' })
    }

})


//express code for image upload
app.post('/api/uploadImage', (req, res) => {
    console.log("uploadImage called");
    const newImage = new Image({
        username: req.body.username,
        img: req.body.image,
        prediction: req.body.prediction,
        truth: req.body.selectedValue,
    });

    newImage
        .save()
        .then(image => {
            console.log('Image uploaded successfully');
            res.json({ status: 'success imgUp' });
        })
        .catch(err => {
            console.log('Error imgUp');
            res.status(500).json({ error: err.message });
        });
}
)

app.post('/api/fetchImage', async (req, res) => {
    console.log("fetchImage called")
    try {
        console.log(req.body.username)
        const images = await Image.find({ username: req.body.username });
        if (!images) {
            return res.status(404).json({ error: "No images found" });
        }
        res.status(200).json({ images });
    } catch (err) {
        console.log(errorMonitor);
        res.status(500).json({ error: "Server Error" });
    }
})

app.listen(port, () => {
    console.log(`app listening at:${port}`)
})

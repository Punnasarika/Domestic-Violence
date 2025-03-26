const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { throwDeprecation } = require('process');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://sarika:2A62kbwvPqlSk2g1@practical.rv8hw.mongodb.net/'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Schema and Model
const ReportSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    nationality: String,
    contact: String,
    incidentDate: String,
    incidentLocation: String,
    violenceType: String,
    incidentDescription: String,
    witnesses: String,
    perpetratorname:String,
    relationship:String,
    perpetratorage:String,
    PGender:String,
    violencebefore:String,
    previousincident:String,
    reported:String,
    actiontaken:String,
    Weapons:String,
    threat:String,
    afraid:String,
    children:String,
    safeplace:String,
    medical:String,
    housing:String,
    legal:String,
    Counselor:String,
    othersupport:String,
    Additionalinfo:String
});

const Report = mongoose.model('Report', ReportSchema);

// API route to handle form submission
app.post('/submit-report', async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.status(200).send({ message: 'Report submitted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to submit report', details: err });
    }
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 },
    replies: [{
        user: String,
        content: String,
        date: { type: Date, default: Date.now }
    }]
});

const Post = mongoose.model('Post', postSchema);

// Routes

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new post
app.post('/posts', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add a reply to a post
app.post('/posts/:id/reply', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Reply content is required" });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.replies.push({ content }); // Only add the reply content
        await post.save();

        res.status(200).json({ message: "Reply added successfully", post });
    } catch (err) {
        res.status(500).json({ message: "Error adding reply", error: err.message });
    }
});


// Vote a post
app.post('/posts/:id/vote', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (req.body.vote === 'up') {
            post.votes += 1;
        } else if (req.body.vote === 'down') {
            post.votes -= 1;
        }
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

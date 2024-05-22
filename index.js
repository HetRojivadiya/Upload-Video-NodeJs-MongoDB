const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());


// Set up MongoDB connection
mongoose.connect('mongodb+srv://hetrojivadiya999:hetrojivadiya@het.ioacmg7.mongodb.net/Videos?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define video schema and model
const videoSchema = new mongoose.Schema({
  title: String,
  video: Buffer,
});

const Video = mongoose.model('Video', videoSchema);

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Express route for video upload
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const newVideo = new Video({
      title: req.body.title,
      video: req.file.buffer,
    });

    await newVideo.save();
    res.status(201).send('Video uploaded successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Express route for retrieving videos
// Add this route to fetch videos
app.get('/videos', async (req, res) => {
    try {
      const videos = await Video.find({}, 'title'); // Fetch only title for simplicity
      res.json(videos);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Add this route to serve video content based on video title
  app.get('/video/:title', async (req, res) => {
    try {
      const video = await Video.findOne({ title: req.params.title });
      
      if (!video) {
        return res.status(404).send('Video not found');
      }
  
      res.setHeader('Content-Type', 'video/mp4');
      res.send(video.video);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

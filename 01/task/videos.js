const express = require('express');
const { MongoClient } = require('mongodb');


const app = express();
const port = 8000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "youtube";

// Middleware
app.use(express.json());

let db, videos;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        videos = db.collection("videos");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}


// Initialize Database
initializeDatabase();

// Routes

// GET: List all videos
app.get('/videos', async (req, res) => {
    try {
        const allvideos = await videos.find().toArray();
        res.status(200).json(allvideos);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});


//GET :List or all by video id
app.get('/videos/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const video = await videos.findOne({ "videoId": videoId });
        res.status(200).json(video);
    } catch (err) {
        res.status(404).send("video not found");
    }
}
)

// POST: Add a new user
app.post('/videos', async (req, res) => {
    try {
        // console.log();
        const newvideos = req.body;
        const result = await videos.insertOne(newvideos);
        res.status(201).send(`courses added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding videos: " + err.message);
    }
});

//PATCH /videos/:userId: Update user profile picture
app.patch('/videos/:videoId/likes', async (req, res) => {
    try {
        const videoId = req.params.videoId;  // Get videoId from the URL parameters

        // Find the video by videoId and increment its like count
        const result = await videos.updateOne(
            { videoId: videoId },  // Find video by videoId
            { $inc: { likes: 1 } }  // Increment the 'likes' field by 1
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send("Video not found or no changes made");
        }

        res.status(200).send("Like count for video with videoId: ${videoId} updated successfully");
    } catch (err) {
        res.status(500).send("Error updating like count for video: " + err.message);
    }
});





// DELETE /videos/:videoId: Delete a video
app.delete('/videos/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const result = await videos.deleteOne({ "videoId": videoId });
        res.status(200).send(`Video deleted with ID: ${result.deletedCount}`);
    } catch (err) {
        res.status(404).send("Video not found");
    }
}
)


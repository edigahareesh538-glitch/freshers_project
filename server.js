require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Schema Definition
const participantSchema = new mongoose.Schema({
    name: String,
    roll: String,
    branch: String,
    phone: String,
    type: String
});

const Participant = mongoose.model("Participant", participantSchema);

// --- API Routes ---

// Default Route
app.get("/", (req, res) => {
    res.send("Server is running successfully");
});

// Post API (Save data)
app.post("/register", async (req, res) => {
    try {
        const newParticipant = new Participant(req.body);
        await newParticipant.save();
        res.json({ message: "Registration Successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get API (Fetch all data)
app.get("/participants", async (req, res) => {
    try {
        const participants = await Participant.find();
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search user by Roll Number
app.get("/participants/roll/:roll", async (req, res) => {
    try {
        const roll = req.params.roll.trim();
        const student = await Participant.findOne({ roll: roll });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete specific user
app.delete("/participants/:id", async (req, res) => {
    try {
        const deletedUser = await Participant.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user details
app.put("/participants/:id", async (req, res) => {
    try {
        const updatedUser = await Participant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Count participants
app.get("/participants/count", async (req, res) => {
    try {
        const total = await Participant.countDocuments();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete ALL data
app.delete("/participants", async (req, res) => {
    try {
        await Participant.deleteMany({});
        res.json({ message: "All participants deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Server Startup ---

// FIX 1: Use a constant and fix the typo (comma to dot)
const PORT = process.env.PORT || 5000;

// FIX 2: Listen on 0.0.0.0 for Render deployment
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});


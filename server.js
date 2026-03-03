require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");
const { message } = require("statuses");
const app = express();//first you create app
app.use(cors());//then use middleware without this the browser will fail to connect one port to another port
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
//creating a model
//schema 
const participantSchema = new mongoose.Schema({
    name: String,
    roll: String,
    branch: String,
    phone: String,
    type: String
});

const Participant = mongoose.model("Participant", participantSchema);
//post API (save data)
app.post("/register", async (req, res) => {
    const newParticipant = new Participant(req.body);
    await newParticipant.save();
    res.json({ message: "Registration Successful" });
});

// GET API (Fetch all data)
app.get("/",(req,res)=>{
    res.send("server is running successfully")
})
app.get("/participants", async (req, res) => {
    const participants = await Participant.find();
    res.json(participants);
})

//delete user
app.get("/participants/roll/:roll", async(req,res)=>{
        try{
            const roll=req.params.roll.trim();
            const student=await Participant.findOne({roll:roll});
            if(!student){
                return res.status(404).json({message:"student not found"});
            }
            res.json(student)
        }catch(error){
            res.status(500).json({error: error.message});
        }   
    });

//it is used for delete participator in database
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
//update the user details
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
//to count the how many nmembers in table
app.get("/participants/count", async (req, res) => {
    try {
        const total = await Participant.countDocuments();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//delete all data in table
app.delete("/participants", async (req, res) => {
    try {
        await Participant.deleteMany({});
        res.json({ message: "All participants deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
console.log(process.env.MONGO_URI);

app.listen(5000,"0.0.0.0", () => {
    console.log("Server running on port 5000");
});
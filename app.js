// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require("nodemailer");
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
// Parse JSON bodies
app.use(express.json());
mongoose.connect(process.env.DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

const userDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  hobbies: String, 
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, 
    secure: process.env.SECURE == 'true', 
    auth: {
      user: process.env.USER, 
      pass: prcocess.env.PASS
    },
  });
  
// Send email function
async function sendEmail(recipient, emailBody) {
    try {
        await transporter.sendMail({
            from: "your-email", // Replace with your email address
            to: recipient,
            subject: "Test Email",
            text: emailBody, // Use the provided email body
        });
        console.log("Email sent successfully to:", recipient);
        return true; // Return true to indicate successful email sending
    } catch (error) {
        console.error("Error sending email:", error);
        return false; // Return false to indicate email sending failure
    }
}

app.post("/send-email", async (req, res) => {
    try {
      const { data, recipient, emailBody: body } = req.body;
  
      // Remove emailBody from data since it's not needed in the database
      const { emailBody, ...emailData } = req.body;
  
      await sendEmail(recipient, body); // Use 'body' for sending email
  
      res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  
  


const UserData = mongoose.model('UserData', userDataSchema);

app.post('/submit', async (req, res) => {
  const { name, email, phoneNumber, hobbies } = req.body;

  try {
    const newUser = new UserData({
      name,
      email,
      phoneNumber,
      hobbies,
    });

    await newUser.save();

    res.status(201).json({ message: 'User data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user data
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, hobbies } = req.body;

  try {
    const updatedUser = await UserData.findByIdAndUpdate(id, {
      name,
      email,
      phoneNumber,
      hobbies,
    });

    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user data
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await UserData.findByIdAndDelete(id); 
    
    res.status(200).json({ message: 'User data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all user data
// Fetch all user data
app.get('/users', async (req, res) => {
    try {
      const users = await UserData.find().select('-__v'); // Exclude '__v' field
      const transformedUsers = users.map(user => ({ ...user.toObject(), id: user._id }));
      res.status(200).json(transformedUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//Dh6HhGkHSsMafZJd

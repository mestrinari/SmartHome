const mongoose = require('mongoose');
async function connectToDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_CONNECT);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  }


  // Call the connection function
  connectToDatabase();
    
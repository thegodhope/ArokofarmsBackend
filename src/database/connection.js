const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error("MONGODB_URI is missing in .env");

    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("Database Connection Failed", error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
const mongoose = require("mongoose");

let isConnected = false;

async function ConnectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to DB successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

module.exports = ConnectDB;
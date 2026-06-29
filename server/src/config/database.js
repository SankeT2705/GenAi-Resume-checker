const mongoose = require("mongoose");

let isConnected = false;

async function ConnectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined on serverless runtime");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to DB successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

module.exports = ConnectDB;
const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isAtlasConfigured = uri && uri.trim() !== '' && !uri.includes('<username>');

  if (isAtlasConfigured) {
    try {
      console.log('🔄 Connecting to MongoDB Atlas cluster...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`⚠️  MongoDB Atlas connection failed: ${error.message}`);
      console.log('🔄 Attempting fallback to high-performance local/in-memory database...');
    }
  } else {
    console.log('ℹ️  No MONGODB_URI configured in .env (or placeholder detected).');
    console.log('🔄 Starting built-in MongoDB instance for instant seamless development...');
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create();
    const memoryUri = memoryServerInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ MongoDB In-Memory Database Connected: ${conn.connection.host}`);
    console.log('💡 Note: To persist to MongoDB Atlas, add your Atlas connection string to server/.env');
  } catch (memError) {
    console.error('❌ Failed to start in-memory database:', memError.message);
    throw memError;
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
};

module.exports = { connectDB, closeDB };

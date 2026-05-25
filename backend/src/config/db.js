const dns = require('dns');

// Configure public DNS servers if default loopback is active, to resolve MongoDB SRV records.
try {
  const servers = dns.getServers();
  if (servers.length === 0 || servers.includes('127.0.0.1') || servers.includes('::1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch (e) {
  // Ignore DNS config errors
}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

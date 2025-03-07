import mongoose from 'mongoose';

declare global {
  var mongoose: { conn: any; promise: any } | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(process.env.MONGODB_URI!);
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default connectDB; 
import mongoose from 'mongoose';

type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  /* eslint-disable no-var */
  var mongoose: MongooseConnection | undefined;
  /* eslint-enable no-var */
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(process.env.MONGODB_URI!);
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default connectDB; 
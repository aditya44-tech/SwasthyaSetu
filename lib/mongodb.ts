import mongoose from 'mongoose';
import dns from 'dns';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    // Force Google DNS — fixes networks where the default DNS can't resolve .mongodb.net
    try {
        dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    } catch {
        // dns.setServers may fail if already set, ignore
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log('✅ MongoDB connected successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('❌ MongoDB connection failed:', e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;

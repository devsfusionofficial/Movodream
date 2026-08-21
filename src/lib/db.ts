import mongoose from 'mongoose'

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Cached across dev HMR reloads so each edit doesn't open a new connection.
const globalForMongoose = globalThis as unknown as { mongooseCache?: MongooseCache }

const cache: MongooseCache = globalForMongoose.mongooseCache ?? { conn: null, promise: null }
globalForMongoose.mongooseCache = cache

export async function connectDB() {
  // Instant 0ms check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  if (cache.conn) return cache.conn

  if (!cache.promise) {
    const DATABASE_URI = process.env.DATABASE_URI
    if (!DATABASE_URI) {
      throw new Error('Missing DATABASE_URI environment variable')
    }
    cache.promise = mongoose.connect(DATABASE_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  }

  cache.conn = await cache.promise
  return cache.conn
}

/**
 * Hands the native `Db` handle to Better Auth's mongodb adapter, so the app
 * has exactly one MongoDB connection shared between Mongoose and Better Auth.
 */
export async function getNativeDb() {
  const conn = await connectDB()
  return conn.connection.getClient().db()
}

export async function getNativeClient() {
  const conn = await connectDB()
  return conn.connection.getClient()
}

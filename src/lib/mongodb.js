import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // We don't throw immediately to prevent build failures on Vercel.
  // We'll throw only if the database is actually accessed.
  clientPromise = Promise.resolve(null);
}

export default clientPromise;

export async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  const client = await clientPromise;
  return client.db("e-commerce");
}

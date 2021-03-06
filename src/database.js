import MongoClient from 'mongodb';

const uri = process.env.DATABASE;
let Client;

export async function initialise() {
  if (!Client) {
    Client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }
}

export function insertPosts(posts) {
  if (posts.length === 0) {
    return;
  }
  const db = Client.db('app');
  const collection = db.collection('posts');
  collection.insertMany(posts);
}

export function insertNotices(notices) {
  if (notices.length === 0) {
    return;
  }
  const db = Client.db('app');
  const collection = db.collection('notices');
  collection.insertMany(notices);
}

export function insertPlaces(places) {
  if (places.length === 0) {
    return;
  }
  const db = Client.db('app');
  const collection = db.collection('places');
  collection.insertMany(places);
}

export async function readNotices(limit = 0) {
  const db = Client.db('app');
  const collection = db.collection('notices');
  const cursor = collection.find({}).sort({ created_time: -1 }).limit(limit);
  const result = await cursor.toArray().then((data) => data);
  return result;
}

export async function getLatest() {
  const db = Client.db('app');
  let collection = db.collection('notices');
  const cursor1 = collection.find({}).sort({ created_time: -1 });
  collection = db.collection('places');
  const cursor2 = collection.find({}).sort({ created_time: -1 });
  const result1 = await cursor1.next();
  const result2 = await cursor2.next();
  if (result1 && result2 && result1.created_time > result2.created_time) {
    return result1;
  }
  return result2 || result1;
}

export async function readAllPlaces() {
  const db = Client.db('app');
  const collection = db.collection('places');
  const cursor = collection.find({}).sort({ created_time: -1 });
  const result = await cursor.toArray().then((data) => data);
  return result;
}

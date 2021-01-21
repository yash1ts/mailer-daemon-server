import MongoClient from 'mongodb';

const uri = `mongodb+srv://yash1ts:y12345678@cluster0.0nqvm.mongodb.net/app?retryWrites=true&w=majority`;

export function insertPosts(posts) {
    MongoClient.connect(uri, function (err, client) {
        if (err) {
            return console.dir(err);
        }
        const db = client.db("app");
        var collection = db.collection('posts');
        collection.insertMany(posts);
    });
}

export function insertPlaces(places) {
    MongoClient.connect(uri, function (err, client) {
        if (err) {
            return console.dir(err);
        }
        const db = client.db("app");
        var collection = db.collection('places');
        collection.insertMany(places);
    });
}

export async function readAllPosts() {
    const client = await MongoClient.connect(uri);
    const db = client.db("app");
    var collection = db.collection('places');
    var cursor = collection.find({});
    var result = await cursor.toArray().then(data => {
        return data;
    });
    return result;
}
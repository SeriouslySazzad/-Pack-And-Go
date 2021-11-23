const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekjpc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelPack');
        const packageCollection = database.collection('packages');
        const tourCollection = database.collection('tours');

        // Get Packages API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // Post Packages API
        app.post('/packages', async (req, res) => {
            const package = req.body;
            console.log('hit the post api', package);

            const result = await packageCollection.insertOne(package);
            res.json(result);
        })

        // Delete API
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packageCollection.deleteOne(query);
            console.log('deleting', result);
            res.json(result);
        })

        // Get Tours API
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Pack & Go Server');
});

app.listen(port, () => {
    console.log('Pack & Go server in running from', port);
})
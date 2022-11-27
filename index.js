const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://phone-bechi-user:3w6NcEGJAUodIjva@cluster0.bogje7w.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('phone-bechi').collection('categoriesCollection');
        const usersCollection = client.db('phone-bechi').collection('users');
        const productsCollection = client.db('phone-bechi').collection('products');
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            // TODO: make sure you do not enter duplicate user email
            // only insert users if the user doesn't exist in the database
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.userType === 'Seller' })
        })
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });
        app.get('/category/:category', async (req, res) => {
            const brand = req.params.category;
            const query = { category: brand }
            const products = await productsCollection.find(query).toArray();
            res.send(products)
        })
    }
    finally {

    }

}
run();
app.get('/', (req, res) => {
    res.send('Server running...')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
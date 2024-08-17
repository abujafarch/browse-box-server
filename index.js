const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello I am running. Please Stop')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f46fr3f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db('browseBox')
        const allProductsCollection = database.collection('allProducts')


        app.get('/all-products', async (req, res) => {

            const query = req.query
            console.log(query)
            const brand = query.brandName
            const category = query.categoryName
            const minPrice = parseInt(query.minPrice)
            const maxPrice = parseInt(query.maxPrice)
            const highLowPrice = query.highLowPrice === 'highLow' ? 1 : 0
            const newest = query.newest

            console.log(brand, category, minPrice, maxPrice, highLowPrice, newest)

            const result = await allProductsCollection.find().toArray()
            res.send(result)
        })

        app.get('/brand-category', async (req, res) => {
            const result = await allProductsCollection.aggregate([
                {
                    $group: { _id: null, brands: { $addToSet: "$brand" }, category: { $addToSet: "$category" } }
                },
                {
                    $project: { _id: 0, brands: 1, category: 1 }
                }

            ]).toArray()
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log("i am running on port: ", port)
})

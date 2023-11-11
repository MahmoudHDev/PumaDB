import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));


// in order to deal with page object smoothly.
app.use(bodyParser.urlencoded({extended: true}));

// in order to render the same view to different pages has an extension of .ejs
app.set('view engine', 'ejs');

// in order to use external resources from folder 'public'.
app.use('/public', express.static(path.join(__dirname, "public")));


// first get request to show the home page.
app.get('/', (req, res) => {

    res.render(__dirname + '/views/home.ejs');
});


// Database:

const uri = "mongodb+srv://mahmoudiosdev:OUOMswSmKVD5DyxH@cluster0.u73s4qh.mongodb.net/?retryWrites=true&w=majority";
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
        const database = client.db("Products");
        const items = database.collection("Items");

        // create a document
        const doc = { 
            name:" Pineapple pie",
            desc: 'a simple pie with Pineapple flavor and syrup'
        };
        const result = await items.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
// run().catch(console.dir);



// Enable the site to start listeining on the declared port
app.listen(port, () => {

    console.log('app started listening')
})

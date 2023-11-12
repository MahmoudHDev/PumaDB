import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { MongoClient, ServerApiVersion } from 'mongodb';
import { error } from 'console';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
var arrUsers = [];


// in order to deal with page object smoothly.
app.use(bodyParser.urlencoded({ extended: true }));

// in order to render the same view to different pages has an extension of .ejs
app.set('view engine', 'ejs');

// in order to use external resources from folder 'public'.
app.use('/public', express.static(path.join(__dirname, "public")));

// first get request to show the home page.
app.get('/', (req, res) => {

    res.render(__dirname + '/views/home.ejs');
});

app.post('/', async (req, res) => {
    try {
        // Use await to wait for fetchData to complete
        await fetchData();

        const email = req.body.email;
        const password = req.body.password;
        const singleUser = {
            userEmail: email,
            userPassword: password
        };

        // Save the single user if needed
        // save(singleUser);

        res.render('users-list.ejs', { userArrInEjs: arrUsers });
        console.log(arrUsers.length);
    } catch (error) {
        console.error("Error processing the request", error);
        res.status(500).send("Internal Server Error");
    }
});

// Database:

const uri = "mongodb+srv://mahmoudiosdev:4bG4UBPDH9GgahM0@cluster0.u73s4qh.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch(err => {
        console.error("Error connecting to the database", err);
    });

function save(UserData) {

    try {
        const database = client.db("Products");
        const items = database.collection("users");

        // create a document
        var doc = {
            email: UserData.userEmail,
            password: UserData.userPassword
        };

        var result = items.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch {
        console.log(error);
    }
}

async function fetchData() {
    // Get the database and collection on which to run the operation
    const database = client.db("Products");
    const users = database.collection("users");
    // Execute query
    const docs = await users.find().toArray();
    arrUsers.length = 0;
    for (var i = 0; i < docs.length; i++) {
        const emailDoc = docs[i].email;
        const passDoc = docs[i].password;
        arrUsers.push(emailDoc);
    }

    console.log(arrUsers.length);
    // Print the document returned by findOne()
    // console.log(docs);
}

// Enable the site to start listeining on the declared port
app.listen(port, () => {

    console.log('app started listening')
})

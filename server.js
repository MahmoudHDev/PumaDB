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


app.locals.delimiter = '?'
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


app.post('/', (req, res) => {

    fetchData() 
    const email = req.body.email;
    const password = req.body.password;
    var singleUser = {
        userEmail: email,
        userPassword: password
    }

    // save(singleUser);
    res.render('users-list.ejs', {userArrInEjs: arrUsers, delimiter: '?'})

   
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
    try {
        // Get the database and collection on which to run the operation
        const database = client.db("Products");
        const users = database.collection("users");
        // Query for a movie that has the title 'The Room'
        const query = { title: "The Room" };
        const options = {
            // Sort matched documents in descending order by rating
            sort: { "imdb.rating": -1 },
            // Include only the `title` and `imdb` fields in the returned document
            projection: { _id: 0, title: 1, imdb: 1 },
        };
        // Execute query
        const docs = await users.find().toArray();

        for (var i = 0; i < docs.length; i++) {
            const emailDoc = docs[i].email;
            const passDoc = docs[i].password;
            arrUsers.push(emailDoc);
            // console.log(`email is: ${emailDoc}, and the password: ${passDoc}`);
        }
        // Print the document returned by findOne()
        // console.log(docs);
    } finally {
        await client.close();
    }
}

// Enable the site to start listeining on the declared port
app.listen(port, () => {

    console.log('app started listening')
})

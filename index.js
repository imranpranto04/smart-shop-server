const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port =process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rimjj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('conn err', err);
  const productCollection = client.db("freshShopStore").collection("products");
  console.log('Database successful');
//   client.close();

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })

  })

  app.post('/addProduct', (req, res) =>{
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted Count',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
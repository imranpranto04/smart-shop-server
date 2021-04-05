const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');
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
  const orderCollection = client.db("freshShopStore").collection("orders");

  console.log('Database successful');
//   client.close();

// show products in ui
  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })

  })

  // single data with id
  app.get('/products:id',(req, res) =>{
    productCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })

  // add products for admin
  app.post('/addProduct', (req, res) =>{
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted Count',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  // orders
  app.post('/addOrder', (req, res) =>{
    const order = req.body;
    console.log('adding new product', order);
    orderCollection.insertOne(order)
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
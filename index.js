const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wp8tr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
  res.send('welcome to foodeli api')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db(process.env.DB_NAME).collection("foods");


  app.get('/foods', (req, res) => {
    foodCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from database ', items)
      })
  })



  app.post('/addFood', (req, res) => {
    const newFood = req.body;
    // console.log('adding new food: ', newFood);
    if (newFood.imageURL !== null) {
      foodCollection.insertOne(newFood)
        .then(result => {
          console.log('inserted count ', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
    }
    else {
      console.log('Uploaded fail')
    }
  })

  app.delete('/deleteFood/:id',(req, res)=>{
    const id = ObjectID(req.params.id);
    console.log('delete this ', id);
    foodCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
  })





});






app.listen(port, () => {
  console.log(`Example app listening port at http://localhost:${port}`)
})
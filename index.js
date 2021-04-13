const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ij0ac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('hello hello hello')
})


// Database connection
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointment");

  app.post('/addAppointment', (req, res) =>  {
      const appointment = req.body;
      appointmentCollection.insertOne(appointment)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })
});




app.listen(port)



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ij0ac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('hello hello hello')
})


// Database connection
client.connect(err => {
    console.log('database connected');
  const appointmentCollection = client.db("doctorsPortal").collection("appointment");
  const doctorsCollection = client.db("doctorsPortal").collection("doctors");

  app.post('/addAppointment', (req, res) =>  {
      const appointment = req.body;
      appointmentCollection.insertOne(appointment)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  });

  app.post('/appointmentByDate', (req, res) =>  {
    const date = req.body;
    const doctor  = req.body.email;
    doctorsCollection.find({date: date})
    .toArray((err, doctors) => {
        const filter = {date: date};
        if(doctors.length === 0){
            filter.email  =  email;
        }
        appointmentCollection.find(filter)
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

});

  app.post('/addDoctor', (req, res) => {
      const file = req.files.file;
      const name = req.body.name;
      const email = req.body.email;
      const filePath = `${__dirname}/doctors/${file.name}`;
      console.log(name, email, file);

      file.mv(filePath, err =>{
          if(err){
              console.log(err);
              return res.status(500)
          }
          const newImg = fs.readFileSync(filePath);
          const encImg = newImg.toString('base64');

          const image = {
              contentType: req.files.file.mimetype,
              size: req.files.file.size,
              img: Buffer(encImg, 'base64')
          };

          doctorsCollection.insertOne({name, email, image})
          .then(result => {
              fs.remove(filePath, err => {
                  if(err){ 
                      console.log(err);
                  }
                 res.send(result.insertedCount > 0)

              })
          })
        //   return res.send({name: file.name, path: `${file.name}`})
      })
  })


  app.post('/isDoctor', (req, res) =>  {
    const doctor  = req.body.email;
    doctorsCollection.find({email: doctor})
    .toArray((err, doctors) => {
        res.send(doctors.length > 0)
    })

});

});




app.listen(port)



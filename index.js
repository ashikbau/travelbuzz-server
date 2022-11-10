const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0avqkuj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next){
//   const authHeader = req.headers.authorization;

//   if(!authHeader){
//       return res.status(401).send({message: 'unauthorized access'});
//   }
//   const token = authHeader.split(' ')[1];

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//       if(err){
//           return res.status(403).send({message: 'Forbidden access'});
//       }
//       req.decoded = decoded;
//       next();
//   })
// }


async function run() {
  try {
      const serviceCollection = client.db('travelbuzz').collection('services');
      const reviewCollection = client.db('travelbuzz').collection('reviews');
      const addServiceCollection = client.db('travelbuzz').collection('addService');
      
      app.post('/jwt', (req, res) =>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d'})
        res.send({token})
    })  



       app.get('/services', async (req, res) => {
          const query = {}
          const cursor = serviceCollection.find(query).limit(3);
          const services = await cursor.toArray();
          res.send(services);
      });
      app.get('/servicess', async (req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
  });

  // Add service

  
  app.get('/addservice', async (req, res) => {
    const query = {};
    const cursor = addServiceCollection.find(query);
    const addservices = await cursor.toArray();
    res.send(addservices);
});

  app.post('/addservice', async (req, res) => {
    const service = req.body;
    console.log(service);
    const result = await addServiceCollection.insertOne(service)
    res.send(result);
});
  
  // app.get('/services', async (req, res) => {
  //   let query = {}
  //   if (req.query.email) {
  //     query = {
  //         email: req.query.email
  //     }
  // }
  //   const cursor = serviceCollection.find(query);
  //   const reviews = await cursor.toArray();
  //   res.send(reviews);
  // });


// review api

app.get('/reviews',  async (req, res) => {
  
  // const decoded = req.decoded;
            
  // if(decoded.email !== req.query.email){
  //     res.status(403).send({message: 'unauthorized access'})
  // }
  let query = {}
  if (req.query.email) {
    query = {
        email: req.query.email
    }
   
}
  const cursor = reviewCollection.find(query);
  const reviews = await cursor.toArray();
  res.send(reviews);
});



app.get('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  let query={ ids:id}
  // console.log(query)

  const cursor = reviewCollection.find(query);
  const reviews = await cursor.toArray();
  
 
  res.send(reviews);
});




app.get('/reviews', async (req, res) => {


  try {
      let query = {}
      if (req.query._id) {
          query = {
              _id: ObjectId(req.query._id)
          }

      }
      console.log(query)


      const cursor = reviewCollection.find(query)
      const currentReview = await cursor.toArray()


      res.send(
       
           currentReview

      )

  }
  catch (error) {
      res.send({
         
          error: error.message,
      });

  }



})







  app.post('/reviews', async (req, res) => {
    const reviews = req.body;
    const result = await reviewCollection.insertOne(reviews);
    res.send(result);
});


app.post('/review', async(req,res)=>{
  
  
    const query = { _id: ObjectId(req.body.id) };
      const review = await reviewCollection.findOne(query);
     
      res.send(review);

})


// app.patch('/reviews/:id',  async (req, res) => {
//   const id = req.params.id;
//   const status = req.body.status
//   const query = { _id: ObjectId(id) }
//   const updatedDoc = {
//       $set:{
//           status: status
//       }
//   }
//   const result = await reviewCollection.updateOne(query, updatedDoc);
//   res.send(result);
// })

app.patch('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const filter = { _id: ObjectId(id) };
  const user = req.body;
  // const option = {upsert: true};
 
  const result = await reviewCollection.updateOne(filter, { $set: req.body });
   res.send(result);
})



app.delete('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await reviewCollection.deleteOne(query);
  res.send(result);
})


    }
  finally {

  }

}

run().catch(err => console.error(err));









app.get('/', (req, res) => {
    res.send('tourists car server is running')
})

app.listen(port, () => {
    console.log(`tourists server running on ${port}`);
})
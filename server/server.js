// // Code  for mongoose config in backend
// // Filename - backend/index.js

// // To connect with your mongoDB database
// const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://jcgilson:<Arliss0329!>@jackgilson.qjfz86t.mongodb.net/?retryWrites=true&w=majority&appName=JackGilson', {
//     dbName: 'JackGilson',
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, err => err ? console.log(err) : 
//     console.log('Connected to JackGilson database'));

// // Schema for users of app
// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     },
// });
// const User = mongoose.model('users', UserSchema);
// User.createIndexes();

// // For backend and express
// const express = require('express');
// const app = express();
// const cors = require("cors");
// console.log("App listen at port 5000");
// app.use(express.json());
// app.use(cors());
// app.get("/", (req, resp) => {

//     resp.send("App is Working");
//     // You can check backend is working or not by 
//     // entering http://loacalhost:5000
    
//     // If you see App is working means
//     // backend working properly
// });

// app.post("/register", async (req, resp) => {
//   console.log("req",req)

//     try {
//       resp.send("got resp");

//         // const user = new User(req.body);
//         // let result = await user.save();
//         // result = result.toObject();
//         // if (result) {
//         //     delete result.password;
//         //     resp.send(req.body);
//         //     console.log(result);
//         // } else {
//         //     console.log("User already register");
//         // }

//     } catch (e) {
//         resp.send("Something Went Wrong");
//     }
// });
// app.listen(5000);


const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://jcgilson:Arliss0329!@jackgilson.qjfz86t.mongodb.net/?retryWrites=true&w=majority&appName=JackGilson";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('PersonalSite');
    const collection = database.collection('GolfCourses');
    // Query for a movie that has the title 'Back to the Future'
    const query = { courseKey: 'plumCreek' };
    const result = await collection.findOne(query);
    console.log("result",result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
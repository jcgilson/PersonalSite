// import { MongoClient } from "mongodb";
// // Replace the uri string with your MongoDB deployment's connection string.
// const uri = "'mongodb+srv://jcgilson:<Arliss0329!>@jackgilson.qjfz86t.mongodb.net/?retryWrites=true&w=majority&appName=JackGilson'";
// const client = new MongoClient(uri);
// export async function insertRounds(round) {
//     console.log("round being passed", round)
//   try {
//     await client.connect();
//     const database = client.db("JackGilson");
//     const haiku = database.collection("GolfRounds");
//     // create a document to insert
//     const doc = {
//       title: "Record of a Shriveled Datum",
//       content: "No bytes, no problem. Just insert a document, in MongoDB",
//     }
//     const result = await haiku.insertOne(doc);
//     console.log(`A document was inserted with the _id: ${result.insertedId}`);
//   } finally {
//     await client.close();
//   }
// }

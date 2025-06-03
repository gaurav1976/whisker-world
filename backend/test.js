// copyWithinSameDB.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://gaurav:gaurav2004@gaurav.attf9.mongodb.net/?retryWrites=true&w=majority&appName=Gaurav"; // Replace with your actual URI

const dbName = "Gaurav";
const sourceCollection = "test";
const targetCollection = "whiskerworld";

async function copyData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const source = db.collection(sourceCollection);
    const target = db.collection(targetCollection);

    // Fetch all documents from source
    const docs = await source.find({}).toArray();

    if (docs.length === 0) {
      console.log("No documents found in source collection.");
      return;
    }

    // Remove _id to avoid duplicate key error
    const docsWithoutId = docs.map(({ _id, ...rest }) => rest);

    const result = await target.insertMany(docsWithoutId);
    console.log(`✅ ${result.insertedCount} documents copied from '${sourceCollection}' to '${targetCollection}'`);
  } catch (err) {
    console.error("❌ Error copying documents:", err.message);
  } finally {
    await client.close();
  }
}

copyData();
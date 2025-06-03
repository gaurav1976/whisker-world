const { MongoClient } = require("mongodb");

async function copyFoods() {
  const uri = "mongodb+srv://gaurav:gaurav2004@gaurav.attf9.mongodb.net/?retryWrites=true&w=majority&appName=Gaurav";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const testDb = client.db("test");
    const whiskerworldDb = client.db("whiskerworld");

    const foods = await testDb.collection("foods").find().toArray();
    if (foods.length > 0) {
      await whiskerworldDb.collection("foods").insertMany(foods);
      console.log("✅ Foods copied successfully!");
    } else {
      console.log("⚠️ No foods found to copy.");
    }

  } catch (error) {
    console.error("❌ Error copying foods:", error);
  } finally {
    await client.close();
  }
}

copyFoods();

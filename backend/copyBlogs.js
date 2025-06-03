const { MongoClient } = require("mongodb");

async function copyBlogs() {
  const uri = "mongodb+srv://gaurav:gaurav2004@gaurav.attf9.mongodb.net/?retryWrites=true&w=majority&appName=Gaurav";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const testDb = client.db("test");
    const whiskerworldDb = client.db("whiskerworld");

    const blogs = await testDb.collection("blogs").find().toArray();
    if (blogs.length > 0) {
      await whiskerworldDb.collection("blogs").insertMany(blogs);
      console.log("✅ Blogs copied successfully!");
    } else {
      console.log("⚠️ No blogs found to copy.");
    }
  } catch (error) {
    console.error("❌ Error copying blogs:", error);
  } finally {
    await client.close();
  }
}

copyBlogs();

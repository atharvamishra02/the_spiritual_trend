const { MongoClient } = require('mongodb');

// 1. Fill in your mapping here:
const idMap = {
  41: "507f1f77bcf86cd799439071",
  201: "507f1f77bcf86cd799439091",
  // ...add all mappings you need
};

const uri = 'mongodb://localhost:27017'; // Update if needed
const dbName = 'spiritual-trend'; // Update if needed

async function migrate() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // 2. Migrate products
    const products = db.collection('products');
    for (const [oldId, newId] of Object.entries(idMap)) {
      // Only migrate if newId does not already exist
      const newExists = await products.findOne({ _id: newId });
      if (newExists) {
        console.log(`Product with new ID ${newId} already exists, skipping.`);
        continue;
      }
      const oldProduct = await products.findOne({ _id: Number(oldId) });
      if (oldProduct) {
        // Insert new product with new _id
        const newProduct = { ...oldProduct, _id: newId };
        await products.insertOne(newProduct);
        // Remove old product
        await products.deleteOne({ _id: Number(oldId) });
        console.log(`Migrated product ${oldId} -> ${newId}`);
      } else {
        console.log(`Old product ${oldId} not found, skipping.`);
      }
    }

    // 3. Update cart items
    const carts = db.collection('carts');
    for (const [oldId, newId] of Object.entries(idMap)) {
      const result = await carts.updateMany(
        { "items.productId": Number(oldId) },
        { $set: { "items.$[elem].productId": newId } },
        { arrayFilters: [ { "elem.productId": Number(oldId) } ] }
      );
      if (result.modifiedCount > 0) {
        console.log(`Updated ${result.modifiedCount} cart items from ${oldId} to ${newId}`);
      }
    }

    // 4. Update order items (if you have an orders collection)
    const orders = db.collection('orders');
    for (const [oldId, newId] of Object.entries(idMap)) {
      const result = await orders.updateMany(
        { "items.productId": Number(oldId) },
        { $set: { "items.$[elem].productId": newId } },
        { arrayFilters: [ { "elem.productId": Number(oldId) } ] }
      );
      if (result.modifiedCount > 0) {
        console.log(`Updated ${result.modifiedCount} order items from ${oldId} to ${newId}`);
      }
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.close();
  }
}

migrate(); 
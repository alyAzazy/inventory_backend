const bodyParser = require('body-parser')
const express = require('express');
const { mongoClient } = require('../mongo');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/inventory', async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send('Systems Unavailable');
 
  console.log(req.body.product_id);
 const result =  await db.collection('products').findOneAndUpdate(
    { 'id': req.body.product_id },
    { '$inc': { 'stock': -1 } },
    { returnOriginal: false }
  );
  return res.status(200).json(result);

});

app.listen(4000);

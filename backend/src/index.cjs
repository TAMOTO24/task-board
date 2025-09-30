const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();
require('./db.cjs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

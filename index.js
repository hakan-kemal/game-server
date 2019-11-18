const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello Client-side; message coming from Server-side!");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Example app listening on port :${port}`);
});

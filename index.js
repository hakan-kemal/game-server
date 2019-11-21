const express = require("express");
const authRouter = require("./auth/router");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./user/router");
const Room = require("./room/model");
const Sse = require("json-sse");
const User = require("./user/model");

const stream = new Sse();

const app = express();

const corsMiddleware = cors();
app.use(corsMiddleware);

const parserMiddleware = bodyParser.json();
app.use(parserMiddleware);

const roomFactory = require("./room/router");
const roomRouter = roomFactory(stream);

app.use(roomRouter);
app.use(authRouter);
app.use(userRouter);

app.get("/stream", async (request, response) => {
  const rooms = await Room.findAll({ include: [User] });

  const action = {
    type: "ROOMS",
    payload: rooms
  };

  const string = JSON.stringify(action);

  stream.updateInit(string);

  stream.init(request, response);
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});

const express = require("express");
const db = require("./db.js");
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
// const gameFactory = require("./room/router");
// const gameRouter = gameFactory(stream);

app.use(roomRouter);
// app.use(gameRouter);

// 8. use the eventsource in app.js to connect to locaLHOST 4000/stream
// 9. log the data property of the event argument in componentDidMount

app.use(authRouter);
app.use(userRouter);
// app.use(gameLobbyRouter);

// app.get("/stream", (request, response) => {
//   Game.findAll().then(rooms => {
//     const string = JSON.stringify(rooms);

//     stream.updateInit(string);

//     stream.init(request, response);
//   });
// });

// app.get("/stream", async (request, response) => {
//   const rooms = await Game.findAll();

//   const string = JSON.stringify(rooms);

//   stream.updateInit(string);

//   stream.init(request, response);
// });

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

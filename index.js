const express = require("express");
const db = require("./db.js");
const authRouter = require("./auth/router");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./user/router");
const Game = require("./gameLobby/model");
const Sse = require("json-sse");
const User = require("./user/model");
// install json-sse library --> import the json-sse in index.js (server-side)
// 2. Make a stream; instanciate the Sse() class --> const stream = new Sse()
// 3. To connect to the stream create a app.get('./stream ... --> stream.init (response.send is inside the stream.init) )
// 4. test the stream in httpie --> send a request to http :4000/stream (if errors run the server; node || nodemon)
// 5. Set up, when someone connects to the stream you can see date; in this case a room model with a room router.
// So that when a room is created the stream displays the created room. fetch all existing/created rooms on the stream
// 6. create a new stream with async await.
// 7. Factory function --> A function that makes something and returns that something; but what is that something?? -->
// *** Important to make one stream, because we want to be able to send data over the stream so that the
// *** client can connect to that one stream, so the data is accessible for everyone who is interested in the stream
// make a function that creates and configures a router
// pass the stream as an argument to the factory function
// Testing: two terminals needed --> 1. run http :4000/stream --stream & 2. run http :4000/room name=test --> see if it all works?
// ***We only wanna make onbe stream, and always want be connected to the stream --> so you do wanna do that in the APp.js

const stream = new Sse();

const app = express();

const corsMiddleware = cors();
app.use(corsMiddleware);

const parserMiddleware = bodyParser.json();
app.use(parserMiddleware);

// const roomFactory = require('./room/router')
// const roomRouter = roomFactory(stream)
const gameFactory = require("./gameLobby/router");
const gameRouter = gameFactory(stream);

// app.use(roomRouter)
app.use(gameRouter);

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
  const rooms = await Game.findAll({ include: [User] });

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

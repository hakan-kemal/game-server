const express = require("express");
const db = require("./db.js");
const authRouter = require("./auth/router");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./user/router");
const gameLobbyRouter = require("./gameLobby/router");

const app = express();

const corsMiddleware = cors();
app.use(corsMiddleware);

const parserMiddleware = bodyParser.json();
app.use(parserMiddleware);

app.use(authRouter);
app.use(userRouter);
app.use(gameLobbyRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`listening on port ${port}!`));

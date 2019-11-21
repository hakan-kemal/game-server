const { Router } = require("express");
const Room = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");
// const { toData } = require("../auth/jwt");

// router.use(auth);

function roomFactory(stream) {
  const router = new Router();

  router.post("/room", async (request, response, next) => {
    console.log("IM IN!");
    const room = await Room.create(request.body);
    console.log({ receivedRoom: room });

    const action = {
      type: "ROOM",
      payload: room
    };

    const string = JSON.stringify(action);

    stream.send(string);

    response.send(room);
  });

  router.put("/join", auth, async (request, response, next) => {
    const { user } = request;

    response.send(user);
  });

  router.put("/join/:name", auth, async (request, response, next) => {
    // const userId = 1

    //   const user = await User
    //     .findByPk(userId)
    const { user } = request;

    if (!user) {
      return next("No user found");
    }

    // const authData;
    // const userId = request.user.dataValues.id;
    // const user = await User.findByPk(request.user.dataValues.id);
    // const auth =
    //   request.headers.authorization && request.headers.authorization.split(" ");
    // if (auth && auth[0] === "Bearer" && auth[1]) {
    //   authData = toData(auth[1]);
    // }
    // console.log("authorization data??", authData);

    // const user = await User.findByPk(data.userId);

    // console.log("user Id:", userId);
    // console.log("data.userId:", data.userId);
    // const user = await User.findByPk(data.userId);
    // // If you use the auth middleware, you only need this --> const { user } = request
    // // user.update(..)

    const { name } = request.params;

    const room = await Room.findOne({ where: { name } });

    const updated = await user.update({ roomId: room.id });

    const rooms = await Room.findAll({ include: [User] });

    const action = {
      type: "ROOMS",
      payload: rooms
    };

    const string = JSON.stringify(action);

    stream.send(string);

    response.send(updated);
  });

  // use this endpoint to add points to the user?
  // router.put("/points/:username", async (request, response, next) => {
  // const { username } = request.params;
  router.put("/points", async (request, response, next) => {
    const { username } = request.body; //if you want your url to be just /points

    try {
      // const user = await User.findByPk(userId);
      const user = await User.findOne({ where: { userName: username } });

      const startingPoints = user.points + 100;

      const updated = await user.update({ points: startingPoints - 1 });

      const rooms = await Room.findAll({ include: [User] });

      const action = {
        type: "ROOMS",
        payload: rooms
      };

      const string = JSON.stringify(action);

      stream.send(string);

      response.send(updated);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = roomFactory;

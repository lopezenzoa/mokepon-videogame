const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const players = [];

class Player {
  constructor(id) {
    this.id = id;
  }

  asignPet(pet) {
    this.pet = pet;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  asignAttacks(attacks) {
    this.attacks = attacks;
  }
}

class Mokepon {
  constructor(name) {
    this.name = name;
  }
}

app.get("/join", (req, res) => {
  const id = `${Math.random()}`;

  const player = new Player(id);

  players.push(player);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(id);
});

app.post("/mokepon/:playerID", (req, res) => {
  const playerID = req.params.playerID || "";
  const name = req.body.mokepon || "";
  const mokepon = new Mokepon(name);

  const playerIndex = players.findIndex(
    (player) => playerID === player.id
  );

  if (playerIndex >= 0) {
    players[playerIndex].asignPet(mokepon);
  }

  res.end();
});

app.post("/mokepon/:playerID/position", (req, res) => {
  const playerID = req.params.playerID || "";
  const x = req.body.x || 0;
  const y = req.body.y || 0;

  const playerIndex = players.findIndex(
    (player) => playerID === player.id
  );

  if (playerIndex >= 0) {
    players[playerIndex].updatePosition(x, y);
  }

  const enemies = players.filter((player) => playerID !== player.id);

  res.send({
    enemies,
  });
});

app.post("/mokepon/:playerID/attacks", (req, res) => {
  const playerID = req.params.playerID || "";
  const attacks = req.body.attacks || [];

  const playerIndex = players.findIndex(
    (playerIndex) => playerID === playerIndex.id
  );

  if (playerIndex >= 0) {
    players[playerIndex].asignAttacks(attacks);
  }

  res.end();
});

app.get("/mokepon/:playerID/attacks", (req, res) => {
  const playerID = req.params.playerID || "";
  const playerIndex = players.find((playerIndex) => playerIndex.id === playerID);

  res.send({
    attacks: playerIndex.attacks || [],
  });
});

app.listen(8080, () => {
  console.log("Server running at port 8080");
});

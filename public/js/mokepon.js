/* HTML sections */
const attacksSelectionSection = document.getElementById(
  "attacks-selection-section"
);
const resetSection = document.getElementById("reset-section");
const petSelectionSection = document.getElementById("pet-selection-section");
const messagesSection = document.getElementById("result");
const mapSection = document.getElementById("map-section");
resetSection.style.display = "none";

/* HTML buttons */
const petSelectionButton = document.getElementById("pet-selection-button");
const resetButton = document.getElementById("reset-button");

/* HTML spans */
const playerPetSpan = document.getElementById("player-pet");
const enemyPetSpan = document.getElementById("enemy-pet");
const playerLivesSpan = document.getElementById("player-lives");
const spanVidasEnemigo = document.getElementById("enemy-lives");

/* HTML containers */
const playerAttacksContainer = document.getElementById("player-attacks");
const enemyAttacksContainer = document.getElementById("enemy-attacks");
const petSelectionContainer = document.getElementById("pet-cards-container");
const attacksSelectionContainer = document.getElementById(
  "attacks-selection-container"
);

const map = document.getElementById("map");

let playerID = null;
let enemyID = null;
let mokeponArray = []; // I'm specifying it's an array since the "mokepon" word has no  plural version
let enemyMokeponArray = [];
let playerAttacks = [];
let enemyAttacks = [];
let mokeponOption;
let hipodogeInput;
let capipepoInput;
let ratigueyaInput;
let playerPet;
let playerPetObject;
let enemyPetAttacks;
let fireButton;
let waterButton;
let grassButton;
let buttons = [];
let playerAttackIndex;
let enemyAttackIndex;
let playerWins = 0;
let enemyWins = 0;
let lienzo = map.getContext("2d");
let interval;
let background = new Image();
background.src = "./assets/background.png";
let wantedHeight;
let mapWidth = window.innerWidth - 20;
const maxMapWidth = 350;

if (mapWidth > maxMapWidth) {
  mapWidth = maxMapWidth - 20;
}

wantedHeight = (mapWidth * 600) / 800;

map.width = mapWidth;
map.height = wantedHeight;

class Mokepon {
  constructor(name, image, mapImage, id = 0) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.attacks = [];
    this.width = 40;
    this.height = 40;
    this.x = randomNumber(0, map.width - this.width);
    this.y = randomNumber(0, map.height - this.height);
    this.mapImage = new Image();
    this.mapImage.src = mapImage;
    this.speedX = 0;
    this.speedY = 0;
  }

  drawPet() {
    lienzo.drawImage(this.mapImage, this.x, this.y, this.width, this.height);
  }
}

let hipodoge = new Mokepon(
  "Hipodoge",
  "./assets/hipodogeSelection.png",
  "./assets/hipodogeMap.png"
);

let capipepo = new Mokepon(
  "Capipepo",
  "./assets/capipepoSelection.png",
  "./assets/capipepoMap.png"
);

let ratigueya = new Mokepon(
  "Ratigueya",
  "./assets/ratigueyaSelection.png",
  "./assets/ratigueyaMap.png"
);

const HIPODOGE_ATTACKS = [
  { name: "💧", id: "water-button" },
  { name: "💧", id: "water-button" },
  { name: "💧", id: "water-button" },
  { name: "🔥", id: "fire-button" },
  { name: "🌱", id: "grass-button" },
];

const CAPIPEPO_ATTACKS = [
  { name: "🌱", id: "grass-button" },
  { name: "🌱", id: "grass-button" },
  { name: "🌱", id: "grass-button" },
  { name: "💧", id: "water-button" },
  { name: "🔥", id: "fire-button" },
];

const RATIGUEYA_ATTACKS = [
  { name: "🔥", id: "fire-button" },
  { name: "🔥", id: "fire-button" },
  { name: "🔥", id: "fire-button" },
  { name: "💧", id: "water-button" },
  { name: "🌱", id: "grass-button" },
];

hipodoge.attacks.push(...HIPODOGE_ATTACKS);
capipepo.attacks.push(...CAPIPEPO_ATTACKS);
ratigueya.attacks.push(...RATIGUEYA_ATTACKS);

mokeponArray.push(hipodoge, capipepo, ratigueya);

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* You can notice functions are sequentially connected */
function startGame() {
  attacksSelectionSection.style.display = "none";
  mapSection.style.display = "none";

  mokeponArray.forEach((mokepon) => {
    mokeponOption = `
          <input type="radio" name="pet" id=${mokepon.name} />
          <label class="pet-card" for=${mokepon.name}>
              <p>${mokepon.name}</p>
              <img src=${mokepon.image} alt=${mokepon.name}>
          </label>
          `;
    petSelectionContainer.innerHTML += mokeponOption;

    hipodogeInput = document.getElementById("Hipodoge");
    capipepoInput = document.getElementById("Capipepo");
    ratigueyaInput = document.getElementById("Ratigueya");
  });

  petSelectionButton.addEventListener("click", selectPlayerPet);
  resetButton.addEventListener("click", resetGame);

  joinGame();
}

function resetGame() {
  location.reload();
}

function joinGame() {
  fetch("http://localhost:8080/join").then((res) => {
    if (res.ok) {
      res.text().then((response) => {
        playerID = response;
      });
    }
  });
}

function selectPlayerPet() {
  if (hipodogeInput.checked) {
    playerPetSpan.innerHTML = hipodogeInput.id;
    playerPet = hipodogeInput.id;
  } else if (capipepoInput.checked) {
    playerPetSpan.innerHTML = capipepoInput.id;
    playerPet = capipepoInput.id;
  } else if (ratigueyaInput.checked) {
    playerPetSpan.innerHTML = ratigueyaInput.id;
    playerPet = ratigueyaInput.id;
  } else {
    alert("Please select a pet!");
    return;
  }

  petSelectionSection.style.display = "none";
  mapSection.style.display = "flex";

  selectPet(playerPet);
  setAttacks(playerPet);

  startMap();
}

function selectPet(playerPet) {
  fetch(`http://localhost:8080/mokepon/${playerID}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mokepon: playerPet,
    }),
  });
}

function setAttacks(playerPet) {
  let attacks;

  for (let i = 0; i < mokeponArray.length; i++) {
    if (playerPet === mokeponArray[i].name) {
      attacks = mokeponArray[i].attacks;
    }
  }

  showAttacks(attacks);
}

function showAttacks(attacks) {
  attacks.forEach((attack) => {
    petAttackButton = `
        <button id=${attack.id} class="attack-button">${attack.name}</button>
        `;
    attacksSelectionContainer.innerHTML += petAttackButton;
  });

  fireButton = document.getElementById("fire-button");
  waterButton = document.getElementById("water-button");
  grassButton = document.getElementById("grass-button");
  buttons = document.querySelectorAll(".attack-button");
}

function startMap() {
  playerPetObject = getPetObject(playerPet);
  interval = setInterval(drawBackground, 50);

  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", stopMovement);
}

function getPetObject(playerPet) {
  for (let i = 0; i < mokeponArray.length; i++) {
    if (playerPet === mokeponArray[i].name) {
      return mokeponArray[i];
    }
  }
}

function drawBackground() {
  playerPetObject.x = playerPetObject.x + playerPetObject.speedX;
  playerPetObject.y = playerPetObject.y + playerPetObject.speedY;

  lienzo.clearRect(0, 0, map.width, map.height);
  lienzo.drawImage(background, 0, 0, map.width, map.height);

  playerPetObject.drawPet();

  sendPosition(playerPetObject.x, playerPetObject.y);

  enemyMokeponArray.forEach(function (enemyPet) {
    enemyPet.drawPet();
    detectCollision(enemyPet);
  });
}

function sendPosition(x, y) {
  fetch(`http://localhost:8080/mokepon/${playerID}/position`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      x,
      y,
    }),
  }).then(function (res) {
    if (res.ok) {
      res.json().then(function ({ enemies }) {
        enemyMokeponArray = enemies.map(function (enemy) {
          let enemyPet;
          const petName = enemy.pet.name || "";

          if (petName === "Hipodoge") {
            enemyPet = new Mokepon(
              "Hipodoge",
              "./assets/hipodogeSelection.png",
              "./assets/hipodogeMap.png",
              enemy.id
            );
          } else if (petName === "Capipepo") {
            enemyPet = new Mokepon(
              "Capipepo",
              "./assets/capipepoSelection.png",
              "./assets/capipepoMap.png",
              enemy.id
            );
          } else if (petName === "Ratigueya") {
            enemyPet = new Mokepon(
              "Ratigueya",
              "./assets/ratigueyaSelection.png",
              "./assets/ratigueyaMap.png",
              enemy.id
            );
          }

          enemyPet.x = enemy.x || 0;
          enemyPet.y = enemy.y || 0;

          return enemyPet;
        });
      });
    }
  });
}

function detectCollision(enemyPet) {
  const enemyTopEdge = enemyPet.y;
  const enemyLowerEdge = enemyPet.y + enemyPet.height;
  const enemyRightEdge = enemyPet.x + enemyPet.width;
  const enemyLeftEdge = enemyPet.x;

  const playerTopEdge = playerPetObject.y;
  const playerLowerEdge = playerPetObject.y + playerPetObject.height;
  const playerRightEdge = playerPetObject.x + playerPetObject.width;
  const playerLeftEdge = playerPetObject.x;

  if (
    playerLowerEdge < enemyTopEdge ||
    playerTopEdge > enemyLowerEdge ||
    playerRightEdge < enemyLeftEdge ||
    playerLeftEdge > enemyRightEdge
  ) {
    return;
  }

  stopMovement();
  clearInterval(interval);

  enemyID = enemyPet.id;
  attacksSelectionSection.style.display = "flex";
  mapSection.style.display = "none";

  selectEnemyPet(enemyPet);
}

function selectEnemyPet(enemyPet) {
  enemyPetSpan.innerHTML = enemyPet.name;
  enemyPetAttacks = enemyPet.attacks;
  buildAttacksSequence();
}

function buildAttacksSequence() {
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.textContent === "🔥") {
        playerAttacks.push("FIRE");
        button.style.background = "#112f58";
        button.disabled = true;
      } else if (e.target.textContent === "💧") {
        playerAttacks.push("WATER");
        button.style.background = "#112f58";
        button.disabled = true;
      } else {
        playerAttacks.push("GRASS");
        button.style.background = "#112f58";
        button.disabled = true;
      }

      if (playerAttacks.length === 5) {
        sendAttacks();
      }
    });
  });
}

function sendAttacks() {
  fetch(`http://localhost:8080/mokepon/${playerID}/attacks`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attacks: playerAttacks,
    }),
  });

  interval = setInterval(getAttacks, 50);
}

function getAttacks() {
  fetch(`http://localhost:8080/mokepon/${enemyID}/attacks`).then(function (
    res
  ) {
    if (res.ok) {
      res.json().then(function ({ attacks }) {
        if (attacks.length === 5) {
          enemyAttacks = attacks;
          fight();
        }
      });
    }
  });
}

function fight() {
  clearInterval(interval);

  for (let index = 0; index < playerAttacks.length; index++) {
    if (playerAttacks[index] === enemyAttacks[index]) {
      getIndex(index, index);
      createMessage("TIE");
    } else if (
      playerAttacks[index] === "FIRE" &&
      enemyAttacks[index] === "GRASS"
    ) {
      getIndex(index, index);
      createMessage("WIN");
      playerWins++;
      playerLivesSpan.innerHTML = playerWins;
    } else if (
      playerAttacks[index] === "WATER" &&
      enemyAttacks[index] === "FIRE"
    ) {
      getIndex(index, index);
      createMessage("WIN");
      playerWins++;
      playerLivesSpan.innerHTML = playerWins;
    } else if (
      playerAttacks[index] === "GRASS" &&
      enemyAttacks[index] === "WATER"
    ) {
      getIndex(index, index);
      createMessage("WIN");
      playerWins++;
      playerLivesSpan.innerHTML = playerWins;
    } else {
      getIndex(index, index);
      createMessage("PERDISTE");
      enemyWins++;
      spanVidasEnemigo.innerHTML = enemyWins;
    }
  }

  checkLives();
}

function getIndex(playerPet, enemyPet) {
  playerAttackIndex = playerAttacks[playerPet];
  enemyAttackIndex = enemyAttacks[enemyPet];
}

function createMessage(result) {
  let playerAttack = document.createElement("p");
  let enemyAttack = document.createElement("p");

  messagesSection.innerHTML = result;
  playerAttack.innerHTML = playerAttackIndex;
  enemyAttack.innerHTML = enemyAttackIndex;

  playerAttacksContainer.appendChild(playerAttack);
  enemyAttacksContainer.appendChild(enemyAttack);
}

function checkLives() {
  if (playerWins === enemyWins) {
    createFinalMessage("This was a tie!");
  } else if (playerWins > enemyWins) {
    createFinalMessage("Congratulations, you win!");
  } else {
    createFinalMessage("I'm sorry, you loose!");
  }
}

function createFinalMessage(finalResult) {
  messagesSection.innerHTML = finalResult;
  resetSection.style.display = "block";
}

function keyPressed(event) {
  switch (event.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    default:
      break;
  }
}

function moveRight() {
  playerPetObject.speedX = 5;
}

function moveLeft() {
  playerPetObject.speedX = -5;
}

function moveDown() {
  playerPetObject.speedY = 5;
}

function moveUp() {
  playerPetObject.speedY = -5;
}

function stopMovement() {
  playerPetObject.speedX = 0;
  playerPetObject.speedY = 0;
}

startGame(); // Where magic takes place...

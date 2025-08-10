// Global variables
let canvas, c, boundaries, objects, player, background, movables, objectInRange;
let keys = { w: { pressed: false }, a: { pressed: false }, s: { pressed: false }, d: { pressed: false } };
let lastKey = "";

console.log("🎮 [DEBUG] Game index.js loaded");

// Wait for DOM to be ready and all scripts to load
function initializeGame() {
  console.log("🎮 [DEBUG] DOMContentLoaded event fired");
  console.log("🎮 [DEBUG] Starting game initialization");
  // 1) Create a canvas
  console.log("🎮 [DEBUG] Looking for canvas element");
  canvas = document.querySelector("canvas");
  console.log("🎮 [DEBUG] Canvas element found:", canvas);
  if (!canvas) {
    console.error("🎮 [DEBUG] ❌ Canvas element not found!");
    return;
  }
  console.log("🎮 [DEBUG] Getting 2D context");
  c = canvas.getContext("2d");
  if (!c) {
    console.error("🎮 [DEBUG] ❌ Could not get 2D context from canvas!");
    return;
  }
  console.log("🎮 [DEBUG] Setting canvas dimensions");
  canvas.width = 1024;
  canvas.height = 576;
  console.log("🎮 [DEBUG] Canvas dimensions set:", canvas.width, "x", canvas.height);

  // 2) Create a layer for collisions
  console.log("🎮 [DEBUG] Creating collisions map");
  console.log("🎮 [DEBUG] collisions variable:", typeof collisions, collisions?.length);
  if (typeof collisions === "undefined") {
    console.error("🎮 [DEBUG] ❌ collisions variable is undefined!");
    return;
  }
  const collisionsMap = [];
  for (let i = 0; i < collisions.length; i += 50) {
    collisionsMap.push(collisions.slice(i, i + 50));
  }
  console.log("🎮 [DEBUG] Collisions map created with", collisionsMap.length, "rows");

  // 3) Create a layer for objects with increasing id
  const objectsMap = [];
  for (let i = 0; i < objectsData.length; i += 50) {
    objectsMap.push(objectsData.slice(i, i + 50));
  }

  const boundaries = [];
  const offset = { x: -60, y: -400 };

  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 193) {
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x + 30,
              y: i * Boundary.height + offset.y + 30,
            },
          }),
        );
      }
    });
  });

  let objects = [];
  let idCounter = 1;

  objectsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 430) {
        const x = j * Item.width + offset.x + 30;
        const y = i * Item.height + offset.y + 30;

        const tolerance = 16;
        let match = interactionZones.find(z => Math.abs(z.x - x) <= tolerance && Math.abs(z.y - y) <= tolerance);

        objects.push(
          new Item({
            position: { x, y },
            id: idCounter,
            name: interactionZones.find(z => z.id === idCounter)?.data.name || "",
            image: interactionZones.find(z => z.id === idCounter)?.data.image || "/ecoquest/assets/player-down.png",
            rarity: interactionZones.find(z => z.id === idCounter)?.data.rarity || "Hello",
            data: interactionZones.find(z => z.id === idCounter)?.data.description || "No description available",
          }),
        );

        idCounter++;
      }
    });
  });

  console.log("Created objects (first 10):", objects.slice(0, 10));

  // 4) Create a player sprite
  const image = new Image();
  image.src = "/ecoquest/assets/ecoquest-map.png";

  const playerDownImage = new Image();
  playerDownImage.src = "/ecoquest/assets/player-down.png";
  const playerUpImage = new Image();
  playerUpImage.src = "/ecoquest/assets/player-up.png";
  const playerRightImage = new Image();
  playerRightImage.src = "/ecoquest/assets/player-right.png";
  const playerLeftImage = new Image();
  playerLeftImage.src = "/ecoquest/assets/player-left.png";

  const player = new Sprite({
    position: {
      x: canvas.width / 2 - 192 / 8,
      y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: { max: 4 },
    sprites: {
      up: playerUpImage,
      left: playerLeftImage,
      right: playerRightImage,
      down: playerDownImage,
    },
  });

  const background = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: image,
  });

  // Movement keys
  const keys = { w: { pressed: false }, a: { pressed: false }, s: { pressed: false }, d: { pressed: false } };
  let lastKey = " ";
  const movables = [background, ...boundaries, ...objects];

  // Collision check
  function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
      rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
      rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
      rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    );
  }

  // 5 & 6) Collision with collisions layer & interaction with items
  let objectInRange = null;

  function animate() {
    window.requestAnimationFrame(animate);
    background.draw();

    // Draw boundaries
    boundaries.forEach(boundary => boundary.draw());

    // Draw objects & detect interaction
    objectInRange = null;
    for (let object of objects) {
      object.draw();
      if (rectangularCollision({ rectangle1: player, rectangle2: object })) {
        object.highlight = true;
        objectInRange = {
          name: object.name,
          image: object.image.src,
          rarity: object.rarity,
          data: object.data,
        };
      } else {
        object.highlight = false;
      }
    }

    // 7) Movement mechanism
    let moving = true;
    player.moving = false;

    if (keys.w.pressed && lastKey === "w") {
      player.moving = true;
      player.image = player.sprites.up;
      for (let boundary of boundaries) {
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y + 3 } },
          })
        ) {
          moving = false;
          break;
        }
      }
      if (moving) movables.forEach(movable => (movable.position.y += 3));
    } else if (keys.a.pressed && lastKey === "a") {
      player.moving = true;
      player.image = player.sprites.left;
      for (let boundary of boundaries) {
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: { ...boundary, position: { x: boundary.position.x + 3, y: boundary.position.y } },
          })
        ) {
          moving = false;
          break;
        }
      }
      if (moving) movables.forEach(movable => (movable.position.x += 3));
    } else if (keys.s.pressed && lastKey === "s") {
      player.moving = true;
      player.image = player.sprites.down;
      for (let boundary of boundaries) {
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y - 3 } },
          })
        ) {
          moving = false;
          break;
        }
      }
      if (moving) movables.forEach(movable => (movable.position.y -= 3));
    } else if (keys.d.pressed && lastKey === "d") {
      player.moving = true;
      player.image = player.sprites.right;
      for (let boundary of boundaries) {
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: { ...boundary, position: { x: boundary.position.x - 3, y: boundary.position.y } },
          })
        ) {
          moving = false;
          break;
        }
      }
      if (moving) movables.forEach(movable => (movable.position.x -= 3));
    }

    player.draw();
    drawQuestList();
  }

  // Start game when images load
  image.onload = () => {
    playerDownImage.onload = () => {
      animate();
    };
  };

  // Interaction functions
  function hideInteraction() {
    const tab = document.getElementById("interactionTab");
    if (tab) tab.style.display = "none";
  }

  // 8) Link new items with predefined interactables
  window.addEventListener("keydown", e => {
    switch (e.key) {
      case "w":
        keys.w.pressed = true;
        lastKey = "w";
        break;
      case "a":
        keys.a.pressed = true;
        lastKey = "a";
        break;
      case "s":
        keys.s.pressed = true;
        lastKey = "s";
        break;
      case "d":
        keys.d.pressed = true;
        lastKey = "d";
        break;
      case " ":
        if (objectInRange) {
          console.log("Interacting with:", objectInRange);
          updateInteractionTab(objectInRange);
          updateQuest(1, 1);
          updateQuest(2, 1);
        } else {
          console.log("No interactable object in range.");
        }
        break;
      case "x":
        hideInteraction();
        break;
    }
  });

  window.addEventListener("keyup", e => {
    if (keys[e.key]) keys[e.key].pressed = false;
  });

  //Navigate to previous page
  //document.getElementById("mainBackButton").addEventListener("click", () => {
  // If you want it to go to a fixed page:
  //  window.location.href = "menu.html"; // Change this to your menu/homepage file
  //});

  console.log("🎮 [DEBUG] Game initialization completed");
}

// Global function to check dependencies
window.checkGameDependencies = function() {
  console.log("🎮 [DEBUG] Checking game dependencies:");
  console.log("🎮 [DEBUG] - collisions:", typeof collisions, collisions?.length);
  console.log("🎮 [DEBUG] - objectsData:", typeof objectsData, objectsData?.length);
  console.log("🎮 [DEBUG] - interactionZones:", typeof interactionZones, interactionZones?.length);
  console.log("🎮 [DEBUG] - Boundary:", typeof Boundary);
  console.log("🎮 [DEBUG] - Item:", typeof Item);
  console.log("🎮 [DEBUG] - Sprite:", typeof Sprite);
  return typeof collisions !== "undefined" && 
         typeof objectsData !== "undefined" && 
         typeof interactionZones !== "undefined" && 
         typeof Boundary !== "undefined";
};

// Listen for the gameReady event from React component
window.addEventListener('gameReady', function () {
  console.log("🎮 [DEBUG] gameReady event received, initializing game...");
  
  // Check if all dependencies are available
  if (!window.checkGameDependencies()) {
    console.error("🎮 [DEBUG] ❌ Not all dependencies are loaded yet");
    return;
  }
  
  console.log("🎮 [DEBUG] All dependencies available, starting game...");
  initializeGame();
});

// Also keep the DOMContentLoaded as a fallback
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎮 [DEBUG] DOMContentLoaded fired, but waiting for React to render canvas...");
});

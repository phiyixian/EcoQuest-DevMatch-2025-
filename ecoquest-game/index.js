const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// Assuming "collisions" is defined globally in another file or above this
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 50) {
  collisionsMap.push(collisions.slice(i, i + 50));
}


const boundaries = [];
const offset = {
  x: -60,
  y: -400,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 193)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x + 30,
            y: i * Boundary.height + offset.y + 30,
          },
        })
      );
  });
});

const image = new Image();
image.src = 'assets/ecoquest-map.png';

const playerDownImage = new Image();
playerDownImage.src = 'assets/player-down.png';

const playerUpImage = new Image();
playerUpImage.src = 'assets/player-up.png';

const playerRightImage = new Image();
playerRightImage.src = 'assets/player-right.png';

const playerLeftImage = new Image();
playerLeftImage.src = 'assets/player-left.png';

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 8,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites : {
    up : playerUpImage,
    left : playerLeftImage,
    right : playerRightImage,
    down : playerDownImage,
  }
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();

  let moving = true;
  player.moving = false

  boundaries.forEach((boundary) => {
    boundary.draw();

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: boundary,
      })
    ) {
      console.log('colliding');
    }
  });

  // Movement handling
  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((movable) => (movable.position.y += 3));
  } else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((movable) => (movable.position.x += 3));
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving = true
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((movable) => (movable.position.y -= 3));
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((movable) => (movable.position.x -= 3));
  }

  player.draw();
}

image.onload = () => {
  playerDownImage.onload = () => {
    animate();
  };
};

let lastKey = ' ';
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});

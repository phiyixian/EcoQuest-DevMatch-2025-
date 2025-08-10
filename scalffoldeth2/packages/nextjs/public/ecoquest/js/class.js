console.log("🎮 [DEBUG] class.js loading");

class Boundary {
  static width = 64;
  static height = 64;
  constructor({ position }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  draw() {
    c.fillStyle = 'rgba(255, 255, 255, 0)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

console.log("🎮 [DEBUG] Boundary class defined");

class Item {
  static width = 64
  static height = 64

  constructor({ position, id, name, image, rarity, data }) {
    this.position = position;
    this.id = id;
    this.name = name;
    this.image = new Image();
    this.image.src = image;
    this.rarity = rarity;
    this.data = data;
    this.width = Item.width;  // example width
    this.height = Item.height; // example height
    this.highlight = false;
  }



  draw() {
    if (this.highlight) {
      c.fillStyle = 'rgba(255, 255, 0, 0.5)'; // yellow highlight
    } else {
      c.fillStyle = 'rgba(0, 0, 0, 0)';
    }
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

  }
}

console.log("🎮 [DEBUG] Item class defined");

class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.width = 48;
    this.height = 68;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };

    this.moving = false;
    this.frameHold = 10; // how many ticks to hold each frame
    this.sprites = sprites
  }

  draw() {
    // draw current frame slice
    const frameWidth = this.image.width / this.frames.max;
    c.drawImage(
      this.image,
      this.frames.val * frameWidth,
      0,
      frameWidth,
      this.image.height,
      this.position.x,
      this.position.y,
      frameWidth,
      this.image.height
    );

    if (!this.moving) {
      // optionally reset to first frame when not moving
      this.frames.val = 0;
      this.frames.elapsed = 0;
      return;
    }

    // advance animation based on hold count
    this.frames.elapsed++;
    if (this.frames.elapsed % this.frameHold === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++;
      } else {
        this.frames.val = 0;
      }
    }
  }
}

console.log("🎮 [DEBUG] Sprite class defined");

class Objects {
  static width = 64;
  static height = 64;

  constructor({ name = 'Unknown', position }) {
    this.name = name;
    this.position = position;
    this.width = Objects.width;
    this.height = Objects.height;
    this.highlight = false;
    this.showMessage = false;
  }

  draw() {
    c.fillStyle = this.highlight
      ? 'rgba(255, 255, 0, 0.6)'
      : 'rgba(0, 0, 0, 0.5)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.showMessage) {
      c.fillStyle = 'white';
      c.font = '16px Arial';
      c.fillText(
        `You interacted with ${this.name}`,
        this.position.x,
        this.position.y - 10
      );
    }
  }
}

console.log("🎮 [DEBUG] Objects class defined");

// Make classes globally available
window.Boundary = Boundary;
window.Item = Item;
window.Sprite = Sprite;
window.Objects = Objects;

console.log("🎮 [DEBUG] class.js loaded successfully");
console.log("🎮 [DEBUG] Classes made globally available");
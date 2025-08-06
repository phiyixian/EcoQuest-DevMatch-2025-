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
  

class InteractableObject {
    constructor({ x, y, width, height, type = 'generic', message = '', name = '' }) {
      this.name = name;
      this.position = { x, y };
      this.width = width;
      this.height = height;
      this.type = type;
      this.message = message;
      this.hasInteracted = false; // optional: prevent repeat interactions
    }
  
    draw() {
      c.fillStyle = 'rgba(0, 0, 0, 0.5)';
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}


const interactables = eco-quest-objects.layers.find(layer => layer.name === 'Interactables').objects;

const interactableObjects = interactables.map(obj => {
  const getProp = (name) =>
    obj.properties?.find(p => p.name === name)?.value || '';

  return new InteractableObject({
    x: obj.x,
    y: obj.y - obj.height, // Fix Tiled origin
    width: obj.width,
    height: obj.height,
    type: getProp('type') || obj.type,
    message: getProp('message'),
    name: obj.name,
  });
});
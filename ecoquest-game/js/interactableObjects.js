// Raw interactables from Tiled (unchanged)

// Example mushroom data
const mushroomData = {
  name: "Shiitake Mushroom",
  image: "assets/mushroom.jpeg",
  rarity: "Common",
  description: `
    <p><strong>Cultivation & Industry Growth:</strong><br>
    Shiitake (Lentinula edodes) is a major cultivated mushroom in Malaysia, alongside oyster and ganoderma varieties.</p>
  `
};

// Another example zone with different data
const treeData = {
  name: "Tree",
  image: "assets/tree.jpeg",
  rarity: "Rare",
  description: `<p>The largest flower in the world.</p>`
};

// Define zones with position, size, and data
const interactionZones = [
  {
      x: 356.320073721395,
      y: 293.349715865458,
      width: 50,
      height: 50,
      data: mushroomData
  },
  {
      x: 415.547651883574,
      y: 290.701894461784,
      width: 60,
      height: 60,
      data: treeData
  }
];

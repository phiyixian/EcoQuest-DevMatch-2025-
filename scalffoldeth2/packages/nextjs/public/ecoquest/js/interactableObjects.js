// Raw interactables from Tiled (unchanged)

// Example mushroom data
const mushroomData = {
  name: "Shiitake Mushroom",
  image: "/ecoquest/assets/wildlife-images/mushroom.jpeg",
  rarity: "Common",
  description: `
    <p><strong>Shiitake Mushrooms in Malaysia:</strong><br>
While not naturally suited to tropical climates, shiitake mushrooms are increasingly cultivated in Malaysia through controlled indoor farming and in highland areas. The similar-looking "black fungus" (Auricularia spp.) is often confused with shiitake in local markets.</p>

<p><strong>Key Production Areas:</strong><br>
Cameron Highlands and other elevated regions feature shiitake cultivation facilities, where cooler temperatures and humidity control enable year-round growth.</p>

<p><strong>Market Note:</strong><br>
Malaysia's shiitake market relies heavily on imports, but local production is growing to meet demand for this nutritious, umami-rich mushroom in Asian cuisine and health products.</p>`,
};

// Another example zone with different data
const treeData = {
  name: "Pine tree",
  image: "/ecoquest/assets/wildlife-images/Tree.jpeg",
  rarity: "Common",
  description: `<p><strong>Pine Trees in Malaysia:</strong><br> While not native, pine trees are planted in highland areas like Cameron Highlands for their temperate forest appeal. The similar-looking Casuarina ("Rhu") tree is often mistaken for a true pine.</p> <p><strong>Key Locations:</strong><br> Fraser’s Hill features pine-like scenery, with conifers grown above 1,400m elevation to create cool-climate landscapes.</p> <p><strong>Ecological Note:</strong><br> Malaysia’s tropical rainforests naturally lack true pines – these are introduced species for tourism and aesthetics.</p>`,
};

// Another example zone with different data
const cowData = {
  name: "Cows",
  image: "/ecoquest/assets/wildlife-images/cow.jpeg",
  rarity: "Common",
  description: `<p><strong>Cows in Malaysia:</strong><br>
Malaysia's cattle industry relies heavily on imports, with local production meeting only 20% of beef demand and 6% of dairy needs. The country's tropical climate limits large-scale cattle farming, making feedlot systems and integration with oil palm plantations key strategies for production :cite[2]:cite[3].</p>

<p><strong>Key Breeds & Systems:</strong><br>
The indigenous Kedah-Kelantan cattle dominate local herds, while crossbreeding with imported breeds (e.g., Australian Brahman) improves meat yields. Most cattle are raised in smallholder farms (<10 heads), with intensive feedlots producing 6,000 to 7,000 heads annually :cite[3]:cite[6].</p>

<p><strong>Economic Note:</strong><br>
Cattle contributed ~RM** billion to GDP of Malaysia in 2024, with beef imports (mainly from India) priced 50% lower than local produce. The industry faces challenges from climate sensitivity and feed costs, but palm kernel cake (PKC) offers a sustainable feed alternative :cite[2]:cite[3]:cite[6].</p>`,
};

const otherTreeData = {
  name: "Round tree",
  image: "/ecoquest/assets/wildlife-images/Tree.jpeg",
  rarity: "Common",
  description: `<p><strong>Round Trees in Malaysia:</strong><br>`,
};
const otherMushroomData = {
  name: "Other Mushroom",
  image: "/ecoquest/assets/wildlife-images/mushroom.jpeg",
  rarity: "Common",
  description: `<p><strong>Another type of mushroom in Malaysia:</strong><br>`,
};
// Define zones with position, size, and data
const interactionZones = [
  {
    id: 1,
    x: 356.320073721395 + 30,
    y: 293.349715865458 + 30,
    width: 50,
    height: 50,
    data: mushroomData,
  },
  {
    id: 2,
    x: 415.547651883574 + 30,
    y: 290.701894461784 + 30,
    width: 60,
    height: 60,
    data: treeData,
  },

  {
    id: 3,
    x: 386.509274873524 + 30,
    y: 675.210792580101 + 30,
    width: 60,
    height: 60,
    data: otherMushroomData,
  },
  {
    id: 4,
    x: 863.57 + 30,
    y: 382.65 + 30,
    width: 60,
    height: 60,
    data: otherTreeData,
  },
  {
    id: 5,
    x: 962.39 + 30,
    y: 351.36 + 30,
    width: 60,
    height: 60,
    data: otherTreeData,
  },
  {
    id: 6,
    x: 1051.88 + 30,
    y: 509.47 + 30,
    width: 60,
    height: 60,
    data: otherMushroomData,
  },
  {
    id: 7,
    x: 963.49 + 30,
    y: 543.51 + 30,
    width: 60,
    height: 60,
    data: otherTreeData,
  },
  {
    id: 8,
    x: 863.02 + 30,
    y: 606.64 + 30,
    width: 60,
    height: 60,
    data: otherTreeData,
  },
  {
    id: 9,
    x: 576.05 + 30,
    y: 671.16 + 30,
    width: 60,
    height: 60,
    data: otherMushroomData,
  },
  {
    id: 10,
    x: 1181.99 + 30,
    y: 509.47 + 30,
    width: 60,
    height: 60,
    data: treeData,
  },
];

// Make interactionZones globally available
window.interactionZones = interactionZones;
window.mushroomData = mushroomData;
window.treeData = treeData;
window.cowData = cowData;
window.otherTreeData = otherTreeData;
window.otherMushroomData = otherMushroomData;

console.log("🎮 [DEBUG] interactableObjects.js loaded, interactionZones:", interactionZones.length, "zones");
console.log("🎮 [DEBUG] interactionZones made globally available");
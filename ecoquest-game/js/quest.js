// Quest data
const quests = [
  {
    id: 1,
    name: "Find the Mushroom",
    description: "Locate and interact with the mushroom in the forest.",
    progress: 0,
    goal: 1,
    completed: false
  },
  {
    id: 2,
    name: "Interact with 5 wildlife",
    description: "Interact with 5 wildlife around the forest.",
    progress: 0,
    goal: 5,
    completed: false
  }
];

// Function to draw quest list
function drawQuestList() {
  c.fillStyle = "rgba(0, 0, 0, 0.6)";
  c.fillRect(10, 10, 300, 120);

  c.fillStyle = "white";
  c.font = "14px Arial";
  c.fillText("Quests:", 20, 30);

  let y = 50;
  quests.forEach(quest => {
    const status = quest.completed ? "Done" : `${quest.progress}/${quest.goal}`;
    c.fillText(`${quest.name} - ${status}`, 20, y);
    y += 20;
  });
}

// Function to update quest progress
function updateQuest(id, amount) {
  const quest = quests.find(q => q.id === id);
  if (!quest || quest.completed) return;
  
  quest.progress += amount;
  if (quest.progress >= quest.goal) {
    quest.progress = quest.goal;
    quest.completed = true;
    console.log(`Quest completed: ${quest.name}`);
  }
}

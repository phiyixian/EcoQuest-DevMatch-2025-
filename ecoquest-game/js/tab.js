// Show initial start modal on page load
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  console.log('✅ Modal element found:', modal);
  modal.classList.add('open'); // Show the modal

  const startGameBtn = document.getElementById('startGame');

  startGameBtn.addEventListener('click', () => {
    console.log('✅ Start Game clicked');
    modal.classList.remove('open'); // Hide the modal
  });
});

// Show the interaction tab with data from the object
function showInteraction(zone) {
const tab = document.getElementById("interactionTab");
if (!tab) return;

const obj = zone.data; // Pull data from the zone

tab.innerHTML = `
    <div style="padding: 10px; font-family: Arial, sans-serif;">
        <h2 style="margin-top:0;">${obj.name || "Unknown"}</h2>
        ${obj.image ? `<img src="${obj.image}" alt="${obj.name || "Image"}" style="max-width: 100px; height: auto; display:block; margin-bottom: 10px;">` : ""}
        <p><strong>Rarity:</strong> ${obj.rarity || "Unknown"}</p>
        <p>${obj.description || "No description available."}</p>
        <p style="font-size: 0.8em; color: gray;">Press X to close</p>
    </div>
`;

tab.style.display = "block";
}

// Hide the interaction tab
function hideInteraction() {
const tab = document.getElementById("interactionTab");
if (tab) {
    tab.style.display = "none";
}
}

function updateInteractionTab(item) {
const tab = document.getElementById("interactionTab");
tab.querySelector(".interaction-name").textContent = item.name;
tab.querySelector(".interaction-image").src = item.image;
tab.querySelector(".interaction-image").alt = item.name;
tab.querySelector(".interaction-rarity").textContent = `Rarity: ${item.rarity}`;

// If `data` contains HTML, we use innerHTML to render it properly
tab.querySelector(".interaction-description").innerHTML = item.data;

tab.style.display = "block"; // show tab
}


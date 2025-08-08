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
  
  // ===== Show Interaction in tab.html =====
function showInteraction({ name, image, rarity, description }) {
  const tab = document.getElementById('interactionTab');
  tab.querySelector('.interaction-name').textContent = name;
  tab.querySelector('.interaction-image').src = image;
  tab.querySelector('.interaction-rarity').textContent = rarity;
  tab.querySelector('.interaction-description').textContent = description;
  tab.style.display = 'block';
}

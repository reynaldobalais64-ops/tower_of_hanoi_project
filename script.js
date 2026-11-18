const towers = [[], [], []];
const towerEls = [...document.querySelectorAll(".tower")];
const diskCountEl = document.getElementById("diskCount");
const moveCountEl = document.getElementById("moveCount");
const messageEl = document.getElementById("message");
let selectedTower = null;
let moves = 0;
let diskCount = 3;

const colors = ["#f06b72", "#f5a45b", "#f5d35e", "#65c5a4", "#62a8e8", "#8b83e8", "#c37dd5"];

function resetGame() {
  diskCount = Number(diskCountEl.value);
  towers[0] = Array.from({length: diskCount}, (_, i) => diskCount - i);
  towers[1] = [];
  towers[2] = [];
  selectedTower = null;
  moves = 0;
  moveCountEl.textContent = moves;
  messageEl.textContent = "Click a tower to pick up its top disk, then click another tower to place it.";
  render();
}

function render() {
  towerEls.forEach((towerEl, index) => {
    towerEl.classList.toggle("selected", selectedTower === index);
    const diskContainer = towerEl.querySelector(".disks");
    diskContainer.innerHTML = "";
    towers[index].forEach((size, diskIndex) => {
      const disk = document.createElement("div");
      disk.className = "disk";
      if (diskIndex === towers[index].length - 1) disk.classList.add("top");
      if (selectedTower === index && diskIndex === towers[index].length - 1) disk.classList.add("selectedDisk");
      const width = 35 + (size / diskCount) * 58;
      disk.style.width = `${width}%`;
      disk.style.background = colors[(size - 1) % colors.length];
      disk.title = `Disk ${size}`;
      diskContainer.appendChild(disk);
    });
  });
}

function clickTower(index) {
  if (selectedTower === null) {
    if (!towers[index].length) {
      messageEl.textContent = "That tower is empty. Select a tower with a disk.";
      return;
    }
    selectedTower = index;
    messageEl.textContent = `Tower ${String.fromCharCode(65 + index)} selected. Choose a destination tower.`;
    render();
    return;
  }

  if (selectedTower === index) {
    selectedTower = null;
    messageEl.textContent = "Selection cancelled. Click a tower to select a disk.";
    render();
    return;
  }

  const disk = towers[selectedTower][towers[selectedTower].length - 1];
  const destinationTop = towers[index][towers[index].length - 1];

  if (destinationTop !== undefined && destinationTop < disk) {
    messageEl.textContent = "Invalid move! A larger disk cannot be placed on a smaller disk.";
    selectedTower = null;
    render();
    return;
  }

  towers[index].push(towers[selectedTower].pop());
  selectedTower = null;
  moves++;
  moveCountEl.textContent = moves;
  render();

  if (towers[2].length === diskCount) {
    messageEl.textContent = `Congratulations! You solved the puzzle in ${moves} moves.`;
  } else {
    messageEl.textContent = "Nice move! Select another disk to continue.";
  }
}

towerEls.forEach((el, index) => {
  el.addEventListener("click", () => clickTower(index));
  el.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      clickTower(index);
    }
  });
});

document.getElementById("resetBtn").addEventListener("click", resetGame);
diskCountEl.addEventListener("change", resetGame);
resetGame();

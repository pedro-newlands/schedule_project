import Schedule from "./models/schedule.js";
import Activity from "./models/activity.js";
import TicTacToeLogic from "./logic.js";

const categories = ['Health', 'Leisure', 'Work'];
const logic = new TicTacToeLogic();
let schedule;
let myBoard;

function saveToLocalStorage() {
  const dataToSave = myBoard.map(row => ({
    row: row.row,
    activities: row.arr.map(slot => ({
      name: slot.activity?.getName(),
      hour: slot.activity?.getHour(),
      category: slot.activity?.getCategory(),
      status: slot.activity?.getStatus()
    }))
  }));
  localStorage.setItem('fitHome_progress', JSON.stringify(dataToSave));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('fitHome_progress');
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed.map(row => ({
      row: row.row,
      arr: row.activities.map(actData => {
        if (!actData.name) return { column: '', activity: null };
        const act = new Activity(actData.name, actData.hour, actData.category);
        act.setStatus(actData.status === 'complete' ? 1 : 0);
        return { column: '', activity: act };
      })
    }));
  }
  return null;
}

function init() {
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = '';

  myBoard = loadFromLocalStorage();
  
  if (!myBoard) {
    const activities = [
      new Activity('Walking', '08:00', 'Health'),
      new Activity('Medicine', '10:30', 'Health'),
      new Activity('Stretching', '19:00', 'Health'),
      new Activity('Reading', '09:00', 'Leisure'),
      new Activity('Gardening', '15:00', 'Leisure'),
      new Activity('Watch TV', '20:00', 'Leisure'),
      new Activity('Make Bed', '07:00', 'Work'),
      new Activity('Cooking', '12:00', 'Work'),
      new Activity('Cleaning', '18:30', 'Work')
    ];
    schedule = new Schedule(categories, activities);
    myBoard = schedule.board;
  }

  myBoard.forEach((row, i) => {
    row.arr.forEach((slot, j) => {
      const cell = document.createElement('div');
      cell.id = `cell-${i}-${j}`;
      cell.className = 'cell';
      
      updateCellVisual(cell, slot.activity);

      if (slot.activity) {
        cell.onclick = () => handleMove(i, j);
      }
      gridContainer.appendChild(cell);
    });
  });

  const initialVictories = logic.checkGameState(myBoard);
  renderVictories(initialVictories);
}

function handleMove(i, j) {
  const result = logic.selectCell(i, j, myBoard);
  const activity = myBoard[i].arr[j].activity;
  const cell = document.getElementById(`cell-${i}-${j}`);

  updateCellVisual(cell, activity);
  
  renderVictories(result.allVictories, result.latestMessage);
  saveToLocalStorage();
}

function updateCellVisual(element, activity) {
  if (!activity) return;
  element.dataset.status = activity.getStatus();
  
  element.innerHTML = `
    <span class="activity-name">${activity.getName()}</span>
    <span class="symbol">${activity.getSymbol() || ''}</span>
    <span class="time">${activity.getHour()}</span>
  `;
}

function renderVictories(victories, specificMessage = null) {
  const messageDisplay = document.getElementById('message-display');
  
  messageDisplay.classList.remove('success-theme');

  if (specificMessage) {
    messageDisplay.textContent = specificMessage;
    messageDisplay.classList.add('active');
  } else if (victories.length === 0) {
    messageDisplay.textContent = '';
    messageDisplay.classList.remove('active');
  }

  document.querySelectorAll('.victory-line').forEach(l => l.remove());
  victories.forEach(v => {
    const line = document.createElement('div');
    line.className = `victory-line ${v.type} ${v.id || ''}`;
    if (v.index !== undefined) {
      line.style.setProperty('--offset', v.index);
    }
    document.getElementById('grid-container').appendChild(line);
  }); 
}

document.getElementById('finish-btn').addEventListener('click', () => {
  const result = logic.getFinalResult(myBoard);
  
  renderFinalMessage(result.message);

  setTimeout(() => {
    resetSchedule();
  }, 5000); 
});

function renderFinalMessage(message) {
  const messageDisplay = document.getElementById('message-display');
  
  messageDisplay.textContent = message;
  messageDisplay.classList.add('active');
  messageDisplay.classList.add('success-theme');
}

function resetSchedule() {
  localStorage.removeItem('fitHome_progress');
  myBoard = null; 
  TicTacToeLogic.count = 0;
  init();
  
  const messageDisplay = document.getElementById('message-display');
  messageDisplay.textContent = '';
  messageDisplay.classList.remove('active');
}

document.getElementById('reset-btn').addEventListener('click', () => {
  if(confirm("Do you want to reset today's progress?")) {
    resetSchedule();
  }
});

init();
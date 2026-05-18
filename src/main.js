import Schedule from "./models/schedule.js";
import Activity from "./models/activity.js";
import TicTacToeLogic from "./gameLogic.js";
import getForeCast from "./http.js";
import attachWeatherToActivity from "./httpLogic.js";

const categories = ['Health', 'Study', 'Specific'];

const locationData = ['Águas claras', 'DF', 'BR'];

const logic = new TicTacToeLogic();

let mySchedule;
let board;

function saveToLocalStorage() {
  const dataToSave = {
    date: mySchedule.getDate() instanceof Date ? mySchedule.getDate().toISOString() : mySchedule.getDate(),
    board: mySchedule.getBoard().map(row => ({
      row: row.row,
      activities: row.arr.map(slot => ({
        name: slot.activity?.getName(),
        hour: slot.activity?.getHour(),
        category: slot.activity?.getCategory(),
        status: slot.activity?.getStatus(),
        isRelativeToWeatherConditions: slot.activity?.getBool()
      }))
    }))
  }

  localStorage.setItem('schedule_progress', JSON.stringify(dataToSave));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('schedule_progress');
  if (!saved) return null;

  const parsed = JSON.parse(saved);
  const loadedActivities = parsed.board.map(row => {
    return row.activities.map(actData => {
      if (!actData.name) return null;
      const act = new Activity(
        actData.name, 
        actData.hour, 
        actData.category, 
        actData.isRelativeToWeatherConditions
      );

      act.setStatus(actData.status);
      return act;
    })
    .filter(act => act !== null);
  }).flat();

  return new Schedule(categories, loadedActivities, parsed.date ? new Date(parsed.date) : new Date());
}

async function init(forcedDate = null) {
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = '';

  if (forcedDate) {
    localStorage.removeItem('schedule_progress');
    mySchedule = null;
  } else {
    mySchedule = loadFromLocalStorage();
  }
  
  if (!mySchedule) {
    const activities = [
      new Activity('Stretch', '07:00', 'Health', true),
      new Activity('Gym', '14:30', 'Health', true),
      new Activity('Diet', '23:00', 'Health', true),
      new Activity('React', '9:59', 'Study', true),
      new Activity('Pokepy', '17:00', 'Study', true),
      new Activity('Piano', '20:00', 'Study', true),
      new Activity('Interfaces Dev study', '19:00', 'Specific', true),
      new Activity('Dermatologist', '13:00', 'Specific', true),
      new Activity('Oftalmologist', '7:00', 'Specific', true)
    ];
    mySchedule = new Schedule(categories, activities, forcedDate ? forcedDate : new Date());
    saveToLocalStorage();
  }

  board = mySchedule.getBoard();

  board.forEach((row, i) => {
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

  const initialVictories = logic.checkGameState(board);
  renderVictories(initialVictories);

  try {
    const todayDataWeather = await getForeCast(locationData, mySchedule.getDate());
    
    board.forEach((row, i) => {
      row.arr.forEach((slot, j) => {
        if (slot.activity?.getBool() === true) {
          attachWeatherToActivity(slot.activity, todayDataWeather);
          const cell = document.getElementById(`cell-${i}-${j}`);
          if (cell) updateCellVisual(cell, slot.activity);
        }
      });
    });
  } catch (error) {
    console.error("Error loading weather data from API:", error);
  }
}


function handleMove(i, j) {
  const result = logic.selectCell(i, j, board);
  const activity = board[i].arr[j].activity;
  const cell = document.getElementById(`cell-${i}-${j}`);

  updateCellVisual(cell, activity);
  
  renderVictories(result.allVictories, result.latestMessage);
  saveToLocalStorage();
}

function updateCellVisual(element, activity) {
  if (!activity) return;
  element.dataset.status = activity.getStatus();
  
  let htmlWeatherIcon = '';

  if (typeof activity.getWeather === 'function') {
    const weather = activity.getWeather();

    if (weather && weather.icon) {
      htmlWeatherIcon = `
        <img src="https://openweathermap.org/img/wn/${weather.icon}.png" 
          alt="${weather.temperature}°C" 
          title="${weather.temperature}°C, ${weather.description}">
      `;
    }
  }

  element.innerHTML = ` 
    <span class="activity-name">${activity.getName()}</span>
    <span class="symbol">${activity.getSymbol() || ''}</span>
    <span class="time">${activity.getHour()}</span>
    <span class="weather-icon">${htmlWeatherIcon}</span>
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
  if (confirm("Do you want to call it a day?")){
    const result = logic.getFinalResult(board);
    
    board.forEach((row, i) => {
      row.arr.forEach((slot, j) => {
        const cell = document.getElementById(`cell-${i}-${j}`);
        if (cell && slot.activity) {
          updateCellVisual(cell, slot.activity);
        }
      });
    });

    saveToLocalStorage();

    renderFinalMessage(result.message);

    setTimeout(() => {
      const tomorrow = new Date();

      tomorrow.setDate(tomorrow.getDate() + 1);

      localStorage.removeItem('schedule_progress');
      TicTacToeLogic.count = 0;
      board = null;

      const messageDisplay = document.getElementById('message-display');
      messageDisplay.textContent = '';
      messageDisplay.classList.remove('active');
      
      init(tomorrow);
    }, 5000); 
  }
});

function renderFinalMessage(message) {
  const messageDisplay = document.getElementById('message-display');
  
  messageDisplay.textContent = message;
  messageDisplay.classList.add('active');
  messageDisplay.classList.add('success-theme');
}

function resetSchedule() {
  const currentScheduleDate = mySchedule ? mySchedule.getDate() : new Date();

  localStorage.removeItem('schedule_progress'); 
  TicTacToeLogic.count = 0;
  board = null;
  
  const messageDisplay = document.getElementById('message-display');
  messageDisplay.textContent = '';
  messageDisplay.classList.remove('active');

  init(currentScheduleDate);
}

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm("Do you want to reset today's progress?")) {
    resetSchedule();
  }
});

init();
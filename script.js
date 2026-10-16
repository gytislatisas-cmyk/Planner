const STORAGE_KEY = 'habits';

const form = document.getElementById('habit-form');
const input = document.getElementById('habit-input');
const list = document.getElementById('habit-list');

let habits = loadHabits();

// Returns today's date as a YYYY-MM-DD string in local time.
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Reads the saved habits from localStorage, or returns an empty list if none exist.
function loadHabits() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

// Writes the current habits array to localStorage.
function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

// Adds a new habit with the given name, then saves and re-renders the list.
function addHabit(name) {
  habits.push({ id: Date.now(), name: name, doneOn: null });
  saveHabits();
  render();
}

// Marks a habit as done for today, or undoes it, then saves and re-renders.
function toggleHabit(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  habit.doneOn = habit.doneOn === getToday() ? null : getToday();
  saveHabits();
  render();
}

// Removes a habit from the list, then saves and re-renders.
function deleteHabit(id) {
  habits = habits.filter((h) => h.id !== id);
  saveHabits();
  render();
}

// Rebuilds the habit list in the page from the current habits array.
function render() {
  list.innerHTML = '';

  habits.forEach((habit) => {
    const isDone = habit.doneOn === getToday();

    const item = document.createElement('li');
    item.className = 'habit' + (isDone ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isDone;
    checkbox.addEventListener('change', () => toggleHabit(habit.id));

    const name = document.createElement('span');
    name.className = 'habit-name';
    name.textContent = habit.name;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => deleteHabit(habit.id));

    item.append(checkbox, name, removeButton);
    list.appendChild(item);
  });
}

// Handles the form submit: adds the typed habit and clears the text field.
function handleSubmit(event) {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return;
  addHabit(name);
  input.value = '';
  input.focus();
}

form.addEventListener('submit', handleSubmit);
render();

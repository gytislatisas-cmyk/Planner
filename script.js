const STORAGE_KEY = 'habits';
const THEME_KEY = 'theme';

const themeToggle = document.getElementById('theme-toggle');

const form = document.getElementById('habit-form');
const input = document.getElementById('habit-input');
const list = document.getElementById('habit-list');
const weekdaysRow = document.getElementById('weekdays');

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

let habits = loadHabits();

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
  habits.push({ id: Date.now(), name: name, days: WEEKDAYS.map(() => false) });
  saveHabits();
  render();
}

// Checks or unchecks one weekday (0 = Mon ... 6 = Sun) for a habit, then saves.
function toggleDay(id, dayIndex) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  habit.days[dayIndex] = !habit.days[dayIndex];
  saveHabits();
}

// Unchecks all seven weekdays for one habit, then saves and re-renders.
function clearWeek(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  habit.days = WEEKDAYS.map(() => false);
  saveHabits();
  render();
}

// Removes a habit from the list, then saves and re-renders.
function deleteHabit(id) {
  habits = habits.filter((h) => h.id !== id);
  saveHabits();
  render();
}

// Fills the header row with the three-letter weekday labels, Monday to Sunday.
function renderWeekdays() {
  weekdaysRow.innerHTML = '';

  const spacer = document.createElement('span');
  weekdaysRow.appendChild(spacer);

  WEEKDAYS.forEach((day) => {
    const label = document.createElement('span');
    label.className = 'weekday';
    label.textContent = day;
    weekdaysRow.appendChild(label);
  });
}

// Rebuilds the habit list in the page: name, seven day checkboxes, and Remove.
function render() {
  list.innerHTML = '';

  habits.forEach((habit) => {
    const item = document.createElement('li');
    item.className = 'habit habit-row';

    const name = document.createElement('span');
    name.className = 'habit-name';
    name.textContent = habit.name;
    item.appendChild(name);

    WEEKDAYS.forEach((day, index) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'day-checkbox';
      checkbox.title = day;
      checkbox.checked = Boolean(habit.days && habit.days[index]);
      checkbox.addEventListener('change', () => {
        if (!habit.days) habit.days = WEEKDAYS.map(() => false);
        toggleDay(habit.id, index);
      });
      item.appendChild(checkbox);
    });

    const actions = document.createElement('div');
    actions.className = 'actions';

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove habit';
    removeButton.addEventListener('click', () => deleteHabit(habit.id));

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Remove weekly results';
    clearButton.addEventListener('click', () => clearWeek(habit.id));

    actions.append(removeButton, clearButton);
    item.appendChild(actions);

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

// Switches dark mode on or off, updates the button label, and saves the choice.
function setDarkMode(enabled) {
  document.body.classList.toggle('dark', enabled);
  themeToggle.textContent = enabled ? 'Light mode' : 'Dark mode';
  localStorage.setItem(THEME_KEY, enabled ? 'dark' : 'light');
}

form.addEventListener('submit', handleSubmit);
themeToggle.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark'));
});
setDarkMode(localStorage.getItem(THEME_KEY) === 'dark');
renderWeekdays();
render();

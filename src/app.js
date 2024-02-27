import './css/bootstrap.css';
import './css/style.css';
import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';

// Initializes CalorieTracker (including event listeners to connect CalorieTracker to the UI)
// Manage the creation/deletion of meals, and workouts
class App {
  constructor() {
    this._tracker = new CalorieTracker()

    this._loadEventListeners();

    this._tracker.loadItems();
  }
  
  _loadEventListeners() {
    const mealForm = document.getElementById('meal-form');
    mealForm.addEventListener('submit', this._newItem.bind(this, 'meal'));
    
    const workoutForm = document.getElementById('workout-form');
    workoutForm.addEventListener('submit', this._newItem.bind(this, 'workout'));

    const mealsEl = document.getElementById('meal-items');
    mealsEl.addEventListener('click', this._removeItem.bind(this, 'meal'));

    const workoutsEl = document.getElementById('workout-items');
    workoutsEl.addEventListener('click', this._removeItem.bind(this, 'workout'));

    const filterMealInput = document.getElementById('filter-meals');
    filterMealInput.addEventListener('input', this._filterItems.bind(this, 'meal'));

    const filterWorkoutInput = document.getElementById('filter-workouts');
    filterWorkoutInput.addEventListener('input', this._filterItems.bind(this, 'workout'));
    
    const resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', this._reset.bind(this));

    const limitForm = document.getElementById('limit-form');
    limitForm.addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // Validate inputs
    if (name.value === '' || calories .value=== '') {
      alert('Please fill in all fields');
      return;
    }

    // Create new meal or item, add it to tracker and add it to the DOM
    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    // clear forms
    name.value = '';
    calories.value = '';

    // close collapsable form when the user submits
    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new Collapse(collapseItem, {
      toggle: true
    });
  }

  _removeItem(type, e) {
    if (e.target.classList.contains('delete')) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id');
        
        type === 'meal' 
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);
        
        e.target.closest('.card').remove();
      }
    }
  }

  _filterItems(type, e) {
    // f
    const text = e.target.value;
    const searchQuery = new RegExp(`^${text}`, 'i'); // Regex to filter elements
    const items = document.querySelectorAll(`#${type}-items .card`);

    items.forEach((item) => {
      const name = item.firstElementChild.firstElementChild.firstElementChild.textContent;
      
      // hides item if it doesnt match search query
      if (searchQuery.test(name)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _setLimit(e) {
    e.preventDefault();
    const checkNumerical = /^(0|[1-9][0-9]*)$/;
    const limit = document.getElementById('limit');
    
    // Input validation
    if (!checkNumerical.test(Math.round(+limit.value)) || limit.value === '') {
      alert("Please enter a valid number");
      return;
    }

    this._tracker.setLimit(+limit.value);

    const modalEl = document.getElementById('limit-modal');
    const modal = Modal.getInstance(modalEl);
    modal.hide();

    limit.value = '';
  }

  _reset() {
    this._tracker.resetDay();
    
    // delete all meal items from DOM
    const meals = document.getElementById('meal-items');
    while (meals.firstElementChild) {
      meals.firstElementChild.remove();
    }
    // delete alll workout items from DOM
    const workouts = document.getElementById('workout-items');
    while (workouts.firstElementChild) {
      workouts.firstElementChild.remove();
    }
  }
}

const app = new App();
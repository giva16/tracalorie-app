// Where we keep track of calories, workouts, and meals
// This class is directly connected to the UI
class CalorieTracker {
  constructor() {
    this._calorieLimit = 3000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._displayCaloriesTotal();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
  }

  // Public methods/API
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index != -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      this._meals.splice(index, 1);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    
    if (index != -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  resetDay() {
    this._meals = [];
    this._workouts = [];
    this._totalCalories = 0;
    this._render();
  }

  // Private Methods
  _displayNewMeal(meal) {
    const mealsEl = document.getElementById('meal-items');

    const mealEl = document.createElement('div');
    mealEl.classList.add('card', 'my-2');
    mealEl.setAttribute('data-id', meal.id);

    mealEl.innerHTML = 
      `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
            >
            ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="delete fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;

    mealsEl.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById('workout-items');

    const workoutEl = document.createElement('div');
    workoutEl.classList.add('card', 'my-2');
    workoutEl.setAttribute('data-id', workout.id);

    workoutEl.innerHTML = 
      `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="delete fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;
    
    workoutsEl.appendChild(workoutEl);
  }

  _displayCaloriesTotal() {
    const caloriesTotalEl = document.getElementById('calories-total');
    caloriesTotalEl.textContent = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const caloriesLimitEl = document.getElementById('calories-limit');
    caloriesLimitEl.textContent = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById('calories-consumed');
    caloriesConsumedEl.textContent = this._meals.reduce((totalCal, meal) => {
      return totalCal + meal.calories;
    }, 0);
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById('calories-burned');
    caloriesBurnedEl.textContent = this._workouts.reduce((totalCal, workout) => {
      return totalCal + workout.calories;
    }, 0);
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const caloriesRemainingContainer = caloriesRemainingEl.parentElement.parentElement;
    const progressEl = document.getElementById('calorie-progress');
    const caloriesRemaining = this._calorieLimit - this._totalCalories;

    caloriesRemainingEl.textContent = caloriesRemaining;

    // Color the calories remaining tracker and pgrogress bar red if calorie limit is hit
    if (caloriesRemaining <= 0) {
      this._displayAlert(caloriesRemainingContainer, progressEl);
    } else {
      this._removeAlert(caloriesRemainingContainer, progressEl);
    }
  }

  _displayProgress() {
    const progressEl = document.getElementById('calorie-progress');
    const percentage = (this._totalCalories / this._calorieLimit) * 100;

    const width = Math.min(percentage, 100);
    progressEl.style.width = `${width}%`;
  }

  _displayAlert(caloriesRemainingContainer, progressEl) {
    caloriesRemainingContainer.classList.replace('bg-light', 'bg-danger');
    caloriesRemainingContainer.classList.add('text-white');
    progressEl.classList.add('bg-danger');
  }

  _removeAlert(caloriesRemainingContainer, progressEl) {
    caloriesRemainingContainer.classList.replace('bg-danger', 'bg-light');
    caloriesRemainingContainer.classList.remove('text-white');
    progressEl.classList.remove('bg-danger');
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesBurned();
    this._displayCaloriesConsumed();
    this._displayCaloriesRemaining();
    this._displayProgress();
  }

}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2); //Generate hexadecimal number as random id
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories, intensity) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
    this.intensity = intensity;
  }
}

// Initializes CalorieTracker (including event listeners to connect CalorieTracker to the UI)
// Manage the creation/deletion of meals, and workouts
class App {
  constructor() {
    this._tracker = new CalorieTracker()

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
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // Validate inputs
    if (name.value === '' || calories .value=== '') {
      alert('Please pill in all fields');
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
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
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
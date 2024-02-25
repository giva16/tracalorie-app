// Where we keep track of calories, workouts, and meals
// This class is directly connected to the UI
class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesBurned();
    this._displayCaloriesConsumed();
    this._displayCaloriesRemaining();
    this._displayProgress();
  }

  // Public methods/API
  addMeal(meal) {
    this._meals[meal.id] = meal;
    this._totalCalories += meal.calories;
    Storage.setTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts[workout.id] = workout;
    this._totalCalories -= workout.calories;
    Storage.setTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const meal = this._meals[id];

    if (meal != undefined) {
      this._totalCalories -= meal.calories;
      Storage.setTotalCalories(this._totalCalories);
      Storage.removeMeal(meal);
      delete this._meals[meal.id];
      this._render();
    }
  }

  removeWorkout(id) {
    const workout = this._workouts[id];
    
    if (workout != undefined) {
      this._totalCalories += workout.calories;
      Storage.setTotalCalories(this._totalCalories);
      Storage.removeWorkout(workout);
      delete this._workouts[workout.id];
      this._render();
    }
  }

  resetDay() {
    this._meals = {};
    this._workouts = {};
    this._totalCalories = 0;
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(this._calorieLimit);
    this._displayCaloriesLimit();
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

  loadItems() {
    for (const [key, meal] of Object.entries(this._meals)) {
      this._displayNewMeal(meal);
    }
    for (const [key, workout] of Object.entries(this._workouts)) {
      this._displayNewWorkout(workout);
    }
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
    let totalCal = 0;
    for (const [key, meal] of Object.entries(this._meals)) {
      totalCal += meal.calories;
    }
    caloriesConsumedEl.textContent = totalCal;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById('calories-burned');
    let totalCal = 0;
    for (const [key, workout] of Object.entries(this._workouts)) {
      totalCal += workout.calories;
    }
    caloriesBurnedEl.textContent = totalCal;
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

// Storage class with static methods to presist all data
class Storage {
  static getCalorieLimit(defaultLimit = 3000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit');
    }
    return calorieLimit;
  }

  // Save calorie limit when the user sets their daily limit
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  // get total calories from storage if there is one
  static getTotalCalories(defaultTotalCalories = 0) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultTotalCalories;
    } else {
      totalCalories = +localStorage.getItem('totalCalories');
    }
    return totalCalories;
  }

  // Save the total calories every time a meal/workout is added/removed
  static setTotalCalories(totalCalories) {
    localStorage.setItem('totalCalories', totalCalories);
  }

  static getMeals() {
    let meals;
    // initialize a meals array storage if theres none in storage
    if (localStorage.getItem('meals') === null) {
      meals = {};
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  // save the meal to storage every time it is added by the user
  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals[meal.id] = meal;
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  // remove the meal from storage if its deleted by the user
  /* NOTE: I've opted to use objects due to its 
   * hashing capabilities yielding O(1) search time complexity */
  static removeMeal(meal) {
    let meals;

    // get meals from storage
    if (localStorage.getItem('meals') === null) {
      return;
    }
    meals = JSON.parse(localStorage.getItem('meals'));

    // delete the specified meal
    delete meals[meal.id];

    //save back to storage
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;

    if (localStorage.getItem('workouts') === null) {
      workouts = {};
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }

  // save the meal to storage every time it is added by the user
  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts[workout.id] = workout;
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(workout) {
    let workouts;

    if (localStorage.getItem('workouts') === null) {
      return;
    }
    workouts = JSON.parse(localStorage.getItem('workouts'));

    delete workouts[workout.id];

    //save back to storage
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem('meals');
    localStorage.removeItem('workouts');
    localStorage.removeItem('totalCalories');
  }
}

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
    const modal = bootstrap.Modal.getInstance(modalEl);
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
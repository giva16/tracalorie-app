import Storage from "./Storage";

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

export default CalorieTracker;
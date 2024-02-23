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
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
  }

  // Private Methods
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
    const caloriesRemaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.textContent = this._calorieLimit - this._totalCalories;

    if (caloriesRemaining <= 200) {
      caloriesRemainingEl.classList.replace('bg-light', 'bg-danger');
      caloriesRemainingEl.classList.add('text-white');
    } else if (caloriesRemainingEl.classList.contains('bg-red')) {
      caloriesRemainingEl.classList.replace('bg-danger', 'bg-light')
      caloriesRemainingEl.classList.remove('text-white');
    }
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesBurned();
    this._displayCaloriesConsumed();
    this._displayCaloriesRemaining();
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

const tracker = new CalorieTracker();

const breakfast = new Meal('Breakfast', 1000);
tracker.addMeal(breakfast);

const lunch = new Meal('Lunch', 500);
tracker.addMeal(lunch);

const basketball = new Workout('Basketball match', 700, 5);
tracker.addWorkout(basketball);

console.log(tracker);
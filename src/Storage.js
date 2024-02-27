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

export default Storage;
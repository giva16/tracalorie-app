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

export {Meal, Workout};
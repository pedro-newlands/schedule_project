export default class Activity {
  static symbolsOptions = ['X', 'O'];

  constructor(name, hour, category, bool) {
    this.name = name;
    this.hour = hour;
    this.category = category;
    this.status = 'pending';
    this.isRelativeToWeatherConditions = bool;
  }

  getName() { return this.name }
  getHour() { return this.hour }
  getCategory() { return this.category }
  getStatus() { return this.status }
  getSymbol() { return this.symbol }
  getBool() { return this.isRelativeToWeatherConditions }

  setName(name) { this.name = name }
  setHour(hour) { this.hour = hour }
  setCategory(category) { this.category = category }

  setStatus(index) {
    if (index === 'complete') {
      this.symbol = Activity.symbolsOptions[1];
    } else if (index === 'incomplete') {
      this.symbol = Activity.symbolsOptions[0];
    }

    this.status = index;
  }
}

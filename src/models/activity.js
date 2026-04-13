export default class Activity {
  static statusOptions = ['incomplete', 'complete'];
  static symbolsOptions = ['X', 'O'];

  constructor(name, hour, category) {
    this.name = name;
    this.hour = hour;
    this.category = category;
    this.status = Activity.statusOptions[0];
    this.symbol = '';
  }

  getName() { return this.name }
  getHour() { return this.hour }
  getCategory() { return this.category }
  getStatus() { return this.status }
  getSymbol() { return this.symbol }

  setName(name) { this.name = name }
  setHour(hour) { this.hour = hour }
  setCategory(category) { this.category = category }

  setStatus(index) {
    const i = (index === 1 || index === 'complete') ? 1 : 0;

    this.status = Activity.statusOptions[i];
    this.symbol = Activity.symbolsOptions[i];
  }
}

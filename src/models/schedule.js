export default class Schedule {
  static shifts = [
    { shift: 'morning', between: ['3:00', '10:59'] },
    { shift: 'afternoon', between: ['11:00', '18:59'] },
    { shift: 'evening', between: ['19:00', '2:59'] }
  ];

  constructor(categories, activities, date) {
    this.date = date;
    this.categories = categories.slice(0, 3);

    this.activities = activities.filter(activity => 
      this.categories.includes(activity.getCategory())
    );
    
    this.board = [];
    this.#generateBoard(this.categories.length, Schedule.shifts.length);
  }

  #generateBoard(rows, columns) {
    for (let i = 0; i < rows; i++) {
      const categoryName = this.categories[i];
      let rowData = { row: categoryName, arr: [] };
      
      for (let j = 0; j < columns; j++) {
        const shift = Schedule.shifts[j];
        
        const match = this.activities.find(act => 
          act.getCategory() === categoryName && 
          this.#compareHourToShift(act.getHour(), ...shift.between)
        );

        rowData.arr.push({ 
          column: shift.shift, 
          activity: match || null 
        });
      }

      this.board.push(rowData);
    }
  }

  #convertToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
  }

  #compareHourToShift(hour, start, end) {
    const currentMin = this.#convertToMinutes(hour);
    const startMin = this.#convertToMinutes(start);
    const endMin = this.#convertToMinutes(end);

    // Caso o turno vire a noite (ex: 19:00 até 2:59)
    if (startMin > endMin) {
      return currentMin >= startMin || currentMin <= endMin;
    }
    
    return currentMin >= startMin && currentMin <= endMin;
  }

  getBoard() { return this.board; };
  
  getDate() { return this.date};
}
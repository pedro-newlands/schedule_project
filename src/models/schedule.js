export default class Schedule {
  static shifts = [
    { shift: 'morning', between: ['02:00', '09:59'] },
    { shift: 'afternoon', between: ['10:00', '17:59'] },
    { shift: 'evening', between: ['18:00', '01:59'] }
  ];

  constructor(categories, activities) {
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

  #compareHourToShift(hour, start, end) {
    if (start > end) {
      return hour >= start || hour <= end;
    }
    return hour >= start && hour <= end;
  }
}


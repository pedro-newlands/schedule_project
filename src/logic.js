export default class TicTacToeLogic {
  static count = 0;

  selectCell(i, j, board) {
    const targetActivity = board[i].arr[j].activity;
    if (!targetActivity) return null;

    const previousVictories = this.checkGameState(board);

    if (targetActivity.getStatus() === 'complete') {
      targetActivity.setStatus(0);
      TicTacToeLogic.count--;
    } else {
      targetActivity.setStatus(1);
      TicTacToeLogic.count++;
    }

    const currentVictories = this.checkGameState(board);

    const newVictory = currentVictories.find(curr =>
      !previousVictories.some(prev =>
        prev.type === curr.type && prev.index === curr.index && prev.id === curr.id
      )
    );

    return {
      allVictories: currentVictories,
      latestMessage: newVictory ? newVictory.message : null
    };
  }

  checkGameState(board) {
    const victories = [];
    const size = board.length;

    for (let i = 0; i < size; i++) {
      if (board[i].arr.every(slot => slot.activity?.getStatus() === 'complete')) {
        victories.push({
          type: 'row',
          index: i,
          label: board[i].row,
          message: `Congratulations! You concluded the ${board[i].row} category.`
        });
      }
    }

    for (let j = 0; j < size; j++) {
      let colComplete = true;
      for (let i = 0; i < size; i++) {
        if (board[i].arr[j].activity?.getStatus() !== 'complete') {
          colComplete = false;
          break;
        }
      }
      if (colComplete) {
        const period = board[0].arr[j].column;
        victories.push({
          type: 'column',
          index: j,
          label: period,
          message: `Incredible! You completed the ${period} period.`
        });
      }
    }

    let mainDiagCount = 0;
    let secDiagCount = 0;
    for (let i = 0; i < size; i++) {
      if (board[i].arr[i].activity?.getStatus() === 'complete') mainDiagCount++;
      if (board[i].arr[size - 1 - i].activity?.getStatus() === 'complete') secDiagCount++;
    }

    if (mainDiagCount === size) {
      victories.push({ type: 'diagonal', id: 'main', message: "Perfect diagonal balance!" });
    }
    if (secDiagCount === size) {
      victories.push({ type: 'diagonal', id: 'secondary', message: "Perfect diagonal balance!" });
    }

    return victories;
  }

  getFinalResult(board) {
    const victories = this.checkGameState(board);

    if (victories.length === 8) {
      return {
        status: 'perfect',
        victories: victories,
        message: "Absolute Harmony! You've achieved total balance across all categories and times."
      };
    }

    if (victories.length > 0) {
      return {
        status: 'winner',
        victories: victories,
        message: `Great job! You achieved ${victories.length} complete sequences today.`
      };
    }

    return {
      status: 'finished',
      victories: [],
      message: `Day completed! You fulfilled ${TicTacToeLogic.count} goals. Let's aim for a sequence tomorrow!`
    };
  }
}
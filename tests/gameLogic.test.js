import TicTacToeLogic from '../src/gameLogic.js';
import Activity from '../src/models/activity.js';

const createMockBoard = () => {
  const categories = ['Health', 'Leisure', 'Work'];
  const periods = ['Morning', 'Afternoon', 'Evening'];

  return categories.map(cat => ({
    row: cat,
    arr: periods.map(p => ({
      column: p,
      activity: new Activity('Task', '00:00', cat)
    }))
  }));
};

describe('TicTacToeLogic - English Business Rules', () => {
  let logic;
  let board;

  beforeEach(() => {
    logic = new TicTacToeLogic();
    board = createMockBoard();
    TicTacToeLogic.count = 0;
  });

  test('Should detect a simple row victory using checkGameState', () => {
    board[0].arr.forEach((slot, j) => logic.selectCell(0, j, board));

    const victories = logic.checkGameState(board);
    
    expect(victories.length).toBe(1);
    expect(victories[0].type).toBe('row');
    expect(victories[0].label).toBe('Health');
  });

  test('Should detect a row victory and return the correct latestMessage', () => {
    logic.selectCell(0, 0, board);
    logic.selectCell(0, 1, board);

    const result = logic.selectCell(0, 2, board);

    expect(result.allVictories.length).toBe(1);
    expect(result.latestMessage).toContain('concluded the Health category');
  });

  test('Should detect multiple victories (row and column) at once', () => {
    logic.selectCell(0, 0, board);
    logic.selectCell(0, 1, board);
    logic.selectCell(0, 2, board);
    logic.selectCell(1, 0, board);
    logic.selectCell(2, 0, board);

    const victories = logic.checkGameState(board);

    expect(victories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'row', index: 0 }),
        expect.objectContaining({ type: 'column', index: 0 })
      ])
    );
  });

  test('Should return "perfect" status when all 8 sequences are met', () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        logic.selectCell(i, j, board);
      }
    }

    const result = logic.getFinalResult(board);

    expect(result.status).toBe('perfect');
    expect(result.victories.length).toBe(8);
    expect(result.message).toContain('Absolute Harmony');
  });

  test('Should return "finished" status for partial completion without sequences', () => {
    logic.selectCell(0, 0, board);
    logic.selectCell(1, 1, board);

    const result = logic.getFinalResult(board);

    expect(result.status).toBe('finished');
    expect(result.message).toContain('fulfilled 2 goals');
  });
});
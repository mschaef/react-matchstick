
import {
    createBoard,
    setMatchStick,
    SIDE_LEFT,
    SIDE_TOP
} from './MatchstickModel';

export function getDefaultBoard() {
    let board = createBoard(4, 4);

    /*
     board = setMatchStick(board, 0, 1, SIDE_LEFT, true);
     board = setMatchStick(board, 1, 1, SIDE_LEFT, true);        
     board = setMatchStick(board, 0, 1, SIDE_TOP , true);
     board = setMatchStick(board, 0, 2, SIDE_TOP , true);
     board = setMatchStick(board, 1, 2, SIDE_TOP , true);
     board = setMatchStick(board, 2, 2, SIDE_TOP , true);
     board = setMatchStick(board, 1, 0, SIDE_LEFT, true);
     board = setMatchStick(board, 1, 0, SIDE_TOP , true);
     board = setMatchStick(board, 2, 0, SIDE_TOP , true);
     board = setMatchStick(board, 2, 1, SIDE_TOP , true);        
     */

    board = setMatchStick(board, 0, 0, SIDE_LEFT, true);
    board = setMatchStick(board, 0, 1, SIDE_LEFT, true);
    board = setMatchStick(board, 0, 2, SIDE_LEFT, true);
    board = setMatchStick(board, 0, 3, SIDE_TOP , true);
    board = setMatchStick(board, 1, 3, SIDE_TOP , true);
    board = setMatchStick(board, 2, 3, SIDE_TOP , true);
    board = setMatchStick(board, 1, 0, SIDE_LEFT, true);
    board = setMatchStick(board, 1, 1, SIDE_LEFT, true);
    board = setMatchStick(board, 1, 2, SIDE_TOP , true);
    board = setMatchStick(board, 2, 1, SIDE_LEFT, true);
    board = setMatchStick(board, 3, 0, SIDE_LEFT, true);
    board = setMatchStick(board, 3, 1, SIDE_LEFT, true);
    board = setMatchStick(board, 3, 2, SIDE_LEFT, true);
    board = setMatchStick(board, 1, 0, SIDE_TOP , true);
    board = setMatchStick(board, 2, 0, SIDE_TOP , true);        
    
    return board;
}

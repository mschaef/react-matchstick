import Immutable from 'immutable';

function FAIL(error) {
    throw new Exception(error);
}

export const SIDE_LEFT = true;
export const SIDE_TOP = false;

export function createBoard(sx, sy) {
    return {
        sx,
        sy,
        board: (new Array((sx * 3) * (sy + 1))).fill(false)
    };
}

export function boardDifference(boardX, boardY) {
    if ((boardX.sx != boardY.sx) || (boardX.sy != boardY.sy))
        FAIL("Boards of differing sizes");

    let result = createBoard(boardX.sx, boardY.sy);

    for(let ii = 0; ii < boardX.board.length; ii++) {
        result.board[ii] = boardX.board[ii] && !boardY.board[ii];
    }

    return result;
}

export function copyBoard(board) {
    return {
        sx: board.sx,
        sy: board.sy,
        board: board.board.slice(0)
    };
        
}

export function _setMatchStick(board, x, y, sideLeft, present) {
    let ofs = ((2 * x) + (sideLeft ? 0 : 1)) + (board.sx * 3 * y);
    board.board[ofs] = present;
}

export function setMatchStick(board, x, y, sideLeft, present) {
    let newBoard = copyBoard(board);
    
    _setMatchStick(newBoard, x, y, sideLeft, present);
    
    return newBoard;
}

export function getMatchStick(board, x, y, sideLeft) {
    let ofs = (2 * x) + (sideLeft ? 0 : 1) + (board.sx * 3 * y);
    
    return board.board[ofs];
}

export function isSquareAt(board, x, y, size) {
            
    let { sx, sy } = board;

    if ((x < 0) || (y < 0) || (x + size > sx) || (y + size > sy))
        return false;

    for(let cx = x; cx < x + size; cx++) {
        if (!getMatchStick(board, cx, y, SIDE_TOP))
            return false;

        if (!getMatchStick(board, cx, y + size, SIDE_TOP))
            return false;
    }

    for(let cy = y; cy < y + size; cy++) {
        if (!getMatchStick(board, x, cy, SIDE_LEFT))
            return false;

        if (!getMatchStick(board, x + size, cy, SIDE_LEFT))
            return false;
    }
    
    return true;
}

export function setSquare(board, x, y, size) {
    let newBoard = copyBoard(board);

    let { sx, sy } = board;

    if ((x < 0) || (y < 0) || (x + size > sx) || (y + size > sy))
        FAIL("Square parameters out of range.");

    for(let cx = x; cx < x + size; cx++) {
        _setMatchStick(newBoard, cx, y, SIDE_TOP, true);
        _setMatchStick(newBoard, cx, y + size, SIDE_TOP, true);
    }

    for(let cy = y; cy < y + size; cy++) {
        _setMatchStick(newBoard, x, cy, SIDE_LEFT, true);
        _setMatchStick(newBoard, x + size, cy, SIDE_LEFT, true);
    }

    return newBoard;
}

export function getSquares(board) {
    let { sx, sy } = board;

    let squares = Immutable.List();
    
    for(let cx = 0; cx < sx; cx++) {
        for(let cy = 0; cy < sy; cy++) {
            let maxSize = Math.min(sx - cx, sy - cy);

            for(let size = 1; size <= maxSize; size++) {
                if(isSquareAt(board, cx, cy, size)) {
                    squares = squares.push(Immutable.fromJS({ x: cx, y: cy, size }));
                }
            }
        }
    }

    return squares;
}

export function setSquares(board, squares) {
    return squares.reduce((board, square) => setSquare(board, square.get('x'), square.get('y'), square.get('size')), board);
}

function queryStickLocations(board, queryValue) {
    let { sx, sy } = board;

    let sticks = Immutable.List();

    for(let cx = 0; cx <= sx; cx++) {
        for(let cy = 0; cy <= sy; cy++) {
            if ((cx < sx) && (getMatchStick(board, cx, cy, SIDE_TOP) == queryValue))
                sticks = sticks.push(Immutable.fromJS({ x : cx, y : cy , side: SIDE_TOP}));

            if ((cy < sy) && (getMatchStick(board, cx, cy, SIDE_LEFT) == queryValue))
                sticks = sticks.push(Immutable.fromJS({ x : cx, y : cy , side: SIDE_LEFT}));
        }
    }

    return sticks;
}

export function getAllSticks(board) {
    return queryStickLocations(board, true);
}

export function getAllEmptySticks(board) {
    return queryStickLocations(board, false);
}

export function countSticks(board) {
    let counter = 0;

    for(let ii = 0; ii < board.board.length; ii++) {
        if (board.board[ii])
            counter++;
    }

    return counter;
}

function moveStick(board, from, to) {
    let newBoard = copyBoard(board);
    
    _setMatchStick(newBoard, from.get('x'), from.get('y'), from.get('side'), false);
    _setMatchStick(newBoard, to.get('x'), to.get('y'), to.get('side'), true);

    return newBoard;
}

function boardsEqual(boardX, boardY) {
    if (boardX.sx != boardY.sx)
        return false;

    if (boardX.sy != boardY.sy)
        return false;

    for(let ii = 0; ii < boardX.board.length; ii++) {
        if (boardX.board[ii] != boardY.board[ii])
            return false;
    }

    return true;
}

var count = 0;
var squareTestCount = 0;

function boardMeetsSearchCriteria(board, targetSquares) {
    let squares = getSquares(board);

    if (squares.size != targetSquares)
        return false;

    squareTestCount++;

    let testBoard = setSquares(createBoard(board.sx, board.sy), squares);    

    return boardsEqual(board, testBoard);
}


function search0(boards, maxDepth, targetSquares) {

    count++;
    
    let currentBoard = boards.last();

    if (boardMeetsSearchCriteria(currentBoard, targetSquares))        
        return boards;
    
    if (maxDepth <= 0)
        return null;

    let sticks = getAllSticks(currentBoard);
    let emptySticks = getAllEmptySticks(currentBoard);
    
    for(let fromIndex = 0; fromIndex < sticks.size; fromIndex++) {
        for(let toIndex = 0; toIndex < emptySticks.size; toIndex++) {

            let newBoard = moveStick(currentBoard, sticks.get(fromIndex), emptySticks.get(toIndex));

            if (boards.has(newBoard))
                continue;
            
            let found = search0(boards.push(newBoard), maxDepth - 1, targetSquares);

            if (found)
                return found;
        }
    }

    return null;
}

export function search(board, maxDepth, targetSquares) {
    count = 0;
    squareTestCount = 0;
    
    let result = search0(Immutable.List().push(board), maxDepth, targetSquares);

    console.error("n=", count, squareTestCount);
    
    return result;
}

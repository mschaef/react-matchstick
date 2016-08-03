import Immutable from 'immutable';

function FAIL(error) {
    throw new Exception(error);
}

export const SIDE_LEFT = true;
export const SIDE_TOP = false;

export function createBoard(sx, sy) {
    return Immutable.Map()
        .set('sx', sx)
        .set('sy', sy)
        .set('board', Immutable.List(Immutable.Repeat(false, (sx * 3) * (sy + 1))));
}

export function getBoardDimensions(board) {
    return {
        sx: board.get('sx'),
        sy: board.get('sy')
    };
}

function matchStickOffset(board, x, y, sideLeft) {
    return ((2 * x) + (sideLeft ? 0 : 1)) + (board.get('sx') * 3 * y);
}

function _setMatchStick(board, mutator, x, y, sideLeft, present) {
    const ofs = matchStickOffset(board, x, y, sideLeft);

    mutator.set(ofs, present);
}

export function setMatchStick(board, x, y, sideLeft, present) {
    const ofs = matchStickOffset(board, x, y, sideLeft);

    return board.setIn(['board', ofs], present);
}

export function getMatchStick(board, x, y, sideLeft) {
    const ofs = matchStickOffset(board, x, y, sideLeft);
    
    return board.getIn(['board',ofs]);
}

export function isSquareAt(board, x, y, size) {
    const sx = board.get('sx');
    const sy = board.get('sy');

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
    let vec = board.get('board');

    const sx = board.get('sx');
    const sy = board.get('sy');
    
    if ((x < 0) || (y < 0) || (x + size > sx) || (y + size > sy))
        FAIL("Square parameters out of range.");

    vec = vec.withMutations(mutator => {
        for(let cx = x; cx < x + size; cx++) {
            _setMatchStick(board, mutator, cx, y, SIDE_TOP, true);
            _setMatchStick(board, mutator, cx, y + size, SIDE_TOP, true);
        }

        for(let cy = y; cy < y + size; cy++) {
            _setMatchStick(board, mutator, x, cy, SIDE_LEFT, true);
            _setMatchStick(board, mutator, x + size, cy, SIDE_LEFT, true);
        }
    });

    return board.set('board', vec);
}

export function getSquares(board) {
    const sx = board.get('sx');
    const sy = board.get('sy');

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

export function countSquares(board) {

    const sx = board.get('sx');
    const sy = board.get('sy');

    let squareCount = 0;
    
    for(let cx = 0; cx < sx; cx++) {
        for(let cy = 0; cy < sy; cy++) {
            let maxSize = Math.min(sx - cx, sy - cy);

            for(let size = 1; size <= maxSize; size++) {
                if(isSquareAt(board, cx, cy, size)) {
                    squareCount++;
                }
            }
        }
    }

    return squareCount;
}

export function setSquares(board, squares) {
    return squares.reduce((board, square) => setSquare(board, square.get('x'), square.get('y'), square.get('size')), board);
}

function queryStickLocations(board, queryValue) {

    const sx = board.get('sx');
    const sy = board.get('sy');

    let sticks = [];

    for(let cx = 0; cx <= sx; cx++) {
        for(let cy = 0; cy <= sy; cy++) {
            if ((cx < sx) && (getMatchStick(board, cx, cy, SIDE_TOP) == queryValue))
                sticks.push({ x : cx, y : cy , side: SIDE_TOP});

            if ((cy < sy) && (getMatchStick(board, cx, cy, SIDE_LEFT) == queryValue))
                sticks.push({ x : cx, y : cy , side: SIDE_LEFT});
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
    let vec = board.get('board');

    vec = vec.withMutations(mutator => {
        _setMatchStick(board, mutator, from.x, from.y, from.side, false);
        _setMatchStick(board, mutator, to.x, to.y, to.side, true);
    });

    return board.set('board', vec);
}

var count = 0;
var squareTestCount = 0;

function boardMeetsSearchCriteria(board, targetSquares) {
    if (countSquares(board) != targetSquares)
        return false;

    squareTestCount++;

    let testBoard = setSquares(createBoard(board.get('sx'), board.get('sy')),
                               getSquares(board));

    return board.equals(testBoard);
}


function search0(boards, maxDepth, targetSquares) {
    count++;

    if (count % 1000 == 0) {
        console.log('count', count);
    }

    let currentBoard = boards.last();

    if (boardMeetsSearchCriteria(currentBoard, targetSquares))        
        return boards;

    if (maxDepth <= 0)
        return null;

    let sticks = getAllSticks(currentBoard);
    let emptySticks = getAllEmptySticks(currentBoard);

    for(let fromIndex = 0; fromIndex < sticks.length; fromIndex++) {
        for(let toIndex = 0; toIndex < emptySticks.length; toIndex++) {

            let newBoard = moveStick(currentBoard,
                                     sticks[fromIndex], emptySticks[toIndex]);

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

    const startT = new Date().getTime();
    
    let result = search0(Immutable.List().push(board), maxDepth, targetSquares);

    const lastSearchTime = new Date().getTime() - startT;
    
    console.error("n=", count, squareTestCount, result);
    
    return {
        result: result ? result.last() : null,
        count,
        squareTestCount,
        lastSearchTime
    };
}

export function boardToJson(board) {
    return board.toJS();
}

export function jsonToBoard(json) {
    return Immutable.fromJS(json);
}

import Immutable from 'immutable';

export const SIDE_LEFT = true;
export const SIDE_TOP = false;

function squareToBoardX(x, sideLeft) {
    if (sideLeft)
        return 2 * x;
    else
        return 2 * x + 1;
}

export function createBoard(sx, sy) {
    let row = Immutable.List(Immutable.Repeat(false, sy * 3));

    return Immutable.Map()
        .set('sx', sx)
        .set('sy', sy)
        .set('board', Immutable.List(Immutable.Repeat(row, sx + 1)));
}

export function setMatchStick(board, x, y, sideLeft, present) {
    return board.setIn(['board', y, squareToBoardX(x, sideLeft)], present);
}

export function getMatchStick(board, x, y, sideLeft) {
    return board.getIn(['board', y, squareToBoardX(x, sideLeft)]);
}

export function isSquareAt(board, x, y, size) {
            
    let { sx, sy } = board.toJS();

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

export function getSquares(board) {
    let { sx, sy } = board.toJS();

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

function queryStickLocations(board, queryValue) {
    let { sx, sy } = board.toJS();

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

function moveStick(board, from, to) {
    let temp = setMatchStick(board, from.get('x'), from.get('y'), from.get('side'), false);

    return setMatchStick(temp, to.get('x'), to.get('y'), to.get('side'), true);
}

var count = 0;

function search0(boards, maxDepth, targetSquares) {

    count++;
    
    let currentBoard = boards.last();

    if ((maxDepth == 0) && (getSquares(currentBoard).size >= targetSquares))
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
    
    let result = search0(Immutable.List().push(board), maxDepth, targetSquares);

    console.error("n=", count);
    
    return result;
}

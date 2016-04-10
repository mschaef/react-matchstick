import Immutable from 'immutable';

function squareToBoard(pos, side) {
    let { x, y } = pos;
    
    switch(side) {
    case 'top':    return { x: 2 * x + 1, y : y     };
    case 'bottom': return { x: 2 * x + 1, y : y + 1 };
    case 'left':   return { x: 2 * x    , y : y     };
    case 'right':  return { x: 2 * x + 2, y : y     };
    default: return FAIL("bad side: " + side);
    }
}

export function createBoard(sx, sy) {
    let row = Immutable.List(Immutable.Repeat(false, sy * 3));

    return Immutable.Map()
        .set('sx', sx)
        .set('sy', sy)
        .set('board', Immutable.List(Immutable.Repeat(row, sx + 1)));
}

export function setMatchStick(board, spos, side, present) {
    let { x, y } = squareToBoard(spos, side);

    return board.setIn(['board', y, x], present);
}

export function getMatchStick(board, spos, side) {
    let { x, y } = squareToBoard(spos, side);

    return board.getIn(['board', y, x]);
}

export function isSquareAt(board, spos, size) {
    let { x, y } = spos;

    let { sx, sy } = board.toJS();

    if ((x < 0) || (y < 0) || (x + size > sx) || (y + size > sy))
        return false;

    for(let cx = x; cx < x + size; cx++) {
        if (!getMatchStick(board, { x: cx, y }, 'top'))
            return false;

        if (!getMatchStick(board, { x: cx, y: y + size - 1}, 'bottom'))
            return false;
    }

    for(let cy = y; cy < y + size; cy++) {
        if (!getMatchStick(board, { x , y: cy }, 'left'))
            return false;

        if (!getMatchStick(board, { x: x + size - 1, y: cy }, 'right'))
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
                if(isSquareAt(board, { x: cx, y: cy }, size)) {
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
            
            if ((cx < sx) && (getMatchStick(board, { x : cx, y : cy }, 'top') == queryValue))
                sticks = sticks.push(Immutable.fromJS({ x : cx, y : cy , side: 'top'}));

            if ((cy < sy) && (getMatchStick(board, { x : cx, y : cy }, 'left') == queryValue))
                sticks = sticks.push(Immutable.fromJS({ x : cx, y : cy , side: 'left'}));
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
    let temp = setMatchStick(board, { x: from.get('x'), y: from.get('y') }, from.get('side'), false);

    return setMatchStick(temp, { x: to.get('x'), y: to.get('y') }, to.get('side'), true);
}

var count = 0;

function search0(boards, maxDepth, targetSquares) {

    count++;
    
    let currentBoard = boards.last();

    if ((getSquares(currentBoard).size >= targetSquares) && (maxDepth == 0))
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

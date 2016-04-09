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

    if ((x < 0) || (y < 0) || (x + size >= sx) || (y + size >= sy))
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

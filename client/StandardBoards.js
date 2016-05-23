import _ from 'lodash';

import {
    createBoard,
    setMatchStick,
    SIDE_LEFT,
    SIDE_TOP
} from './MatchstickModel';

const standardBoards = {
    "Simple" : {
        size: { x: 4, y: 4 },
        sticks: [
            { x: 0, y:1, side: SIDE_LEFT },
            { x: 1, y:1, side: SIDE_LEFT },
            { x: 0, y:1, side: SIDE_TOP  },
            { x: 0, y:2, side: SIDE_TOP  },
            { x: 1, y:2, side: SIDE_TOP  },
            { x: 2, y:2, side: SIDE_TOP  },
            { x: 1, y:0, side: SIDE_LEFT },
            { x: 1, y:0, side: SIDE_TOP  },
            { x: 2, y:0, side: SIDE_TOP  },
            { x: 2, y:1, side: SIDE_TOP  }
        ],
        params: { targetMatchSticks: 3, targetSquares: 2 }
    },
    "Complex": {
        size: { x: 4, y: 4},
        sticks: [
            { x: 0, y: 0, side: SIDE_LEFT },
            { x: 0, y: 1, side: SIDE_LEFT },
            { x: 0, y: 2, side: SIDE_LEFT },
            { x: 0, y: 3, side: SIDE_TOP  },
            { x: 1, y: 3, side: SIDE_TOP  },
            { x: 2, y: 3, side: SIDE_TOP  },
            { x: 1, y: 0, side: SIDE_LEFT },
            { x: 1, y: 1, side: SIDE_LEFT },
            { x: 1, y: 2, side: SIDE_TOP  },
            { x: 2, y: 1, side: SIDE_LEFT },
            { x: 3, y: 0, side: SIDE_LEFT },
            { x: 3, y: 1, side: SIDE_LEFT },
            { x: 3, y: 2, side: SIDE_LEFT },
            { x: 1, y: 0, side: SIDE_TOP  },
            { x: 2, y: 0, side: SIDE_TOP  }
        ],
        params: { targetMatchSticks: 3, targetSquares: 2 }    
    }
};

function getBoard(boardDefinition) {
    let { size, sticks } = boardDefinition;

    let board = createBoard(size.x, size.y);

    for(let ii = 0; ii < sticks.length; ii++) {
        const stick = sticks[ii];
        
        board = setMatchStick(board, stick.x, stick.y, stick.side, true);
    }

    return board;
}

export function getBoardNames() {
    return _.keys(standardBoards);
}

export function getBoardByName(boardName) {
    const boardDefinition = standardBoards[boardName];
    
    return {
        board: getBoard(boardDefinition),
        targetMatchSticks: boardDefinition.params.targetMatchSticks,
        targetSquares: boardDefinition.params.targetSquares
    };
}

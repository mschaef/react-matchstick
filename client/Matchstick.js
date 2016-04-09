import Immutable from 'immutable';

import React, { Component } from 'react';

import classNames from 'classnames';

function FAIL(error) {
    console.error(error);
}

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

function createBoard(sx, sy) {
    let row = Immutable.Repeat(false, sy * 3);

    return Immutable.Map()
        .set('sx', sx)
        .set('sy', sy)
        .set('board', Immutable.Repeat(row, sx + 1));
}

function setMatchStick(board, spos, side, present) {
    let { x, y } = squareToBoard(spos, side);

    return board.setIn([x, y], present);
}

function getMatchStick(board, spos, side) {
    let { x, y } = squareToBoard(spos, side);

    return board.getIn([x, y]);
}

export default class Matchstick extends Component {

    constructor(props) {
        super(props);

        this.state = {
            board: createBoard(4, 4)
        };
    }

    makeHRow(board, y, side) {
        let row = [];

        let sx = board.get('sx');
        
        for(let x = 0; x < sx; x++) {
            row.push(<td key={x + "-l"}/>);
            row.push(<td key={x + "-m"} className={classNames('h-matchstick', {'placed': getMatchStick(board, { x, y }, side)})}/>);
        }
        
        row.push(<td key={sx + "-r"}/>);

        return <tr key={y + "-" + side} className="hrow">{row}</tr>;
    }

    makeVRow(board, y) {
        let row = [];

        let sx = board.get('sx');
        
        for(let x = 0; x < sx; x++) {
            row.push(<td key={x + "-l"} className={classNames('v-matchstick', {'placed': getMatchStick(board, { x, y }, 'left')})}/>);                
            row.push(<td key={x + "-m"}/>);
        }

        row.push(<td key={sx + "-r"} className={classNames('v-matchstick', {'placed': getMatchStick(board, { sx, y }, 'left')})}/>);                
        
        return <tr key={y + "-v"} className="vrow">{row}</tr>;
    }
    


    render() {
        const board = this.state.board;
        
        let rows = [];

        let sy = board.get('sy');
        
        for(let y = 0; y < sy; y++) {
            rows.push(this.makeHRow(board, y, 'top'));
            rows.push(this.makeVRow(board, y));
        }

        rows.push(this.makeHRow(board, sy, 'top'));
        
        let table = (
            <table className="playfield">
              <tbody>
                {rows}
              </tbody>
            </table>
        );
        
        return (
            <div>
              <h1>Matchstick</h1>
              {table}
            </div>
        );
    }
}

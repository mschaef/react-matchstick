import Immutable from 'immutable';

import React, { Component } from 'react';

import classNames from 'classnames';

import {
    createBoard,
    setMatchStick,
    getMatchStick,
    getSquares
} from './MatchstickBoard';

import SquareList from './SquareList';

function FAIL(error) {
    console.error(error);
}

export default class Matchstick extends Component {

    constructor(props) {
        super(props);

        let board = createBoard(4, 4);

        this.state = { board, squares: Immutable.List() };
    }

    getStickClickHandler(spos, side) {
        return () => {
            let board = this.state.board;

            let oldStick = getMatchStick(board, spos, side);

            let newBoard = setMatchStick(board, spos, side, !oldStick);

            this.setState({
                board: newBoard,
                squares: getSquares(newBoard)
            });
        };
    }
    
    makeHRow(board, y, side) {
        let row = [];

        let sx = board.get('sx');
        
        for(let x = 0; x < sx; x++) {
            let spos = { x, y };
            
            row.push(<td key={x + "-l"}/>);
            
            row.push(<td key={x + "-m"}
                     onClick={this.getStickClickHandler(spos, side)}
                     className={classNames('h-matchstick', {
                         'placed': getMatchStick(board, spos, side)
                     })}/>);
        }
        
        row.push(<td key={sx + "-r"}/>);

        return <tr key={y + "-" + side} className="hrow">{row}</tr>;
    }

    makeVRow(board, y) {
        let row = [];

        let sx = board.get('sx');
        
        for(let x = 0; x < sx; x++) {
            let spos = { x, y };
            
            row.push(<td key={x + "-l"}
                     onClick={this.getStickClickHandler(spos, 'left')}
                     className={classNames('v-matchstick', {
                         'placed': getMatchStick(board, spos, 'left')
                     })}/>);
            
            row.push(<td key={x + "-m"}/>);
        }

        row.push(<td key={sx + "-r"}
                 onClick={this.getStickClickHandler({ x : sx, y}, 'left')}
                 className={classNames('v-matchstick', {
                     'placed': getMatchStick(board, { x : sx, y }, 'left')
                 })}/>);
        
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
              <div id="solver-config">
                Move <input/> matchsticks to make <input/> squares.
              </div>
              <div id="playfield">
                {table}
              </div>
              <div id="square-list">
                <SquareList squares={this.state.squares}/>
              </div>
            </div>
        );
    }
}

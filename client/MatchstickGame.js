import Immutable from 'immutable';

import React, { Component } from 'react';

import classNames from 'classnames';

import {
    createBoard,
    setMatchStick,
    getMatchStick,
    getSquares,
    getAllSticks,
    getAllEmptySticks,
    search
} from './MatchstickModel';

import SquareList from './SquareList';
import MatchstickPlayfield from './MatchstickPlayfield';

function FAIL(error) {
    console.error(error);
}

export default class MatchstickGame extends Component {

    constructor(props) {
        super(props);

        let board = createBoard(4, 4);

        this.state = {
            board,
            squares: Immutable.List(),
            sticks: Immutable.List(),
            emptySticks: getAllEmptySticks(board)
        };
    }

    setBoard(newBoard) {
        this.setState({
            board: newBoard,
            squares: getSquares(newBoard),
            sticks: getAllSticks(newBoard),
            emptySticks: getAllEmptySticks(newBoard)
        });
    }
    
    onStickClick(spos, side) {
        let board = this.state.board;

        let oldStick = getMatchStick(board, spos, side);

        let newBoard = setMatchStick(board, spos, side, !oldStick);
            
        this.setBoard(newBoard);
    }
    
    doSearch() {
        let newBoard = search(this.state.board, 3, 2);

        if (newBoard)
            this.setBoard(newBoard.last());
    }
    
    render() {
        return (
            <div>
              <h1>Matchstick</h1>
              <div id="solver-config">
                Move <input/> matchsticks to make <input/> squares.
              </div>
              <div id="playfield">
                <MatchstickPlayfield board={this.state.board} onClick={this.onStickClick.bind(this)}/>
              </div>
              <div id="square-list">
                {this.state.sticks.size} - 
                {this.state.emptySticks.size}
                <SquareList squares={this.state.squares}/>
              </div>

              <button onClick={this.doSearch.bind(this)}>
                Go
              </button>
            </div>
        );
    }
}

import Immutable from 'immutable';

import React, { Component } from 'react';

import classNames from 'classnames';

import {
    createBoard,
    setMatchStick,
    getMatchStick,
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

        this.state = {
            board: this.getDefaultBoard(),
            lastSearchTime : "N/A",
            targetMatchSticks: "3",
            targetSquares: "2"
        };
    }

    getDefaultBoard() {
        let board = createBoard(4, 4);

        board = setMatchStick(board, { x: 0, y: 1 }, 'left', true);
        board = setMatchStick(board, { x: 1, y: 1 }, 'left', true);        
        board = setMatchStick(board, { x: 0, y: 1 }, 'top', true);
        board = setMatchStick(board, { x: 0, y: 2 }, 'top', true);
        board = setMatchStick(board, { x: 1, y: 2 }, 'top', true);
        board = setMatchStick(board, { x: 2, y: 2 }, 'top', true);
        board = setMatchStick(board, { x: 1, y: 0 }, 'left', true);
        board = setMatchStick(board, { x: 1, y: 0 }, 'top', true);
        board = setMatchStick(board, { x: 2, y: 0 }, 'top', true);
        board = setMatchStick(board, { x: 2, y: 1 }, 'top', true);        

        return board;
    }
    
    onStickClick(spos, side) {
        let board = this.state.board;

        let oldStick = getMatchStick(board, spos, side);

        let newBoard = setMatchStick(board, spos, side, !oldStick);
            
        this.setState({ board: newBoard });
    }

    onTargetMatchSticksChange(event) {
        this.setState({ targetMatchSticks: event.target.value });
    }

    onTargetSquaresChange(event) {
        this.setState({ targetSquares: event.target.value });
    }
    
    doSearch() {
        var startT = new Date().getTime();

        let results = search(this.state.board,
                             parseInt(this.state.targetMatchSticks),
                             parseInt(this.state.targetSquares));

        this.setState({ lastSearchTime: new Date().getTime() - startT });
        
        if (results) {
            this.setState({
                board: results.last()
            });
        }
    }

    doReset() {
        this.setState({ board: this.getDefaultBoard() });
    }
    
    render() {
        return (
            <div>
              <h1>Matchstick</h1>
              <div id="solver-config">
                Move <input value={this.state.targetMatchSticks}
                            onChange={this.onTargetMatchSticksChange.bind(this)}/>
                matchsticks to make <input value={this.state.targetSquares}
                                           onChange={this.onTargetSquaresChange.bind(this)}/>
                squares.
                
                <button onClick={this.doSearch.bind(this)}>Go</button>
                <button onClick={this.doReset.bind(this)}>Reset</button>
                <span>Last Search Time: {this.state.lastSearchTime} msec.</span>
              </div>
              <div id="playfield">
                <MatchstickPlayfield board={this.state.board} onClick={this.onStickClick.bind(this)}/>
              </div>
              <div id="square-list">
                <SquareList board={this.state.board}/>
              </div>
            </div>
        );
    }
}

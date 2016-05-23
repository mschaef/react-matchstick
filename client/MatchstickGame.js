import React, { Component } from 'react';

import classNames from 'classnames';

import {
    createBoard,
    setMatchStick,
    getMatchStick,
    getAllSticks,
    getAllEmptySticks,
    getSquares,
    setSquares,
    search,
    SIDE_LEFT,
    SIDE_TOP
} from './MatchstickModel';

import {
    getDefaultBoard
} from './StandardBoards';

import SquareList from './SquareList';
import MatchstickPlayfield from './MatchstickPlayfield';

export default class MatchstickGame extends Component {

    constructor(props) {
        super(props);

        this.state = {
            board: getDefaultBoard(),
            lastSearchTime : "N/A",
            targetMatchSticks: "3",
            targetSquares: "2"
        };
    }

    onStickClick(x, y, side) {
        let board = this.state.board;

        let oldStick = getMatchStick(board, x, y, side);

        let newBoard = setMatchStick(board, x, y, side, !oldStick);

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
                board: results
            });
        }
    }

    doReset() {
        this.setState({ board: this.getDefaultBoard() });
    }

    doSquarify() {
        let currentBoard = this.state.board;

        let squares = getSquares(currentBoard);

        let newBoard = setSquares(createBoard(currentBoard.sx, currentBoard.sy), squares);

        this.setState({ board: newBoard });
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
                <button onClick={this.doSquarify.bind(this)}>Squarify</button>
                
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

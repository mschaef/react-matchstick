import 'whatwg-fetch';

import React, { Component } from 'react';

import classNames from 'classnames';

import {
    boardToJson,
    createBoard,
    setMatchStick,
    getMatchStick,
    getAllSticks,
    getAllEmptySticks,
    getBoardDimensions,
    getSquares,
    jsonToBoard,
    setSquares,
    search,
    SIDE_LEFT,
    SIDE_TOP
} from '../common/MatchstickModel';

import {
    getBoardNames,
    getBoardByName
} from './StandardBoards';

import SquareList from './SquareList';
import MatchstickPlayfield from './MatchstickPlayfield';

function BoardSelector({onReset}) {
    const entries = getBoardNames().map(name => {
        return <div className="board-name" key={name} onClick={() => onReset(name)}>
            {name}
        </div>;
    });
                                        
    return (
        <div className="board-selector">
          {entries}
        </div>
    );
};

export default class MatchstickGame extends Component {

    constructor(props) {
        super(props);

        const boardInfo = getBoardByName("1 - Simple");

        this.state = {
            board: boardInfo.board,
            lastSearchTime : "N/A",
            targetMatchSticks: boardInfo.targetMatchSticks,
            targetSquares: boardInfo.targetSquares
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
    
    setSearchResults({ result, count, squareTestCount, lastSearchTime }) {
        this.setState({
            lastSearchTime,
            count,
            squareTestCount
        });
        
        if (result) {
            this.setState({ board: result });
        }
    }
    
    doBrowserSearch() {
        const results
                  = search(this.state.board,
                           parseInt(this.state.targetMatchSticks),
                           parseInt(this.state.targetSquares));

        this.setSearchResults(results);
    }

    doServerSearch() {
        const request = {
            board: boardToJson(this.state.board),
            maxDepth: this.state.targetMatchSticks,
            targetSquares: this.state.targetSquares
        };

        return fetch(`/solve-board`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }).then(response => {
            response.json().then(response => {
                console.log('response', response);

                response.result = jsonToBoard(response.result);
                
                this.setSearchResults(response);
            });
        });
    }

    doReset(boardName) {
        const boardInfo = getBoardByName(boardName);
        
        this.setState({
            board: boardInfo.board,
            targetMatchSticks: boardInfo.targetMatchSticks,
            targetSquares: boardInfo.targetSquares
        });
    }

    doSquarify() {
        let currentBoard = this.state.board;

        let squares = getSquares(currentBoard);

        let { sx, sy } = getBoardDimensions(currentBoard);
        
        let newBoard = setSquares(createBoard(sx, sy), squares); 

        this.setState({ board: newBoard });
    }
    
    render() {
        const nSticks = getAllSticks(this.state.board).length;
        const nEmptySticks = getAllEmptySticks(this.state.board).length;

        return (
            <div>
              <h1>Matchstick</h1>
              <div className="solver-controls">
                Move <input value={this.state.targetMatchSticks}
                            onChange={this.onTargetMatchSticksChange.bind(this)}/>
                matchsticks to make <input value={this.state.targetSquares}
                                           onChange={this.onTargetSquaresChange.bind(this)}/>
                squares.
                
                <button onClick={this.doBrowserSearch.bind(this)}>Go (Browser)</button>
                <button onClick={this.doServerSearch.bind(this)}>Go (Server)</button>                
                <button onClick={this.doSquarify.bind(this)}>Squarify</button>
              </div>

              <div className="solver-controls">
                Last Search. Time: {this.state.lastSearchTime} msec., Count: {this.state.count}
              </div>
              <div id="selector">
                <BoardSelector onReset={this.doReset.bind(this)}/>
              </div>
              <div id="playfield">
                <MatchstickPlayfield board={this.state.board}
                                     onClick={this.onStickClick.bind(this)}/>
              </div>
              <div id="square-list">
                <table className="stats">
                  <tbody>
                    <tr><td className="label">Sticks</td><td>{nSticks}</td></tr>
                    <tr><td className="label">Empty Sticks</td><td>{nEmptySticks}</td></tr>
                    <tr><td className="label">Moves</td><td>{nSticks * nEmptySticks}</td></tr>
                  </tbody>
                </table>
                
                <SquareList board={this.state.board}/>
              </div>
            </div>
        );
    }
}

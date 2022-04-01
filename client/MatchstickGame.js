// Copyright (c) Mike Schaeffer. All rights reserved.
//
// The use and distribution terms for this software are covered by the
// Eclipse Public License 2.0 (https://opensource.org/licenses/EPL-2.0)
// which can be found in the file LICENSE at the root of this distribution.
// By using this software in any fashion, you are agreeing to be bound by
// the terms of this license.
//
// You must not remove this notice, or any other, from this software.

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
} from '../common/MatchstickModel.js';

import {
    getBoardNames,
    getBoardByName
} from './StandardBoards.js';

import SquareList from './SquareList.js';
import MatchstickPlayfield from './MatchstickPlayfield.js';

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


function SearchStats({serverRequestPending, lastSearchTime, count}) {

    if (serverRequestPending) {
        return (
            <div className="search-stats server-request-pending">
              Server request pending.
            </div>
        );
    }

    if (!lastSearchTime || ! count) {
        return (
            <div className="search-stats">
              No previous search.
            </div>
        );
    }

    return (
        <div className="search-stats">
          Last Search
          Time: {(lastSearchTime / 1000).toFixed(0)} sec,
          Count: {count},
          Rate: {(count / lastSearchTime * 1000).toFixed(0)}/sec.
        </div>
    );
}

export default class MatchstickGame extends Component {

    constructor(props) {
        super(props);

        const boardInfo = getBoardByName("1 - Simple");

        this.state = {
            board: boardInfo.board,
            lastSearchTime : null,
            targetMatchSticks: boardInfo.targetMatchSticks,
            targetSquares: boardInfo.targetSquares,
            serverRequestPending: false
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

        this.setState({serverRequestPending: true});

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
                this.setState({serverRequestPending: false});

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

              <SearchStats
                 serverRequestPending={this.state.serverRequestPending}
                 lastSearchTime={this.state.lastSearchTime}
                 count={this.state.count}/>

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

// Copyright (c) Mike Schaeffer. All rights reserved.
//
// The use and distribution terms for this software are covered by the
// Eclipse Public License 2.0 (https://opensource.org/licenses/EPL-2.0)
// which can be found in the file LICENSE at the root of this distribution.
// By using this software in any fashion, you are agreeing to be bound by
// the terms of this license.
//
// You must not remove this notice, or any other, from this software.

import React, { Component } from 'react';

import classNames from 'classnames';

import {
    createBoard,
    setMatchStick,
    getMatchStick,
    getSquares,
    getAllSticks,
    getAllEmptySticks,
    getBoardDimensions,
    search,
    SIDE_LEFT,
    SIDE_TOP
} from '../common/MatchstickModel.js';

import SquareList from './SquareList.js';

function bindClickHandler(onClick, x, y, side) {
    return () => onClick(x, y, side);
}

function makeHRow(board, y, onClick) {
    let row = [];

    let sx = getBoardDimensions(board).sx;

    for(let x = 0; x <= sx; x++) {
        row.push(<td key={x + "-l"}/>);

        if (x != sx)
            row.push(<td key={x + "-m"}
                     onClick={bindClickHandler(onClick, x, y, SIDE_TOP)}
                     className={classNames('h-matchstick', {
                         'placed': getMatchStick(board, x, y, SIDE_TOP)
                     })}>&nbsp;</td>);
    }

    return <tr key={y + "-t"} className="hrow">{row}</tr>;
}

function makeVRow(board, y, onClick) {
    let row = [];

    let sx = getBoardDimensions(board).sx;

    for(let x = 0; x <= sx; x++) {
        row.push(<td key={x + "-l"}
                 onClick={bindClickHandler(onClick, x, y, SIDE_LEFT)}
                 className={classNames('v-matchstick', {
                     'placed': getMatchStick(board, x, y, SIDE_LEFT)
                 })}>&nbsp;</td>);

        if (x != sx)
            row.push(<td key={x + "-m"}/>);
    }

    return <tr key={y + "-v"} className="vrow">{row}</tr>;
}

export default function MatchstickPlayfield({board, onClick}) {
    let rows = [];

    let sy = getBoardDimensions(board).sy;

    for(let y = 0; y <= sy; y++) {
        rows.push(makeHRow(board, y, onClick));

        if (y != sy)
            rows.push(makeVRow(board, y, onClick));
    }

    return (
        <table className="playfield">
          <tbody>
            {rows}
          </tbody>
        </table>
    );
}

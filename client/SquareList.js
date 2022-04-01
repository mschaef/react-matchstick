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

import {
    getSquares
} from '../common/MatchstickModel.js';


export default function SquareList({board}) {

    let squares = getSquares(board);

    function squareKey(square) {
        return square.get('x') + '-' + square.get('y') + '-' + square.get('size');
    }

    let squareRows = squares.map(square => (
        <tr key={squareKey(square)}>
          <td>{square.get('x')}</td>
          <td>{square.get('y')}</td>
          <td>{square.get('size')}</td>
        </tr>
    ));

    return (
        <div className="square-list">
          <div className="list-title">
            Squares
          </div>
          <table>
            <tbody>
              <tr>
                <th>X</th>
                <th>Y</th>
                <th>Size</th>
              </tr>
              {squareRows}
            </tbody>
          </table>
        </div>
    );
}

import React, { Component } from 'react';

import {
    getSquares
} from '../common/MatchstickModel';


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

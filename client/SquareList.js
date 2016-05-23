import React, { Component } from 'react';

import {
    getSquares
} from './MatchstickModel';


export default function SquareList({board}) {

    let squares = getSquares(board);
    
    let squareRows = squares.map(square => (
        <tr>
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

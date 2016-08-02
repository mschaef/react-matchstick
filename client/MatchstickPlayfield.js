import React, { Component } from 'react';

import classNames from 'classnames';

import {
    createBoard,
    setMatchStick,
    getMatchStick,
    getSquares,
    getAllSticks,
    getAllEmptySticks,
    search,
    SIDE_LEFT,
    SIDE_TOP
} from '../common/MatchstickModel';

import SquareList from './SquareList';

function bindClickHandler(onClick, x, y, side) {
    return () => onClick(x, y, side);
}

function makeHRow(board, y, onClick) {
    let row = [];
    
    let sx = board.sx;
    
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

    let sx = board.sx;
        
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

    let sy = board.sy;
        
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

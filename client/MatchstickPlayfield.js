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

function bindClickHandler(onClick, spos, side) {
    return () => onClick(spos, side);
}

function makeHRow(board, y, side, onClick) {
    let row = [];
    
    let sx = board.get('sx');
    
    for(let x = 0; x < sx; x++) {
        let spos = { x, y };
            
        row.push(<td key={x + "-l"}/>);
            
        row.push(<td key={x + "-m"}
                 onClick={bindClickHandler(onClick, spos, side)}
                 className={classNames('h-matchstick', {
                     'placed': getMatchStick(board, spos, side)
                 })}/>);
    }
    
    row.push(<td key={sx + "-r"}/>);
    
    return <tr key={y + "-" + side} className="hrow">{row}</tr>;
}

function makeVRow(board, y, onClick) {
    let row = [];

    let sx = board.get('sx');
        
    for(let x = 0; x < sx; x++) {
        let spos = { x, y };
            
        row.push(<td key={x + "-l"}
                 onClick={bindClickHandler(onClick, spos, 'left')}
                 className={classNames('v-matchstick', {
                     'placed': getMatchStick(board, spos, 'left')
                 })}/>);
            
        row.push(<td key={x + "-m"}/>);
    }

    row.push(<td key={sx + "-r"}
             onClick={bindClickHandler(onClick, { x : sx, y}, 'left')}
             className={classNames('v-matchstick', {
                 'placed': getMatchStick(board, { x : sx, y }, 'left')
             })}/>);
    
    return <tr key={y + "-v"} className="vrow">{row}</tr>;
}

export default function MatchstickPlayfield({board, onClick}) {
    let rows = [];

    let sy = board.get('sy');
        
    for(let y = 0; y < sy; y++) {
        rows.push(makeHRow(board, y, 'top', onClick));
        rows.push(makeVRow(board, y, onClick));
    }

    rows.push(makeHRow(board, sy, 'top', onClick));
        
    return (
        <table className="playfield">
          <tbody>
            {rows}
          </tbody>
        </table>
    );
}

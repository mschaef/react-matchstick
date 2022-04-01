// Copyright (c) Mike Schaeffer. All rights reserved.
//
// The use and distribution terms for this software are covered by the
// Eclipse Public License 2.0 (https://opensource.org/licenses/EPL-2.0)
// which can be found in the file LICENSE at the root of this distribution.
// By using this software in any fashion, you are agreeing to be bound by
// the terms of this license.
//
// You must not remove this notice, or any other, from this software.

import config from 'config';
import LOG from './Logger.js';
import Immutable from 'immutable';

import './_InitialData.js';

import {
    boardToJson,
    jsonToBoard,
    search
} from '../common/MatchstickModel.js';

export default function(app) {

    function respondBadRequest(res, message) {
        LOG.error("bad request: " + message);
        res.status(400).send(message);
    }

    function respondNotFound(res, message) {
        LOG.error("Not Found: " + message);
        res.status(404).send(message);
    }

    app.post('/solve-board', function(req, res) {
        const { board, maxDepth, targetSquares } = req.body;

        LOG.info('solution-request', { board, maxDepth, targetSquares });

        const solution = search(jsonToBoard(board), maxDepth, targetSquares);

        solution.result = boardToJson(solution.result);
        
        LOG.info('solution', solution);
        
        res.json(solution);
        res.end();
    });
}

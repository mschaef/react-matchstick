import config from 'config';
import LOG from './Logger';
import Immutable from 'immutable';

import './_InitialData';

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

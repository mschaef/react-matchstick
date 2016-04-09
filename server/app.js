import config from 'config';
import LOG from './Logger';
import Immutable from 'immutable';

import './_InitialData';

export default function(app) {

    function respondBadRequest(res, message) {
        LOG.error("bad request: " + message);
        res.status(400).send(message);
    }

    function respondNotFound(res, message) {
        LOG.error("Not Found: " + message);
        res.status(404).send(message);
    }

}

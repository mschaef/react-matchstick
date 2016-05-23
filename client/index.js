if (module.hot) {
  module.hot.accept();
}

import React from 'react';
import ReactDOM from 'react-dom';

import 'whatwg-fetch';

import MatchstickGame from './MatchstickGame';

import 'font-awesome/css/font-awesome.css';
import './matchstick.scss';

ReactDOM.render(<MatchstickGame/>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}

import React from 'react';
import ReactDOM from 'react-dom';

import Immutable from 'immutable';

import 'whatwg-fetch';

import Matchstick from './Matchstick';

import 'font-awesome/css/font-awesome.css';
import './matchstick.scss';

ReactDOM.render(<Matchstick/>, document.getElementById('root'));

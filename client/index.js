if (module.hot) {
  module.hot.accept();
}

import React from 'react';
import ReactDOM from 'react-dom';

import Immutable from 'immutable';

import 'whatwg-fetch';

import GLCanvas from './GLCanvas';

import 'font-awesome/css/font-awesome.css';
import './dashboard.scss';

ReactDOM.render(<GLCanvas/>, document.getElementById('root'));

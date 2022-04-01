// Copyright (c) Mike Schaeffer. All rights reserved.
//
// The use and distribution terms for this software are covered by the
// Eclipse Public License 2.0 (https://opensource.org/licenses/EPL-2.0)
// which can be found in the file LICENSE at the root of this distribution.
// By using this software in any fashion, you are agreeing to be bound by
// the terms of this license.
//
// You must not remove this notice, or any other, from this software.

import React from 'react';
import ReactDOM from 'react-dom';

import 'whatwg-fetch';

import MatchstickGame from './MatchstickGame.js';

import 'font-awesome/css/font-awesome.css';
import './matchstick.scss';

ReactDOM.render(<MatchstickGame/>, document.getElementById('root'));

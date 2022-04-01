// Copyright (c) Mike Schaeffer. All rights reserved.
//
// The use and distribution terms for this software are covered by the
// Eclipse Public License 2.0 (https://opensource.org/licenses/EPL-2.0)
// which can be found in the file LICENSE at the root of this distribution.
// By using this software in any fashion, you are agreeing to be bound by
// the terms of this license.
//
// You must not remove this notice, or any other, from this software.

export function fetchAndThen(url, then) {
    fetch(url)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            then(json);
        }).catch(function(ex) {
            console.log('Remote resource parsing failed: ' + url, ex, ex.stack);
        });
}

function serverPost(url, jsonData) {
    fetch(url, {
        method: 'post',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
}


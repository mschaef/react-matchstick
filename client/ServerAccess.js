
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


// ==UserScript==
// @name         BGA table collector
// @namespace    https://jpeterbaker.github.io/
// @version      0.1
// @description  Print table numbers on gamepanel page (if you want more than the most recent dozen, you'll need to click "See more..." at the bottom)
// @author       Babamots
// @match        *://boardgamearena.com/gamepanel*
// @icon         https://i.imgur.com/dGP5Nqv.png
// @grant        none
// @run-at       context-menu
// ==/UserScript==

// Rather than running when the page loads,
// right click on the page > Tampermonkey > BGA table number collector
// Do this after you've clicked "See more..." enough times

/*
You can automate the "See more..." clicking with this code in the developer console.
If I were more ambitious, I would make it another script, but for now, just copy it.


async function pause(t) {
	return new Promise(
		resolve => {
			setTimeout(resolve,t);
		}
	);
}

var x = document.getElementById('board_seemore__');
var i;
for(i=0;i<50;i++){
    x.click();
    await pause(2000);
}
console.log('\n\n\nfinished\n\n\n');


*/

function get_url_param(name, url = window.location.href) {
    // Get the value of the url's parameter with the given name
    // null if there is no such parameter
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results){
        return null;
    }
    if (!results[2]){
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

(function() {
    'use strict';

    var links = Array.from(document.querySelectorAll('.post'));
    var tables = [];
    var i,anchors,table;
    for(i=0;i<links.length;i++){
        anchors = links[i].querySelectorAll('a');
        // TODO get smarter about making sure you have the right link
        // For now, it seems to always have index 3
        table = get_url_param('table',anchors[3]);
        tables.push(table);
    }
    console.log(tables.join('\n'));
})();

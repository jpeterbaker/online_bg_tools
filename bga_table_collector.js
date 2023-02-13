// ==UserScript==
// @name         BGA table collector
// @namespace    https://jpeterbaker.github.io/
// @version      0.1
// @description  Print table numbers on gamepanel page (if you want more than the most recent dozen, you'll need to click "more" at the bottom)
// @author       Babamots
// @match        *://boardgamearena.com/gamepanel*
// @icon         https://i.imgur.com/dGP5Nqv.png
// @grant        none
// @run-at       context-menu
// ==/UserScript==

// Rather than running when the page loads,
// right click on the page > Tampermonkey > BGA table number collector

(function() {
    'use strict';

    var links = Array.from(document.querySelectorAll('.post'));
    var tables = links.map(link => link.id.replace('post___',''));
    console.log(tables.join('\n'));
})();

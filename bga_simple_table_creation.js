// ==UserScript==
// @name         BGA simple table creation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://boardgamearena.com/gamepanel*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       context-menu
// ==/UserScript==


/*
I want to go from URLs like
https://boardgamearena.com/gamepanel?game=hive
to URLs like
https://boardgamearena.com/lobby?game=79

The former is for game pages with a rather confusing table creation subpage.
The latter is for a simple lobby specific to the game.
*/

(function() {
    'use strict';
    /// BGA kindly provides a (hidden) span that lists the game ID
    var gid = document.getElementById('game_id').innerText;
    var dest = 'https://boardgamearena.com/lobby?game=' + gid;
    window.location.href = dest;
})();

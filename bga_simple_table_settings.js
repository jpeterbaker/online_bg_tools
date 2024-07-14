// ==UserScript==
// @name         BGA simple table settings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://boardgamearena.com/gamepanel*table=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       context-menu
// ==/UserScript==


/*
I want to go from URLs like
https://boardgamearena.com/gamepanel?game=backgammon&table=388780335
to URLs like
https://boardgamearena.com/table?table=388780335&nr=true

The former is for game pages with a rather confusing table creation/setup subpage.
The latter is a simple dedicated table setup page.
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
    var table = get_url_param('table');
    var dest = 'https://boardgamearena.com/table?table='+table+'&nr=true'
    window.location.href = dest;
})();

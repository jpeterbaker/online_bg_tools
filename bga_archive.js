// ==UserScript==
// @name         BGA Archivist
// @namespace    https://jpeterbaker.github.io/
// @version      0.1
// @description  Crawl a list of records of completed games
// @author       Babamots
// @match        *://boardgamearena.com/*
// @icon         https://i.imgur.com/dGP5Nqv.png
// @grant        none
// @noframes
// ==/UserScript==

async function sleep(t) {
	return new Promise(
		resolve => {
			setTimeout(resolve,t);
		}
	);
}

// Pause execution until the given DOM selector finds something
// Inspired by
// https://github.com/Tampermonkey/tampermonkey/issues/1279
async function pause_until_loaded(readySelector) {
    var numAttempts = 0;
    var elem;
    do{
        elem = document.querySelector(readySelector);
        if(elem){
            return;
        }
        numAttempts++;
        if (numAttempts >= 34) {
            console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            return;
        }
        await sleep(Math.pow(1.1, numAttempts));
    }while(true);
}

(function() {
    'use strict';


})();


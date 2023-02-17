// ==UserScript==
// @name         Block friend notices
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://boardgamearena.com/*?table=*
// @icon         https://i.imgur.com/dGP5Nqv.png
// @grant        none
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    console.log('NOTICE BLOCKER running');

    // Log entries matching this regex will be hidden
    // Change this to match your language
    let notif_regex = /is now o(ff|n)line/;

    const observer = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		mutation.addedNodes.forEach(function(added_node) {
			if(notif_regex.test(added_node.innerText)) {
                // I don't know why, but BGA always changes the style back.
                // Adding a custom attribute lets you hide the element with something like Stylebot
                added_node.setAttribute('style','display:none');
                added_node.setAttribute('nevershow','y');
                console.log('Hiding notification',added_node);

			}
		});
	});
    });
    let log = document.getElementById('logs');
    console.log(log);
    observer.observe(log, { subtree: false, childList: true });
})();

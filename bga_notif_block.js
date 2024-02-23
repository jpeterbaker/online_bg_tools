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

async function pause(t) {
    // Pause for t milliseconds
	return new Promise(
		resolve => {
			setTimeout(resolve,t);
		}
	);
}

window.pause = pause;

(function() {
    'use strict';

    // Log entries matching this regex will be hidden
    // Change this to match your language
    let notif_regex = /is now o(ff|n)line/;

    const observer = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		mutation.addedNodes.forEach(async function(added_node) {
			if(notif_regex.test(added_node.innerText)) {
                // BGA always sets the style to block after the node is created
                // For me, there's about a quarter of a second
                // My solution is to check the style until BGA's change is detected
                // At 1 check per 50 ms, I can't see anything strange in the log
                var count = 0;
                while(true){
                    if(added_node.style.display == 'block'){
                        added_node.style.setProperty('display','none');
                        console.log('Hiding notification',added_node);
                        break;
                    }
                    if(added_node.style.display != 'none'){
                        added_node.style.setProperty('display','none');
                    }
                    await pause(50);
                    // Yes, this could be a for loop, but while(true) emphasizes the intent
                    ++count;
                    if(count > 50){
                        console.log('Exiting after 50 checks.');
                        console.log('Problem node:',added_node);
                        break;
                    }
                }
                added_node.setAttribute('nevershow','y');
			}
		});
	});
    });
    let log = document.getElementById('logs');
    console.log(log);
    observer.observe(log, { subtree: false, childList: true });
})();

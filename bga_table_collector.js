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

async function pause(t) {
    // Pause for t milliseconds
	return new Promise(
		resolve => {
			setTimeout(resolve,t);
		}
	);
}

// Taken from
// https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function save(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

async function save_tables_until(x){
    // The "latest results" subwindow should be open before calling this
    // Repeatedly "clicks" the "See more" button until a link to table number x appears
    // Then collects the table numbers and returns them as an array
    // x will be the last number in the list
    var next_button = document.getElementById('board_seemore__');
    if(next_button==null){
        alert('Could not find "See next" button. Is the window of latest results open? Click the number total number of games played in the info table.');
        return;
    }

    var links;
    var tables = [];
    var i,anchors,table;
    var all_done=false;
    // Increment for n_verify
    var step_verify = 500;
    // Check with user when this number of tables is reached
    var n_verify = step_verify;
    while(true){
        // Get all table links (will include the ones whose tables are already in the list)
        links = Array.from(document.querySelectorAll('.post'));
        // Check if we have run out of tables
        if(links.length==tables.length){
            alert("Ran out of tables without finding requested one!");
            break;
        }
        // Look at the list of links, starting after the last already in the list of tables
        for(i=tables.length;i<links.length;i++){
            anchors = links[i].querySelectorAll('a');
            // TODO get smarter about making sure you have the right link
            // For now, it seems to always have index 3
            table = get_url_param('table',anchors[3]);
            tables.push(table);
            if(table==x){
                console.log('Found last table '+x);
                console.log(tables);
                all_done = true;
                break;
            }
        }
        if(all_done){
            break;
        }
        if(tables.length >= n_verify){
            // Check if user wants to continue
            if(confirm(n_verify+" tables found. Continue?")){
                // User clicked OK, increment next check value and proceed
                n_verify += step_verify;
            }
            else{
                // User clicked cancel, stop everything
                break;
            }
        }
        console.log('I have',tables.length,'tables');
        next_button.click();
        await pause(5000);
    }
    var s = tables.join('\n');
    save('latest_tables.txt',s);
}

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

    var x = prompt('What table number would you like to stop on? (0 to get all)',0);
    if(x==null){
        alert("Scraping canceled");
        return;
    }
    save_tables_until(x);
})();


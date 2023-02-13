// ==UserScript==
// @name         BGA Archivist
// @namespace    https://jpeterbaker.github.io/
// @version      0.1
// @description  Add download button to game log pages (also provide a button to go to the next table in the list)
// @author       Babamots
// @match        *://boardgamearena.com/gamereview?table=*
// @icon         https://i.imgur.com/dGP5Nqv.png
// @grant        none
// @noframes
// ==/UserScript==

// Taken from
// // https://github.com/Tampermonkey/tampermonkey/issues/1279
function run_when_ready(readySelector, callback) {
    var numAttempts = 0;
    var tryNow = function() {
        var elem = document.querySelector(readySelector);
        if (elem) {
            callback();
        }
        else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            }
            else {
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
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

function save_log(){
    let text = document.querySelector('.pagesection__content').innerText;
    //let text = document.querySelector('#ctitle').innerText;// XKCD VERSION

    let table = get_url_param('table');
    save('bga'+table+'.txt',text);

    add_go_next_button();
}

function add_download_button(){
    var section = document.querySelector('.pagesection');
    //var section = document.querySelector('#middleContainer');// XKCD VERSION
    var button = document.createElement('div');
    button.id = 'archive_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style','background-color:black;margin:5px;color:white');
    button.setAttribute('onclick','window.save_log()');
    button.innerText = 'Dowload log';
    section.prepend(button);
}

function add_go_next_button(){
    var section = document.querySelector('.pagesection');
    //var section = document.querySelector('#middleContainer');// XKCD VERSION
    var button = document.createElement('div');
    button.id = 'archive_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style','background-color:black;margin:5px;color:white');
    button.setAttribute('onclick','window.go_next()');
    button.innerText = 'Go next';
    section.prepend(button);
}

function go_next(){
    let table = get_url_param('table');
    // We're going backward throug the list. Find previous table number
    var i;
    for(i=tables.length-1;i>=0;i--){
        if(tables[i] == table){
            // We found this table in the list
            break;
        }
    }
    if(i==0){
        alert('This was the last table in the list');
        return;
    }
    if(i<0){
        alert('This table was not in the list. Edit the source file if you want to do lots of tables in a row.');
        return;
    }
    // Go to the next table in the list (just before the current one)
    table = tables[i-1];
    var dest = 'https://boardgamearena.com/gamereview?table='+table;
    //alert('want to go to '+dest);
    window.location.href = dest;
}

window.save_log = save_log;
window.go_next = go_next;

// Put the list of table numbers that interest you here in reverse order of your desired visits
var tables = [218842996,
              218725584,
              219004834,
              218770993,
              220399182,
              218548520,
              220026976,
              220061875,
              220262775];

(function() {
    'use strict';
    console.log('ARCHIVIST running');
    //var load_indicator = '.pagesection__content';
    var load_indicator = '#gamelogs';
    run_when_ready(load_indicator,add_download_button);
})();



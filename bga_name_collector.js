// ==UserScript==
// @name         Name collector
// @namespace    https://jpeterbaker.github.io/
// @version      0.1
// @description  Get player names and numbers from archived tables (not the replays or logs)
// @author       Babamots
// @match        *://boardgamearena.com/table?table=*
// @icon         https://i.imgur.com/dGP5Nqv.png
// @grant        none
// ==/UserScript==

// @run-at       context-menu

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
    // Get the player numbers and names and save them in a file

    let player_links = document.querySelectorAll('a[id^="player_"]');
    let i,name,id;
    let intros = [];
    for(i=0;i<player_links.length;i++){
        name = player_links[i].innerText;
        id = player_links[i].id;
        id = id.replaceAll(/[^0-9]/g,'');
        intros.push(id + '=' + name);
    }
    let text=intros.join('\n');
    let table = get_url_param('table');
    save('bga'+table+'_names.txt',text);

    add_go_next_button();
}

function add_download_button(){
    var section = document.querySelector('#game_result_panel');
    //var section = document.querySelector('#middleContainer');// XKCD VERSION
    var button = document.createElement('div');
    button.id = 'archive_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style','background-color:black;margin:5px;color:white');
    button.setAttribute('onclick','window.save_log()');
    button.innerText = 'Download player ids';
    section.prepend(button);
}

function add_go_next_button(){
    var section = document.querySelector('#game_result_panel');
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
    // Provide some notice on every 10th table
    if((tables.length-i)%10==9){
        alert('The upcoming table is the '+(tables.length-i+1)+'th from the end of the list');
    }
    // Go to the next table in the list (just before the current one)
    table = tables[i-1];
    var dest = 'https://boardgamearena.com/table?table='+table;
    //alert('want to go to '+dest);
    window.location.href = dest;
}

window.save_log = save_log;
window.go_next = go_next;

// Put the list of table numbers that interest you here in reverse order of your desired visits
var tables = [226301094,
              226302710,
              226305700,
              225976815,
              225780806,
              225494794,
              225168993,
              226197165,
              225522515,
              226248890,
              224484132,
              226164957,
              224835917,
              225899801,
              222337586,
              224725656,
              222832238,
              225226871,
              223588029,
              225642704,
              225638441,
              225276101,
              224992998,
              225378438,
              223051403,
              224929393,
              224936394,
              225052475,
              224226992,
              225194648,
              224958887,
              224392143,
              223680948,
              224955495,
              221974428,
              225021963,
              224121890,
              224806161,
              224645912,
              220675601,
              224907629,
              224903643,
              224899894,
              224880714,
              224040124,
              224327127,
              224290349,
              222576241,
              223918919,
              223686737,
              223824723,
              223957543,
              223550088,
              224055873,
              221638559,
              221937956,
              223763827,
              223606174,
              220989073,
              223330882,
              222425866,
              221686527,
              222904086,
              220534608,
              222709668,
              219774574,
              223097738,
              223221691,
              218584543,
              222027801,
              221768464,
              223144291,
              223377419,
              223377601,
              223341608,
              223346677,
              223197424,
              221973528,
              222468863,
              218516758,
              221450433,
              222356308,
              222386090,
              221109793,
              222042358,
              222687934,
              220946503,
              222332302,
              220740387,
              220179033,
              222040154,
              220721726,
              222164197,
              220925695,
              221942603,
              220880233,
              221107130,
              220379197,
              222009705,
              221923820,
              221420015,
              220703814,
              219299976,
              221932883,
              221636184,
              220212783,
              221677238,
              220294927,
              218488936,
              218513977,
              220750462,
              218697874,
              220989766,
              220757521,
              220971630,
              218615979,
              220962304,
              218781666,
              220755502,
              219628925,
              220286184,
              218515448,
              219939397,
              219780467,
              220185720,
              219138476,
              218842996,
              218725584,
              219004834,
              218770993,
              220399182,
              218548520,
              220026976,
              220061875,
              220262775,
              220023797,
              218837200,
              220071951,
              219860177,
              219550975,
              218557229,
              218926259,
              218555807,
              218573600,
              218511940,
              219873388,
              218595518,
              218976777,
              218550888,
              219564726,
              218560912,
              218552515,
              219384862,
              219513163,
              218922908,
              218589842,
              219484891,
              218739972,
              219363073,
              219313067,
              219318734,
              219273268,
              218608822,
              218588226,
              218512428,
              218633558,
              218854864,
              218580988,
              218558790,
              218753413,
              218636911,
              218632700,
              218591670,
              218619712,
              218589680,
              218557687,
              218449456
];

(function() {
    'use strict';
    console.log('NAME COLLECTOR running');
    //var load_indicator = '.pagesection__content';
    var load_indicator = '#game_result_panel';
    run_when_ready(load_indicator,add_download_button);
})();

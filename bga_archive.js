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


// @run-at       context-menu

/*
The landing pages for archived games have URLs like
https://boardgamearena.com/table?table=XXXX
These can give you the player names, player numbers, and final score

Game log pages look like
https://boardgamearena.com/gamereview?table=XXXX
These are more expensive to serve, so visit them sparingly
*/


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
    // Get the log of the game and a translation from player numbers to names
    // and save it all in a file
    let text = document.querySelector('.pagesection__content').innerText;

    let player_links = document.querySelectorAll('a[id^="playername_"]');
    let i,name,id;
    let intros = [];
    for(i=0;i<player_links.length;i++){
        name = player_links[i].innerText;
        id = player_links[i].id;
        id = id.replaceAll(/[^0-9]/g,'');
        intros.push(id + '=' + name);
    }
    text = intros.join('\n') + '\n' + text;
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
    button.innerText = 'Download log';
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
    // Provide some notice on every 10th table
    if((tables.length-i)%10==9){
        alert('The upcoming table is the '+(tables.length-i+1)+'th from the end of the list');
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
var tables = [234014197,
              234988870,
              234813776,
              234959393,
              234572189,
              229576975,
              234840409,
              234886589,
              234883955,
              234884764,
              234870999,
              234873198,
              231704330,
              234812385,
              234818366,
              234845491,
              234846006,
              234848205,
              234847491,
              234849390,
              234837027,
              234820014,
              234820567,
              234489893,
              234370088,
              234683115,
              234573361,
              234402899,
              234724051,
              234766056,
              234765861,
              234716619,
              234393171,
              234633358,
              234446860,
              234382588,
              234406757,
              234667496,
              234431850,
              234627176,
              234618440,
              232363006,
              234590276,
              234378637,
              234391728,
              234586676,
              234564841,
              232167264,
              234361375,
              234383235,
              234490355,
              234371384,
              234408511,
              232353927,
              233587222,
              234445892,
              234309305,
              234369083,
              234368990,
              225295972,
              234394212,
              234394951,
              234369398,
              234365403,
              229141250,
              230054725,
              231803994,
              234022734,
              231776868,
              233692886,
              232608272,
              233695674,
              233845441,
              231890431,
              233295981,
              232463197,
              230034968,
              232690894,
              233094963,
              232991496,
              232735198,
              229957401,
              231952157,
              231698498,
              232909199,
              230470984,
              232709438,
              232337134,
              231231891,
              230752345,
              229558532,
              231237100,
              232371470,
              232075946,
              230370878,
              230183651,
              231155204,
              231624754,
              220985983,
              226793364,
              230348273,
              229724252,
              229373484,
              228534016,
              231367871,
              231312588,
              230097727,
              230529773,
              230446979,
              230534203,
              230044938,
              229097094,
              229835251,
              227650671,
              227190603,
              228732268,
              230324525,
              228944383,
              229040851,
              229283532,
              224680777,
              226331871,
              230054459,
              229772309,
              229047353,
              227044195,
              230168759,
              228402735,
              226542158,
              229415527,
              229414117,
              227923052,
              228335822,
              228431806,
              228971317,
              227108380,
              229227716,
              228414872,
              223452578,
              227273721,
              227579450,
              227747783,
              229226211,
              228111575,
              227623775,
              227842214,
              227636067,
              225592295,
              228935065,
              228919576,
              228896584,
              227480869,
              227727479,
              224470670,
              224451265,
              225814177,
              228042586,
              222192339,
              228126166,
              227800504,
              227138623,
              227961746,
              227668480,
              227696540,
              228119343,
              226250714,
              228102987,
              227680710,
              227559559,
              227112308,
              227274445,
              224205344,
              223503700,
              225636591,
              224707109,
              225261574,
              227535070,
              226872633,
              226232510,
              225559882,
              225530727,
              226547658,
              227500196,
              218535707,
              225638215,
              227045807,
              226997363,
              225991666,
              227169320,
              224927925,
              226183427,
              225840400,
              227096562,
              227071388,
              227061847,
              227064840,
              225687375,
              226317579,
              224572940,
              226328296,
              226295599,
              226301094

];

(function() {
    'use strict';
    console.log('ARCHIVIST running');
    //var load_indicator = '.pagesection__content';
    var load_indicator = '#gamelogs';
    run_when_ready(load_indicator,add_download_button);
})();



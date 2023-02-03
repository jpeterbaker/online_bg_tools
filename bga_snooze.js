// ==UserScript==
// @name         BGA Snooze
// @namespace    https://jpeterbaker.github.io/
// @version      0.1
// @description  Add snooze button to BGA tables
// @author       Babamots
// @match        *://boardgamearena.com/*
// @icon         https://i.imgur.com/dGP5Nqv.png
// @grant        none
// @noframes
// ==/UserScript==

var debugging = 1;

// Convenience function from
// https://github.com/Tampermonkey/tampermonkey/issues/1279
// It calls callback() function when the page is fully loaded as indicated by the query readySelector finding something
// This is needed on the list page because the table info is loaded by JS after the signal Tampermonkey uses to start running
// This worked for a while, but now it doesn't seem to
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
function dalert(s){
    if(debugging){
        alert(s);
    }
}
function dprint(s){
    if(debugging){
        console.log(s);
    }
}

//////////////////
// COOKIE NAMES //
//////////////////
function snooze_cookie_name(table){
    // Name of the cookie indicating that this table is snoozed
    return 'snooze_table_' + table;
}
function queue_cookie_name(){
    // Name of the cookie indicating that this table is snoozed
    return 'table_queue';
}

//////////////////////
// ADD PAGE BUTTONS //
//////////////////////
function add_table_buttons(){
    // Add buttons to display on table pages

    let bar = document.getElementById('maintitlebar_content');

    let container = document.createElement('div');
    container.setAttribute('style','right:0px;float:right');
    container.id = 'snooze_container';
    bar.insertBefore(container,bar.firstChild);

    // Clear-all button
    let button = document.createElement('a');
    button.id = 'clear_snooze_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style',"background-color:purple;margin:5px");
    button.setAttribute('onclick','window.snooze_functions.clear_all_clicked()');
    button.innerText = 'Clear all snoozes';
    container.appendChild(button);

    // Snooze button
    button = document.createElement('a');
    button.id = 'snooze_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style',"background-color:black;margin:5px");
    button.setAttribute('onclick','window.snooze_functions.snooze_clicked()');
    button.innerText = 'Snooze 1 hr';
    container.appendChild(button);

    // Skip button
    button = document.createElement('a');
    button.id = 'snooze_skip_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style',"background-color:black;margin:5px");
    button.setAttribute('onclick','window.snooze_functions.skip_clicked()');
    button.innerText = 'Go to unsnoozed game';
    container.appendChild(button);
}
function add_list_buttons(){
    // Add buttons to display on list page (/gameinprogress)
    //let container = document.getElementById('menubar-holder');
    let bar = document.getElementById('gamelobby_inner');
    //let container = document.querySelector('.bga-menu-bar');

    let container = document.createElement('div');
    container.id = 'snooze_container';
    bar.insertBefore(container,bar.firstChild);

    // Clear all button
    let button = document.createElement('a');
    button.id = 'clear_snooze_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style',"background-color:purple;margin:5px;color:white");
    button.setAttribute('onclick','window.snooze_functions.clear_all_clicked()');
    button.innerText = 'Clear all snoozes';
    container.appendChild(button);

    // Skip button
    button = document.createElement('a');
    button.id = 'snooze_skip_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style',"background-color:black;margin:5px;color:white");
    button.setAttribute('onclick','window.snooze_functions.skip_clicked()');
    button.innerText = 'Go to unsnoozed game';
    container.appendChild(button);
}

///////////////////////
// COOKIE MANAGEMENT //
///////////////////////
function set_cookie(value, minutes=null) {
	// Set a cookie with the given value (or name-value string), expiration time (in minutes), and path=/
    let toset = value;
    if(minutes != null){
        const d = new Date();
        d.setTime(d.getTime() + (minutes*60*1000));
        toset += ';expires=' + d.toUTCString();
    }
    toset += ';path=/';
    document.cookie = toset;
}
function clear_cookie(name){
    // The path of this cookie must be /
    document.cookie = name + ';path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
}
function get_cookie_value(name) {
    // Get the value of the cookie with this name (or null)
    let ca = document.cookie.split(';');
    let parts,c;
    for(let i = 0; i < ca.length; i++) {
        c = ca[i].trim();
        parts = c.split('=');
        if(parts.length != 2){
            // Malformed cookie, ignore it
        }
        if (parts[0] == name) {
            return parts[1];
        }
    }
    return null;
}

////////////////////
// LOCATION CHECK //
////////////////////
function at_table(){
    // Check if current page is a table
    if(get_url_param('table')){
        return true;
    }
    return false;
}
function at_list(){
    // Check if current page is the table list
    let url = window.location.href;
    return url.indexOf('/gameinprogress') > 0;
}
function is_snoozed(table){
    // Check if this table is already snoozed
    return get_cookie_value(snooze_cookie_name(table)) == 'y';
}
function get_url_param(name, url = window.location.href) {
    // Get the value of the url's parameter with the given name
    // null if there is no such parameter
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
//////////////////////
// QUEUE MANAGEMENT //
//////////////////////
function build_queue(){
    // Get the active games from the list page and store them as a list in  a session cookie
    let nodes = Array.from(document.querySelectorAll('.tableplace_activeplayer_current'));
    // Example id of one of these nodes: tableplace_340479481_84983491
    // First number is the table number, second is the active player's number (the same for all these nodes)
    let tables = nodes.map(node => node.id.split('_')[1]);
    set_cookie(queue_cookie_name() + '=' + tables.join(','));
}
function peek_queue(pop=false){
    // Return first table in queue
    // If pop is true, the first table is also removed
    // Return null if queue is empty or missing
    let queue = get_cookie_value(queue_cookie_name());
    if(queue==null){
        // No queue has been set up
        return null;
    }
    let tables = queue.split(',');
    if(tables[0].length==0){
        return null;
    }
    let top = tables[0];
    if(pop){
        tables.splice(0,1);
        set_cookie(queue_cookie_name() + '=' + tables.join(','));
    }
    return top;
}
function go_next(current_table){
    // Ensure that the current table is at the front of the queue and then go to next table in queue
    // If current table is null, just go to the first table in the queue
    // If the current table is not at the front (or current_table is null and queue is empty),
    // then the user has navigated in an unexpected way and the queue of active games is probably out of dat
    //     We need to visit the list page to get the active games
    let top = peek_queue(true);
    dprint('popped '+top);
    dprint('new queue '+get_cookie_value(queue_cookie_name()));
    if(top==null){
        // There is no queue, go to the list to make one
        dprint('no queue');
        go_list(true);
        return;
    }
    if(current_table != null && current_table != top){
        // We are at a table, but it's not the one we thought we were at
        // The user has deviated from the queue but wants to go back to it
        // We should go to the list to rebuild it
        dprint('lost!');
        go_list(true);
        return;
    }
    top = peek_queue();
    // Find the next unsnoozed table in queue
    while(top != null && is_snoozed(top)){
        peek_queue(true);
        top = peek_queue();
    }
    if(top==null){
        // We just emptied the queue
        if(current_table == null){
            // The queue is empty after just being built. All games are inactive or snoozed
            // Go to the un-seeking list page
            dprint('empty queue on list');
            go_list(false,true);
            return;
        }
        // so go to the list for more
        dprint('refilling queue');
        go_list(true);
        return;
    }
    // We found an unsnoozed table in the queue. Go there
    dprint('going to new table '+top);
    go_table(top);
}

//////////////////
// USER ACTIONS //
//////////////////
function snooze_clicked(minutes=60){
    let table = get_url_param('table');
    set_cookie(snooze_cookie_name(table)+'=y',minutes);
    go_next(table);
}
function clear_all_clicked(){
    // Delete all snoozing cookies
    let ca = document.cookie.split(';');
    let prefix = 'snooze_table';
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(prefix) == 0) {
            clear_cookie(c);
        }
    }
}
function skip_clicked(){
    if(at_list()){
        go_list(true,true);
        return;
    }
    let table = get_url_param('table');
    go_next(table);
}
/////////////////
// REDIRECTION //
/////////////////
function list_landing(){
    // Handle arrival on list page
    if( get_url_param('seeking') == null){
        // We are on the list page, but not in seek mode. Just add the buttons and stay here.
        add_list_buttons();
        return;
    }
    // We are on the list page but should be redirected to an active table if possible
    // Build the queue when the page finishes loading

    function do_the_rest(){
        build_queue();
        // Go to the first active table and remove this page visit from the history
        // (if user hits back, this brief visit to the list page should not appear)
        // The go_next function will handle detection of snoozed tables
        go_next(null,true);
    }
    //run_when_ready('.gametable_content',build_queue);
    run_when_ready('.tableplace_activeplayer_current',do_the_rest);
}
function go_list(seeking=false,exclude_history=false){
    // Go back to the game list
    let dest = 'https://boardgamearena.com/gameinprogress';
    if(seeking){
        dalert('going to list, seeking');
        dest += '?seeking=y';
    }
    else{
        dalert('going to list, NOT seeking');
    }
    if(exclude_history){
        window.location.replace(dest);
    }
    else{
        window.location.href = dest;
    }
}
function go_table(table,exclude_history=false){
    // Go to the given table
    // Or, if no table is null, go to list page to refresh the queue
    // Set exclude_history true to prevent current page from being in the history and back-button-queue
    dalert('going to table'+table);
    if(table==null){
        // We reached the end of the queue or the
        go_list(true,exclude_history);
        return;
    }

    let dest = 'https://boardgamearena.com/play?table='+table;
    if(exclude_history){
        window.location.replace(dest);
    }
    else{
        window.location.href = dest;
    }
}

// Save the button-connected functions somewhere that remains accessible after this script runs
window.snooze_functions = {snooze_clicked,clear_all_clicked,skip_clicked};

(function() {
    'use strict';

    console.log('Snooze: cookie on entry',document.cookie);

    if(at_list()){
        list_landing();
        return;
    }
    if(!at_table()){
        // This is neither the list page nor a table, so there's nothing to do
        return;
    }
    // This is a table page
    var table = get_url_param('table');

    if(is_snoozed(table)){
        // Go to the next table
        alert("This table is snoozed. Upcoming functionality: an option to skip it before it loads.")
        return;
    }
    // This is an unsnoozed table, we're staying here

    add_table_buttons();
})();

// ==UserScript==
// @name         BGA Snooze
// @namespace    https://jpeterbaker.github.io/
// @version      0.5
// @description  Add snooze button to BGA tables
// @author       Babamots
// @match        *://boardgamearena.com/gameinprogress*
// @match        *://boardgamearena.com/1*/*?table=*
// @match        *://boardgamearena.com/2*/*?table=*
// @match        *://boardgamearena.com/3*/*?table=*
// @match        *://boardgamearena.com/4*/*?table=*
// @match        *://boardgamearena.com/5*/*?table=*
// @match        *://boardgamearena.com/6*/*?table=*
// @match        *://boardgamearena.com/7*/*?table=*
// @match        *://boardgamearena.com/8*/*?table=*
// @match        *://boardgamearena.com/9*/*?table=*
// @icon         https://i.imgur.com/dGP5Nqv.png
// @grant        none
// @noframes
// ==/UserScript==

var debugging = 0;

// Convenience function from
// https://github.com/Tampermonkey/tampermonkey/issues/1279
// It calls callback() function when the page is fully loaded as indicated by the query readySelector finding something
// This is needed on the list page because the table info is loaded by JS after the signal Tampermonkey uses to start running
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
function snooze_game_cookie_name(){
    // Name of the cookie listing names of snoozed games
    return 'snooze_games';
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

    //let bga_container_id = 'maintitlebar_content';
    //let bga_container_id = 'current_header_infos_wrap';
    let bga_container_id = 'right-side';
    let bar = document.getElementById(bga_container_id);

    let container = document.createElement('div');
    //container.setAttribute('style','right:0px;float:right');
    //container.setAttribute('style','margin-left:180px');
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

    // Snooze all button
    button = document.createElement('a');
    button.id = 'snooze_all_button';
    button.setAttribute('class','bgabutton');
    button.setAttribute('style',"background-color:black;margin:5px");
    button.setAttribute('onclick','window.snooze_functions.snooze_all_clicked()');
    button.innerText = 'Snooze all matching games 1 hr';
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
    let toset = value + ';path=/';
    if(minutes != null){
        const d = new Date();
        d.setTime(d.getTime() + (minutes*60*1000));
        toset += ';expires=' + d.toUTCString();
    }
    document.cookie = toset;
}
function clear_cookie(name){
    // The path of this cookie must be /
    let fullname = name+'='+get_cookie_value(name);
    document.cookie = fullname + ';path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
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
function snooze_table(table,minutes=60){
    set_cookie(snooze_cookie_name(table)+'=y',minutes);
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
function is_snoozed_table(table){
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
function get_game_name(url = window.location.href){
    // Get the name of the game as it appears in the table url e.g. "homeworlds" or "thecrewdeepsea"
    var reg = /boardgamearena.com\/\d+\/(\w+)\?table=/;
    var m = url.match(reg);
    if(m==null){
        return null;
    }
    return m[1];
}
function low_time_remaining(minutes=60){
    // Is the player's time remaining less than the input number of minutes?
    // RIGHT NOW, THIS WILL ONLY WORK FOR minutes=60
    // The problem is that the time indicator is language dependent,
    // so is it is difficult get time remaining as a number.
    // TODO try to adapt this for other time intervals

    // BGA seems to use (ordinary) Arabic numerals in every language
    // and to separate minutes from seconds with a colon (once time is under an hour).
    // Also, BGA's countdown ticks down from "2 days" to "36 hours".
    // It seems that we can detect when the player has less than 1 hour by checking for a colon
    // and detect when the player has less than 2 hours by checking if the only digit in the time is a "1"

    // Get the text from the timer box
    let time = document.querySelector('.timeToThink').innerText;
    if(time.indexOf(':') >= 0){
        // Time has a colon in it
        // This only happens when time is under and hour
        return true;
    }
    // Remove non-digit characters
    let digits_only = time.replace(/[^0-9]/g,"");
    if(digits_only == "1"){
        // I believe this only happens when time is under two hours
        return true;
    }
    return false;
}
//////////////////////
// QUEUE MANAGEMENT //
//////////////////////
function build_queue(){
    // Get the active games from the list page and store them as a list in a session cookie
    let actives = Array.from(document.querySelectorAll('.tableplace_activeplayer_current'));
    // Example id of one of these nodes: tableplace_340479481_84983491
    // First number is the table number, second is the active player's number (the same for all these nodes)
    let tables = actives.map(node => node.id.split('_')[1]);
    set_cookie(queue_cookie_name() + '=' + tables.join(','));
}
function snooze_tables_of_snoozed_games(minutes){
    // Snooze every table whose game is in the list of snoozed games
    let c = get_cookie_value(snooze_game_cookie_name());
    if(c == null){
        return;
    }
    let names = c.split(',');
    dprint('snoozing tables for games '+names);
    let anchors = Array.from(document.querySelectorAll('.gametablelink'));
    dprint('got anchors: '+anchors);
    let urls = anchors.map(a => a.href);
    let table,name;
    for(let i=0; i<urls.length; i++){
        dprint('looking at url '+urls[i]);
        name = get_game_name(urls[i]);
        if(!names.includes(name)){
            dprint(name+' not in the snooze game list');
            continue;
        }
        // All games with this name are supposed to be snoozed
        table = get_url_param('table',urls[i]);
        dprint('snoozing table '+table);
        snooze_table(table,minutes);
    }
    dalert('finished snoozing tables of snoozed games');
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
    /*
    Ensure that the current table is at the front of the queue and then go to next table in queue.
    If current table is null, just go to the first table in the queue.
    If the current table is not at the front (or current_table is null and queue is empty),
    then the user has navigated in an unexpected way and the queue of active games is probably out of date
        We need to visit the list page to get the active games
    This function will not DIRECTLY trigger a rebuild of the queue,
    but it will redirect to the list page (with seeking turned on) if
        * queue needs refreshing AND
        * user is NOT alreaedy on list page (i.e. if current_table is not null)
    */
    let top;
    if(current_table==null){
        // We are on the list page, so look at but do not change the top of the queue
        top = peek_queue();
        dprint('peeked '+top);
    }
    else{
        // We are on a table, so take this page off the queue
        top = peek_queue(true);
        dprint('popped '+top);
    }
    dprint('queue afterward '+get_cookie_value(queue_cookie_name()));
    if(top==null){
        // There is no queue
        dprint('no queue');
        if(current_table==null){
            // We're already on the list, so the queue is still empty after being built. There's nothing to do
            return;
        }
        // We are not at the list, so we should go to the list page and make a queue
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
    while(top != null && is_snoozed_table(top)){
        peek_queue(true);
        top = peek_queue();
    }
    if(top==null){
        // We just emptied the queue
        // All games were inactive or snoozed when they reached the front of the queue
        if(current_table == null){
            // We are at the list, which is where BGA sends users when there are no active games
            // Just stay here
            dprint('empty queue on list');
            return;
        }
        // We're at a table now, but we need to go to the list and rebuild the queue in case we became the active player in any games
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
    // Add a snooze cookie for this table and go to another one
    // subject to confirmation if time remaining is low
    if(low_time_remaining(minutes)){
        if(!confirm('It appears that you will have little or no time on your clock when the snooze expires. Are you sure this is what you want?')){
            return;
        }
    }
    let table = get_url_param('table');
    snooze_table(table,minutes);
    go_next(table);
}
function snooze_all_clicked(minutes=60){
    // Add a snooze cookie for this game name and go to table list so that queue can be rebuilt with all tables of this type snoozed
    // subject to confirmation if time remaining is low
    if(low_time_remaining(minutes)){
        if(!confirm('It appears that you will have little or no time on your clock when the snooze expires. Are you sure this is what you want?')){
            return;
        }
    }
    let name = get_game_name();
    if(name==null){
        alert('Error: could not determine game name');
    }
    // Append game name to list of snoozed games
    let curlist = get_cookie_value(snooze_game_cookie_name());
    if(curlist != null && curlist.spit(',').includes(name)){
        dalert(name+' is already on list of snoozed games');
        return;
    }
    if(curlist == null){
        set_cookie(snooze_game_cookie_name()+'='+name,minutes);
    }
    else{
        set_cookie(snooze_game_cookie_name()+'='+curlist+','+name,minutes);
    }
    go_list(true);
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
    clear_cookie(snooze_game_cookie_name());
}
function skip_clicked(){
    if(at_list()){
        build_queue_and_go(false);
        return;
    }
    let table = get_url_param('table');
    go_next(table);
}
/////////////////
// REDIRECTION //
/////////////////
function go_list(seeking=false,exclude_history=false){
    // Go back to the game list
    // If seeking, then redirect to the first active non-snoozed game
    // If exclude_history, the current page will not appear in history or be available with back button
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
        // We're on the list page. We reached the end of the queue or the user clicked "skip"
        build_queue_and_go(exclude_history);
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
function build_queue_and_go(exclude_history=false){
    // Run this while on list page to build the queue and redirect to table
    dprint('building queue')
    function subfun(){
        build_queue();
        dprint('queue built, checking snoozed games')
        snooze_tables_of_snoozed_games(60);
        let top = peek_queue();
        go_next(null,exclude_history);
    }
    run_when_ready('.tableplace_activeplayer_current',subfun);
}

// Save the button-connected functions somewhere that remains accessible after this script runs
window.snooze_functions = {snooze_clicked,clear_all_clicked,skip_clicked,snooze_all_clicked};

(function() {
    'use strict';

    console.log('SNOOZE running');

    if(at_list()){
        // Handle arriving on list page
        dalert('on list page');
        // It's easier to add buttons even when we're going to be redirected than to postpone adding buttons
        // until after checking the queue
        add_list_buttons();
        if(get_url_param('seeking') == null){
            // We are on the list page, but not in seek mode
            return;
        }
        // We are on the list page but should be redirected to an active table if possible
        // Build the queue when the page finishes loading
        build_queue_and_go(true);
        return;
    }
    if(!at_table()){
        // This is neither the list page nor a table, so there's nothing to do
        dalert('NOT on list or table page');
        return;
    }
    dalert('on table page');
    // This is a table page
    var table = get_url_param('table');

    if(is_snoozed_table(table)){
        // Check if user really wants a snoozed table
        if(!confirm('This table is snoozed. Would you like to visit it anyway?')){
            // User declined to visit this table
            go_list(false);
            return;
        }
        // User wants to stay at this table
        // Else, proceed a usual, including adding table buttons
    }
    // This is an unsnoozed table, we're staying here
    add_table_buttons();
})();


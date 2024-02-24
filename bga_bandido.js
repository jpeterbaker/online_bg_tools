// ==UserScript==
// @name         BGA Bandido card counter
// @namespace    http://tampermonkey.net/
// @version      2024-02-17
// @description  Display counts of the unseen cards on Bandido
// @author       Babamots
// @match        *://boardgamearena.com/*/bandido*table=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamearena.com
// @grant        none
// ==/UserScript==
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

async function pause(t) {
    // Pause for t milliseconds
	return new Promise(
		resolve => {
			setTimeout(resolve,t);
		}
	);
}
function add_child_trigger(parent,callback){
    // Each time a child is added to parent,
    // callback function is called with new child as parameter
    if(!parent){
        return;
    }
    const observer = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		mutation.addedNodes.forEach(async function(added_node) {
			await callback(added_node);
		});
	});
    });
    observer.observe(parent, { subtree: false, childList: true, attributes: false, characterData:false });
}

function node_to_id(node){
    // Get the id number of the card node
    var pos = node.style.backgroundPositionY.match(/[-0-9]*/)[0];
    return -Number(pos)/100;
}

function get_deck_counts(){
    // Get an array with the number of unseen cards of each type
    var deck = exit_repeats.slice();
    var board = document.querySelectorAll('.cardontable');
    var hand = document.querySelectorAll('.stockitem');
    var collection,id,node;
    for(collection of [board,hand]){
        for(node of collection){
            id = node_to_id(node);
            if(id == undefined){
                continue;
            }
            deck[card_exiti[id]] -= 1;
        }
    }
    return deck;
}

async function make_container(){
    // Create deck display area and children
    let bga_sibling = document.getElementById('right-side-first-part');

    let counter_title = document.createElement('div');
    counter_title.innerHTML = 'Cards remaining';
    counter_title.style.width = '100%';
    counter_title.style.textAlign = 'center';
    counter_title.style.fontSize = '20px';
    bga_sibling.after(counter_title);

    let container = document.createElement('div');
    container.style.height = '500px';
    container.style.overflowY = 'scroll';
    container.id = 'deck_count_container';
    counter_title.after(container);

    // Make card displays and labels
    var exiti,card_node,count_node;
    for(exiti=0;exiti<exit_repr.length;exiti++){
        card_node = document.createElement('div');
        card_node.id = 'count_card_' + exiti;
        card_node.style.backgroundImage = "url('https://x.boardgamearena.net/data/themereleases/current/games/bandido/200930-2055/img/cards.jpg')";
        card_node.style.backgroundPositionY = (-100*exit_repr[exiti]) + 'px';
        card_node.style.width = '200px';
        card_node.style.height = '100px';
        card_node.style.margin = '5px';
        container.appendChild(card_node);

        count_node = document.createElement('div');
        count_node.id = 'count_label_' + exiti;
        count_node.style.width = '100%';
        count_node.style.textAlign = 'center';
        count_node.style.fontSize = '33px';
        count_node.style.paddingTop = '33px';
        count_node.style.color = 'white';
        count_node.innerHTML = 0;
        card_node.appendChild(count_node);
    }
}

async function update_card_counters(added_node){
    // Update the text on each card graphic to show how many remain in the deck
    if(added_node && added_node.classList && !added_node.classList.contains('stockitem') && !added_node.classList.contains('cardontable')){
        // Something other than a card was added
        return;
    }

    // A card you play is briefly in your hand and on the board. Pause should help avoid double-counting
    await pause(2000);
    var deck_counts = get_deck_counts();
    var exiti,count_node;
    for(exiti=0;exiti<exit_repr.length;exiti++){
        count_node = document.getElementById('count_label_' + exiti);
        count_node.innerHTML = deck_counts[exiti];
        if(deck_counts[exiti] == 0){
            count_node.style.color = 'red';
        }
        else{
            // Counters may need to change from red to white if hand gets traded in
            count_node.style.color = 'white';
        }
    }
}

// A representative card for each exit pattern
// exit_repr[i] is the index of a card with the ith exit pattern
var exit_repr = [4, 44, 2, 49, 29, 19, 9, 18, 23, 52, 0, 35, 8, 33, 13, 1, 26, 31, 30, 17, 12, 14, 22, 28, 16, 60, 5, 7, 10, 6, 15];
// The number of cards with each exit pattern
// exit_repeats[i] is the number of cards with the ith exit pattern
var exit_repeats = [3, 3, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
// The exit pattern index of each card
// card_exiti[i] is the index of exit pattern of the ith
var card_exiti = [10, 15, 2, 2, 0, 26, 29, 27, 12, 6, 28, 6, 20, 14, 21, 30, 24, 19, 7, 5, 28, 24, 22, 8, 12, 29, 16, 22, 23, 4, 18, 17, 19, 13, 16, 11, 4, 20, 14, 11, 30, 27, 13, 7, 1, 0, 21, 23, 8, 3, 5, 10, 9, 8, 1, 12, 18, 15, 1, 10, 25, 17, 9, 0, 3, 3, 25, 26, 5];

(async function() {
    'use strict';
    run_when_ready('#right-side-first-part',make_container);
    // Waiting a moment prevents the cards from being counted many times when board is first loaded
    await pause(2000);
    add_child_trigger(document.getElementById('map_scrollable'),update_card_counters);
    // If the player has to trade their hand, the card counts need to be recalculated
    add_child_trigger(document.getElementById('playerhand'),update_card_counters);

    run_when_ready('#deck_count_container',update_card_counters);
})();


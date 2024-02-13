// ==UserScript==
// @name         MacGuffin card tracker
// @namespace    http://tampermonkey.net/
// @version      2024-02-11
// @description  Print the names of cards you cannot currently see to the console (right click > Tampermonkey > MacGuffin card tracker)
// @author       Babamots
// @match         *://boardgamearena.com/*/getthemacguffin*table=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamearena.com
// @run-at       context-menu
// @grant        none
// ==/UserScript==

var cards = [
    {x: -1 , y:  0, threat: 4, name: 'The MacGuffin'},
    {x: -4 , y:  0, threat: 4, name: 'Backup MacGuffin'},
    {x: -3 , y:  0, threat: 4, name: 'The Crown'},
    {x: -1 , y: -1, threat: 3, name: 'The Thief'},
    {x: -2 , y:  0, threat: 3, name: 'The Money'},
    {x:  0 , y: -2, threat: 3, name: 'The Assassin'},
    {x: -8 , y: -1, threat: 3, name: 'Garbage Collector'},
    {x: -2 , y: -1, threat: 3, name: 'Tomb Robbers'},
    {x: -7 , y: -1, threat: 3, name: 'The Fist of Doom'},
    {x: -3 , y: -2, threat: 3, name: "I'm Not Dead Yet"},
    {x: -5 , y: -1, threat: 2, name: 'The Merchant'},
    {x: -9 , y: -1, threat: 1, name: 'Can I Use That?'},
    {x: -4 , y: -1, threat: 1, name: 'The Switcheroo'},
    {x: -3 , y: -1, threat: 1, name: 'Wheel of Fortune'},
    {x: -1 , y: -2, threat: 1, name: 'Vortex'},
    {x: -6 , y: -1, threat: 0, name: 'The Rock'},
    {x: -7 , y: -1, threat: 0, name: 'The Paper'},
    {x: -5 , y: -1, threat: 0, name: 'The Scissors'},
    {x:  0 , y: -1, threat: 0, name: 'The Interogator'},
    {x: -6 , y: -1, threat: 0, name: 'The Spy'},
    {x: -9 , y:  0, threat: 0, name: 'The Shrugmaster'},
    {x: -8 , y:  0, threat: 0, name: 'Grand Marshal'},
    {x: -2 , y: -2, threat: 0, name: 'The Hippie'},

];

function check_off(node){
    // Mark the card corresponding to this node as seen
    var x = Number(node.style.backgroundPositionX.slice(0,-1))/100;
    var y = Number(node.style.backgroundPositionY.slice(0,-1))/100;
    for(var card of cards){
        if(card.x == x && card.y == y){
            card.seen = true;
            return;
        }
    }
}

(function() {
    'use strict';
    var my_hand = document.querySelectorAll('#myhand>.stockitem')
    var on_table = document.querySelectorAll('.cardsInPlay>.stockitem')
    var discarded = document.querySelectorAll('#playing_zone_detail>.stockitem');
    var node;
    for(var collection of [my_hand,on_table,discarded]){
        for(node of collection){
            check_off(node);
        }
    }
    console.log('The following cards are not visible to you:');
    for(var card of cards){
        if(!card.seen){
            console.log(card.name);
        }

    }
})();


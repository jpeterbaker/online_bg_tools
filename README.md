# Online board game tools

These are a couple of small tools making it easier to play board games on some sites I like.

## bga_snooze.js

The website [Board Game Arena](https://www.boardgamearena.com) (BGA) has hundreds of board games available to play for free in real time or asynchronously.
Sometimes when playing many games asynchronously, I like to ignore some of my more difficult games until I have a chance to focus.
The file `bga_snooze.js` is a Tampermonkey script that adds buttons to BGA pages
that allow you to "snooze" games that you don't want to be shown for a while.
By selecting the new "Go to unsnoozed game" button rather than BGA's default
"X tables are waiting for you" button,
BGA will only show oyu tables that you have not snoozed
(or whose snooze timer has expired).
The script uses cookies that time out when the snooze is over.

1. Install the [Tampermonkey](https://tampermonkey.net/) extension for your browser.
1. Look at the [raw bga_snooze.js](https://raw.githubusercontent.com/jpeterbaker/online_bg_tools/master/bga_snooze.js) file.
1. Copy the entire file.
1. Open your Tampermonkey extension.
1. Open a new script by selecting a plus icon (+) or the menu option "Create a new script."
   - You should see a blank document.
1. Paste the file contents into that document.
1. Save the file.
   - In the menu at the top, select File > Save.
1. Go to any game table page on BGA.
   - If you are at any tables, you should be taken to one by navigating to [https://boardgamearena.com/play](https://boardgamearena.com/play).
1. Use the black "Go to unsnoozed game" button to go to another game you have not snoozed.
1. If you don't want to see a game again for an hour, click the "Snooze 1 hr" button.
1. If you want to cancel all snoozes (making all games available to appear again), click the purple "Clear all snoozes."

## sdgPageChange.js

### Background

The website www.superdupergames.org (SDG) allows users to play many board games with each others asychronously
(in the style of chess-by-mail).
When displaying the state of a game (i.e. the board and pieces), there are two different display formats:
1) Play Pages
2) Archive Pages.
Games that haven't been finished yet are usually shown on Play Pages. Games that are over are usually shown on archive pages.

Each type of page has advantages over the other:
1) Play Page advantages:
      * If the game is still active, players must use the Play Page to specify their next move.
      * All parts of game states are shown on Play Pages (Archive Pages sometimes omit some information, e.g. a list of captured pieces).
      * The time at which each move was made is only shown on the Play Page.
2) Archive Page advantages:
      * Previous game states can only be seen visually on Archive Pages.
      * Archive Pages show the complete game histories using convenient simple notation (e.g. A3-A2) whereas Play Pages often use verbal descriptions (e.g. North moves a pawn from A2 to A3).

SDG does not provide an easy way to change between these views.
The only way I have found to access the Archive Page of an ongoing game (or the Play Page of an ended game)
is to copy the game number from the URL and paste it in the base URL of the other page type.

This little project is to make it easy to change between page types.
What I have written is a Javascript function that parses the URL of the current page and
opens a new tab displaying the opposite page type.
To be as easy to use as possible, this Javascript is meant to be used as a browser bookmarklet.

### To use the script

1) Open sdgPageChange.js in a text editor.
2) Copy the entire file contents.
3) Open a web browser.
4) Create a bookmark (the URL doesn't matter)
5) Edit the bookmark, and in place of the URL, paste the Javascript just copied
     * A bookmark with code is called a "bookmarklet"

To test the bookmarklet,

1) Navigate the browser to any SDG game page (a Play Page or Archive Page).
2) Click the bookmark.
3) Ensure that the page for that game of the opposite type has been opened.

### IF IT DOESN'T WORK FOR YOU

Try removing "false" from "return false;" on line 17.

I mostly test with Chrome.
I've heard that this change is necessary on some versions of other browsers.
If that doesn't work either, please let me know.

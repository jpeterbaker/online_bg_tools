README for sdgPageChange.js

==========
Background
==========
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
What I have written is a Javascript function that parses the URL and HTML of the current page and
opens a new tab displaying the opposite page type.
To be as easy to use as possible, this Javascript is meant to be used as a browser bookmarklet.

=================
To use the script
=================
1) Open sdgPageChange.js in a text editor.
2) Copy the entire file contents.
3) Open a web browser.
4) Create a bookmark (the URL doesn't matter)
5) Edit the bookmark, and in place of the URL, paste the Javascript just copied
     * A bookmark with code is called a "bookmarklet"

To test the bookmarklet,

1) Navigate the browser to any SDG game page (a Play Page or Archive Page)
2) Click the bookmark
3) Ensure that the page for that game of the opposite type has been opened


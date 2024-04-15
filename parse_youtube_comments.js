/* Copy chosen information from every video description
  Meant to be run on your own account's YouTube channel content page.
  I use this for making sure I don't cast the same game twice.
  This is written as a bookmarklet: put it as the URL in a bookmark
  and click it to run. Stuff gets copied to the clipboard.
*/


/* Capture the content you want from each description */
javascript:(function(){
var desc_re = /table=(\d*)/;
/* Capture the video id */
var vid_re = /video\/([^\/]*)/;

function make_link(s){
    /* Take a URL of the form https://studio.youtube.com/video/BtPpch1V9nc/edit
       Return a URL of the form https://youtu.be/BtPpch1V9nc */
    return 'https://youtu.be/' + s.match(vid_re)[1];
}

var lines = [];
var i,row,link_node,link,desc_node,m,data,date;

var rows = document.querySelectorAll('#row-container');

for(i=0;i<rows.length;++i){
    row = rows[i];

    link_node = row.querySelector('#video-title');
    link = make_link(link_node.href);

    desc_node = row.querySelector('.description');
    
    m = desc_node.innerHTML.match(/table=(\d*)/);
    if(m==null){
        data = 'None';
    }
    else{
        data = m[1];
    }
    date = row.querySelector('.tablecell-date').innerText.replace(/\n.*/,'');
    lines.push(data + '\t' + link + '\t' + date);
}
var result = lines.join('\n');

navigator.clipboard.writeText(result);
})();


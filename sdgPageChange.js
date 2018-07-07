javascript:(function(){
    url = window.location.href;
    urlre = /superdupergames\.org\/(?:main\.html)?\?page=(play_[^&]*|archive_play)&(?:num|gid)=(\d+)/;
    urlgroups = urlre.exec(url);
    if(urlgroups == null){
        alert("This bookmarklet is for use on game-viewing pages of superdupergames.org");
        return;
    }
    newurl = "http://www.superdupergames.org/main.html?page=";
    if(urlgroups[1].startsWith("play_")){
        newurl = newurl.concat('archive_play&gid=').concat(urlgroups[2]);
    }
    else{
        newurl = newurl.concat('play&gid=').concat(urlgroups[2]);
    }
    window.open(newurl);
    return false;
}
)();

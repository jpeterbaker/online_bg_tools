javascript:(function(){
    url = window.location.href;
    urlre = /superdupergames\.org\/(?:main\.html)?\?page=(play_[^&]*|archive_play)&(?:num|gid)=(\d+)/;
    urlgroups = urlre.exec(url);
    if(urlgroups == null){
        alert("This bookmarklet is for use on game pages of superdupergames.org");
        return;
    }
    newurl = "http://www.superdupergames.org/main.html?page=";
    if(urlgroups[1].startsWith("play_")){
        gameName = urlgroups[1].substring(5);
        newurl = newurl.concat('archive_play&gid=').concat(urlgroups[2]);
    }
    else{
        gamere = /\n\s*([-0-9,'#;&A-Za-z!: ]*) \(#/;
        contents = document.documentElement.innerHTML;
        htmlgroups = gamere.exec(contents);
        if(htmlgroups == null){
            alert("Problem reading page");
            return;
        }
        gameName = htmlgroups[1];
        nameMap = new Map([
            ["3-6-9",""],
            ["55Stones","stones"],
            ["Abande","abande"],
            ["Accasta","accasta"],
            ["Afrika","afrika"],
            ["Alak",""],
            ["Alfred&#39;s Wyke",""],
            ["Alien City","acity"],
            ["Amazons","amazons"],
            ["Archimedes",""],
            ["Aries",""],
            ["Attangle","attangle"],
            ["Attract",""],
            ["Avalam Bitaka",""],
            ["Blam!","blam"],
            ["Blockade",""],
            ["Branches, Twigs, and Thorns","btt"],
            ["Breakthrough","break"],
            ["Byte",""],
            ["Cage",""],
            ["Cannon","cannon"],
            ["Caravaneers","caravan"],
            ["Cascades",""],
            ["Castle",""],
            ["Castle Danger",""],
            ["Cephalopod","ceph"],
            ["Chase","chase"],
            ["Chess Cards",""],
            ["Complica",""],
            ["Conversion",""],
            ["Copolymer",""],
            ["Crossway","cross"],
            ["DareBase","dare"],
            ["Delta",""],
            ["Depth Charge","depth"],
            ["Diagonals",""],
            ["Diagonals2: Line of Sight",""],
            ["Diffusion",""],
            ["Dipole",""],
            ["Dugi",""],
            ["Entropy","entropy"],
            ["Epaminondas","epam"],
            ["Euclid",""],
            ["Fanorona",""],
            ["Fission",""],
            ["Focus","focus"],
            ["Forms",""],
            ["Fortac",""],
            ["Frames",""],
            ["Froggy Bottom",""],
            ["Generatorb",""],
            ["Golem",""],
            ["Gorgon","gorgon"],
            ["Gounki",""],
            ["Gravity",""],
            ["Grim Reaper",""],
            ["Groups",""],
            ["Guard &amp; Towers",""],
            ["Homeworlds","homeworlds"],
            ["Impasse",""],
            ["Inchworm","inchworm"],
            ["India",""],
            ["Intermedium",""],
            ["Ithaka",""],
            ["Jostle",""],
            ["Kechi","kechi"],
            ["Kingdom","kingdom"],
            ["Linear Progression",""],
            ["Lines of Action","loa"],
            ["Macadam",""],
            ["Mad Bishops",""],
            ["Magneton","magneton"],
            ["Mak-Yek",""],
            ["Man in the Moon",""],
            ["Martian Chess",""],
            ["Mastery",""],
            ["Mind Ninja",""],
            ["Mirador","mirador"],
            ["Motala Strom",""],
            ["Neighbours",""],
            ["Numeri",""],
            ["Numica",""],
            ["Ordo","ordo"],
            ["Oust","oust"],
            ["Owlman",""],
            ["Pah-Tum",""],
            ["Palisade","palisade"],
            ["Penguin Soccer",""],
            ["Photonic Attack",""],
            ["Phutball","phutball"],
            ["Phwar",""],
            ["Piecepack Letterbox",""],
            ["Pikemen","pikemen"],
            ["Praetorian",""],
            ["Pulling Strings","strings"],
            ["Quadrature",""],
            ["Qyshinsu",""],
            ["Razzle Dazzle","razzle"],
            ["Realm",""],
            ["Robo Battle Pigs","pigs"],
            ["Rush",""],
            ["SanQi",""],
            ["Scribe","scribe"],
            ["Sicic",""],
            ["Slings &amp; Stones",""],
            ["Sprawl",""],
            ["Square-Grid Hex",""],
            ["Squaredance",""],
            ["Subdivision",""],
            ["Tanbo","tanbo"],
            ["Terratain",""],
            ["Tonga",""],
            ["Tumblewords",""],
            ["Volcano","volcano"],
            ["Witch Stones",""],
            ["Wizard&#39;s Garden","garden"],
            ["Zendo","zen"],
        ]);
        shortGameName = nameMap.get(gameName);
        if(shortGameName == ""){
            alert('Error: URL-style name of the game '.concat(gameName).concat(' is not known'));
            return;
        }
        if(typeof shortGameName == 'undefined'){
            alert('Error: the game '.concat(gameName).concat(' does not appear to be on SDG'));
            return;
        }
        newurl = newurl.concat('play_').concat(shortGameName).concat('&num=').concat(urlgroups[2]);
    }
    window.open(newurl);
    return false;
}
)();


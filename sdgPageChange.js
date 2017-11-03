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
            ["3-6-9","three69"],
            ["55Stones","stones"],
            ["Abande","abande"],
            ["Accasta","accasta"],
            ["Afrika","afrika"],
            ["Alak","alak"],
            ["Alfred&#39;s Wyke","wyke"],
            ["Alien City","acity"],
            ["Amazons","amazons"],
            ["Archimedes","archimedes"],
            ["Aries","aries"],
            ["Attangle","attangle"],
            ["Attract","attract"],
            ["Avalam Bitaka","avalam"],
            ["Blam!","blam"],
            ["Blockade","blockade"],
            ["Branches, Twigs, and Thorns","btt"],
            ["Breakthrough","break"],
            ["Byte","byte"],
            ["Cage","cage"],
            ["Cannon","cannon"],
            ["Caravaneers","caravan"],
            ["Cascades","cascades"],
            ["Castle","castle"],
            ["Castle Danger","danger"],
            ["Cephalopod","ceph"],
            ["Chase","chase"],
            ["Chess Cards","ccards"],
            ["Complica","complica"],
            ["Conversion","conversion"],
            ["Copolymer","cop"],
            ["Crossway","cross"],
            ["DareBase","dare"],
            ["Delta","delta"],
            ["Depth Charge","depth"],
            ["Diagonals","diag"],
            ["Diagonals2: Line of Sight","diag2"],
            ["Diffusion","diffusion"],
            ["Dipole","dipole"],
            ["Dugi","dugi"],
            ["Entropy","entropy"],
            ["Epaminondas","epam"],
            ["Euclid","euclid"],
            ["Fanorona","fanorona"],
            ["Fission","fission"],
            ["Focus","focus"],
            ["Forms","forms"],
            ["Fortac","fortac"],
            ["Frames","frames"],
            ["Froggy Bottom","froggy"],
            ["Generatorb","generatorb"],
            ["Golem","golem"],
            ["Gorgon","gorgon"],
            ["Gounki","gounki"],
            ["Gravity","gravity"],
            ["Grim Reaper","reaper"],
            ["Groups","groups"],
            ["Guard &amp; Towers","guard"],
            ["Homeworlds","homeworlds"],
            ["Impasse","impasse"],
            ["Inchworm","inchworm"],
            ["India","india"],
            ["Intermedium","medium"],
            ["Ithaka","ithaka"],
            ["Jostle","jostle"],
            ["Kechi","kechi"],
            ["Kingdom","kingdom"],
            ["Linear Progression","linear"],
            ["Lines of Action","loa"],
            ["Macadam","macadam"],
            ["Mad Bishops","mad"],
            ["Magneton","magneton"],
            ["Mak-Yek","makyek"],
            ["Man in the Moon","moon"],
            ["Martian Chess","mchess"],
            ["Mastery","mastery"],
            ["Mind Ninja","ninja"],
            ["Mirador","mirador"],
            ["Motala Strom","motala"],
            ["Neighbours","neighbours"],
            ["Numeri","numeri"],
            ["Numica","numica"],
            ["Ordo","ordo"],
            ["Oust","oust"],
            ["Owlman","owlman"],
            ["Pah-Tum","pahtum"],
            ["Palisade","palisade"],
            ["Penguin Soccer","soccer"],
            ["Photonic Attack","photonic"],
            ["Phutball","phutball"],
            ["Phwar","phwar"],
            ["Piecepack Letterbox","letterbox"],
            ["Pikemen","pikemen"],
            ["Praetorian","praetorian"],
            ["Pulling Strings","strings"],
            ["Quadrature","quad"],
            ["Qyshinsu","qy"],
            ["Razzle Dazzle","razzle"],
            ["Realm","realm"],
            ["Robo Battle Pigs","pigs"],
            ["Rush","rush"],
            ["SanQi","sanqi"],
            ["Scribe","scribe"],
            ["Sicic","sicic"],
            ["Slings &amp; Stones","slings"],
            ["Sprawl","sprawl"],
            ["Square-Grid Hex","slash"],
            ["Squaredance","square"],
            ["Subdivision","subdivision"],
            ["Tanbo","tanbo"],
            ["Terratain","terra"],
            ["Tonga","tonga"],
            ["Tumblewords","tumble"],
            ["Volcano","volcano"],
            ["Witch Stones","witch"],
            ["Wizard&#39;s Garden","garden"],
            ["Zendo","zen"],
        ]);
        shortGameName = nameMap.get(gameName);
        if(shortGameName == ""){
            alert('Error: URL-style name of the game '.concat(gameName).concat(' is not known'));
            return;
        }
        if(typeof shortGameName == 'undefined'){
            alert('Error: the game "'.concat(gameName).concat('" does not appear to be on SDG'));
            return;
        }
        newurl = newurl.concat('play_').concat(shortGameName).concat('&num=').concat(urlgroups[2]);
    }
    window.open(newurl);
    return false;
}
)();

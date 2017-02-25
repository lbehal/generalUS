// ==UserScript==
// @name           TorrentLeechImdb
// @namespace      null
// @description    Gets IMDB scores for TL movies. 
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js 
// @include        https://classic.torrentleech.org/torrents/* 
// @grant          none
// ==/UserScript==


$1 = this.jQuery = jQuery.noConflict(true);

var debug = function(x) {    
    console.log(x); 
};

var getImdbScore = function(ref, data) {    

    var rating = $1($1(data).find("div:contains('out of 10'):last")).find("span:last").html();
    var genders = $1($1(data).find("tr:contains('Genres'):last")).find("td:last").text();
    var gtimbd = $1($1(data).find("a:contains('Go to IMDB')"));

    if (rating !== undefined && genders !== undefined) 
        ref.find('a:first').text(ref.text() + " [" + genders + ", - "+rating+ "]");
    
    if(gtimbd !== undefined)
    {   
        var texts = gtimbd.map(function(){
            return this.previousSibling.nodeValue
        });
                        
        ref.append(" ");
        gtimbd.text('IMBD');        
        gtimbd.appendTo(ref);
        
        if(texts[0] !== undefined)
        {
            var href = "http://www.csfd.cz/hledat/?q="+encodeURIComponent(texts[0]);
            var csfd = $1("<a href='"+href+"' target='_blank' style='font-size: 9px;'>CSFD</table>");
            ref.append(" ");
             csfd.appendTo(ref);
        }
    }
    
    
    if(rating !== undefined)
    {
        var link = ref.find('a:first');
        if(rating < 7.0)
        {
            link.css("font-weight", "normal");
            link.css("color", "#C2C8C8");
        }    
        if(rating < 6.0) 
            link.css("color", "#859292");
    }

};

var getTorrentPage = function(ref, url) {
    debug("Getting "+url);

    $1.get(url).success(function(data) {       
        getImdbScore(ref, data);
    }).error(function(jqXHR, textStatus, errorThrown) {
        debug("error:"+textStatus+" "+errorThrown);
    });
};

$1(".title").each(function() {    
    getTorrentPage($1(this), "https://classic.torrentleech.org"+$1(this).find('a:first').attr("href"));
});

//Holds the information about each page (profile).
function Page(_url, _username, _score, _trust, _citation, _subnets, _topics) {
    this.url = this.removeFinalSlash(_url);
    this.username = _username;
    this.score = _score;
    this.trust = _trust;
    this.citation = _citation;
    this.subnets = _subnets;
    this.topics = _topics;
}

Page.prototype.constructor = Page;

//Returns the page's url.
Page.prototype.getUrl = function () {
    return this.url;
}

//Returns just the profile name.
Page.prototype.getProfile = function () {
    return this.username;
}

//Gets the score of the profile.
Page.prototype.getScore = function () {
    return this.score;
}

//Returns the topic of a given level.
Page.prototype.getTopic = function (n, _t) {
    var t = _t;
    if(!t)
        t = 0;
    
    var topic = this.topics[t].topic.split("/");
    return topic[n] ? topic[n] : this.getUrl();
}

//Removes the final "/" from a url, important for the twitter widgets as otherwise they break - but this funciton could probably be done better.
Page.prototype.removeFinalSlash = function (string) {
    var parts = string.split("/");
    if(parts[parts.length - 1] == "") {
        var url = "";
        for(var i = 0; i < parts.length - 1; i++) {
            url += parts[i];
            if(i < parts.length - 2) {
                url += "/";
            }
        }
        return url;
    } else {
        return string;
    }
}

Page.prototype.containsTopic = function (topic) {
    for(var j = 0; j < this.topics.length; j++) {
        if (this.topics[j].topic.indexOf(topic) == 0) {
            return j;
        }
    }
    
    return -1;
}
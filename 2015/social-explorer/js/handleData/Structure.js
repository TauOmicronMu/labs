//Create a tree structure for holding the chart data.
function Structure(_name, _supertopic, list, _l, fulllist) {
    this.name = _name;
    this.supertopic = _supertopic;
    this.score = this.calcScore(list);
    this.l = _l;
    this.children = [];
    
    if(_l == 10) return;
    
    var nextLayers = {};
    
    for(var i = 0; i < list.length; i++) {
        var item = list[i].getTopic(this.l);
        if(!nextLayers[item]) {
            nextLayers[item] = [];
        }
        nextLayers[item].push(list[i]);
    }
    
    this.fullname = this.getFullTopicName(list[0].topics[0].topic);
    
    this.topprofiles = this.getTopProfiles(fulllist, this.fullname);

    
    for(var i in nextLayers) {
        if(nextLayers.hasOwnProperty(i) && !this.isUrl(nextLayers[i][0].getTopic(this.l))) 
            this.children.push(new Structure(nextLayers[i][0].getTopic(this.l), nextLayers[i][0].getTopic(0), nextLayers[i], (this.l + 1), fulllist));
    }
}

Structure.prototype.getFullTopicName = function(topic) {
    var str = topic.split("/");
    var toreturn = "";
    for(var i = 0; i < this.l; i++) {
        toreturn += str[i];
        if(i < this.l - 1)
            toreturn += "/";
    }
    if(toreturn == "")
        toreturn = "Top 10 profiles on Twitter";
    
    return toreturn
}

Structure.prototype.constructor = Structure;

//Calculates the score for this section by summing scores of all of its children.
Structure.prototype.calcScore = function (list) {
    var score = 0;
    
    for(var i = 0; i < list.length; i++) {
        score += parseInt(list[i].getScore());
    }
    
    return score;
}

//Checks to see if the string supplied is an url.
Structure.prototype.isUrl = function (str) {
    return str.indexOf("http") > -1;
}

//Sorts and saves the top 10 profiles for this section.
Structure.prototype.getTopProfiles = function (fulllist, topic) {
    var list = [];

    if(topic == "Top 10 profiles on Twitter") {
        for(var i = 0; i < fulllist.length; i++) {
            list.push({ page: fulllist[i], ti: 0 });
        }
    } else {
        for(var i = 0; i < fulllist.length; i++) {
            var index = fulllist[i].containsTopic(topic);
            if(index > -1)
                list.push({ page: fulllist[i], ti: index });
        }
    }

    list.sort(function (p1, p2) {
        var i = p2.page.topics[p2.ti].value - p1.page.topics[p1.ti].value;
        
        if (i == 0)
            i = p2.page.trust - p1.page.trust;
        
        if (i == 0)
            i = p2.page.citation - p1.page.citation;
        
        if (i == 0)
            i = p2.page.subnets - p1.page.subnets;

        return i;
    });
    
    var profiles = [];
    
    for(var i = 0; i < 10; i++) {
        if(list[i])
            profiles.push(list[i].page);
    }
    
    return profiles;
}

//Returns the object.
Structure.prototype.getMe = function () {
    var stru = {};
    stru["name"] = this.name;
    stru["fullname"] = this.fullname;
    stru["score"] = this.score;
    stru["supertopic"] = this.supertopic;
    stru["depth"] = (this.l - 1);
    stru["children"] = [];
    stru["topprofiles"] = this.topprofiles;
    
    for(var i = 0; i < this.children.length; i++) {
        stru["children"].push(this.children[i].getMe());
    }
    
    return stru;
}
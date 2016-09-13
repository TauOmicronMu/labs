function TopicTree(_page, _subPages, d) {
    this.page = _page;
    this.subtrees = [];
    
    if(_subPages[0] instanceof TopicTree) {
        this.subtrees = _subPages;
    } else {
        var children = [];
        var rest = [];

        for(var i = 0; i < _subPages.length; i++) {
            var toAdd = _subPages[i];
            if(_subPages[i].getUrlPieces().length > d) {
                rest.push(toAdd);
            } else {
                var old = this.checkForDuplicate(children, toAdd);
                if(!old) {
                    children.push(toAdd);
                } else if (toAdd == old) {
                    for(var j = 0; j < children.length; j++) {
                        if(children[i].getFinalUrlPiece() == toAdd.getFinalUrlPiece()) {
                            children[i] = toAdd;
                        }
                    }
                }
            }
        }

        var children2 = {};

        for(var i = 0; i < children.length; i++) {
            children2[children[i].getFinalUrlPiece()] = [];
        }

        for(var i = 0; i < rest.length; i++) {
            if(!children2[rest[i].getUrlPieces()[d - 1]]) {
                children.push(new PageDetails(rest[i].getUrlPieces()[d - 1], rest[i].getTrustFlow(),  rest[i].getCitationFlow(),  rest[i].getBacklinkCount(),  rest[i].getTopic()));
                children2[rest[i].getUrlPieces()[d - 1]] = [];
            }
            children2[rest[i].getUrlPieces()[d - 1]].push(rest[i]);
        }

        var x = 0;

        for(var i = 0; i < Math.min(max_subtrees, children.length); i++) {
            this.subtrees.push(new TopicTree(children[i], children2[children[i].getFinalUrlPiece()], (d + 1)));
            x++;
        }

        if(x < children.length - 1) {
            var otherList = [];

            for(x; x < children.length; x++) {
                otherList.push(new TopicTree(children[x], children2[children[x].getFinalUrlPiece()], (d + 1)));
            }

            var otherPage = new PageDetails("Other", 0,  0,  0,  new TopicDetails("Other", 0));
            this.subtrees.push(new TopicTree(otherPage, otherList, d));
        }
    }
}

TopicTree.prototype.checkForDuplicate = function (children, subPage) {
    for(var j = 0; j < children.length; j++) {
        if(children[j].getFinalUrlPiece() == subPage.getFinalUrlPiece()) {
            return comparePages(children[j], subPage);
        }
    }
    
    return null;
}

TopicTree.prototype.constructor = TopicTree;

TopicTree.prototype.getBackLinkSum = function () {
    var num = 0;
    for(var i = 0; i < this.subtrees.length; i++) {
        num += this.subtrees[i].getBackLinkSum();
    }
    
    var toReturn = num + parseInt(this.page.getBacklinkCount());
    return isNaN(toReturn) ? num : toReturn;
}

TopicTree.prototype.getTopTopic = function () {
    var topTopic = this.page.getTopic();
    
    for(var i = 0; i < this.subtrees.length; i++) {
        var topicToTest = this.subtrees[i].getTopTopic();
        
        if(topTopic.trustFlow < topicToTest.trustFlow) {
            topTopic = topicToTest;
        }
    }
    
    return topTopic;
}

TopicTree.prototype.getMe = function () {
    var tree = {};
    
    var subtreesForReturn = [];
    for(var i = 0; i < this.subtrees.length; i++) {
        subtreesForReturn.push(this.subtrees[i].getMe());
    }
    
    tree["name"] = this.page.getFinalUrlPiece();
    tree["trustFlow"] = this.page.trustFlow;
    tree["citationFlow"] = this.page.citationFlow;
    tree["backlinkCount"] = this.getBackLinkSum();
    tree["topTopic"] = this.getTopTopic();
    tree["children"] = subtreesForReturn;
    return tree;
}
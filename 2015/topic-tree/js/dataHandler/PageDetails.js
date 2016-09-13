function PageDetails(_url, _trustFlow, _citationFlow, _backlinkCount, _topic) {
    this.urlPieces = this.createUrlPieces(_url);
    this.trustFlow = _trustFlow;
    this.citationFlow = _citationFlow;
    this.backlinkCount = _backlinkCount;
    this.topic = _topic;
}

PageDetails.prototype.constructor = PageDetails;

PageDetails.prototype.createUrlPieces = function (_url) {
    var noSpeechMarks = _url.replace("\"", "");
    var noProto = noSpeechMarks.replace("http://", "").replace("https://", "");
    var domain = noProto.split("/")[0];
    var domPieces = domain.split(".");
    var subDom = domPieces.length > 2 ? domPieces[0] : "";
    var noSubDom = noProto.replace(subDom + ".", "");
    var phpVarIndex = noSubDom.indexOf("?");
    var noPHPVars = phpVarIndex != -1 ? noSubDom.substring(0, phpVarIndex) : noSubDom;
    var splitURL = noPHPVars.split("/");
    
    var toReturn = [];
    for(var i = 0; i < splitURL.length; i++) {
        if(splitURL[i] !== "") {
            toReturn.push(splitURL[i]);
        }
    }
    
    return toReturn;
}

PageDetails.prototype.getUrlPieces = function () {
    return this.urlPieces;
}

PageDetails.prototype.getFinalUrlPiece = function () {
    return this.urlPieces[this.urlPieces.length - 1];
}

PageDetails.prototype.getTrustFlow = function () {
    return this.trustFlow;
}

PageDetails.prototype.getCitationFlow = function () {
    return this.citationFlow;
}

PageDetails.prototype.getBacklinkCount = function () {
    return this.backlinkCount;
}

PageDetails.prototype.getTopic = function () {
    return this.topic;
}

PageDetails.prototype.getMe = function () {
    var page = {};
    page["name"] = this.getFinalUrlPiece();
    page["trustFlow"] = this.trustFlow;
    page["citationFlow"] = this.citationFlow;
    page["backlinkCount"] = this.backlinkCount;
    page["topTopic"] = this.getTopic().getMe();
    return page;
}
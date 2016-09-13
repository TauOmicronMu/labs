function TopicDetails(_name, _trustFlow) {
    this.name = _name;
    this.trustFlow = _trustFlow;
}

TopicDetails.prototype.constructor = TopicDetails;

TopicDetails.prototype.getName = function () {
    return this.name;
}

TopicDetails.prototype.getTrustFlow = function () {
    return this.trustFlow;
}

TopicDetails.prototype.getMe = function () {
    var topic = {};
    topic["name"] = this.name;
    topic["trustFlow"] = this.trustFlow;
    return topic;
}
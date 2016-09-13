var findKeywords = new (function() {
	this.addWebsite = function() {
		var inputRows = document.getElementsByClassName("websiteinput");
		var newRow = document.createElement("tr");
		newRow.className = "websiteinput";
		var newCol = document.createElement("td");
		var websiteInput = document.createElement("input");
		websiteInput.id = "website"+inputRows.length;
		websiteInput.className = "websiteinputbox";
		newCol.appendChild(websiteInput);
		newRow.appendChild(newCol);
		var webTable = document.getElementById("weblist");
		webTable.appendChild(newRow);
	}
	
	this.removeWebsite = function() {
		$("#weblist tr:last").remove();
	}
	
	this.submit = function() {
		var anchorWords = [];
		var inputRows = document.getElementsByClassName("websiteinput");
		for(var i = 0; i < inputRows.length; i++) {
			var domain = $("#website"+i).val();
			anchorWords.push({});
			anchorWords[i] = getAnchorWords(domain,anchorWords[i]);
		}
		
		var commonAnchorWords = getCommonWords(anchorWords);
		commonAnchorWords = removeCommonWords(commonAnchorWords);
		commonAnchorWords = sortWords(commonAnchorWords);
		
		displayWords(commonAnchorWords);
		
		removeLoadingScreen();
	}
	
	function getCommonWords(anchorWords) {
		var commonAnchorWords = {}
		
		for(var i in anchorWords[0]){
			for(var j = 1; j < anchorWords.length; j++){
				if(anchorWords[j][i]){
					anchorWords[0][i]+=anchorWords[j][i];
				} else {
					delete anchorWords[0][i];
					break;
				}
			}
		}
		
		return anchorWords[0];
	}
	
	function displayWords(anchorWords) {
		$("option").remove();
		var select = $("#keywordresults")
		for(var i = 0; i < anchorWords.length; i++) {
			var anchorWord = anchorWords[i].word;
			anchorWord = anchorWord.replace(" ","");
			if(anchorWord !== "") {
				var option = document.createElement("option")
				option.innerHTML = anchorWord;
				select.append(option);
			}
		}
	}
	
	function sortWords(anchorWords) {
		var anchorWordsArray = [];
		
		for(var i in anchorWords){
			anchorWordsArray.push({word:i, value:anchorWords[i]});
		}
		
		anchorWordsArray = anchorWordsArray.sort(function(a,b){return (b.value - a.value); });
		
		return anchorWordsArray;
	}
	
	function removeCommonWords(anchorWords) {
		for(var i in anchorWords){
			if($.inArray(i,dict)>=0){
				delete anchorWords[i];
			}
		}
		
		return anchorWords;
	}
	
	//Returns Set of words in anchor text
	function getAnchorWords(domain, anchorWords) {
		var anchorText = getAnchorText(domain);
		
		for(var i = 0; i < anchorText.length; i++){
			var currentText = anchorText[i].AnchorText;
			currentText = currentText.replace(/[^a-zA-Z ]+/g, '').replace('/ {2,}/',' ');
			var currentTextList = currentText.split(/\b/);
			for(var j = 0; j < currentTextList.length; j++){
				var anchorWord = (currentTextList[j].toLowerCase()).replace(" ","");
				if(anchorWord !== ""){
					if(anchorWords[anchorWord]) {
						anchorWords[anchorWord]++;
					} else {
						anchorWords[anchorWord] = 1;
					}
				}
			}
		}
		
		return anchorWords;
	}
	
	function getAnchorText(domain) {
		var anchorTextResults = $.ajax({
			url: "../projects/APIFilter.php",
			data: {
				cmd: "GetAnchorText",
				item: domain,
				datasource: "fresh",
				count: 1000,
				AccessToken: getCookie("accessToken")
			},
			type: "POST",
			async: false,
			dataType: "json"
			}).responseText;
		return $.parseJSON(anchorTextResults).DataTables.AnchorText.Data;
	}
	
	this.gotoKeyWordComparator = function() {
		var selectedKeyWord = $("#keywordresults").val();
		var selectedWebsite = $("#website0").val();
		window.location.href = "index.php?goto=" + selectedWebsite + "_" + selectedKeyWord;
	}
})();
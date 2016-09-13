var Record = new (function(){
	this.recordJSONToFile = function(json, filename){
		download(filename + ".json", JSON.stringify(json));
	}
	
	this.decodeFileToJSON = function(values){
		var json = $.ajax({
				url: "../projects/phpIncludes/loadRecordedJSONFile.php",
				data: {
					filename: "../../" + values.projectname + "/json/" + values.filename + ".json"
				},
				async: false,
				dataType: "json"
			}).responseText;
		return json;
	}
	
	//Function to download a file containing text
	function download(filename, text) {
		var file = document.createElement('a');
		file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		file.setAttribute('download', filename);

		file.style.display = 'none';
		document.body.appendChild(file);

		file.click();

		document.body.removeChild(file);
	}
})();
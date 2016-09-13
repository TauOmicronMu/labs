var c;
var ctx;
var game;
var players = [];
var inPlay = false;
var raceFinished = true;
var beforeStart = true;
var canDrive = false;
var lastTime = 0;
var tracks;
var controlScheme;
var keysPressed;
var controls;

// Images
var imgGrass,
    imgRoad,
    imgStartLine,
    imgArray,
    imgBoost;

function init() {
    hidePlayer2();
    createAILeageTable();
    
    initImages();
    initControls();
    initCanvas();
    initTracks();
    initWindowEvents();
    initAccessTokenLayout();
    initCover();
}

function initImages() {
    imgGrass = new Image();
    imgGrass.src = "res/img/grass.png";
    imgRoad = new Image();
    imgRoad.src = "res/img/road.png";
    imgStartLine = new Image();
    imgStartLine.src = "res/img/startline.png";
    imgBoost = new Image();
    imgBoost.src = "res/img/boost.png";

    topicCatagories = [
        "Arts",
        "News",
        "Society",
        "Computers",
        "Business",
        "Regional",
        "Recreation",
        "Sports",
        "Kids",
        "Reference",
        "Games",
        "Home",
        "Shopping",
        "Health",
        "Science",
        "Adult",
        "World"
    ];

    imgArray = {};

    for (var i = 0; i < topicCatagories.length; i++) {
        var imgTempF = new Image();
        var imgTempL = new Image();
        var imgTempR = new Image();
        imgTempF.src = "res/img/cars/" + topicCatagories[i] + "_car.png";
        imgTempL.src = "res/img/cars/" + topicCatagories[i] + "_car_left.png";
        imgTempR.src = "res/img/cars/" + topicCatagories[i] + "_car_right.png";
        imgArray[topicCatagories[i]] = {
            imgCar: imgTempF,
            imgCarLeft: imgTempL,
            imgCarRight: imgTempR
        };
    }
}

function initControls() {
    /*
    Controlls: 
    
    Player 0 - w a s d

    Player 1 - up left down right
    */
    controlScheme = [{
        up: 38,
        down: 40,
        left: 37,
        right: 39
    }, {
        up: 87,
        down: 83,
        left: 65,
        right: 68
    }];

    controls = [{
        up: false,
        down: false,
        left: false,
        right: false
    }, {
        up: false,
        down: false,
        left: false,
        right: false
    }];


    keysPressed = [];
    for (var i = 0; i < 222; i++) {
        keysPressed.push(false);
    }
    
    function keyPressed(e) {
        keysPressed[e.keyCode] = true;
    }

    function keyReleased(e) {
        keysPressed[e.keyCode] = false;
    }

    window.addEventListener('keydown', keyPressed, false);
    window.addEventListener('keyup', keyReleased, false);
}

function initCanvas() {
    c = document.getElementById("mracing");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    ctx = c.getContext("2d");
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
}

function initTracks() {
    tracks = {
        "Grasslands": scaleCoursePoints([
            {x: 300, y: 100},
            {x: 100, y: 100},
            {x: 100, y: 500},
            {x: 500, y: 500},
            {x: 500, y: 100},
            {x: 300, y: 100}
            ], 500),
        "The Big M": scaleCoursePoints([
            {x: 0, y: 500},
            {x: 0, y: 900},
            {x: 400, y: 900},
            {x: 400, y: 300},
            {x: 800, y: 300},
            {x: 800, y: 900},
            {x: 1200, y: 900},
            {x: 1200, y: 300},
            {x: 1600, y: 300},
            {x: 1600, y: 900},
            {x: 2000, y: 900},
            {x: 2000, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 500}
            ], 800),
        "Triangulate": scaleCoursePoints([
            {x: 4, y: 0},
            {x: 5, y: 0},
            {x: 5, y: 2},
            {x: 4, y: 2},
            {x: 4, y: 3},
            {x: 5, y: 3},
            {x: 5, y: 5},
            {x: 0, y: 0},
            {x: 2, y: 0},
            {x: 2, y: 1},
            {x: 3, y: 1},
            {x: 3, y: 0},
            {x: 4, y: 0},
            ], 800),
        "Round The Bend": scaleCoursePoints([
            {x: 9, y: 5},
            {x: 9, y: 12},
            {x: 0, y: 3},
            {x: 1, y: 2},
            {x: 6, y: 7},
            {x: 7, y: 6},
            {x: 2, y: 1},
            {x: 5, y: 1},
            {x: 9, y: 1},
            {x: 9, y: 5}
            ], 800)
    };

    //Creates the options menu
    var keys = [];
    for (var key in tracks) {
        if (tracks.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    var trackOptions = document.getElementById("trackselector");

    for (var i = 0; i < keys.length; i++) {
        var option = document.createElement("option");
        option.text = keys[i];
        option.value = keys[i];
        trackOptions.add(option);
    }

//    $.ajax({
//        type: 'GET',
//        url: 'res/countries.geo.json',
//        success: function(data) {
//            for (var i = 0; i < data.features.length; i++) {
//                if (data.features[i].id != "-99") {
//                    var option = document.createElement("option");
//                    option.text = data.features[i].properties.name;
//                    option.value = data.features[i].id;
//                    trackOptions.add(option);
//                }
//            }
//        }
//    });
}

function initWindowEvents() {    
    $(window).blur(function() {
        if (inPlay && !raceFinished) pause();
    });

    $(window).resize(function() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        if(game) game.tick(ctx, 0);
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27 && inPlay && !raceFinished) {
            pause();
        }
        getGoButton().className = "unusableButton";
    });
    
    $(document).click(function(e) {
        var x = e.clientX, y = e.clientY;
        var emio = document.elementFromPoint(x, y);

        if(!(emio == document.getElementById("loadButton"))) {
           getGoButton().className = "unusableButton";
        }
    });
}

function initAccessTokenLayout() {
    if(getCookie("accessToken")) {
        showElements([getCookieDiv("with")]);
        hideElements([getCookieDiv("without")]);
        
        makeInputOptions();
    } else {
        showElements([getCookieDiv("without")]);
        hideElements([getCookieDiv("with")]);
        
        makeDropDownOptions();
    }
}

function initCover() {
    if(getUrlVars()['article'] == "true") {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        var img = document.createElement("img");
        img.className = "coverImg";
        img.width = 850;
        img.height = 600;
        img.src = "res/img/cover.png";
        var beginButton = document.createElement("button");
        beginButton.className = "bigbutton";
        beginButton.id = "beginFromCoverButton";
        beginButton.innerHTML = "Start game";
        beginButton.onclick = function() { 
            document.getElementsByTagName("body")[0].removeChild(document.getElementById("coverDiv")); 
            document.getElementsByTagName("body")[0].style.overflow = "visible";
        };
        var fullVersionButton = document.createElement("button");
        fullVersionButton.className = "bigbutton";
        fullVersionButton.id = "fullVersionButton";
        fullVersionButton.innerHTML = "View Full Version";
        fullVersionButton.onclick = function() {
            var win = window.open("https://labs.majestic.com/2015/mracing", '_blank');
            win.focus();
        };
        var div = document.createElement("div");
        div.id = "coverDiv";
        div.appendChild(img);
        div.appendChild(fullVersionButton);
        div.appendChild(beginButton);
        document.getElementsByTagName("body")[0].appendChild(div);
    }
}

function changeToUseAccessToken() {
    showElements([getCookieDiv("with")]);
    hideElements([getCookieDiv("without")]);
    
    makeInputOptions();
}

function makeInputOptions() {
    for(var i = 0; i < 2; i++) {
		var div = document.getElementById("player" + i).getElementsByClassName("webInput")[0];
		replaceSelect(div, "winput");
	}
	var aiPlayers = document.getElementsByClassName("aifield");
	for(var i = 0; i < aiPlayers.length; i++){
		var aiRow = aiPlayers[i].getElementsByTagName("td")[1];
		if(aiRow.getElementsByClassName("aiinput") != 0){
			aiRow.removeChild(aiRow.getElementsByClassName("aiinput")[0]);
		}
		replaceSelect(aiPlayers[i].getElementsByTagName("td")[1], "aiinput");
	}
}

function replaceSelect(div, inputClass){
	var select = div.getElementsByTagName("select");
	var input = document.createElement("input");
	if(select.length==1){        
		input.value = select[0].value;
		div.removeChild(select[0]);
	}
	input.className=inputClass;
	div.appendChild(input);
}

function makeDropDownOptions() {    
    for(var i = 0; i < 2; i++) {
        var div = document.getElementById("player" + i).getElementsByClassName("webInput")[0];
        var select = getselectfromjson();
        select.className = "winput";
        div.appendChild(select);
    }
}

function getselectfromjson() {
    var websiteOptions = $.ajax({
        url: "getNameFromJson.php",
        async: false
    }).responseText;
	
    websiteOptions = $.parseJSON(websiteOptions);
    
    var select = document.createElement("select");
    for(var j = 0; j < websiteOptions.length; j++) {
        var option = document.createElement("option");
        option.text = websiteOptions[j];
        option.value = websiteOptions[j];
        select.appendChild(option);
    }
    return select;
}

function getCountry(countryCode) {

    var res = $.ajax({
        url: "res/countries.geo.json",
        async: false
    }).responseText;

    var returned = $.parseJSON(res.responseText).features;

    for (var i = 0; i < returned.length; i++) {
        if (returned[i].id == countryCode) {
            allJSON = returned[i].geometry.coordinates;
        }
    }

    var json;
    // Get the biggest piece of the country
    for (var i = 0; i < allJSON.length; i++) {
        if (allJSON[i][0][0] && !json || allJSON[i][0].length > json.length) {
            json = allJSON[i][0];
        } else if (!json || allJSON[i].length > json.length) {
            json = allJSON[i];
        }
    }

    var smoothing = Math.ceil(json.length / 50),
        scaleX = 7000,
        scaleY = 7000;


    var points = [];

    for (var i = 0; i < json.length; i++) {
        if (i % smoothing == 0 || i == json.length - 1) {
            points.push({
                x: json[i][0],
                y: -json[i][1]
            });
        }
    }

    points = scaleCoursePoints(points, 7000);

    return points;
}

// Scale so all courses are the same size
function scaleCoursePoints(points, size) {
    var mmX = new MinMax(points, function(p) {
        return p.x;
    });
    var newPoints = [];

    for (var i = 0; i < points.length; i++) {
        newPoints.push({
            x: mmX.getScaledValue(points[i].x) * size,
            y: mmX.getScaledValue(points[i].y) * size
        });
    }

    return newPoints;
}

function launchGame() {
    if (players.length > 0 && getGoButton().className == "bigbutton") {
        addAIPlayers();
        var huds = document.getElementsByClassName("hudsection");
        hideHud();

        var selectedTrack = document.getElementById("trackselector").value;
        var toGame;
        if (selectedTrack.length == 3) {
            toGame = scaleCoursePoints(getCountry(selectedTrack), 2500);
        } else {
            toGame = tracks[document.getElementById("trackselector").value];
        }

        game = new Game(
            players,
            toGame,
            document.getElementById("lapcount").innerHTML
        );

        inPlay = true;
        beforeStart = true;

        showGame();

        var countDown = 3;
        var cdText = document.getElementById("countdown");
        cdText.style.display = 'block';

        var countdownLoop = setInterval(function() {
            if (parseInt(cdText.innerHTML) > 1) {
                cdText.innerHTML = parseInt(cdText.innerHTML) - 1;
            } else if (parseInt(cdText.innerHTML) == 1) {
                cdText.innerHTML = "GO!!!";
                raceFinished = false;
                canDrive = true;
                showElements([getPauseButton()]);
            } else {
                cdText.innerHTML = 3;
                beforeStart = false;
                cdText.style.display = 'none';
                clearInterval(countdownLoop);
            }
            countDown--;
        }, 1000);
        
        tick();
    }
}

function tick() {
    if (inPlay) {
        var curTime = new Date().getTime();
        var alpha = (curTime - lastTime) / 8;
        lastTime = curTime;

        alpha = Math.min(alpha, 10);

        if (!raceFinished) {
            updateControls();
        } else {
            for (var i = 0; i < 2; i++) {
                controls[i].up = false;
                controls[i].down = false;
                controls[i].left = false;
                controls[i].right = false;
            }
        }



        game.tick(ctx, alpha);
    }

    setTimeout(tick, 0);
}

function updateControls() {
    for (var i = 0; i < 2; i++) {
        controls[i].up = keysPressed[controlScheme[i].up];
        controls[i].down = keysPressed[controlScheme[i].down];
        controls[i].left = keysPressed[controlScheme[i].left];
        controls[i].right = keysPressed[controlScheme[i].right];
    }
}

function getJSONIndexItemInfo(domain) {
	var accessToken = getCookie("accessToken");
	
	var json;
	if(accessToken) {
		var res = $.ajax({
			url: "../projects/APIFilter.php",
			data: {
				cmd: "GetIndexItemInfo",
				items: 1,
				item0: domain,
				datasource: "fresh",
				count: 100,
				AccessToken: getCookie("accessToken")
			},
			type: "POST",
			async: false,
			dataType: "json"
		}).responseText;

		json = $.parseJSON(res).DataTables.Results.Data[0];
	} else {
		json = $.parseJSON(Record.decodeFileToJSON({projectname:"mracing",filename:domain}));
	}
	//Record.recordJSONToFile(json,domain);
    return json;
}

function pause() {
    showElements([getPauseMenu()]);
    hideElements([getPauseButton()]);
    inPlay = false;
}

function showGame() {
    showElements([getGameArea()]);
    hideElements([getPauseMenu(), getMainMenu()]);
    inPlay = true;
}

function exitGame() {
    emptyCharts();
    showElements([getMainMenu()]);
    hideElements([getGameArea(), getPauseMenu(), getWinnerBox(), getPauseButton()]);
    hideHud();
    
    inPlay = false;
    beforeStart = true;
    raceFinished = true;
    canDrive = false;
}

function hideHud() {
    var huds = document.getElementsByClassName("hudsection");
    for (var i = 0; i < huds.length; i++) {
        huds[i].style.display = 'none';
    }
}

function showElements(elems) {
    for(var i = 0; i < elems.length; i++) {
        elems[i].style.display = 'block';
    }
}

function hideElements(elems) {
    for(var i = 0; i < elems.length; i++) {
        elems[i].style.display = 'none';
    }
}

function getPauseMenu() {
    return document.getElementById("pausemenu");
}

function getPauseButton() {
    return document.getElementById("pausebutton");
}

function getMainMenu() {
    return document.getElementById("inputarea");
}

function getGoButton() {
    return document.getElementById("goButton");
}

function getWinnerBox() {
    return document.getElementById("winnerbox");
}

function getGameArea() {
    return document.getElementById("gamearea");
}

function getAiDiv() {
    return document.getElementById("aiEntries");
}

function getPlayerDiv(n) {
    return document.getElementById("player" + n);
}

function getCookieDiv(w) {
    return document.getElementById(w + "Token");
}

function toggleTwoPlayerMode() {
    var button = document.getElementById("togglePlayer2Button");
    if(button.innerHTML == "Add Player 2") {
        showElements([getPlayerDiv(1)]);
        button.innerHTML = "Remove Player 2";
    } else {
        hidePlayer2();
        button.innerHTML = "Add Player 2";
    }
}

function hidePlayer2() {
    var p2div = getPlayerDiv(1);
    hideElements([p2div]);
    var inputs = p2div.getElementsByTagName("input");
    for(var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
}

function loadPlayerInfo() {
    emptyCharts();
    
    setCookie();

    var tableRows = document.getElementsByClassName("playerEntry");
    players = [];
    getGoButton().style.display = 'inline';

    for (var i = 0; i < tableRows.length; i++) {
        if (addHumanPlayer(i)) {
            var player = players[players.length - 1];
            addBar("speed", player.data.TrustFlow, i, "red");
            addBar("acceleration", player.data.CitationFlow, i, "yellow");
            addBar("handling", player.data.TopicalTrustFlow_Value_0, i, "green");
        }
    }

    fillAIFields();
    
    getGoButton().className = "bigbutton";
}

function addHumanPlayer(index) {
    var tableRows = document.getElementsByClassName("playerEntry");
    var name = tableRows[index].getElementsByClassName("nameinput")[0].value;
    var website = tableRows[index].getElementsByClassName("winput")[0].value;

    if (name != "" && website != "") {
        var data = getJSONIndexItemInfo(website);

        players.push({
            player: index,
            name: name,
            website: website,
            data: data,
            controls: controls[index],
            img: imgArray[getSuperTopic(data.TopicalTrustFlow_Topic_0)],
            type: "player"
        });
        return true;
    }

    return false;
}

function addBar(attribute, value, index, color) {
    var chart = document.getElementById(attribute + index);
    var chartHeight = chart.height;
    var chartWidth = chart.width;

    var chartCtx = chart.getContext("2d");

    chartCtx.fillStyle = color;
    chartCtx.fillRect(0, 0, chartWidth * value / 100, chartHeight);
}

function emptyCharts() {
    var attrs = ["speed", "acceleration", "handling"];
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < attrs.length; j++) {
            var chart = document.getElementById(attrs[j] + i);
            var chartHeight = chart.height;
            var chartWidth = chart.width;
            var chartCtx = chart.getContext("2d");

            chartCtx.clearRect(0, 0, chartWidth, chartHeight);
        }
    }
}

function getEnemySites(refSubNets, n) {
    
    var playerIndex = million.length;

    for (var i = 0; i < million.length; i++) {
        if (million[i].RefSubNets < refSubNets) {
            playerIndex = i;
            break;
        }
    }

    playerIndex = Math.max(playerIndex, n / 2);
    playerIndex = Math.min(playerIndex, million.length - (n / 2));
    
    if(playerIndex + n > million.length - 1){
        playerIndex -= n;
    }
    
    var enemySites = [];
    for (var i = Math.floor(playerIndex - n / 2); i < Math.floor(playerIndex + n / 2); i++) {
        enemySites.push(million[i + 2].Domain);
    }

    return enemySites;
}

function changeNumberOfLapsOnPage(n) {
    n = parseInt(n);
    var lapN = document.getElementById("lapcount");
    lapN.innerHTML = Math.abs((parseInt(lapN.innerHTML) + n)%11);
    if(parseInt(lapN.innerHTML) <= 0) {
        lapN.innerHTML = Math.abs((parseInt(lapN.innerHTML) + n)%11);
    }
}

function changeNumberOfAiOnPage(n) {
    n = parseInt(n);
    var aiN = document.getElementById("ainumbers");
    onP = parseInt(aiN.innerHTML);
    var maxN = getCookie("accessToken") ? 10 : 2;
    if(!(onP == maxN && n == 1) && !(onP == 0 && n == -1)) {
        aiN.innerHTML = Math.abs(onP + n);
        changeNumberOfAi();
    }
    if(aiN.innerHTML == 0) {
        hideElements([getAiDiv()]);
    } else {
        showElements([getAiDiv()]);
    }
}

function createAILeageTable() {
    var table = document.createElement("table");
    
    var tr = document.createElement("tr");
    var tdtxt = document.createElement("td");

    tdtxt.innerHTML = "<b>AI Players</b>";
    tdtxt.setAttribute("colspan","2");
    tr.appendChild(tdtxt);
    tr.className = "aititle";
    table.appendChild(tr);
    
    for (var i = 0; i < document.getElementById("ainumbers").innerHTML; i++) {
        createAIField(table);
    }
    getAiDiv().appendChild(table);
}

function createAIField(table) {
    var tr = document.createElement("tr");
    var tdtxt = document.createElement("td");
    var tdbox = document.createElement("td");    
    var box = getCookie("accessToken") ? document.createElement("input") : getselectfromjson();
    
    box.className = "aiinput";
    tdtxt.innerHTML = "Website:";
    tdbox.appendChild(box);
    tr.appendChild(tdtxt);
    tr.appendChild(tdbox);
    tr.className = "aiField";
    table.appendChild(tr);
}

function changeNumberOfAi() {
    var table = getAiDiv().getElementsByTagName("table")[0];
    var trs = document.getElementsByClassName("aiField");
    for (var i = 0; i < 11; i++) {
        if (i <= document.getElementById("ainumbers").innerHTML && trs.length < i) {
            createAIField(table);
        } else if (trs[i]) {
            table.removeChild(trs[trs.length - 1]);
        }
    }
}

function addAIPlayers() {
    var trs = document.getElementsByClassName("aiField");
    var playerNumberOfAI = players.length + 1;

    for (var i = 0; i < trs.length; i++) {
        var aiField = trs[i].getElementsByClassName("aiinput")[0];
        var data = getJSONIndexItemInfo(aiField.value);

        players.push({
            player: playerNumberOfAI + i,
            name: names[parseInt(Math.random() * names.length)],
            website: aiField.value,
            data: data,
            controls: controls[0], //Not used, but doesn't hurt so why fix it :p sorry misha ;)
            img: imgArray[getSuperTopic(data.TopicalTrustFlow_Topic_0)],
            type: "cpu"
        });
    }
}

function fillAIFields() {
    var aiDetails = getEnemySites(players[0].data.RefSubNets, parseInt(document.getElementById("ainumbers").innerHTML));
    var trs = document.getElementsByClassName("aiField");
    var j = 0;

    for (var i = 0; i < trs.length; i++) {
        var aiField = trs[i].getElementsByClassName("aiinput")[0];
        if (aiField.value == "") {
            aiField.value = aiDetails[j];
            j++;
        }
    }
}
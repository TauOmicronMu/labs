<html>
    <head>
        <title>MRacing</title>
        
        <?php include '../projects/phpIncludes/coreImports.php'?>
        
        <link rel="stylesheet" href="css/main.css" type="text/css">
        <link rel="stylesheet" href="css/playerentry.css" type="text/css">
        <script src="js/main.js"></script>
        <script src="js/Game.js"></script>
        <script src="js/sprites/Sprite.js"></script>
        <script src="js/sprites/cars/Car.js"></script>
        <script src="js/sprites/cars/Player.js"></script>
        <script src="js/sprites/cars/Enemy.js"></script>
        <script src="js/sprites/Barrier.js"></script>
        <script src="js/sprites/Terrain.js"></script>
        <script src="js/sprites/Boost.js"></script>
        <script src="js/coursebuilder.js"></script>
        <script src="js/collisions.js"></script>
        <script src="js/mathhelper.js"></script>
        <script src="js/names.js"></script>
        <script src="js/sprites/Checkpoint.js"></script>
        <script>
            var million = <?php
                $rows = array_map('str_getcsv', file('res/majestic_million_shortened.csv'));
                $header = array_shift($rows);
                $csv = array();
                foreach ($rows as $row) {
                    $csv[] = array_combine($header, $row);
                }
                print json_encode($csv);
            ?>;
        </script>
    </head>
    
    <body onload="logo.setupLogoWithWhiteText(); init();">
        <div class="menu" id="inputarea">            
            <p id="pageTitle">MRacing</p>
            
            <?php
                $names = ["Player 1", "Player 2"];
                $sites = ["google.com", "facebook.com"];
                $ctrls = [
                    "Forward: &#8593; , Backward: &#8595; , Left: &#8592; , Right: &#8594;",
                    "Forward: w, Backward: s, Left: a, Right: d"
                ];

                for ($index = 0; $index < 2; $index ++) {
                    $defname = $names[$index];
                    $ctrlstring = $ctrls[$index];
                    
                    include 'getPlayerEntry.php';
                }
            ?>
            
            <button class="bigbutton" onclick="toggleTwoPlayerMode();" id="togglePlayer2Button">Add Player 2</button>
            
            <br/>            
            <br/>            
            <br/>            
            <table class="infoEntry">
                <tr><td>Number of AI players:</td><td><button class="iterateButton" onclick="changeNumberOfAiOnPage(-1);">-</button><span id="ainumbers">2</span><button class="iterateButton" onclick="changeNumberOfAiOnPage(1);">+</button></td></tr>
                <tr><td>Number of laps:</td><td><button class="iterateButton" onclick="changeNumberOfLapsOnPage(-1);">-</button><span id="lapcount">3</span><button class="iterateButton" onclick="changeNumberOfLapsOnPage(1);">+</button></td></tr>
                <tr><td>Course:</td><td>
                    <select id="trackselector">
                    </select>
                </td></tr>
            </table>
			<br/><button class="bigbutton" onclick="loadPlayerInfo();" id="loadButton">Load cars</button>
            
            <div class="playerdetails" id="aiEntries">

            </div>

            <br/><button class="unusableButton" onclick="launchGame();" id="goButton">GO!</button>
            <div id="accessTokenArea">
                <div id="withoutToken">
                    <button class="bigbutton" type="button" onclick="changeToUseAccessToken();">Use Access Token</button>
                </div>
                <div id="withToken">
                    <br/><span class="inputsection">Access Token:<input type="text" id="accesstoken" value="<?php echo isset($_COOKIE["accessToken"]) ? $_COOKIE["accessToken"] : "" ?>"></input></span>
                    <button class="bigbutton" type="button" onclick="loadKeyGetter();">Get Access Token</button>
                </div>
            </div>
        </div>

        <div class="menu" id="pausemenu" style="display: none;">
            <p id="pageTitle" style="margin-top: 10px">Game Paused</p>
            <button class="bigbutton" onclick="showGame(); showElements([getPauseButton()]);">Resume game</button>
            <button class="bigbutton" onclick="exitGame();">Exit to main menu</button>
        </div>
        
        <div id="gamearea">
            <div id="hud">
                <table>
                    <tr class="hudsection"><td>
                        <table class="hudtile" id="p0hud">
                            <tr class="hudname"><td>Name: </td></tr>
                            <tr class="hudwebsite"><td>Website:</td></tr>
                            <tr class="hudlap"><td>Lap:</td></tr>
                            <tr class="hudlap"><td>Controls:</td></tr>
                        </table>
                        <canvas class="carpic" id="carpic0"></canvas>
                    </td></tr>
                    <tr class="hudsection"><td>
                        <table class="hudtile" id="p1hud">
                            <tr class="hudname"><td>Name: </td></tr>
                            <tr class="hudwebsite"><td>Website: </td></tr>
                            <tr class="hudlap"><td>Lap:</td></tr>
                            <tr class="hudlap"><td>Controls:</td></tr>
                        </table>
                        <canvas class="carpic" id="carpic1"></canvas>
                    </td></tr>
                </table>
            </div>
            <canvas id="mracing">
                Your browser doesn't support this game.
            </canvas>
            <p id="countdown">3</p>
        </div>
        <div class="menu" id="winnerbox">
            <p><b>WINNER!</b></p>
            <p id="congratsbox">Congratulations </p>
            <button class="bigbutton" onclick="exitGame();">New Game</button>
        </div>
        <button id="pausebutton" onclick="pause();">Pause</button>
    </body>
</html>
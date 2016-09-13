<html>
    <head>
        <title>Update Social Explorer</title>
        <link href="../../projects/res/icons/favicon.png" rel="icon" type="image/png">
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>

        <script src="js/handler.js"></script>
        <script src="../js/handleData/Page.js"></script>
        <script src="../js/handleData/Structure.js"></script>
    </head>
    
    <body>
        <h3>Instructions to update Social Explorer data:</h3>
        <ol>
            <li>Select the file below.</li>
            <li>Press "Generate Social Explorer Data" button below. This may take a short while, and even if your browser says the tab has crashed do not exit the tab.</li>
            <li>When "Done" appears the process is complete, and the updated graphic will appear.</li>
        </ol>
        File: <input type="file" id="fileupload"></input>
        <button onclick="newdata();">Generate Social Explorer Data</button>
        <h3>To roll back to previous data:</h3>
        <ul>
            <li>Press the roll back button to roll back to the previous data set.</li>
            <li>You can press roll back again to revert back to the data set before that.</li>
        </ul>
        <button onclick="rollback();">Roll back</button>
        <div id="output"></div>
    </body>
</html>
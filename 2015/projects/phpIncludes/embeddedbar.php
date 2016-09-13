<div class="main" id="holder">
    <div class="holderTitle">
        
        <div class="holdertext">
            <script>
                var replaceWords = {
                    "url": "URL",
                    "w1": "URL 1",
                    "w2": "URL 2",
                    "keyword": "Key word"
                };

                var graphdata = getGraphValues();
                var data = graphdata.data;
                function goToFullVersion() {
                    var win = window.open("https://labs.majestic.com/2015/" + graphdata.projectname + "/index.php?goto=" + <?php echo json_encode($_GET["goto"]) ?>, '_blank');
                    win.focus(); 
                }

                function getEmbedded() {
                    var string = "";
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            string += (replaceWords[key] ? replaceWords[key] : key) + ": " + data[key] + ", ";
                        }
                    }

                    return string.substr(0, string.length - 2);
                }

                document.write(document.title + " - ");
                document.write(getEmbedded());
            </script>
        </div>
        
        <div class="navButtonContainer">
            <div class="navButton" style="width: 120px;">
                <button onclick="goToFullVersion();">View full version</button>
            </div>
        </div>
    </div>
</div>

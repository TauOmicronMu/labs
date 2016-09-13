<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <script>
            window.twttr = (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
                if (d.getElementById(id)) return t;
                js = d.createElement(s);
                js.id = id;
                js.src = "https://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);

                t._e = [];
                t.ready = function(f) {
                t._e.push(f);
                };

                return t;
            }(document, "script", "twitter-wjs"));
        </script>
        
        <title>Social Explorer&trade;</title>
        
        <?php include dirname($_SERVER['SCRIPT_FILENAME']) . '/../projects/phpIncludes/coreImports.php'?>
        
        <!-- jQuery UI -->
        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
        
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        
        <!-- CSS -->
        <link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/social-explorer/css/main.css"></link>
    
        <?php if (!isset($_GET["embedded"])): ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/social-explorer/css/responsive.css"></link>
        <?php else: ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/social-explorer/css/embedded.css"></link>
        <?php endif; ?>

        <?php if (isset($_GET["embedtype"]) && $_GET["embedtype"] == "chart"): ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/social-explorer/css/allchart.css"></link>
        <?php endif; ?>
        <?php if (isset($_GET["embedtype"]) && $_GET["embedtype"] == "list"): ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/social-explorer/css/alllist.css"></link>
        <?php endif; ?>
        
        <!-- JS -->
        <script src="<?php echo $serv_dir; ?>/social-explorer/js/main1.1.js"></script>
        <script src="<?php echo $serv_dir; ?>/social-explorer/js/handleData/Page.js"></script>
        <script src="<?php echo $serv_dir; ?>/social-explorer/js/handleData/Structure.js"></script>
        
        <script>
            var handle,
                topic,
                topic1,
                topic2,
                topic3,
                embedded,
                mobile;
            
            <?php if (isset($_GET["handle"])): ?>
            handle = "<?php print $_GET["handle"]; ?>";
            handle = handle.toLowerCase();
            <?php endif; ?>
            
            <?php if (isset($_GET["topic"])): ?>
            topic = "<?php print $_GET["topic"]; ?>";
            <?php endif; ?>
            
            <?php if (isset($_GET["embedded"])): ?>
            embedded = "<?php print $_GET["embedded"]; ?>";
            <?php endif; ?>
            
            if (topic) {
                topic = topic.split("/");

                if (topic[0]) { topic1 = topic[0]; }
                if (topic[1]) { topic2 = topic[1]; }
                if (topic[2]) { topic3 = topic[2]; }
            }
            
            mobile = window.innerWidth < 1000 && !embedded;
        </script>
    
        <?php if (!(isset($_SERVER['HTTP_DNT']) && $_SERVER['HTTP_DNT'] == 1)): ?>
        <script type="text/javascript">
            setTimeout(function(){var a=document.createElement("script");
            var b=document.getElementsByTagName("script")[0];
            a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/0039/3356.js?"+Math.floor(new Date().getTime()/3600000);
            a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);
        </script>
        <?php endif; ?>
    </head>
    
    <body onload="logo.setupLogo(); graph.loadGraph();">
        <?php
            if(isset($_GET["embedded"])) {
                include 'embeddedhead.php';
            }
        ?>
        
        
        <div id="main-content">
            <!-- Graph -->
            <script>createLoadingScreen();</script>
            
            <div class="graphContainer" style="margin-top: 0px;">
                <div class="graph" id="socialexplorer"></div>
            </div>
            
            <!-- Top 10 list -->
            <div id="top-container">
                <div id="top-title"></div>
                <div id="top-list" class="row"></div>
            </div>
            
            <script>
                
            </script>
            
            <div style="clear:both"></div>
        </div>
        
        
        
        <?php if (!(isset($_GET["embedded"]) && $_GET["embedded"])): ?>
        <!-- Footer -->
        <div id="footer">
            <button id="embedcode-buttonshow" onclick="graph.showEmbedCode();">Embed/Link</button>
            <p id="analyticsText">Social Explorer&trade; powered by <a href="http://www.majesticanalytics.com/">Majestic Analytics</a>. Not endorsed by Twitter.</p>
        </div>
        
        <div id="embedcode-holder">
            <p id="embedcode-text">Link to page:</p>
            <textarea readonly rows="5" class="embedcode-code" id="embedcode-link"></textarea><br/>
            <p id="embedcode-text">Embed this page:</p>
            <textarea readonly rows="5" class="embedcode-code" id="embedcode-embedfull"></textarea><br/>
            <p id="embedcode-text">Embed top 10 panel only:</p>
            <textarea readonly rows="5" class="embedcode-code" id="embedcode-embedlist"></textarea><br/>
            <p id="embedcode-text">Embed graphic only:</p>
            <textarea readonly rows="5" class="embedcode-code" id="embedcode-embedchart"></textarea><br/>
            <button id="embedcode-buttonhide" class="bigbutton" onclick="graph.hideEmbedCode();">Close</button>
        </div>
        
        <div class="hashtag-container">
            <a class="hashtag-container" target="_blank" href="https://twitter.com/intent/tweet?text=Find+the+most+influential+people+on+Twitter+with+%23SocialExplorer&via=tryMajestic&url=https%3A%2F%2Flabs.majestic.com%2F2015%2Fsocial-explorer">#SocialExplorer</a>
        </div>
        
        <?php endif; ?>
        
        <?php include $comp_dir . '/projects/phpIncludes/piwik.php'?>
    </body>
</html>

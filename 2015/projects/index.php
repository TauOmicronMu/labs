<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>Majestic Projects</title>
        
        <?php include '../projects/phpIncludes/coreImports.php'?>
        
        <!-- Bootstrap -->
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"></link>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    
	    <link rel="stylesheet" type="text/css" href="<?php print $serv_dir; ?>/projects/css/homepage.css"></link>
    
        <script src="js/setupHomePage.js"></script>

        <?php if (!(isset($_SERVER['HTTP_DNT']) && $_SERVER['HTTP_DNT'] == 1)): ?>
        <script type="text/javascript">
            setTimeout(function(){var a=document.createElement("script");
            var b=document.getElementsByTagName("script")[0];
            a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/0039/3356.js?"+Math.floor(new Date().getTime()/3600000);
            a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);
        </script>
        <?php endif; ?>
    </head>
    <body style="overflow: visible; overflow-x: hidden;" onload="setupHomePage();">
        <a href="http://majestic.com"><img class="mlogo" src="res/icons/majesticseo-logo.png" id="header"></img></a>
        <p style="font-size:30pt; text-align:center; margin:0px;"><b>Summer 2015 Internship Projects/Prototypes</b></p><br>
        
        <div class="container">
            <div class="row mainPage" id="projLinks"></div>
        </div>
        
        <div class="wrapperForBottom">
            <div class="mainPage" id="authorDescription">
                <button style="position: fixed; bottom: 5px; left: 5px;" onclick="deleteCookie();">Forget Access Token</button>
                Created by Misha Wagner, Rowan Cole and Thomas Clarke using HTML, CSS, PHP, JavaScript with D3 and the <a href="http://majestic.com">Majestic</a> <a href="http://developer-support.majestic.com/">API</a>
            </div>
        </div>
        <a href="about" class="aboutlink">About</a>
    </body>
</html>
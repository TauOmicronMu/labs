<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>About</title>
        <?php 
            $dir = '../phpIncludes/helperfunctions.php';
            include '../phpIncludes/coreImports.php' 
        ?>  
	    <link rel="stylesheet" type="text/css" href="../css/homepage.css"></link>
    </head>
    <body style="overflow: visible; overflow-x: hidden;">
        <a href="http://majestic.com"><img class="mlogo" src="../res/icons/majesticseo-logo.png" id="header"></img></a>
        <p style="font-size:30pt; text-align:center; margin:0px;"><b>About labs.majestic.com</b></p><br>
        
        <div>
            <table class="descriptionContent">
                <tr class="descriptioncoloumn">
                    <td>
                        <p class="descriptionText">Majestic is an independent technology solution that provides commercial insight into data and market trends. We want to help you bridge the gap and be better positioned within your industry, and to do that, we thought we’d be a little creative. On this page you’ll find games, interactive programmes and applications which have been created using HTML, CSS, PHP, JavaScript with D3 and the Majestic API.</p>
                        <p class="descriptionText">The team largely responsible for the work are Thomas Clarke, Rowan Cole and Misha Wagner who have joined Majestic over the 2015 summer period. You can find their contact details below for any questions, and read some blog posts about their work via the <a href="https://blog.majestic.com/category/labs/">labs blog post section</a>.</p>
                    </td>
                </tr>
                <tr class="memberHolder" id="misha">
                    <td>
                        <?php 
                            $name = "Misha Wagner";
                            $contact = "<a target=\"_blank\" href=\"https://linkedin.com/in/mishawagner\" a>LinkedIn</a> | <a target=\"_blank\" href=\"http://mishawagner.co.nf/\">Website</a>";
                            $position = "Developer";
                            $pic = "misha";
                            include('membertable.php');
                        ?>
                    </td>
                </tr>
                <tr class="memberHolder" id="tom">
                    <td>
                        <?php 
                            $name = "Tom Clarke";
                            $contact = "<a target=\"_blank\" href=\"https://linkedin.com/in/TomBClarke\" a>LinkedIn</a> | <a target=\"_blank\" href=\"http://tombclarke.co.uk\">Website</a>";
                            $position = "Developer";
                            $pic = "tom";
                            include('membertable.php');
                        ?>
                    </td>                         
                </tr>
                <tr class="memberHolder" id="rowan">
                    <td>
                        <?php 
                            $name = "Rowan Cole";
                            $contact = "<a target=\"_blank\" href=\"https://linkedin.com/in/rowanphilip\" a>LinkedIn</a>";
                            $position = "Developer";
                            $pic = "rowan";
                            include('membertable.php');
                        ?>
                    </td>                           
                </tr>
                <tr class="memberHolder" id="pupul">
                    <td>
                        <?php 
                            $name = "Pupul Chatterjee";
                            $contact = "<a target=\"_blank\" href=\"https://twitter.com/pupulchatterjee\" a>@pupulchatterjee</a>";
                            $position = "Blogger";
                            $pic = "pupul";
                            include('membertable.php');
                        ?>
                    </td>                           
                </tr>
            </table>
            
        </div>
        <br/>
        <a href="https://labs.majestic.com" class="aboutlink">Back</a>
    </body>
</html>
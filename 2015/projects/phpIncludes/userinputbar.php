<?php
    print "<div class=\"inputs\">";

    /*
        Must have inputs[] set, array of strings showing prompts for inputs,
        and ids[] set, array of IDs to attach to the entries.
        Can have:
         - defaults[] - array of default values
         - types[] - array of types of entry
    */

    // Whether to put in full access code or not
    $fullaccess = isset($_COOKIE["accessToken"]) || (isset($_GET["fullaccess"]) && $_GET["fullaccess"]);

    $token_from_cookie = "";

    // Get token from cookie
    if ($fullaccess) {
        $token_from_cookie = isset($_COOKIE["accessToken"]) ? $_COOKIE["accessToken"] : "";
    }

    if (!isset($inputs)) {
        die("Inputs aren't set.");
    }

    // Loop through inputs 
    for ($i = 0; $i < count($inputs); $i++) {	

        // Print out entry onto the HTML
        print "<span class=\"inputsection\">$inputs[$i]: ";

        // Change type of entry depending on types[]
        if (!isset($types) || $types[$i] == "text") {
            if ($fullaccess) {
                print "<input type=\"text\" id=\"$ids[$i]\" value=\"" . $defaults[$i][0] . "\">";
            } else {
                print "<select id=\"$ids[$i]\">";

                for ($j=0; $j<count($defaults[$i]); $j++) {
                    print "<option value=\"" . $defaults[$i][$j] . "\">" . $defaults[$i][$j] . "</option>";
                }

                print "</select>";
            }
        } else if ($types[$i] == "select") {
            print "<select id=\"$ids[$i]\"></select>";
        } else if ($types[$i] == "checkbox") {
            if($defaults[$i]==true){
                print "<input type=\"checkbox\" id=\"" . $ids[$i] . "\"checked></input>";
            }else{
                print "<input type=\"checkbox\" id=\"" . $ids[$i] . "\"></input>";
            }
        }

        print "</span>";
    }

    // HTML for submit button
    $submitButton = "";
    $userButton = "";
    
    // soz ro
    if(isset($button) && (!isset($button["fullAccess"])||(!$button["fullAccess"] || $fullaccess))){
        $userButton = "<button class=\"extraButton\" type=\"button\" id=\"submitbutton\" onclick=\"" . $button["onclick"] . "\">" . $button["text"] . "</button>";
    }
    
    if(!isset($hideButton) || $hideButton == false){
        $submitButton = "<button type=\"button\" id=\"submitbutton\" onclick=\"setupGraph();\">Submit</button>";
    }

    //Triggers the button on enter being pressed.
	
	$inputButtons = $submitButton . $userButton;

    if ($fullaccess) {
        print "<span class=\"inputsection\">Access Token: ";
        print "<input type=\"text\" id=\"accesstoken\" value=\"$token_from_cookie\">";
        print "</span>";
		print $inputButtons;
        print "<button class=\"generalbuttons\" type=\"button\" onclick=\"loadKeyGetter();\">Get Access Token</button>";
    } else {
		print $inputButtons;
        print "<button class=\"generalbuttons\" type=\"button\" onclick=\"loadFullAccess();\">Get Full Access</button>";
    }

    if (isset($usageImg)) {
        print "<img class=\"apiOMeter\" src=\"../projects/res/apiOMeter/apiOMeter_" . $usageImg . ".png\"></img>";
    }

    print "</div>";
?>

<script>
    $(document).keyup(function(e) {
        if (e.keyCode == 13) {
            var button = document.getElementById('submitbutton');
            button.click();
        }
    });
</script>
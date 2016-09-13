var logo = new (function() {
    this.setupLogo = function() {
        makeLogo("majesticseo-logo-small.png");
    }
    
    this.setupLogoWithWhiteText = function() {
        makeLogo("majesticseo-logo-small-white.png");
    }
    
    function makeLogo(png) {
        var a = document.createElement("a");
        a.setAttribute("href","https://labs.majestic.com");
        a.setAttribute("target", "_blank");
        
        var img = document.createElement("img");
        img.className = "imglogoembedded";
        img.setAttribute("src", serv_dir + "/projects/res/icons/" + png);
        
        a.appendChild(img);
        document.getElementsByTagName("body")[0].appendChild(a);
    }
}) ();
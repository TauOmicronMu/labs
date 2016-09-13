/* JavaScipt Domain Tools */
function DomainTools()
{
	var domain = [];
	var IPLegacyMode;
	var validSecondLevelDomains = [ "co", "com", "org", "net", "edu", "ac", "gov", "eu", "mil" ];
	var domainMap = {};
	domainMap["au"] = [ "asn", "id" ];
	domainMap["tr"] = [ "gen", "biz", "info", "av", "dr", "pol", "bel", "bbs", "k12", "name", "web", "tel" ];
	domainMap["cn"] = [ "tw", "hk" ];
	domainMap["jp"] = [ "ad", "ac", "co", "go", "or", "ne", "gr", "ed", "lg", "geo" ];

	/*
		Instantiates the object - pass in either a URL or a String
	*/
	this.setup = function( host )
	{
		if ( host )
		{
			// remove anything before (and including) ****://
			host = host.replace(/.*?:\/\//g, "");//host.replace("(^[a-zA-Z]+://)", "");
			// remove anything after a :
			host = host.replace(/:.*/g, "");
			// remove a trailing / and anything after it /***/***
			host = host.replace(/\/.*/, "");

			this.IPLegacyMode = 1;
			this.domain = host.split(/\./);
		}
	}

	/*
		Set the IP Legacy mode
	*/
	this.setLegacyIPMode = function( status )
	{
		if ( status == 0 )
		{
			this.IPLegacyMode = 0;
		}
		else
		{
			this.IPLegacyMode = 1;
		}
	}

	/* 
		Return the domain from the Array of Parts.
	*/
	this.getDomain = function()
	{
		var joinedUpDomain = this.domain[0];
		for ( var i = 1; i < this.domain.length; i++ )
		{
			joinedUpDomain += "." + this.domain[i];
		}
		return joinedUpDomain;
	}

	/*
		Estimates a sub domain from the original url passed in.
	*/
	this.getSubDomain = function()
	{
		if ( this.getDomain() == this.getShortDomain() )
		{
			return "www." + this.getDomain();
		}
		else
		{
			return this.getDomain();
		}
	}

	/*
		IF www.(short domain) is the same as the domain then return the domain, otherwise return the short domain.
	*/
	this.getWWWDomain = function()
	{
		var dom = this.getDomain();
		var sd = this.getShortDomain();
		var shortDomain = "www.";
		shortDomain += sd;
		if ( shortDomain == dom )
		{
			return sd;
		}
		else
		{
			return dom;
		}
	}

	/*
		Get the equivalent WWW domain, return true if they are the same.
	*/
	this.equivalentWWWDomain = function( baseDomain, compareDomain )
	{
		var domainToCompare = baseDomain.getWWWDomain();
		var domainToCompareAgainst = compareDomain.getWWWDomain();

		if ( domainToCompare == domainToCompareAgainst )
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}

	/*
		Returns either the last three elements, or the last two elements, depending on where the tld is,
		so getShortDomain on "www.example.co.uk" returns "example.co.uk", and "www.example.com" returns "example.com"
	*/
	this.getShortDomain = function()
	{
		if ( this.domain.length <= 2 )
		{
			return this.domain.join(".");
		}

		var first = this.domain[0];
		var tld = this.domain[ this.domain.length - 1 ];
		var secondld = this.domain[ this.domain.length - 2 ];

		if ( first.match(/\d/) && this.domain.length == 4 && this.IPLegacyMode == 1 )
		{
			return this.domain[0] + "." + this.domain[1] + "." + this.domain[2];
		}

		if ( tld == "uk" )
		{
			return this.threeParts( this.domain );
		}

		var domainMapToLoop = ""
		if ( typeof domainMap[ tld ] != "undefined" )
		{
			domainMapToLoop = domainMap[ tld ];
		}
		for( var i = 0; i < domainMapToLoop.length; i++ )
		{
			if ( domainMapToLoop[i] == secondld )
			{
				return this.threeParts( this.domain );
			}
		}

		for ( var j = 0; j < validSecondLevelDomains.length; j++ )
		{
			if ( validSecondLevelDomains[j] == secondld )
			{
				return this.threeParts( this.domain );
			}
		}

		return this.twoParts( this.domain );
	}

	/*
		Used to return 3 parts of a domain
	*/
	this.threeParts = function( dom )
	{
		if ( dom.length < 3 )
		{
			return dom.join(".");
		}

		return dom[ dom.length - 3 ] + "." + dom[ dom.length - 2 ] + "." + dom[ dom.length - 1 ];
	}

	/*
		Used to return 2 parts of a domain
	*/
	this.twoParts = function( dom )
	{
		if ( dom.length < 2 )
		{
			return dom.join(".");
		}

		return dom[ dom.length - 2 ] + "." + dom[ dom.length - 1 ];
	}
}
// Create nodes from domain
function createData(json) {
    var newJSONArray = json.New.DataTables.BackLinks.Data;
    var lostJSONArray = json.Lost.DataTables.BackLinks.Data;

    var newDataSingle = parseJSONToSingleEvents(newJSONArray, true);
    var lostDataSingle = parseJSONToSingleEvents(lostJSONArray, false);

    // Safe to concat now that isNew has been set
    var dataSingle = newDataSingle.concat(lostDataSingle);

    return parseSingleToDateEvents(dataSingle);
}

// JSON to data
function parseJSONToSingleEvents(jsonArray, isNew) {
    var allData = [];

    for (var i=0; i<jsonArray.length; i++) {
        allData.push(new SingleEvent(jsonArray[i], isNew));
    }

    return allData;
}

// Call all parsing of datasets
function parseSingleToDateEvents(singles) {
    var dataCompany = parseSingleToCompanyEvents(singles);
    var dataDate = parseCompanyToDateEvents(dataCompany);

    return dataDate;
} 

// Group into companies
function parseSingleToCompanyEvents(singles) {
    var companyCollections = {};

    for (var i=0; i<singles.length; i++) {
        var key = singles[i].getCompanyGroupKey();
        if (key in companyCollections) {
            companyCollections[key].push(singles[i]);
        } else {
            companyCollections[key] = [singles[i]];
        }
    }

    var companyEvents = [];

    Object.keys(companyCollections).forEach(function(key, index) {
        companyEvents.push(new CompanyEvent(companyCollections[key]));
    });

    return companyEvents;
}

// Group into dates
function parseCompanyToDateEvents(companies) {
    var dateCollections = {};

    for (var i=0; i<companies.length; i++) {
        var key = companies[i].getDateGroupKey();
        if (key in dateCollections) {
            dateCollections[key].push(companies[i]);
        } else {
            dateCollections[key] = [companies[i]];
        }
    }

    var dateEvents = [];

    Object.keys(dateCollections).forEach(function(key, index) {
        dateEvents.push(new DateEvent(dateCollections[key]));
    });

    return dateEvents;
}

// Group back together if been broken down
function groupBackTogether() {
    // Get singles
    var singles = [];
    nodes.forEach(function(d) {
        if (d instanceof SingleEvent) {
            singles.push(d);
        }
    });

    // Remove them
    singles.forEach(function(d) {
        d.removeSelf();
    });

    // Create company events
    var newCompanyEvents = parseSingleToCompanyEvents(singles);
    
    // Get other company events
    var companies = [];
    nodes.forEach(function(d) {
        if (d instanceof CompanyEvent) {
            companies.push(d);
        }
    });
    
    // Remove them
    companies.forEach(function(d) {
        d.removeSelf();
    });
    
    // Combine two companies arrays
    companies = companies.concat(newCompanyEvents);
    
    // Create date events
    var newDateEvents = parseCompanyToDateEvents(companies);
    
    // Set start points to grav points so they start in the right place
    newDateEvents.forEach(function(d) {
        var newY;
        for (var i=0; i<d.companyEvents.length; i++) {
            var curCompany = d.companyEvents[i];
            
            if (curCompany.y) {
                newY = curCompany.y;
                break;
            }
        }
        
        if (!newY) {
            console.log("No company with Y value. Setting to middle.")
            newY = height/2;
        }
            
        
        var gravPoint = d.getGravPoint();
        d.x = gravPoint.x;
        d.y = newY;
        d.px = d.x;
        d.py = d.y;
    });
    
    // Add date events
    nodes = nodes.concat(newDateEvents);

    // Update the graph
    graph.update();
}
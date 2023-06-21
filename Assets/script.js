
const key = "Bdv7pnZ1L2aRNw7L0NjHQAwtIPjQmGsD";

// Update the current slider value (each time you drag the slider handle)
$("#radius").on("input", function() {
    $("#radiusValue").text(this.value + " mi");
}); 

// When the search button is clicked, retrieve the user's input and use it to search for POI
$("#searchBtn").on("click", function() {
    $("#mapOptions").collapse("hide");
    var query = $("#addressInput").val();
    if (query == "") {
        
        // If no query is provided, retrieve current geolocation
        navigator.geolocation.getCurrentPosition(function(location) {
            var lat = location.coords.latitude;
            var lon = location.coords.longitude;
            
            //Now use Reverse Geocoding to get the address
            var revgeoapiUrl = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${key}`;
            $.getJSON(revgeoapiUrl, function(data) {
                $("#addressInput").val(data.addresses[0].address.freeformAddress);
                loadPOI(data.addresses[0].address.freeformAddress, lat, lon);
            });
        });
    } else {
        // Request geolocation data from TomTom Geocoding API using the provided query
        var geoapiUrl = `https://api.tomtom.com/search/2/geocode/${query}.json?key=${key}`;
        $.getJSON(geoapiUrl, function(data) {
            var lat = data.results[0].position.lat;
            var lon = data.results[0].position.lon;
            loadPOI(query, lat, lon);
        });
    }
});

/*
    This function creates a marker on a given map at a specified position. 
    It also associates a popup with the marker, displaying additional data. 
*/
function createMarker( map, position, color, data, onClick ) {
    const popupText = displayDetails( data )
    const popup = new tt.Popup({ offset: 30 }).setHTML( popupText );
    const marker = new tt.Marker({ anchor: "bottom", color: color })
        .setLngLat( position )
        .setPopup( popup )
        .addTo( map );
    if( onClick ) {
        marker._element.addEventListener( "click", onClick );
    }
}

/*
    This function creates HTML code to display details such as the name, distance, address, and phone number based on the provided data.
    The generated HTML code is then returned.
*/
function displayDetails( data ) {
    var info = "";
    info += `<h1>${data.poi.name}</h1>`;

    let dist = data.dist;
    if (dist) {
        dist = dist * 0.000621371;
        dist = dist.toFixed(1);
        info += `<p>${dist} miles away</p>`;
    }

    if( data.address ) {
        info += `<p>${data.address.streetNumber} ${data.address.streetName}<br>${data.address.localName}, ${data.address.countrySubdivision} ${data.address.postalCode}</p>`;
    }
    if( data.poi.phone ) {
        info += `<p>${data.poi.phone}</p>`;
    }
    return info;
}

// This function loads POI based on the provided latitude and longitude
async function loadPOI(query, lat, lon) {
        walkscore(query, lat, lon);

        // Set the response radius to the user's input
        const radiusMi = $("#radius").val();
        var radius = radiusMi * 1609.3440 + 150;
        const zoom = convertMileToZoom(radiusMi);

        // Get the user's selected categories
        var categorySet = [];
        $("input[type=checkbox]:checked").each(function() {
            categorySet.push($(this).val());
        });

        // Create the object of search data to save to local storage
        var searchObj = {
            query: query,
            radius: radiusMi,
            categories: categorySet
        };
        var storageData = JSON.parse(localStorage.getItem("searches")) || [];

        // Find if there is an existing object with same query and remove it
        for (var i = 0; i < storageData.length; i++) {
                if (storageData[i].query === query) {
                    storageData.splice(i, 1); // remove the object
                    break; // exit loop after finding the object and removing it
                }
        }
        storageData.push(searchObj);

        // Save the updated array to local storage
        localStorage.setItem("searches", JSON.stringify(storageData));

        // Code to update your dropdown
        updateDropDown(storageData);


        //Generates a TomTom Map using the TomTom Maps SDK for Web
        var map = tt.map({
            key: key,
            container: "map",
            dragPan: true,
            center: [lon, lat],
            zoom: zoom
        });
        map.addControl(new tt.FullscreenControl());
        map.addControl(new tt.NavigationControl());

        //Looks up POI nearby using the TomTom nearbySearch SDK
        const data = await tt.services.nearbySearch({
            key: key,
            categorySet: categorySet.join(","),
            center: [lon, lat],
            radius: radius,
            limit: 100,
        });

        // Adds a marker for the entered address
        createMarker( map, [ lon, lat ], "#0000FF", { poi : {name : "Home" }});

        // Adds a marker for each POI found
        data.results.forEach( p => {
            createMarker( map, [ p.position.lng, p.position.lat ], "#000000", p, async () => {
                displayDetails( p, null );
            });
        });
}

// This function retrieves the Walk Score for the provided latitude and longitude 
function walkscore(query, lat, lon) {
    var wsapiUrl = `https://coreyelectronics.com/walkscore/?lat=${lat}&lon=${lon}`;
    $.getJSON(wsapiUrl, function(data) {
        $("#walkscore").html(data.walkscore);
        $("#walkscore_description").html(data.description);
        
    });
}
// Function to convert miles to zoom level
function convertMileToZoom(mile) {
    if (mile <= 0) return 1;
    if (mile <= 1) return 15;
    if (mile <= 2) return 13;
    if (mile <= 5) return 12;
    if (mile <= 9) return 11;
    if (mile <= 20) return 10;
    return 10;
}

// Function to update the dropdown list of searches
function updateDropDown(searchData) {
    var select = $("#searchesDropdown");
    select.children("option:not(:first)").remove(); // remove old options but keep the first one
    searchData.forEach(function(searchObj, index) {
        var option = $("<option></option>")
            .attr("value", index)
            .text(searchObj.query);
        select.append(option);
    });
}

// When a search is selected from the dropdown, populate the elements with the selected search data and perform the search
$("#searchesDropdown").change(function() {
    var selectedIndex = $(this).val();
    var storageData = JSON.parse(localStorage.getItem("searches"));
    var selectedSearch = storageData[selectedIndex];

    // now populate the elements with selectedSearch data
    // assuming you have elements with ids 'radius', 'categories' and 'results'
    $("#addressInput").val(selectedSearch.query);
    $("#radius").val(selectedSearch.radius);
    $("#radiusValue").text($("#radius").val() + " mi");
    $("#results").html(JSON.stringify(selectedSearch.results)); // simplistic representation
    
    //clear checkboxes first
    $("input[type=checkbox]").prop('checked', false);
    selectedSearch.categories.forEach(function(category) {
        $("input[value='" + category + "']").prop('checked', true);
    });
    $("#searchBtn").click();
});

// When the page is done loading, retrieve the search history from local storage and populate the dropdown
$(document).ready(function() {
    var storageData = JSON.parse(localStorage.getItem("searches")) || [];
    updateDropDown(storageData);
});
$("#searchesDropdown").val(""); // clear the dropdown

// When the clear history button is clicked, remove the search history from local storage and clear the dropdown
$("#clearHistoryBtn").on("click", function() {
    localStorage.removeItem("searches"); // clear the search history from local storage
    $("#searchesDropdown").children("option:not(:first)").remove(); // clear the dropdown
});

//send email function
function sendEmail(){

    Email.send({
        SecureToken: "1a233ae3-a03f-42a9-9bd8-b01afed00735",
        To : [ 'ibrahimadiallo2394@gmail.com', 'aliviahhilliard@gmail.com', 'omnipresentadservices@gmail.com', 'keiquanboy@gmail.com' ],
        From : document.getElementById("multi-email").value,
        Subject : "Contact us form Entry",
        Body :"First Name: " + document.getElementById("multi-first-name").value
            + "<br> Last Name: " + document.getElementById("multi-last-name").value
            + "<br> E-Mail: " + document.getElementById("multi-email").value
            + "<br> City: " + document.getElementById("multi-city").value
            + "<br> Subject: " + document.getElementById("subject").value
    }).then(
      message => alert("Message Sent Succesfully")
    );
}


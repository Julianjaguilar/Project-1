var baseURL = "api.tomtom.com", 
versionNumber = "2",
query = "Coffee",
ext = "json",
apiKey = "Bdv7pnZ1L2aRNw7L0NjHQAwtIPjQmGsD",
categoryset = "9376006"
// when the user clicks the search button
$("#search").on("click", function(event) {
$.ajax({
    url: `https://${baseURL}/search/${versionNumber}/poiSearch/${query}.${ext}?key=${apiKey}&categoryset=${categoryset}`,

    method: "GET",
    dataType: "json",
    success: function(response) {
      // Code to handle the response
      console.log(response);
      // Loop through response
      for (var i = 0; i < response.results.length; i++) {
        // Create a new table row element
        var tRow = $("<tr>");
        // Create a new table data element for the location name
        var nameTd = $("<td>");
        // Set the text of the table data to the location name
        nameTd.text(response.results[i].poi.name);
        // Append the table data to the table row
        tRow.append(nameTd);
        // Append the table row to the table body
        $("tbody").append(tRow);
      }
      
    },
    error: function(xhr, status, error) {
      // Code to handle errors
      console.log("Request failed: " + error);
    }
  });
});

  

  

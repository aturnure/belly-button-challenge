// Use the D3 library to read in samples.json from the URL
const samples = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the JSON data and console log it
d3.json(samples).then(function(data) {
    console.log(data);
  });

// Use the D3 library to read in samples.json from the URL
const samplesURL = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initializes the page with a default plot
function init() {

  // Use d3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  // Fetch the json data with d3
  d3.json(samplesURL).then(function(data) {
    console.log(data);

    // Put Sample IDs in the dropdown menu
    data.names.forEach(function(sampleID) {
      dropdownMenu.append("option").text(sampleID).property("value", sampleID);
    });

    // Make first sample default data for chart
    createBarChart(data.names[0], data);

    // Prepare dropdown for change
    dropdownMenu.on("change", function() {
      let selectedId = dropdownMenu.property("value");
      createBarChart(selectedId, data);
    });
  });
}

// Create bar chart
function createBarChart(sample_id, data) {

  // Sort sample_values by descending
  let sample = data.samples.find(sample => sample.id == sample_id);
  let sortedByValue = sample.sample_values.slice().sort((a, b) => b - a);

  // Slice the first 10 objects for plotting
  let slicedSampValue = sortedByValue.slice(0, 10);

  // Reverse the array to accommodate Plotly's defaults
  slicedSampValue.reverse();

  // Trace for data
  let traceSamp = {
    x: slicedSampValue.map(object => object.sample_value),
    y: slicedSampValue.map(object => `OTU ${object.otu_id}`),
    text: slicedSampValue.map(object => object.otu_label),
    name: "OTU Chart",
    type: "bar",
    orientation: "h"
  };

  // Data array
  let otuData = [traceSamp];

  // Apply title
  let layout1 = {
    title: "Top 10 OTU's per Individual",
  };

  // Render the plot
  Plotly.newPlot("bar", otuData, layout1);
}

init();


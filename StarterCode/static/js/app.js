// Use the D3 library to read in samples.json from the URL
const samplesURL = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to collect the data from the metadata list in the samples json 
function buildMetadata(sample) {

  // Fetch the json data with d3
  d3.json(samplesURL).then(function(data) {
    let sampleData = data.metadata;
    let resultList = sampleData.filter(function(metadata) {
      return metadata.id == sample;
    });

    let IDdata = d3.select("#sample-metadata");

    // Clear previous content
    IDdata.html("");

    // Loop to include the demographic info in the list on the side for each id selected
    Object.entries(resultList[0]).forEach(function(pair) {
      let key = pair[0];
      let value = pair[1];

      let h6data = IDdata.append("h6");
      h6data.text(`${key}: ${value}`);
    });
  });
}

// Create bar and bubble charts
// Call function to build charts
function buildCharts(sample) {
  d3.json(samplesURL).then(function(data) {
    let samples = data.samples;
    let sampList = samples.filter(function(samples) {
      return samples.id == sample;
    });
    let results = sampList[0];

    // Get desired data for bar chart
    let bar_x = results.sample_values.slice(0, 10).reverse();
    let bar_y = results.otu_ids.slice(0, 10).map(function(otuid) {
      return "OTU" + otuid;
    }).reverse();
    let bar_text = results.otu_labels.slice(0, 10).reverse();

    // Get desired data for bubble chart
    let bubble_x = results.otu_ids;
    let bubble_y = results.sample_values;
    let bubble_text = results.otu_labels;

    // Create bar chart
    let trace1 = {
      y: bar_y,
      x: bar_x,
      text: bar_text,
      type: "bar",
      orientation: "h",
    };

    // Data array
    let data1 = [trace1];

    // Create layout
    let layout1 = {
      title: "Top 10 Bacteria Found Per Individual",
      margin: {
        l: 100,
        t: 40
      }
    };

    // Render the plot to the div tag with the id "bar"
    Plotly.newPlot("bar", data1, layout1);

    // Create bubble chart
    let trace2 = {
      x: bubble_x,
      y: bubble_y,
      text: bubble_text,
      mode: "markers",
      marker: {
        size: bubble_y,
        color: bubble_x
      }
    };
    
    // Data array
    let data2 = [trace2];
  
    // Create layout
    let layout2 = {
      title: "All Bacteria Present per Sample",
      margin: {t: 0},
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      margin: {t: 25}
    };

    // Render the plot to the div tag with the id "bar"
    Plotly.newPlot("bubble", data2, layout2);
  });
}

// Function to append dropdown menu and have a default chart upon opening
function init() {

  // Use d3 to select the dropdown menu
  let dropdown = d3.select("#selDataset");

  // Use names list in data to get all the sample names
  d3.json(samplesURL).then(function(data) {
    let sample_names = data.names;

    for (let i = 0; i < sample_names.length; i++) {
      dropdown.append("option").text(sample_names[i]).property("value", sample_names[i]);
    };

    // Use the first sample as the default when opening the page
    let default_sample = sample_names[0];
    buildCharts(default_sample);
    buildMetadata(default_sample);
  });
}

// Create a function that will render the new data charts for each selected data point
function optionChanged(new_selection) {
  buildCharts(new_selection);
  buildMetadata(new_selection);
}
// Initialize 
init()

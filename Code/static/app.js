d3.json("samples.json").then((importedData) => {
    var ConsoleData = importedData;
    console.log(ConsoleData);
});

//Create Dropdown Options
d3.json("samples.json").then((importedData) => {
    var DropdownData = importedData.names
    d3.select("select").selectAll('option')
        .data(DropdownData)
        .enter()
        .append("option")
        .text(function(d) {
            return d;
        });
});


//Select Correct Data Based on Dropdown
d3.select("#selDataset").on("change", function() {
    var dropdownSelection = this.value
    console.log(dropdownSelection)

    d3.json("samples.json").then((importedData) => {
        var SpecimenData = importedData.samples
        console.log(SpecimenData)
        //Shows All Arrays with the data still inside
        //console.log(SpecimenData[0])
        //shows specificly this dataset, with tangible ID, otu_ids array, etc. 
        //console.log(SpecimenData[0].id)
        //Displays ID
        //Need to loop through all Specimen Data to find when SpecimenData[?].id == dropdownSelection
            //We can then extract all the necesarry data and assign them to variabels for sorting/splice/charting
        for (var i = 0; i < SpecimenData.length; i++) {
            if (SpecimenData[i].id == dropdownSelection) {
                var FoundSpecimen = SpecimenData[i];
                break
            };
        };
        console.log(FoundSpecimen);

        FoundSpecimen.sample_values.sort(function(a, b) {
            return parseInt(b.sample_values) - parseInt(a.sample_values);
        });

        var specimen_id = FoundSpecimen.id;
        var otu_ids = FoundSpecimen.otu_ids;
        var otu_labels = FoundSpecimen.otu_labels;
        var values = FoundSpecimen.sample_values;

        //Parse and Sort Data
        top10IDs = otu_ids.slice(0, 10);
        top10Labels = otu_labels.slice(0, 10);
        top10values = values.slice(0, 10);

        top10IDs.reverse()
        top10Labels.reverse()
        top10values.reverse()

        console.log("----------------------------------------------------------");
        console.log(specimen_id);
        console.log(top10IDs);
        console.log(top10Labels);
        console.log(top10values);
        console.log("----------------------------------------------------------");

        // Gotta map something somewhere???
        top10IDlist = top10IDs.map(id => id.toString());

        var OTUlist = top10IDlist.map(function(id) {
            return `OTU #${id}`;
        });
        console.log(OTUlist);
        // Chart Creation
        var trace1 = {
            x: top10values,
            y: OTUlist,
            text: top10Labels.map(String),
            type: "bar",
            orientation: "h"
        };

        var BarData = [trace1];

        var layout = {
            title: "OTU Specimen Chart",
            xaxis: {title: "Specimen Count"},
            yaxis: {title: "OTU ID Number"},
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
              }
        };

        Plotly.newPlot("bar", BarData, layout);
    });
});

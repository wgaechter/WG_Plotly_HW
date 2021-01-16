d3.json("samples.json").then((importedData) => {
    var ConsoleData = importedData;
    console.log(ConsoleData);
});

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
        //console.log(SpecimenData)
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
        // console.log(FoundSpecimen);

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

        /* console.log("----------------------------------------------------------");
        console.log(specimen_id);
        console.log(top10IDs);
        console.log(top10Labels);
        console.log(top10values);
        console.log("----------------------------------------------------------");
 */
        // Gotta map something somewhere???
        top10IDlist = top10IDs.map(id => id.toString());

        var OTUlist = top10IDlist.map(function(id) {
            return `OTU #${id}`;
        });
        //console.log(OTUlist);
        // Chart Creation
        var trace1 = {
            x: top10values,
            y: OTUlist,
            text: top10Labels.map(String),
            type: "bar",
            orientation: "h"
        };

        var BarData = [trace1];

        var layout1 = {
            title: `Patient #${specimen_id} OTU Specimen Chart`,
            xaxis: {title: "Bacteria Count"},
            //yaxis: {title: "OTU ID Number"},
            /* margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
              } */
        };

        var trace2 = {
            x: otu_ids,
            y: values,
            mode: 'markers',
            marker: {
                //color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
                size: values
            }
        };

        var BubbleData = [trace2];

        var layout2 = {
            title: "All Present Bacteria Sampled",
            xaxis: {title: "Bacteria ID Number"},
            yaxis: {title: "Sample Ammount"},
            /* margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
              } */
        }

        Plotly.newPlot("bar", BarData, layout1);
        Plotly.newPlot("bubble", BubbleData, layout2);
    });
    // Demographic Info Section
    console.log("Demographic Selection:", dropdownSelection)

    d3.json("samples.json").then((importedData) => {
        var DemoData = importedData.metadata
        console.log(DemoData)

        //Loop to find Sepcific MetaData
        for (var i = 0; i < DemoData.length; i++) {
            if (DemoData[i].id == dropdownSelection) {
                var FoundDemo = DemoData[i];
                console.log(FoundDemo);
                break
            };
        };

        //Parse Metadata for Table
        var tbody = d3.select('tbody');

        var tableRows = d3.selectAll("tr");
        var tableCells = d3.selectAll("td");

        tableRows.remove();
        tableCells.remove();

        Object.entries(FoundDemo).forEach(function([key, value]) {
            console.log(`${key}: ${value}`);
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(`${key}: ${value}`);
        });
    });
});

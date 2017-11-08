

var wavequestions_data = eval(wave_questions); 

var genreateSelector = function(sectionDiv, index) {
    var section_group = document.getElementById(sectionDiv);

    var selectList_sectionlevel = document.createElement("select");
    selectList_sectionlevel.id = "section_dropdown" + index;
    section_group.appendChild(selectList_sectionlevel);
    var unselected_option = document.createElement("option");
    unselected_option.value = "no selected";
    unselected_option.text="no selected";
    selectList_sectionlevel.appendChild(unselected_option);
    for (var sectionkey in wavequestions_data[wave]) {
            var option = document.createElement("option");
            option.value = sectionkey;
            option.text = sectionkey;
            selectList_sectionlevel.appendChild(option);                 
    }
        
    // $("#" + NAME).change(function () {
        
    $("#section_dropdown" + index).change(function () {         
        //Create and append select list
        var section = this.value;
        if($("#" + "question_dropdown"+index).length == 0){
            var selectList_questionlevel = document.createElement("select");
            selectList_questionlevel.id = "question_dropdown"+index;
            }
        else{
            var selectList_questionlevel=document.getElementById("question_dropdown"+index);
            $("#question_dropdown"+index).empty();
        }
        selectList_questionlevel.setAttribute("onchange","questionvaluefunction(this)");
        section_group.appendChild(selectList_questionlevel);

        //Create and append the options
        for (var questionkey in wavequestions_data[wave][section]) {
            // for (var section_key in wavequestions_data[wavekey])
            var option = document.createElement("option");
            option.value = questionkey;
            option.text = wavequestions_data[wave][section][questionkey];
            selectList_questionlevel.appendChild(option);                
        }
    });
}

var questionvaluefunction=function(obj){
       // $("question_dropdown"+index).empty();
        console.log(obj.value);
    };




// var margin = {top: 30, right: 10, bottom: 10, left: 10},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

// var x = d3.scale.ordinal().rangePoints([0, width], 1),
//     y = {};

// var line = d3.svg.line(),
//     axis = d3.svg.axis().orient("left"),
//     background,
//     foreground;



var waveCSVdata=d3.csvParse(waveCSV,
                            function(d){
                                return d
                            });


var drawPC=function(wavedata, svg, theKeys){


    //var theKeys = ["H1DA1", "H1DA2", "H1DA3", "H1DA4", "H1GH1"];
  

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = theKeys.filter(function(d) {
        return (y[d] = d3.scale.linear()
            .domain(d3.extent(wavedata, function(p) { return +p[d]; }))
            .range([height, 0]));
    }));

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(wavedata)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(wavedata)
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
};


// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}


var drawScatterPlotMatrix = function (data, svgIn, featuresIn, classIn, sizeIn){

    var size = sizeIn,
        padding = 20,
        color = d3.scaleOrdinal(d3.schemeCategory20);

    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);

   
    var domainByTrait = {},
        n = featuresIn.length;

    featuresIn.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; })
    });

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var brush = d3.brush()
        .on("start", brushstart)
        .on("brush", brushmove)
        .on("end", brushend)
        .extent([[0,0],[size,size]]);

    var svg = d3.select(svgIn)
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")")
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }));
        //.on("dblclick.zoom", null); //disable double click to zoom;

    svg.selectAll(".x.axis")
        .data(featuresIn)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

    svg.selectAll(".y.axis")
        .data(featuresIn)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

    var cell = svg.selectAll(".cell")
        .data(cross(featuresIn, featuresIn))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) { return d.x; });

    cell.call(brush);

    function plot(p) {
        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 4)
            .style("fill", function(d) { return color(d[classIn[0]]); });
    }

    var brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brushCell !== this) {
            d3.select(brushCell).call(brush.move, null);
            brushCell = this;
            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
        }
    }

    // Highlight the selected circles.
    function brushmove(p) {
        var e = d3.brushSelection(this);
        svg.selectAll("circle").classed("hidden", function(d) {
            return !e
                ? false
                : (
                    e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
                    || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
                );
        });
    }

    // If the brush is empty, select all circles.
    function brushend() {
        var e = d3.brushSelection(this);
        if (e === null) svg.selectAll(".hidden").classed("hidden", false);
    }


    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
    }
};

$( document ).ready(function() {
    console.log( "ready!" );
    var dropdown_group = document.getElementById("dropdown_group");
    for (var i = 1; i <6; i++) {
        var dropdown_section = document.createElement("div");
        dropdown_section.id= "dropdown_section"+i;
        dropdown_group.appendChild(dropdown_section)
        genreateSelector(dropdown_section.id, i);
    }
    // var dropdown_section1 = document.createElement("div");
    // var dropdown_section2 = document.createElement("div");
    // // var dropdown_section3 = document.createElement("div");
    // // var dropdown_section4 = document.createElement("div");
    // // var dropdown_section5 = document.createElement("div");
    // dropdown_group.appendChild(dropdown_section1)
    // dropdown_group.appendChild(dropdown_section2)

    // genreateSelector("dropdown_group", 1);
    // genreateSelector("dropdown_group", 2);
    // genreateSelector("dropdown_group", 3);
    // genreateSelector("dropdown_group", 4);
    // genreateSelector("dropdown_group", 5);
    
    document.getElementById("dropdown_go_button").addEventListener("click", function(){
        //document.getElementById("demo").innerHTML = "Hello World";
        document.getElementById("pc").innerHTML = "";
        // var svg = d3.select("#pc").append("svg")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        // .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var theKeys=[]
        for (var i=1; i<6;i++){
            thekey=$( "#question_dropdown"+i+" option:selected" ).val();
            if(thekey!=null){
                theKeys.push(thekey);
            }
        }
        
        //var featuresIn = ["H1DA5","H1DA6","H1DA7","H1DA8"];
        var classIn = ["C_CRP"];
        var sizeIn = 230;
        //drawPC(waveCSVdata, svg,theKeys);
        drawScatterPlotMatrix(waveCSVdata, "#w1", theKeys, classIn, sizeIn);
    });

    
});


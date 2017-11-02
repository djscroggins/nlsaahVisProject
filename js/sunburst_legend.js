function drawLegend(paramsIn) {
    var svg = d3.select(paramsIn.divClass).append("svg")
        .attr("width", paramsIn.svgDims.width)
        .attr("height", paramsIn.svgDims.height - 50);

    var dLength = 0;
    var offset = paramsIn.offset; //Make parameter

    var legend4 = svg.selectAll(".legends4")
        .data(paramsIn.values)
        .enter().append('g')
        .attr("class", "legends4")
        .attr("transform", function (d, i) {
            if (i === 0) {
                dLength = d.length + offset;
                return "translate(0,0)"
            } else {
                var newdataL = dLength;
                dLength +=  d.length + offset;
                return "translate(" + (newdataL) + ",0)"
            }
        });

    legend4.append("rect")
        .attr("x", 0)
        .attr("y", 5)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
            return paramsIn.color(i)
        });

    legend4.append('text')
        .attr("x", 20)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(function (d, i) {
            return d
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", 15)
}

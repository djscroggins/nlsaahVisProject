/**
 * Created by davidscroggins on 10/30/17.
 */

/**
 * Draws Sunburst style tree map with transition effects for size and count
 * @param {string} fileIn title or path to .json file
 * @param {string} svgIn id svg element to be selected
 * @param {string} inputIn class of input element to be selected
 */

// TODO: Refactor to d3.v4
var drawSunburst = function (fileIn, svgIn, inputIn, widthIn, heightIn) {

    var width = widthIn,
        height = heightIn,
        radius = Math.min(width, height) / 2,
        color = d3.scale.category20c();

    var svg = d3.select(svgIn)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

    var partition = d3.layout.partition()
        .sort(null)
        .size([2 * Math.PI, radius * radius])
        .value(function(d) { return 1; });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });


    d3.json(fileIn, function(error, root) {
        if (error) throw error;

        var path = svg.datum(root).selectAll("path")
            .data(partition.nodes)
            .enter().append("path")
            .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
            .attr("d", arc)
            .style("stroke", "#fff")
            .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
            .style("fill-rule", "evenodd")
            .each(stash);

        path.selectAll(".node")
            .append("text")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
            .attr("dx", "-20") // radius margin
            .attr("dy", ".5em") // rotation align
            .text(function(d) { return d.parent ? d.data.name : "" });

        d3.selectAll(inputIn).on("change", function change() {
            var value = this.value === "count"
                ? function() { return 1; }
                : function(d) { return d.size; };

            path
                .data(partition.value(value).nodes)
                .transition()
                .duration(1500)
                .attrTween("d", arcTween);
        });
    });

    // Stash the old values for transition.
    function stash(d) {
        d.x0 = d.x;
        d.dx0 = d.dx;
    }

    // Interpolate the arcs in data space.
    function arcTween(a) {
        var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
        return function(t) {
            var b = i(t);
            a.x0 = b.x;
            a.dx0 = b.dx;
            return arc(b);
        };
    }

    d3.select(self.frameElement).style("height", height + "px");

};

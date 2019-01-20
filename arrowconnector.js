function arrowConnector() {

  var svg, arrows;

  function render() {

    if(d3.select(".arrow-connector-container").empty()) {
      svg = d3.select("body").append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .classed("arrow-connector-container", true)
        .style("position", "absolute")
        .style("top", "0")
        .style("left", "0")
        .style("width", "100%")
        .style("height", "100%")
        .style("pointer-events", "none");
    } else {
      svg = d3.select(".arrow-connector-container");
    }

    var diagonal = d3.svg.diagonal()
      .source(function(d) { return {"x":d.source.y, "y":d.source.x}; })            
      .target(function(d) { return {"x":d.target.y, "y":d.target.x}; })
      .projection(function(d) { return [d.y, d.x]; });
    var link = svg.selectAll(".link")
      .data(getTargets())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

    arrows = svg.selectAll("line")
      .data(getTargets())
        .attr("x1", function(d) { return d[0].x })
        .attr("y1", function(d) { return d[0].y })
        .attr("x2", function(d) { return d[1].x })
        .attr("y2", function(d) { return d[1].y });

    arrows.enter()
      .append("line")
      .classed("arrow-connector", true)
      .attr("x1", function(d) { return d[0].x })
      .attr("y1", function(d) { return d[0].y })
      .attr("x2", function(d) { return d[1].x })
      .attr("y2", function(d) { return d[1].y });
  }

  function getTargets() {
    var targets = [];
    d3.selectAll("[data-arrow-target]")
      .each(function(d,i) {
        // fromCorners = edgesToCorners(this);
        fromCorners = edgesMidpoints(this);
        d3.selectAll(this.dataset.arrowTarget).each(function(dd,ii) {
          // var toCorners = edgesToCorners(this);
          var toCorners = edgesMidpoints(this);

          // check all possible combinations of eligible endpoints for the shortest distance
          var fromClosest, toClosest, distance;
          fromCorners.forEach(function(from) {
            toCorners.forEach(function(to) {
              if(distance == null || hypotenuse( to.x-from.x, to.y-from.y ) < distance) {
                distance = hypotenuse( to.x-from.x, to.y-from.y );
                fromClosest = from;
                toClosest = to;
              }
            });
          });
          console.log(`line coordinates from ${fromClosest.x},${fromClosest.y} to ${toClosest.x},${toClosest.y}`);
          targets.push([fromClosest,toClosest]);

        });
      });

    return targets;
  }

  // gets from the sides of a bounding rect (left, right, top, bottom)
  // to its corners (topleft, topright, bottomleft, bottomright)
  function edgesToCorners(element) {
    var corners = [];
    ["left","right"].forEach(function(i) { ["top","bottom"].forEach(function(j) { corners.push({"x":i,"y":j}); }); });
    return corners.map(function(corner) {
      return {
        "x": element.getBoundingClientRect()[corner.x] + window.pageXOffset,
        "y": element.getBoundingClientRect()[corner.y] + window.pageYOffset
      };
    });
  }

  // gets midpoint on left, right, top, bottom edges
  function edgesMidpoints(element) {
    const rect = element.getBoundingClientRect();
    const xmid = rect.x + rect.width / 2;
    const ymid = rect.y + rect.height / 2;
    var points = [
      { x: rect.left, y: ymid }, // left midpoint
      { x: rect.right, y: ymid }, // left midpoint
      { x: xmid, y: rect.top }, // top midpoint
      { x: xmid, y: rect.bottom }, // bottom midpoint
    ];
    points = points.map(xy => ({
      x: xy.x + window.pageXOffset,
      y: xy.y + window.pageYOffset
    }));
    return points;
  }

  // this seems good to have
  function hypotenuse(a, b) {
    return Math.sqrt( Math.pow(a,2) + Math.pow(b,2) );
  }

  return render;

}
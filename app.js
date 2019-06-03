function makeResponsive(){

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 200,
    bottom: 200,
    right: 400,
    left: 400
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3.select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  var chartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  //Import data from csv file
  d3.csv("data.csv").then(function(data){
  console.log(data); 

    //Format data
    data.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    //Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.poverty))
      .range([0, width]);
    var bottomAxis = d3.axisBottom(xLinearScale);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)])
      .range([height, 0]);
    var leftAxis = d3.axisLeft(yLinearScale)

    //Append axis to chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //Add scatter
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", '12')
      .attr("fill", "steelblue")
      .attr("stroke-width","1")
      .attr("opacity", 0.7)

    //Add scatter labels  
    var circlesGroup = chartGroup.append('text').selectAll('tspan')
      .data(data)
      .enter()  
      .append("tspan")
      .text(function(data){
        return data.abbr
      })
      .attr('x', d => xLinearScale(d.poverty)-7)
      .attr('y', d => yLinearScale(d.healthcare)+3)
      .attr("font-size", "12px")
      .attr("fill", "white");
    

    //Add axis labels
    svg.append("text")
      .attr("x", width/2+400)
      .attr("y", height+margin.bottom+50)
      .style('text-anchor',"middle")
      .text("In Poverty (%)")
      .attr("font-size","18px")
      .attr("font-weight","bold");
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr('y', 0-margin.left+740)
      .attr('x', 0-(height)+25)
      .attr("dy", "1em")
      .style('text-anchor',"middle")
      .text("Lacks Healthcare (%)")
      .attr("font-size","18px")
      .attr("font-weight","bold");


    //Append tooltip div
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60]) 
        .html(function(d) {
          return (`<strong>Poverty rate: ${d.poverty}%;<p>
          Without healthcare: ${d.healthcare}%`);
        })
  
    
    chartGroup.call(toolTip);
    circlesGroup.on("mouseover", function(d){
      toolTip.show(d, this);
    })
      .on("mouseout", function(data, index){
        toolTip.hide(data);
      });
  });
}

makeResponsive();
d3.select(window).on("resize", makeResponsive);
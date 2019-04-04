var dataP = d3.json("classData.json");
dataP.then(function(data)
{
  drawChart(data);

},
function(err)
{
  console.log(err);
});




var drawChart = function(data)
{
//data first
  data[0].homework.forEach(function(d){d.type="Homework"});
  var hw = data[0].homework;
  hw.forEach(function(d){
    d.percent=(d.grade/d.max)*100
  });
//scales

// grab svg
  var screen =
  {
    width: 600,
    height: 600
  }

  var margins =
  {
    top:10,
    bottom:100,
    left:40,
    right:10
  }
  var width = screen.width-margins.left-margins.right;
  var height = screen.height-margins.top-margins.bottom;



  var svg = d3.select('svg')
            .attr('width',screen.width)
            .attr('height',screen.height);

            xScale=d3.scaleLinear()
                      .domain([0,40])
                      //.domain([0,d3.max(hw, function(d){return d.day;})])
                      .range([0, width]);
            yScale=d3.scaleLinear()
                      .domain([0,100])
                      .range([height,0]);
  var plotLand = svg.append('g')
                    .classed("plot",true)

                    .attr("transform","translate(40,10)");

  var xA = margins.top+height;
  var xAxis = d3.axisBottom(xScale);
  svg.append('g').classed('xAxis',true)
      .call(xAxis)
      .attr('transform','translate('+ margins.left + ','+(xA)+')' );
  var yAxis = d3.axisLeft(yScale);
  var yA = margins.left+10;
  svg.append('g').classed('yAxis',true)
      .call(yAxis)
      .attr('transform','translate('+yA+ ','+'10'+')' );

//make line
var drawLine = d3.line()
                .x(function(d,i){
                  return xScale(d.day)})
                .y(function(d){return yScale(d.percent)});
plotLand.append('path')
      .datum(hw)
      .attr('class',"line")
      .attr('d',drawLine)
      .attr("fill", "none")
      .attr("stroke", "red");
var click = 0;
var change_view =
    d3.select('button')
      .on('click',function()
          {
          click+=1;
          svg.selectAll("path.line")
            .attr("stroke", "none")
          svg.selectAll("path.area")
            .attr("stroke", "none")
            .attr("fill", "none")
          updateChart(svg, hw, xScale, yScale, click, plotLand);

          return click

          })


}

var updateChart = function(svg, hw, xScale, yScale, click, plotLand)
{


if(click%2==1)
{
var drawArea=d3.area()
.x(function(d){return xScale(d.day)})
.y0(function(d){return yScale.range()[0]})
.y1(function(d){return yScale(d.percent)})

plotLand.append('path')
  .datum(hw)
  .attr('class','area')
  .attr("fill", "green")
  .attr('d',drawArea);


  }

else if(click%2==0)
{



  var drawLine = d3.line()
                  .x(function(d,i){
                    return xScale(d.day)})
                  .y(function(d){return yScale(d.percent)});
  plotLand.append('path')
        .datum(hw)
        .attr('class',"line")
        .attr('d',drawLine)
        .attr("fill", "none")
        .attr("stroke", "red");




}

}

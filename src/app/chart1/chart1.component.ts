import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.css']
})
export class Chart1Component implements OnInit {

  constructor() { }



  ngOnInit() {



    var flagDR = 0;
    function type(d, i, columns) {
      d.Year = d3.timeParse("%Y")(d.Year);

      for (var i = <any>2, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
      return d;
    }
    function animateGraph2(){

     // var selection = d3.select('#countries').node();
      var sel1=d3.selectAll('.c1').nodes();
      var sel2=d3.selectAll('.c2').nodes();
      var sel3=d3.selectAll('.c3').nodes();
        (function myLoop (i) {          
          setTimeout(function () {  
            if (i<14){
              sel1[13-i]["style"].opacity=0.5;
              sel2[13-i]["style"].opacity=0.5;
              sel3[13-i]["style"].opacity=0.5;
           
            }
            if (i==14){
              d3.selectAll('.c1').style("opacity", 0);
             d3.selectAll('.c2').style("opacity", 0);
             d3.selectAll('.c3').style("opacity", 0);
           
            }
            // d3.selectAll('.c1').style("opacity", 0);
            // d3.selectAll('.c2').style("opacity", 0);
            // d3.selectAll('.c3').style("opacity", 0);
            sel1[14-i]["style"].opacity=1;
            sel2[14-i]["style"].opacity=1;
            sel3[14-i]["style"].opacity=1;
         
                         
             if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
          }, 800)
       })(14);

    
    };

    d3.csv("assets/processed_age_distribution.csv", type).then(function (data) {
      var selection = d3.select('select').property('value');
      var data1 = data.filter(x => x['Region'] == selection);

      d3.select('#countries')
        .on("change", function () {
          var selection = d3.select('select').property('value');
          data1 = data.filter(x => x['Region'] == selection);
          data1['columns'] = data.columns.slice(1);
          updateGraph(data1);
          updateGraph2(data1);
             d3.selectAll('.c1').style("opacity", 0);
             d3.selectAll('.c2').style("opacity", 0);
             d3.selectAll('.c3').style("opacity", 0);
          
        });
       
        d3.select("#trend").on("click",function(){
          animateGraph2();
        })

      d3.select('#auto')
        .on("click", function () {
         
          if (flagDR == 0) {
            d3.selectAll(".dr").transition().duration(800).style("opacity", 1);
            d3.selectAll(".area").transition().duration(800).style("opacity", 0.4);
            d3.selectAll(".yaxis").transition().duration(800).style("stroke-opacity", 0.4);
            d3.selectAll(".yLab").transition().duration(800).style("opacity", 0.3);
            // d3.selectAll(".yaxis text").transition().duration(800).style("opacity", 0.4);
            flagDR = 1;
          }
          else {
            d3.selectAll(".dr").transition().duration(800).style("opacity", 0);
            d3.selectAll(".area").transition().duration(800).style("opacity", 1);
            d3.selectAll(".yaxis").transition().duration(800).style("stroke-opacity", 1);
            d3.selectAll(".yLab").transition().duration(800).style("opacity", 1);
            // d3.selectAll(".yaxis text").transition().duration(800).style("opacity", 1);
            flagDR = 0;
          }




        });



      var data1 = data.filter(x => x['Region'] == selection);
      data1['columns'] = data.columns.slice(1);
      var svg = d3.select("#chart1"),
        margin = { top: 10, right: 150, bottom: 60, left: 100 },
        width = $('#chart1').width() - margin.left - margin.right,
        height = $('#chart1').height() - margin.top - margin.bottom;

      var svg2 = d3.select("#chart2"),
        margin = { top: 10, right: 150, bottom: 60, left: 100 },
        width = $('#chart2').width() - margin.left - margin.right,
        height = $('#chart2').height() - margin.top - margin.bottom;

      var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        _y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(['orange', 'yellow', 'silver']),
        z2 = d3.scaleOrdinal(['orange', 'yellow', 'grey']);

      var stack = d3.stack();
      var area = d3.area()
        .x(function (d, i) { return x(d['data']['Year']); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); });

      var legend = svg.selectAll('g')
        .data(['<14', '15-64', '65+'])
        .enter()
        .append('g')
        .attr('class', 'legend');

      legend.append('rect')
        .attr('x', $('#chart1').width() - 70)
        .attr('y', function (d, i) { return height - (330 - i * 30); })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d, i) { return z(i.toString()); });

      legend.append('text')
        .attr('x', $('#chart1').width() - 50)
        .attr('y', function (d, i) { return height - (326 - i * 30); })
        .attr("dy", ".35em")
        .style("font", "12px sans-serif")
        .text(function (d) { return d; });

      var legendText = svg.append('text')

      legendText.attr("x", $('#chart1').width())
        .attr("y", height - 350)
        .attr("dy", ".35em")
        .style("font", "14px sans-serif")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .text("Age Groups");

      var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var xAxis = g.append("g")
        .attr("class", "yaxis")


      var yAxis = g.append("g")
        .attr("class", "yArea")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

      var yDep = g.append("g")
        .attr("class", "dr")
        .attr("transform", "translate(" + width + ",0" + ")")
        .style("opacity", 0);;

      var xLab = svg.append('text')

      xLab.attr("x", 500)
        .attr("y", 530)
        .attr("dy", ".35em")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Year");

      var yLab = svg.append('text').attr("class", "yLab")

      yLab.attr("x", -210)
        .attr("y", 40)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Population (in Million / 10)");

      var depLab = svg.append('text').attr("class", "dr")

      depLab.attr("x", 320)
        .attr("y", -890)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Dependency Ratio")
        .style("opacity", 0);

      ///....

      var legend2 = svg2.selectAll('g')
        .data(['<14', '15-64', '65+'])
        .enter()
        .append('g')
        .attr('class', 'legend');

      legend2.append('rect')
        .attr('x', $('#chart2').width() - 70)
        .attr('y', function (d, i) { return height - (330 - i * 30); })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d, i) { return z2(i.toString()); });

      legend2.append('text')
        .attr('x', $('#chart2').width() - 50)
        .attr('y', function (d, i) { return height - (326 - i * 30); })
        .attr("dy", ".35em")
        .style("font", "12px sans-serif")
        .text(function (d) { return d; });

      var legendText2 = svg2.append('text')

      legendText2.attr("x", $('#chart2').width())
        .attr("y", height - 350)
        .attr("dy", ".35em")
        .style("font", "14px sans-serif")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .text("Age Groups");

      var g2 = svg2.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var xAxis2 = g2.append("g")
        .attr("class", "yaxis2")


      var yAxis2 = g2.append("g")
        .attr("class", "yArea")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

      

      var xLab2 = svg2.append('text')

      xLab2.attr("x", 500)
        .attr("y", 530)
        .attr("dy", ".35em")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Year");

      var yLab2 = svg2.append('text').attr("class", "yLab2")

      yLab2.attr("x", -210)
        .attr("y", 40)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Dependency Ratio");



      //    ....



      var is_pct = false;
      updateGraph(data1);
      updateGraph2(data1);

      d3.select('#pp').on("click", function () {
        is_pct = false;
        updateGraph(data1);

      });
      d3.select('#pppct').on("click", function () {
        is_pct = true;
        updateGraph(data1);

      });





      function updateGraph(data) {




        var country = data[0].Region;

        data.map(x => !x.Region);
        if (is_pct) {
          var title = "Percentage of Age in " + country;
          var ylab = "Percentage";
          var X = -270;
          var Y = 50
        }
        else {
          var title = "Age Distribution in " + country;
          var ylab = "Population (in Million / 10)";
          var X = -210;
          var Y = 50;
        }
        d3.select("#title").style("font-weight", "bold").text(title)
        yLab.transition().duration(800).attr("x", X)
          .attr("y", Y)
          .attr("dy", ".35em")
          .attr("transform", "rotate(-90)")
          .style("font", "11px sans-serif")
          .style("text-anchor", "end")
          .text(ylab);

        var keys = data.columns.slice(1);

        if (is_pct) {
          data = data.map(function (d, i) {

            var sum = d.Middle + d.Young + d.Old;

            return { Year: d.Year, Middle: d.Middle * 100 / sum, Old: d.Old * 100 / sum, Young: d.Young * 100 / sum };

          });
          y.domain([0, 100]);
        }
        else {

          y.domain([0, <any>d3.max(data, function (d) { return d['Young'] + d['Middle'] + d['Old'] + 300; })]);

        }
        var xyz = d3.extent(data, function (d) { return d['Year'] })
        x.domain(<any>xyz);
        z.domain(keys);
        _y.domain([<any>d3.min(data, function (d) { return (d['Young'] + d['Old'])/d['Middle']})-0.1,<any>d3.max(data, function (d) { return (d['Young'] + d['Old'])/d['Middle']})+0.1]);

        stack.keys(keys);



        var layer_selection = g.selectAll(".layer")
          .data(stack(data))

        var layer_selection_enter = layer_selection.enter().append("g")
          // .transition().duration(800)
          .attr("class", "layer");



        layer_selection_enter.append("path").attr("class", "area")

        g.selectAll(".layer").select(".area")
          .style("fill", function (d) {
            return z(d['key']);
          })
          .transition().duration(800)
          .attr("d", <any>area);


        // layer_selection_enter.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
        //   .append("text")
        //   .attr("x", width - 6)
        //   .attr("y", function (d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
        //   .attr("dy", ".35em")
        //   .style("font", "10px sans-serif")
        //   .style("text-anchor", "end")
        //   .text(function (d) { return d.key; });



        yAxis.call(d3.axisBottom(x));
        xAxis.transition().duration(800).call(<any>d3.axisLeft(y).ticks(10));
        yDep.call(d3.axisRight(_y));


        layer_selection.exit().remove();
        // svg.exit().remove();
        // yAxis.exit().remove();
        // xAxis.exit().remove();

        var rects = g.selectAll("rect").data(data, function (d) { return d['Year']; });
        rects.enter() //ENTER
          .append('rect')
          .attr('class', 'dr')
          .attr('x', function (d) { return x(d['Year']); })
          .attr('y', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
          .attr('width', 2)
          .attr('height', function (d) { return height - _y( (d['Young'] + d['Old'])/d['Middle']); })
          .style('fill', 'black')
          .style("opacity", 0);

        rects.transition()
          .duration(800)
          .attr('x', function (d) { return x(d['Year']); })
          .attr('y', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
          .attr('width', 2)
          .attr('height', function (d) { return height - _y( (d['Young'] + d['Old'])/d['Middle']); })
          .style('fill', 'black')

        rects.exit().remove();

        var div = d3.select("#tooltip")
                    .attr("class", "tooltip")				
                    .style("opacity", 0)
                    .style("visibility", "visible");

        var circle = g.selectAll('circle').data(data, function (d) { return d['Year']; })

        circle.enter()
          .append('circle')
          .attr('class', 'dr')
          .attr('r', 4)
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) {return _y( (d['Young'] + d['Old'])/d['Middle']); })
          .style('fill', 'tomato')
          .style("opacity", 0)
          .on("mouseover", function (d) {
            if (flagDR == 1)
             {d3.select(this)
               .attr("fill", "orange")
               .attr('r', 8)
               .style("cursor", "pointer");
              var num = Math.round( (d['Young'] + d['Old'])/d['Middle'] * 100) / 100
              div.transition()		
               .duration(200)		
               .style("opacity", .9);		
              div.html(<any>num)	
               .style("left", (d3.event.pageX) + "px")		
               .style("top", (d3.event.pageY - 28) + "px");
             g.append('line')
               .attr("id", "limit")
               .attr('x1', x(d['Year']))
               .attr('y1', _y( (d['Young'] + d['Old'])/d['Middle']))
               .attr('x2', width)
               .attr('y2', _y( (d['Young'] + d['Old'])/d['Middle']))
               .attr('stroke', 'tomato')
               .style("stroke-width", "3")
               .style("stroke-dasharray", "3 6")}
             
           })
           .on("mouseout", function (d) {
             if (flagDR == 1)
             {d3.select(this)
                .attr("fill", "tomato")
                .attr('r', 4)
               .style("cursor", "none");
             div.transition()		
                .duration(100)		
                .style("opacity", 0);
             g.selectAll('#limit').remove()}
           });
        

        circle.transition()
          .duration(800)
          .attr('r', 4)
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
          .style('fill', 'tomato')
          

        circle.exit().remove();


      }

      function updateGraph2(data) {
        var country = data[0].Region;

        data.map(x => !x.Region);
       
          var title2 = "Dependency ratio in " + country;
        
          var X = -270;
          var Y = 50
     
       


       

        
          data = data.map(function (d, i) {

            var sum = d.Middle + d.Young + d.Old;

            return { Year: d.Year, Middle: d.Middle * 100 / sum, Old: d.Old * 100 / sum, Young: d.Young * 100 / sum };

          });
          y.domain([0, 100]);
      
            
        var xyz = d3.extent(data, function (d) { return d['Year'] })
        var x = d3.scaleTime().range([0, width]);
        //console.log(xyz)
        x.domain(<any>xyz);
        _y.domain([<any>d3.min(data, function (d) { return (d['Young'] + d['Old'])/d['Middle']})-0.1,<any>d3.max(data, function (d) { return (d['Young'] + d['Old'])/d['Middle']})+0.1]);

        

        yAxis2.call(d3.axisBottom(x));
        xAxis2.transition().duration(800).call(<any>d3.axisLeft(_y).ticks(10));

        

        var circle1 = g2.selectAll('.c1').data(data, function (d) { return d['Year']; });
        var circle2 = g2.selectAll('.c2').data(data, function (d) { return d['Year']; });
        var circle3 = g2.selectAll('.c3').data(data, function (d) { return d['Year']; });

        circle1.enter()
        .append('circle')
        .attr('class', 'c1')
        .attr('r', 20)
        .style("opacity", 0)
        .attr('cx', function (d) { return x(d['Year']); })
        .attr('cy', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
        .style('fill', 'grey')

        circle2.enter()
        .append('circle')
        .attr('class', 'c2')
        .style("opacity", 0)
        .attr('r', 15)
        .attr('cx', function (d) { return x(d['Year']); })
        .attr('cy', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
        .style('fill', 'yellow')
        
        circle3.enter()
          .append('circle')
          .attr('class', 'c3')
          .style("opacity", 0)
          .attr('r', 8)
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
          .style('fill','orange');
         
       

     

          circle1.transition()
          
          .attr('r', function(d){ var sum = d['Young'] + d['Old']+d['Middle'];    return  30*(d['Young']+d['Middle']+d['Old'])/sum;})
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
          .style('fill','grey')
          circle2.transition()
          
          .attr('r', function(d){ var sum = d['Young'] + d['Old']+d['Middle'];    return  30*(d['Young']+d['Middle'])/sum;})
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
          .style('fill','yellow')
          circle3.transition()
         
          .attr('r', function(d){ var sum = d['Young'] + d['Old']+d['Middle'];    return  30*d['Young']/sum;})
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) { return _y( (d['Young'] + d['Old'])/d['Middle']); })
          .style('fill','orange')
          
        d3.select("#title2").style("font-weight", "bold").text(title2)

        circle1.exit().remove();
        circle2.exit().remove();
        circle3.exit().remove();

      }




    });



  }

}

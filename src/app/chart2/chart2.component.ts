import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as kk from '../../assets/d3-scale-radial.js';





@Component({
    selector: 'app-chart2',
    templateUrl: './chart2.component.html',
    styleUrls: ['./chart2.component.css']
})
export class Chart2Component implements OnInit {

    constructor() { }

    ngOnInit() {

        var svg = d3.select("#chart2"),
            width = +$("#chart2").width() - 40,
            height = +$("#chart2").height()+10,
            innerRadius = 140,
            outerRadius = Math.min(width, height) / 2,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0);


        var y = kk.scaleRadial().range([innerRadius, outerRadius]);


        var z = d3.scaleOrdinal()
            .range(["gold","tomato","mediumseagreen"]);

        var x0 = d3.scaleBand()
            .rangeRound([0, width - 20])
            .paddingInner(0.1);

        var x1 = d3.scaleBand()
            .padding(0.05);

        var ylinear = d3.scaleLinear()
            .rangeRound([height, 0]);
        //var margin = { top: 20, right: 20, bottom: 30, left: 20 };

        var is_bar = true;
        var is_pct2 = true;
        var div = d3.select("#tooltip")
                    .attr("class", "tooltip")				
                    .style("opacity", 0)
                    .style("visibility", "visible");

        var divBar = d3.select("#tooltip_bar")
                    .attr("class", "tooltip_bar")				
                    .style("opacity", 0)
                    .style("visibility", "visible");

        div.append('div') // add divs to the tooltip defined above                            
           .attr('class', 'country');
        div.append('div') // add divs to the tooltip defined above                            
           .attr('class', 'year');
        div.append('div') // add divs to the tooltip defined above                            
           .attr('class', 'ahff');
        div.append('div') // add divs to the tooltip defined above                            
           .attr('class', 'industry');
        div.append('div') // add divs to the tooltip defined above                            
           .attr('class', 'services');

        function updatedk(dat1, dat2) {

            var col = dat1.columns;
            dat1.map(function (d) {
                var popd = dat2.find(function (element) {
                    if (d.Year === '2014' || d.Year === '2016')
                        return element.Year === '2015' && element.Region === d.Region;
                    return element.Year === d.Year && element.Region === d.Region;
                });
                if (typeof popd != 'undefined') {
                d.Industry = parseFloat(d.Industry) * popd.Middle;
                    d.Services = parseFloat(d.Services) * popd.Middle;
                    d.AHFF = parseFloat(d.AHFF) * popd.Middle;
                }

                d['total'] = parseFloat(d.Industry) + parseFloat(d.Services) + parseFloat(d.AHFF) + 5;
                d.Year = (d.Year).toString();
                return d;

            });
         
            dat1['columns'] = col;
            return dat1;
        }

        function revertdk(dat2){

                    var sel = d3.select('#Ecountries').property('value');
                   
                    var dat1 = JSON.parse(JSON.stringify(dat2));
                    
                    dat1=dat1.filter(x => x['Region'] == sel);
                //    console.log(dat1)
                    dat1['columns'] = dat2.columns.slice(1);
return dat1;

        }

        function update_bar_vars() {
            svg.remove();
            var margin = { top: 10, right: 30, bottom: 40, left: 40 };
            d3.select("#insvg").append("svg").attr("id", "chart2").attr("height", "500").attr("width", "950")
            svg = d3.select("#chart2");
            width = +$("#chart2").width() - margin.left -margin.right;
            height = +$("#chart2").height() - margin.top - margin.bottom;

            x0 = d3.scaleBand()
                .rangeRound([0, width - 20])
                .paddingInner(0.1);

            x1 = d3.scaleBand()
                .padding(0.05);


            
            ylinear = d3.scaleLinear()
                .rangeRound([height, 0]);

            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        }
        function update_radial_vars() {
            svg.remove();
            d3.select("#insvg").append("svg").attr("id", "chart2").attr("height", "600").attr("width", "600")
            svg = d3.select("#chart2");


            width = +$("#chart2").width() - 40,
                height = +$("#chart2").width()+10,
                innerRadius = 140,
                outerRadius = Math.min(width, height) / 2,
                g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



            y = kk.scaleRadial().range([innerRadius, outerRadius]);




        }


        var files = ["assets/processed_economic_activity_small.csv", "assets/processed_age_distribution.csv"];
        var promises = [];

        files.forEach(function (url) {
            promises.push(d3.csv(url))
        });

        Promise.all(promises).then(function (values) {
            var data1 = values[0];
            var data2 = values[1];


            var col = data1.columns;
            data1.map(function (d) {


                d['total'] = parseFloat(d.Industry) + parseFloat(d.Services) + parseFloat(d.AHFF) ;
                d.Year = (d.Year).toString();

                return d;
            });
            data1['columns'] = col;

            return [data1, data2];
        }).then(<any>function (bothdata) {
            var newdata = bothdata[0]
            
            var selection = d3.select('#Ecountries').property('value');
            //Make Percentage Data
            var dk = JSON.parse(JSON.stringify(newdata.filter(x => x['Region'] == selection)));
            dk['columns'] = JSON.parse(JSON.stringify(newdata.columns.slice(1)));

            d3.select('#Ecountries')
                .on("change", function () {
                    selection = d3.select('#Ecountries').property('value');

                    

                    if (is_pct2)
                    {
                        dk = JSON.parse(JSON.stringify(newdata.filter(x => x['Region'] == selection)));
                        dk['columns'] = JSON.parse(JSON.stringify(newdata.columns.slice(1)));
                        
                    }
                    
                    else{
                        dk= revertdk(bothdata[0]); 
                   
                    }
                    
                    if (is_bar) {


                        update_bar_vars();
                        Updatechartgroup(dk);
                    }
                    else {

                        update_radial_vars();
                        Updatechart2(dk);
                    }

                });

            d3.select('#bar').on("click", function () {

                if(is_bar===false)
                {
                update_bar_vars();
                Updatechartgroup(dk);
                }
                is_bar = true;
                


            })

            d3.select('#radial').on("click", function () {
                
                if(is_bar)
                {
                update_radial_vars();
                Updatechart2(dk);
                }
                
                is_bar = false;

                

            });

            d3.select('#absolute_val').on("click", function () {
                
                if(is_pct2){
                    dk = updatedk(dk, bothdata[1]); //Multiply population. blowing up
                    if (is_bar) {
                        update_bar_vars();
                        Updatechartgroup(dk);
                    } else {
                        update_radial_vars();
                        Updatechart2(dk);
                    }
                            
               
               
                }
                
                 is_pct2 = false;
            });


            d3.select('#pct_val').on("click", function () {
                // console.log(dk);
                if (is_pct2===false)
                {   
                    dk = revertdk(bothdata[0]); 
                    

                    if (is_bar) {
                        update_bar_vars();
                        Updatechartgroup(dk);
                    } else {
                        update_radial_vars();
                        Updatechart2(dk);
                    }
                }
                
                is_pct2 = true;

                
              
            });

            update_bar_vars();
            Updatechartgroup(dk);

            function Updatechartgroup(data) {

                var keys = data.columns.slice(1);
                data.map(x => !x.Region);
                x0.domain(data.map(function (d) { return d['Year']; }));
                x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  
                ylinear.domain([0,parseFloat(d3.max(data, function(d) { return d3.max(keys, function(key) { return  <any>parseFloat(d[<any>key]); }); }))]).nice();
               
                g.append("g")
                    .selectAll("g")
                    .data(data)
                    .enter().append("g")
                    .attr("transform", function (d) { return "translate(" + x0(d['Year']) + ", 0)"; })
                    .selectAll("rect")
                    .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); })
                    .enter().append("rect")
                    .attr("x", function (d) { return x1(d['key']); })
                    .attr("y", function (d) { return ylinear(d['value']); })
                    .attr("width", x1.bandwidth())
                    .attr("height", function (d) { return height - ylinear(d['value']); })
                    .attr("fill", <any>function (d) { return z(d['key']); })
                    .on("mouseover", function(d){
                        console.log(d);
                        d3.select(this)
                          .style("cursor", " pointer")
                          .style("opacity", 0.5);
                        divBar.transition()		
                          .duration(200)		
                          .style("opacity", .9);

                        if (!(ylinear.domain()[1] >= 105)){
                        divBar.html(d['value'])
                          .style("left", (d3.event.pageX) + "px")		
                          .style("top", (d3.event.pageY - 50) + "px");}
                        else{
                            divBar.html(Math.round( (d['value']/1000000) * 100) / 100 + "M")
                          .style("left", (d3.event.pageX) + "px")		
                          .style("top", (d3.event.pageY - 50) + "px");
                        }
                    })
                    .on("mouseout", function (d) {
                        d3.select(this)
                          .style("cursor", "none")
                          .style("opacity", 1);
                        divBar.transition()		
                          .duration(100)		
                          .style("opacity", 0);
                    });

                g.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x0));

                g.append("g")
                    .attr("class", "axis")
                    .call(d3.axisLeft(ylinear).ticks(null, "s"))
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -240)
                    .attr("y", ylinear(ylinear.ticks().pop()) - 30)
                    .attr("dy", "0.32em")
                    .attr("fill", "#000")
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "start")
                    .text(function(){if(ylinear.domain()[1] >= 105) return "Population"; else return "Population %";});

                var legend = g.append("g")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .attr("text-anchor", "end")
                    .selectAll("g")
                    .data(keys.slice().reverse())
                    .enter().append("g")
                    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

                legend.append("rect")
                    .attr("x", width - 19)
                    .attr("width", 19)
                    .attr("height", 19)
                    .attr("fill", <any>z);

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9.5)
                    .attr("dy", "0.32em")
                    .text(<any>function (d) { return d; });

                legend.exit().remove();
                g.exit().remove();


            }



            function Updatechart2(data) {

                data.map(x => !x.Region);
               // console.log(data);

                x.domain(data.map(function (d) { return d['Year']; }));
                y.domain([0, <any>d3.max(data, function (d) { return d['total']; })]);
                z.domain(data.columns.slice(1));

                g.append("g")
                    .selectAll("g")
                    .data(d3.stack().keys(data.columns.slice(1))(data))
                    .enter().append("g")
                    .attr("fill", <any>function (d) { return z(d.key); })
                    .selectAll("path")
                    .data(function (d) { return d; })
                    .enter().append("path")
                    .attr("d", <any>d3.arc()
                        .innerRadius(function (d) { return y(d[0]); })
                        .outerRadius(function (d) { return y(d[1]); })
                        .startAngle(function (d) { return x(d['data']['Year']); })
                        .endAngle(function (d) { return x(d['data']['Year']) + x.bandwidth(); })
                        .padAngle(0.01)
                        .padRadius(innerRadius))
                    .on("mouseover", function(d){
                        // console.log(d['data']);
                        d3.select(this)
                          .style("cursor", "pointer");
                        div.transition()		
                          .duration(200)		
                          .style("opacity", 0.8)
                          .style("border", "1px solid grey");
                        
                        if (!(y.domain()[1] >= 105))
                        {div.select('.country').html("<b>Country</b>: " + <any>d['data']['Region']);
                        div.select('.year').html("<b>Year</b>: " + <any>d['data']['Year']);
                        div.select('.ahff').html("<b>AHFF</b>: " + <any>d['data']['AHFF']);
                        div.select('.services').html("<b>Services</b>: " + <any>d['data']['Services']);
                        div.select('.industry').html("<b>Industry</b>: " + <any>d['data']['Industry']);}
                        else
                        {div.select('.country').html("<b>Country</b>: " + <any>d['data']['Region']);
                        div.select('.year').html("<b>Year</b>: " + <any>d['data']['Year']);
                        div.select('.ahff').html("<b>AHFF</b>: " + Math.round( (d['data']['AHFF']/1000000) * 100) / 100 + "M");
                        div.select('.services').html("<b>Services</b>: " + Math.round( (d['data']['Services']/1000000) * 100) / 100 + "M");
                        div.select('.industry').html("<b>Industry</b>: " + Math.round( (d['data']['Industry']/1000000) * 100) / 100 + "M");}
                    })
                    .on("mouseout", function (d) {
                        d3.select(this)
                          .style("cursor", "none");
                        div.transition()		
                          .duration(100)		
                          .style("opacity", 0);
                    })

                var label = g.append("g")
                    .selectAll("g")
                    .data(data)
                    .enter().append("g")
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) { return "rotate(" + ((x(d['Year']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

                label.append("line")
                    .attr("x2", -5)
                    .attr("stroke", "#000");

                label.append("text")
                    .attr("transform", function (d) { return (x(d['Year']) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
                    .text(function (d) { return d['Year']; });

                var yAxis = g.append("g")
                    .attr("text-anchor", "middle");

                var yTick = yAxis
                    .selectAll("g")
                    .data(y.ticks(5).slice(1))
                    .enter().append("g");

                yTick.append("circle")
                    .attr("fill", "none")
                    .attr("stroke", "#000")
                    .attr("r", y);

                yTick.append("text")
                    .attr("y", function (d) { return -y(d); })
                    .attr("dy", "0.35em")
                    .attr("fill", "none")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 5)
                    .text(y.tickFormat(5, "s"));

                yTick.append("text")
                    .attr("y", function (d) { return -y(d); })
                    .attr("dy", "0.35em")
                    .text(y.tickFormat(5, "s"));

                yAxis.append("text")
                    .attr("y", function (d) { return (-y(y.ticks(5).pop() - 5)); })
                    .attr("dy", "-1em")
                    .text(function(){ if(y.domain()[1] >= 105) return "Population"; else return "Population %";});

                var legend = g.append("g")
                    .selectAll("g")
                    .data(data.columns.slice(1).reverse())
                    .enter().append("g")
                    .attr("transform", function (d, i) { return "translate(-70," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });

                legend.append("rect")
                    .attr("width", 18)
                    .attr("height", 18)
                    .attr("fill", <any>z);

                legend.append("text")
                    .attr("x", 24)
                    .attr("y", 9)
                    .attr("dy", "0.35em")
                    .text(<any>function (d) { return d; });


                legend.exit().remove();
                yTick.exit().remove();
                yAxis.exit().remove();
                g.exit().remove();
                label.exit().remove();


            }

        });




    }



}

import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {feature} from 'topojson';

@Component({
  selector: 'app-chart3',
  templateUrl: './chart3.component.html',
  styleUrls: ['./chart3.component.css']
})
export class Chart3Component implements OnInit {

  constructor() { }

  ngOnInit() {

	var contryList = ["China","Nigeria","Japan","Bangladesh","India","Pakistan","Indonesia","Mexico","Brazil","United States of America"]

  	var margin = { top: 100, left: 120, bottom: 50, right: 50 };
	var width = $('#graphArea').width() - margin.left - margin.right;
	var height = $('#graphArea').height() - margin.top - margin.bottom;




  	var svg = d3.select("#graphArea").append("svg")
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	var projection=d3.geoMercator()
					.translate([width/2,height/3])

	var path=d3.geoPath()
				.projection(projection)

	d3.json("assets/worldmap.json").then(function (worldMap:any) {
		d3.csv("assets/GDPNewer.csv").then(function(gdpData:any){

			// d3.slider()
			var columnName = "Gross Domestic Product (GDP)"
			function getTargetGDP() {
				var targetGDP = {}
				// console.log(+(gdpData[1][2010].replace(/\,/g,"")))
				for (var i = 0; i < gdpData.length; ++i) {
					if(gdpData[i].IndicatorName!=columnName) {
						continue
					} else {
						var years = Object.keys(gdpData[i])
						for (var j = 0; j < years.length-2; ++j) {
							if(Object.keys(targetGDP).indexOf(years[j])==-1) {
								targetGDP[years[j]] = {}
							}
							targetGDP[years[j]][gdpData[i].Country] = +(gdpData[i][years[j]].replace(/\,/g,""))
						}
					}
					// if(Object.keys(targetGDP).indexOf(gdpData[i].Year)==-1) {
					// 	targetGDP[gdpData[i].Year] = {}
					// }
					// targetGDP[gdpData[i].Year][gdpData[i].Country] = +gdpData[i].Value

					// ob[gdpData[i].Country] = +gdpData[i].Value

					// if(gdpData[i].Year==selectedYear) {
						// targetGDP.push({Country:gdpData[i].Country,value:+gdpData[i].Value})
						// targetGDP[gdpData[i].Country] = +gdpData[i].Value
					// }
					// console.log(targetGDP)
				}

				return targetGDP
			}

			function getMaxGDP(targetGDP) {
				// @ts-ignore
				return Math.max(...Object.values(targetGDP))
			}

			var selectedYear = "2000";
			var allGDP = getTargetGDP()
			// var targetGDP = allGDP
			var targetGDP = allGDP[selectedYear]
			// console.log(allGDP)

			var maxGDP = getMaxGDP(targetGDP)
			// 
			
			// console.log(maxGDP)

			// console.log(Object.keys(targetGDP))

			// var minG = Math.min(Object.values(targetGDP))

			// @ts-ignore
			var colorScale:any = d3.scaleLinear()
									.domain([0,maxGDP])
									// @ts-ignore
									.range([0,1])
									// .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')])
      							// .interpolate(d3.)
      							// .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
			// draw map 

			var countries:any=feature(worldMap, worldMap.objects["custom.geo"])
			countries = countries.features
			// console.log(countries)
			var paths= svg.selectAll(".country")
						.data(countries)
						.enter()
						.append("path")
						.attr("class","country")
						.attr("d",path)
						.attr("value", function(d):any {
							var a:any = d
							return a.properties.sovereignt
						})
						.attr("fill",function(d):any{
							var a:any = d
							// console.log(a.properties.name)
							// if(contryList.indexOf(a.properties.sovereignt)!=-1 && targetGDP[a.properties.sovereignt]) {
							// 	console.log(targetGDP[a.properties.sovereignt])
							// 	console.log(a.properties.sovereignt)
							// 	return d3.interpolateReds(colorScale(targetGDP[a.properties.sovereignt]))
							// }
							// return 'None'

							if(targetGDP[a.properties.sovereignt]) {
								// console.log(targetGDP[a.properties.sovereignt])
								// console.log(a.properties.sovereignt)
								return d3.interpolateReds(colorScale(targetGDP[a.properties.sovereignt]))
							}
							return 'None'

							// console.log(targetGDP[a.properties.name])
							// console.log(colorScale(targetGDP[a.properties.name]))
							// console.log(d3.schemeReds[colorScale(targetGDP[a.properties.name])])
							
						})
						.attr("stroke","black")
						.on("mouseover",function(){
							var selected:any = this
							
							//console.log(selected.__data__.properties.name)
							d3.select("#countryText")
								.text(selected.__data__.properties.name)
							d3.select("#GDPText")
								// @ts-ignore
								.text(parseInt((+allGDP[selectedYear][selected.__data__.properties.name])/1000000000).toString())
							d3.select(this)
								.attr("stroke","red")
							// d3.select(selected)
								// .attr("fill","red")
						})
						.on("mouseout",function(){
							d3.select(this)
								.attr("stroke","black")
							// var selected:any = this

							// d3.select(selected)
								// .attr("fill","None")
						})
						.on("click",function(){
							// var selected:any = this
							// d3.select(selected)
								// .attr("fill","green")

						})
			var legendScale = d3.scaleSequential(d3.interpolateReds)
    						.domain([0, 50])
    		var bars = svg.selectAll(".bars")
    						// @ts-ignore
						    .data(d3.range(50), function(d) { return d; })
						  	.enter().append("rect")
						    .attr("class", "bars")
						    .attr("x", function(d, i) { return i; })
						    .attr("y", 300)
						    .attr("height", 10)
						    .attr("width", 30)
						    .style("fill", function(d, i ) { return legendScale(d); })

			svg.append("text")
				.attr("id","legendMax")
				.text("1030(billion $)")
				.attr("x",50)
				.attr("y",290)
				.attr("style","font-size:10px")

			svg.append("text")
					.attr("id","legendMin")
					.text("0")
					.attr("x",0)
					.attr("y",290)
					.attr("style","font-size:10px")



			// var selection = d3.select('select').property('value');
			// draw heat map with selected year
			// console.log(selection)
			// console.log(gdpData)
			// @ts-ignore
			//console.log(d3.select(".slider")._groups[0][0].value)
			d3.select(".slider")
				.on('input',function(){

					d3.select("#countryText")
						.text("")
					d3.select("#GDPText")
						.text("")

					// @ts-ignore
					selectedYear = d3.select(".slider")._groups[0][0].value
					//console.log(selectedYear)

					d3.select("#yearText")
						.text(selectedYear)

					targetGDP = allGDP[selectedYear]
					maxGDP = getMaxGDP(targetGDP)

					// @ts-ignore
					var lm = parseInt(maxGDP/1000000000).toString()

					svg.select("#legendMax")
						.text(lm+"(billion $)")
						.attr("x",50)
						.attr("y",290)
						.attr("style","font-size:10px")

					colorScale = d3.scaleLinear()
									.domain([0,maxGDP])
									// @ts-ignore
									.range([0,1])
					svg.selectAll(".country")
						.remove()
					svg.selectAll(".country")
						.data(countries)
						.enter()
						.append("path")
						.attr("class","country")
						.attr("d",path)
						.attr("value", function(d):any {
							var a:any = d
							return a.properties.sovereignt
						})
						.attr("fill",function(d):any{
							var a:any = d
							// console.log(a.properties.name)
							// if(contryList.indexOf(a.properties.sovereignt)!=-1 && targetGDP[a.properties.sovereignt]) {
							// 	console.log(targetGDP[a.properties.sovereignt])
							// 	console.log(a.properties.sovereignt)
							// 	return d3.interpolateReds(colorScale(targetGDP[a.properties.sovereignt]))
							// }
							// return 'None'

							if(targetGDP[a.properties.sovereignt]) {
								// console.log(targetGDP[a.properties.sovereignt])
								// console.log(a.properties.sovereignt)
								return d3.interpolateReds(colorScale(targetGDP[a.properties.sovereignt]))
							}
							return 'None'

							// console.log(targetGDP[a.properties.name])
							// console.log(colorScale(targetGDP[a.properties.name]))
							// console.log(d3.schemeReds[colorScale(targetGDP[a.properties.name])])
							
						})
						.attr("stroke","black")
						.on("mouseover",function(){
							// var selected:any = this
							
							// console.log(selected.__data__.properties.name)
							// d3.select("#countryText")
							// 	.text(selected.__data__.properties.name)

							var selected:any = this
							
							//console.log(selected.__data__.properties.name)
							d3.select("#countryText")
								.text(selected.__data__.properties.name)
							d3.select("#GDPText")
								// @ts-ignore
								.text((parseInt((+allGDP[selectedYear][selected.__data__.properties.name])/1000000000)).toString())
							d3.select(this)
								.attr("stroke","red")
							// d3.select(selected)
								// .attr("fill","red")
						})
						.on("mouseout",function(){
							// var selected:any = this
							d3.select(this)
								.attr("stroke","black")

							// d3.select(selected)
								// .attr("fill","None")
						})
						.on("click",function(){
							// var selected:any = this
							// d3.select(selected)
								// .attr("fill","green")

						})

				})
			// 	.on('slide',function() {
			// 		console.log("111")
			// 		console.log(d3.select(this).property('value'))
			// 	})

			// d3.selectAll('.yearButton')
			// 	.on("click",function() {
			// 		// draw heat map with updated year
					
			// 		selectedYear = d3.select(this).property('value')
			// 		console.log(selectedYear)
			// 		targetGDP = allGDP[selectedYear]
			// 		maxGDP = getMaxGDP(targetGDP)
			// 		colorScale = d3.scaleLinear()
			// 						.domain([0,maxGDP])
			// 						// @ts-ignore
			// 						.range([0,1])
			// 		svg.selectAll(".country")
			// 			.remove()
			// 		svg.selectAll(".country")
			// 			.data(countries)
			// 			.enter()
			// 			.append("path")
			// 			.attr("class","country")
			// 			.attr("d",path)
			// 			.attr("value", function(d):any {
			// 				var a:any = d
			// 				return a.properties.sovereignt
			// 			})
			// 			.attr("fill",function(d):any{
			// 				var a:any = d
			// 				// console.log(a.properties.name)
			// 				// if(contryList.indexOf(a.properties.sovereignt)!=-1 && targetGDP[a.properties.sovereignt]) {
			// 				// 	console.log(targetGDP[a.properties.sovereignt])
			// 				// 	console.log(a.properties.sovereignt)
			// 				// 	return d3.interpolateReds(colorScale(targetGDP[a.properties.sovereignt]))
			// 				// }
			// 				// return 'None'

			// 				if(targetGDP[a.properties.sovereignt]) {
			// 					// console.log(targetGDP[a.properties.sovereignt])
			// 					// console.log(a.properties.sovereignt)
			// 					return d3.interpolateReds(colorScale(targetGDP[a.properties.sovereignt]))
			// 				}
			// 				return 'None'

			// 				// console.log(targetGDP[a.properties.name])
			// 				// console.log(colorScale(targetGDP[a.properties.name]))
			// 				// console.log(d3.schemeReds[colorScale(targetGDP[a.properties.name])])
							
			// 			})
			// 			.attr("stroke","black")
			// 			.on("mouseover",function(){
			// 				var selected:any = this
							
			// 				console.log(selected.__data__.properties.name)

			// 				// d3.select(selected)
			// 					// .attr("fill","red")
			// 			})
			// 			.on("mouseout",function(){
			// 				var selected:any = this

			// 				// d3.select(selected)
			// 					// .attr("fill","None")
			// 			})
			// 			.on("click",function(){
			// 				// var selected:any = this
			// 				// d3.select(selected)
			// 					// .attr("fill","green")

			// 			})
					
			// 	})

		})

	}) //////

  }

}

//page2 graph
async function electricity() {
  const margin = {top: 80, right: 80, bottom: 40, left: 80},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
  const data = await d3.csv("data/combined.csv");
  
  const svg = d3.select("#electricgraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
  
  //Dropdown
  const entities = getCountries();
  d3.select("#select-country")
    .selectAll('country-options')
    .data(entities)
    .enter()
    .append('option')
    .text(function (d) {return d;})
    .attr("value", function (d) {return d;});
  
  //Line Graph
  const option1 = data.filter(function (d) {
    return d.entity === entities[0]
  });
  
  const x = d3.scaleLinear()
    .domain([1990, 2021])
    .range([0, width]);
  const xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));
  const y = d3.scaleLinear()
    .domain([0, d3.max(option1, d => +d.egen)])
    .range([height, 0]);
  const yAxis = svg.append("g").call(d3.axisLeft(y).tickFormat(d => d + " TWh"));
  
  
  const line = svg.append('g')
    .append("path")
    .attr("id", "line-" + entities[0])
    .datum(option1)
    .attr("d", d3.line()
          .x(function (d) {return x(Number(d.year))})
          .y(function (d) {return y(Number(d.egen))}))
    .attr("stroke","black")
    .style("stroke-width", 5)
  .style("fill","none");

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px")
    .text("Electricity Generation vs Year");

  //Mouseover
  const tooltip = d3.select("#electricgraph").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("pointer-events", "none");
  
  const mouseover = function(event, d) {tooltip.style("opacity", 1);};
  
  const mousemove = function(event, d) {
    tooltip.html("Year: " + d.year + "<br>Electrcity Generated: " + d.egen + " TWh")
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  };
  const mouseleave = function(event, d) {tooltip.style("opacity", 0);};
  svg.selectAll("dot")
    .data(option1)
    .enter().append("circle")
    .attr("cx", function(d) { return x(d.year); })
    .attr("cy", function(d) { return y(d.egen); })
    .attr("r", 5)
    .attr("fill", "black")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

decades().forEach(function (years) {
        for (let i = 0; i < option1.length; i++) {
            if (option1[i].year === years) {
                const countryData = option1[i];
              svg.append("text")
                .attr("class", "bottom-text")
                .attr("x", (width / 2))
                .attr("y", height + margin.bottom / 2)
                .attr("text-anchor", "middle")  
                .style("font-size", "16px")
                .text(option1[i].year + ": " + option1[i].egen + " TWh<br>");
            }
        }
    })
                                              
// function annotatechart1(d, x, y, margin) {
//     const annotations = [
//         {
//             note: {
//                 label: (Math.round(d.egen/10)*10) + " TWh",
//                 lineType: "none",
//                 bgPadding: {"top": 15, "left": 10, "right": 10, "bottom": 10},
//                 title: d.year,
//                 orientation: "leftRight",
//                 "align": "middle"
//             },
//             type: d3.annotationCallout,
//             subject: {radius: 15},
//             dx: x,
//             dy: y
//         },
//     ];
//     const makeAnnotations = d3.annotation().annotations(annotations);

//     d3.select("svg")
//         .append("g")
//         .attr("transform",
//             "translate(" + margin.left + "," + margin.top + ")")
//         .attr("class", "annotation-group")
//         .call(makeAnnotations)
// }

  // decades().forEach(function (years) {
  //       for (let i = 0; i < option1.length; i++) {
  //           if (option1[i].year === years) {
  //               const years = option1[i];
  //               annotatechart1(option1, x(Number(option1.year)), y(Number(option1.egen)), margin);
  //           }
  //       }
  //   })

  //update upon new country selection
  function update(newCountry) {
    const countryData = data.filter(function (d) {return d.entity === newCountry;});
    y.domain([0, d3.max(countryData, d => +d.egen)]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d => d + " TWh"));
    
    line.datum(countryData)
      .transition()
      .duration(1000)
      .attr("id", "line-" + newCountry)
      .attr("d", d3.line()
            .x(function (d) {return x(Number(d.year))})
            .y(function (d) {return y(Number(d.egen))}))
      .attr("stroke","black")
      .style("stroke-width", 5)
      .style("fill","none");
  

    //update mouseover
    const circles = svg.selectAll("circle")
      .data(countryData);
    
    circles.enter().append("circle")
      .merge(circles)
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return x(d.year); })
      .attr("cy", function(d) { return y(d.egen); })
      .attr("r",4)
      .attr("fill", "black");
      
    circles.exit().remove();
    svg.select(".bottom-text").remove();
    decades().forEach(function (years) {
        for (let i = 0; i < option1.length; i++) {
            if (option1[i].year === years) {
                const countryData = option1[i];
              svg.append("text")
                .attr("class", "bottom-text")
                .attr("x", (width / 2))
                .attr("y", height + margin.bottom / 2)
                .attr("text-anchor", "middle")  
                .style("font-size", "16px")
                .text(option1[i).year + ": " + option1[i].egen + " TWh<br>";
            }
        }
    })
    
    // d3.select(".annotation-group").remove();
    // decades().forEach(function (years) {
    //     for (let i = 0; i < countryData.length; i++) {
    //         if (countryData[i].year === years) {
    //             const years = countryData[i];
    //             annotatechart1(countryData, x(Number(countryData.year)), y(Number(countryData.egen)), margin);
    //         }
    //     }
    // })
  }
  d3.select("#select-country").on("change", function (d) {
    const nextCountry = d3.select(this).property("value")
    update(nextCountry)
  });
}



<!-- -------------------------------------------------------------------------------------------- -->



//page3 graph
async function elecgdp() {
  const margin = {top: 80, right: 80, bottom: 40, left: 80},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
  const data = await d3.csv("data/combined.csv");

  const svg = d3.select("#electricgdp").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
  
  //Dropdown
  const entities = getCountries();
  d3.select("#select-country")
    .selectAll('country-options')
    .data(entities)
    .enter()
    .append('option')
    .text(function (d) {return d;})
    .attr("value", function (d) {return d;});
  
  //Scatter Plot
  const option1 = data.filter(function (d) {
    return d.entity === entities[0]
  });
  
  const x = d3.scaleLinear()
    .domain([Math.floor(d3.min(option1,f => +f.gdp)/1000)*1000 ,Math.ceil(d3.max(option1,f => +f.gdp)/1000)*1000])
    .range([0, width]);
  const xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(f => "$" + f));
  const y = d3.scaleLinear()
    .domain([0, d3.max(option1, d => +d.egen)])
    .range([height, 0]);
  const yAxis = svg.append("g").call(d3.axisLeft(y).tickFormat(d => d + " TWh"));

  const line = svg.append('g')
    .append("path")
    .attr("id", "line-" + entities[0])
    .datum(option1)
    .attr("d", d3.line()
          .x(function (d) {return x(Number(d.gdp))})
          .y(function (d) {return y(Number(d.egen))}))
    .attr("stroke","none")
    .style("stroke-width", 5)
  .style("fill","none");

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px")
    .text("Electricity Generation vs GDP Per Capita");

  //Mouseover
  const tooltip = d3.select("#electricgdp").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("pointer-events", "none");
  
  const mouseover = function(event, d) {tooltip.style("opacity", 1);};
  
  const mousemove = function(event, d) {
    tooltip.html("Year: " + d.year + "<br>Electricity Generated: " + d.egen+"  TWh<br>GDP Per Capita: $" + d.gdp)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  };
  const mouseleave = function(event, d) {tooltip.style("opacity", 0);};
  
  //Add dots
  svg.selectAll("dot")
    .data(option1)
    .enter().append("circle")
    .attr("cx", function(d) { return x(d.gdp); })
    .attr("cy", function(d) { return y(d.egen); })
    .attr("r", 8)
    .attr("fill", "blue")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  //update upon new country selection
  function update(newCountry) {
    const countryData = data.filter(function (d) {return d.entity === newCountry;});
    x.domain([Math.floor(d3.min(countryData,d => +d.gdp)/1000)*1000 ,Math.ceil(d3.max(countryData,d => +d.gdp)/1000)*1000]);
    xAxis.transition().duration(1000).call(d3.axisBottom(x).tickFormat(d => "$" + d));
    y.domain([0, d3.max(countryData, d => +d.egen)]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d => d + " TWh"));
    
    line.datum(countryData)
      .transition()
      .duration(1000)
      .attr("id", "line-" + newCountry)
      .attr("d", d3.line()
            .x(function (d) {return x(Number(d.gdp))})
            .y(function (d) {return y(Number(d.egen))}))
      .attr("stroke","none")
      .style("stroke-width", 5)
      .style("fill","none");
  

    //update mouseover
    const circles = svg.selectAll("circle")
      .data(countryData);
    
    circles.enter().append("circle")
      .merge(circles)
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return x(d.gdp); })
      .attr("cy", function(d) { return y(d.egen); })
      .attr("r",8)
      .attr("fill", "blue");
      
    circles.exit().remove();
  }
  d3.select("#select-country").on("change", function (d) {
    const nextCountry = d3.select(this).property("value")
    update(nextCountry)
  });
}

<!-- -------------------------------------------------------------------------------------------- -->

//page4 graph
async function eleclife() {
  const margin = {top: 80, right: 80, bottom: 40, left: 80},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
  const data = await d3.csv("data/combined.csv");

  const svg = d3.select("#electriclife").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
  
  //Dropdown
  const entities = getCountries();
  d3.select("#select-country")
    .selectAll('country-options')
    .data(entities)
    .enter()
    .append('option')
    .text(function (d) {return d;})
    .attr("value", function (d) {return d;});
  
  //Scatter Plot
  const option1 = data.filter(function (d) {
    return d.entity === entities[0]
  });
  
  const x = d3.scaleLinear()
    .domain([Math.floor(d3.min(option1,f => +f.lifeex)/10)*10 ,Math.ceil(d3.max(option1,f => +f.lifeex)/10)*10])
    .range([0, width]);
  const xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(f => f + " yrs"));
  const y = d3.scaleLinear()
    .domain([0, d3.max(option1, d => +d.egen)])
    .range([height, 0]);
  const yAxis = svg.append("g").call(d3.axisLeft(y).tickFormat(d => d + " TWh"));

  const line = svg.append('g')
    .append("path")
    .attr("id", "line-" + entities[0])
    .datum(option1)
    .attr("d", d3.line()
          .x(function (d) {return x(Number(d.lifeex))})
          .y(function (d) {return y(Number(d.egen))}))
    .attr("stroke","none")
    .style("stroke-width", 5)
  .style("fill","none");

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px")
    .text("Electricity Generation vs Life Expectancy");

  //Mouseover
  const tooltip = d3.select("#electriclife").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("pointer-events", "none");
  
  const mouseover = function(event, d) {tooltip.style("opacity", 1);};
  
  const mousemove = function(event, d) {
    tooltip.html("Year: " + d.year + "<br>Electricity Generated: " + d.egen+"  TWh<br>Life Expectancy: " + d.lifeex + " yrs")
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  };
  const mouseleave = function(event, d) {tooltip.style("opacity", 0);};
  
  //Add dots
  svg.selectAll("dot")
    .data(option1)
    .enter().append("circle")
    .attr("cx", function(d) { return x(d.lifeex); })
    .attr("cy", function(d) { return y(d.egen); })
    .attr("r", 8)
    .attr("fill", "darkred")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  //update upon new country selection
  function update(newCountry) {
    const countryData = data.filter(function (d) {return d.entity === newCountry;});
    x.domain([Math.floor(d3.min(countryData,f => +f.lifeex)/10)*10 ,Math.ceil(d3.max(countryData,f => +f.lifeex)/10)*10])
    xAxis.transition().duration(1000).call(d3.axisBottom(x).tickFormat(d => d + " yrs"));
    y.domain([0, d3.max(countryData, d => +d.egen)]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d => d + " TWh"));
    
    line.datum(countryData)
      .transition()
      .duration(1000)
      .attr("id", "line-" + newCountry)
      .attr("d", d3.line()
            .x(function (d) {return x(Number(d.lifeex))})
            .y(function (d) {return y(Number(d.egen))}))
      .attr("stroke","none")
      .style("stroke-width", 5)
      .style("fill","none");
  

    //update mouseover
    const circles = svg.selectAll("circle")
      .data(countryData);
    
    circles.enter().append("circle")
      .merge(circles)
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return x(d.lifeex); })
      .attr("cy", function(d) { return y(d.egen); })
      .attr("r",8)
      .attr("fill", "darkred");
      
    circles.exit().remove();
  }
  d3.select("#select-country").on("change", function (d) {
    const nextCountry = d3.select(this).property("value")
    update(nextCountry)
  });
}


<!-- -------------------------------------------------------------------------------------------- -->

//page5 graph
async function elecco2() {
  const margin = {top: 80, right: 80, bottom: 40, left: 80},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
  const data = await d3.csv("data/combined.csv");

  const svg = d3.select("#electricco2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
  
  //Dropdown
  const entities = getCountries();
  d3.select("#select-country")
    .selectAll('country-options')
    .data(entities)
    .enter()
    .append('option')
    .text(function (d) {return d;})
    .attr("value", function (d) {return d;});
  
  //Scatter Plot
  const option1 = data.filter(function (d) {
    return d.entity === entities[0]
  });
  
  const x = d3.scaleLinear()
    .domain([Math.floor(d3.min(option1,f => +f.co2)/10)*10 ,Math.ceil(d3.max(option1,f => +f.co2)/10)*10])
    .range([0, width]);
  const xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(f => f + " t"));
  const y = d3.scaleLinear()
    .domain([0, d3.max(option1, d => +d.egen)])
    .range([height, 0]);
  const yAxis = svg.append("g").call(d3.axisLeft(y).tickFormat(d => d + " TWh"));

  const line = svg.append('g')
    .append("path")
    .attr("id", "line-" + entities[0])
    .datum(option1)
    .attr("d", d3.line()
          .x(function (d) {return x(Number(d.co2))})
          .y(function (d) {return y(Number(d.egen))}))
    .attr("stroke","none")
    .style("stroke-width", 5)
  .style("fill","none");

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px")
    .text("Electricity Generation vs Annual CO2 Per Capita (Tons/Person)");

  //Mouseover
  const tooltip = d3.select("#electricco2").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("pointer-events", "none");
  
  const mouseover = function(event, d) {tooltip.style("opacity", 1);};
  
  const mousemove = function(event, d) {
    tooltip.html("Year: " + d.year + "<br>Electricity Generated: " + d.egen+"  TWh<br>Annual CO2/Capita: " + d.co2 + " t")
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  };
  const mouseleave = function(event, d) {tooltip.style("opacity", 0);};
  
  //Add dots
  svg.selectAll("dot")
    .data(option1)
    .enter().append("circle")
    .attr("cx", function(d) { return x(d.co2); })
    .attr("cy", function(d) { return y(d.egen); })
    .attr("r", 8)
    .attr("fill", "dimgrey")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  //update upon new country selection
  function update(newCountry) {
    const countryData = data.filter(function (d) {return d.entity === newCountry;});
    x.domain([Math.floor(d3.min(countryData,f => +f.co2)/10)*10 ,Math.ceil(d3.max(countryData,f => +f.co2)/10)*10])
    xAxis.transition().duration(1000).call(d3.axisBottom(x).tickFormat(d => d + " t"));
    y.domain([0, d3.max(countryData, d => +d.egen)]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d => d + " TWh"));
    
    line.datum(countryData)
      .transition()
      .duration(1000)
      .attr("id", "line-" + newCountry)
      .attr("d", d3.line()
            .x(function (d) {return x(Number(d.co2))})
            .y(function (d) {return y(Number(d.egen))}))
      .attr("stroke","none")
      .style("stroke-width", 5)
      .style("fill","none");
  

    //update mouseover
    const circles = svg.selectAll("circle")
      .data(countryData);
    
    circles.enter().append("circle")
      .merge(circles)
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return x(d.co2); })
      .attr("cy", function(d) { return y(d.egen); })
      .attr("r",8)
      .attr("fill", "dimgrey");
      
    circles.exit().remove();
  }
  d3.select("#select-country").on("change", function (d) {
    const nextCountry = d3.select(this).property("value")
    update(nextCountry)
  });
}


<!-- -------------------------------------------------------------------------------------------- -->
  
  
function getCountries() {
  //196 countries
  return ["Afghanistan", "Albania", "Algeria", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cyprus", "Czechia", "Democratic Republic of Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vietnam", "Zambia", "Zimbabwe"]
}

function decades() {
    return [1990,2000,2010,2020]
}

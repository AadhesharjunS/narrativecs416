async function electricity() {
  const margin = {top: 20, right: 30, bottom: 40, left: 80},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
  const data = await d3.csv("https://aadhesharjuns.github.io/narrativecs416/data/combined.csv");
  
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
  const x = d3.scaleLinear()
    .domain([1990, 2021])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));
  const y = d3.scaleLinear()
    .domain([0, 10000])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d => d + " TWh"));
  
  const option1 = data.filter(function (d) {
    return d.entity === entities[0]
  });
  
  const line = svg.append('g')
    .append("path")
    .attr("id", "line-" + entities[0])
    .data(option1)
    .attr("d", d3.line()
          .x(function (d) {return x(Number(d.year))})
          .y(function (d) {return y(Number(d.egen))}))
    .attr("stroke","black")
    .style("stroke-width", 5)
  .style("fill","none");

  //update upon new country selection
  function update(newCountry) {
    const countryData = data.filter(function (d) {return d.entity === newCountry;});
    
    line.data(countryData)
      .transition()
      .duration(1000)
      .attr("id", "line-" + newCountry)
      .attr("d", d3.line()
            .x(function (d) {return x(Number(d.year))})
            .y(function (d) {return y(Number(d.egen))}));
  }
  
  d3.select("#select-country").on("change", function (d) {
    const newcountry = d3.select(this).property("value");
    update(newcountry);
  });
}
  
function getCountries() {
  //196 countries
  return ["Afghanistan", "Albania", "Algeria", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cyprus", "Czechia", "Democratic Republic of Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vietnam", "Zambia", "Zimbabwe"]
}

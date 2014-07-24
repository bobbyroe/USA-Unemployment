log = console.log.bind console
width = window.innerWidth
height = window.innerHeight

rateById = d3.map()

quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map((i) -> "q" + i + "-9" ))

projection = d3.geo.albersUsa()
    .scale(1300)
    .translate([width / 2, height / 2])

path = d3.geo.path()
    .projection(projection)

svg = d3.select(".panel").append("svg")
    .attr("width", width)
    .attr("height", height)

val = d3.scale.linear()
    .range([1, 0])
duration = 1
ready = (error, us) ->

    counties = topojson.feature(us, us.objects.counties).features
    # counties.sort((a, b) -> Math.round(Math.random()) - .5 )
    val.domain([d3.min(counties, (d) -> rateById.get(d.id)), d3.max(counties, (d) -> rateById.get(d.id))])

    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(counties)
        .enter().append("path")
        # .attr("class", (d) -> quantize(rateById.get(d.id)) )
        .attr("d", path)
        .attr('fill', (d) -> d3.hsl(210, 0.0, 0.26))
        .transition()
        .delay((d, i) -> i * duration )
        .attr('fill', (d) -> s = Math.random() * 0.5 + 0.5; d3.hsl(0, 0.0, s))
        .duration((d) -> 750)
        .transition()
        .delay((d, i) -> i * duration * 1.2 )
        .attr('fill', (d) -> s = val(rateById.get(d.id)); d3.hsl(15 + Math.round(Math.random() * 10) - 5, s, s))
        .duration((d) -> Math.random() * 750 + 750)

    # state borders

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) -> a isnt b ))
        .attr("class", "states")
        .attr("d", path)

queue()
  .defer(d3.json, "data/us.json")
  .defer(d3.tsv, "data/unemployment.tsv", (d) -> rateById.set(d.id, +d.rate) )
  .await(ready)

d3.select(self.frameElement).style("height", height + "px")

#

d = document
panel = d.querySelector '.panel'
info_panel = d.querySelector '#info'
showInfoPanel = ->
    panel.classList.add 'scooched_right'
    info_panel.classList.add 'open'
    is_highlighing_points = false

hideInfoPanel = ->
    panel.classList.remove 'scooched_right'
    info_panel.classList.remove 'open'
    is_highlighing_points = true

toggleInfoPanel = ->
    if info_panel.classList.contains 'open'
        hideInfoPanel()
    else 
        showInfoPanel()

clicked = (evt) ->
    if evt.target.id is 'nub'
        toggleInfoPanel()
    if evt.target.id is ''
        hideInfoPanel()

d.addEventListener 'click', clicked

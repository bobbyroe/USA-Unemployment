// Generated by CoffeeScript 1.7.1
var clicked, d, duration, height, hideInfoPanel, info_panel, log, panel, path, projection, quantize, rateById, ready, showInfoPanel, svg, toggleInfoPanel, val, width;

log = console.log.bind(console);

width = window.innerWidth;

height = window.innerHeight;

rateById = d3.map();

quantize = d3.scale.quantize().domain([0, .15]).range(d3.range(9).map(function(i) {
  return "q" + i + "-9";
}));

projection = d3.geo.albersUsa().scale(1300).translate([width / 2, height / 2]);

path = d3.geo.path().projection(projection);

svg = d3.select(".panel").append("svg").attr("width", width).attr("height", height);

val = d3.scale.linear().range([1, 0]);

duration = 1;

ready = function(error, us) {
  var counties;
  counties = topojson.feature(us, us.objects.counties).features;
  val.domain([
    d3.min(counties, function(d) {
      return rateById.get(d.id);
    }), d3.max(counties, function(d) {
      return rateById.get(d.id);
    })
  ]);
  svg.append("g").attr("class", "counties").selectAll("path").data(counties).enter().append("path").attr("d", path).attr('fill', function(d) {
    return d3.hsl(210, 0.0, 0.26);
  }).transition().delay(function(d, i) {
    return i * duration;
  }).attr('fill', function(d) {
    var s;
    s = Math.random() * 0.5 + 0.5;
    return d3.hsl(0, 0.0, s);
  }).duration(function(d) {
    return 750;
  }).transition().delay(function(d, i) {
    return i * duration * 1.2;
  }).attr('fill', function(d) {
    var s;
    s = val(rateById.get(d.id));
    return d3.hsl(15 + Math.round(Math.random() * 10) - 5, s, s);
  }).duration(function(d) {
    return Math.random() * 750 + 750;
  });
  return svg.append("path").datum(topojson.mesh(us, us.objects.states, function(a, b) {
    return a !== b;
  })).attr("class", "states").attr("d", path);
};

queue().defer(d3.json, "data/us.json").defer(d3.tsv, "data/unemployment.tsv", function(d) {
  return rateById.set(d.id, +d.rate);
}).await(ready);

d3.select(self.frameElement).style("height", height + "px");

d = document;

panel = d.querySelector('.panel');

info_panel = d.querySelector('#info');

showInfoPanel = function() {
  var is_highlighing_points;
  panel.classList.add('scooched_right');
  info_panel.classList.add('open');
  return is_highlighing_points = false;
};

hideInfoPanel = function() {
  var is_highlighing_points;
  panel.classList.remove('scooched_right');
  info_panel.classList.remove('open');
  return is_highlighing_points = true;
};

toggleInfoPanel = function() {
  if (info_panel.classList.contains('open')) {
    return hideInfoPanel();
  } else {
    return showInfoPanel();
  }
};

clicked = function(evt) {
  if (evt.target.id === 'nub') {
    toggleInfoPanel();
  }
  if (evt.target.id === '') {
    return hideInfoPanel();
  }
};

d.addEventListener('click', clicked);

/*
//@ sourceMappingURL=main.map
*/

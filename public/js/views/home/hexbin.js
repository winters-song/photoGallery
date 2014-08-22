define([
  'jquery',
  'underscore',
  'd3',
  'common',
  'hexbin'
], 
function($, _, d3, Common, hexbin){

  var Hexbin = function(el){
    this.el = el;
    this.initialize();
  };

  Hexbin.prototype = {

    height: 460,
    imageWidth : 132,
    imageHeight : 152,
    radius : 75,
    depth : 4,

    currentFocus: null,
    desiredFocus: null,
    idle: true,

    initialize: function(){
      var me = this;

      me.currentFocus = [window.innerWidth / 2, me.height / 2];

      $.ajax({
        url: '/proxy/hexbin.json'
      }).done(function(data){
        me.data = data;

        me.data.forEach(function(d, i) {
          d.i = i % 10;
          d.j = i / 10 | 0;
        });

        me.render();
      });
    },

    render: function(){
      var me = this;

      me.hexbin = d3.hexbin().radius(me.radius);

      me.$deep = $("#examples-deep");

      me.$canvas = $("<canvas>").appendTo(me.$deep).css("height", me.height);

      me.context = me.$canvas[0].getContext("2d");

      me.$svg = $("<svg>").appendTo(me.$deep).css("height", me.height);

      me.$mesh = $("<path>").appendTo(me.$svg).addClass("example-mesh");

      var g = $("<g>").appendTo(me.$svg).addClass("example-anchor");

      me.$anchor = $("a", me.svg);

      me.$graphic = $("svg,canvas", me.el);

      var image = new Image;
      image.src = "http://d3js.org/ex.jpg?3f2d00ffdba6ced9c50f02ed42f12f6156368bd2";

      $(window).on("resize", me, me.resized);
      me.resized();
    },

    resized: function(e) {
      var me = this;
      if(e){
        me = e.data;
      }
      var innerWidth = window.innerWidth;
      var deepWidth = innerWidth * (me.depth + 1) / me.depth,
          deepHeight = me.height * (me.depth + 1) / me.depth,
          centers = me.hexbin.size([deepWidth, deepHeight]).centers();

      me.desiredFocus = [innerWidth / 2, me.height / 2];

      me.moved();

      me.$graphic.css({
        left: Math.round((innerWidth - deepWidth) / 2) + "px",
        top: Math.round((me.height - deepHeight) / 2) + "px",
        width: deepWidth,
        height: deepHeight
      });

      centers.forEach(function(center, i) {
        center.j = Math.round(center[1] / (me.radius * 1.5));
        center.i = Math.round((center[0] - (center.j & 1) * me.radius * Math.sin(Math.PI / 3)) / (me.radius * 2 * Math.sin(Math.PI / 3)));
        me.context.save();
        me.context.translate(Math.round(center[0]), Math.round(center[1]));
        me.drawImage(center.example = me.data[(center.i % 10) + ((center.j + (center.i / 10 & 1) * 5) % 10) * 10]);
        me.context.restore();
      });

      //   mesh.attr("d", hexbin.mesh);

      //   anchor = anchor.data(centers, function(d) { return d.i + "," + d.j; });

      //   anchor.exit().remove();

      //   anchor.enter().append("a")
      //       .attr("xlink:href", function(d) { return d.example.url; })
      //       .attr("xlink:title", function(d) { return d.example.title; })
      //     .append("path")
      //       .attr("d", hexbin.hexagon());

      //   anchor
      //       .attr("transform", function(d) { return "translate(" + d + ")"; });
    },

    moved: function() {
      var me = this;

      if (me.idle) {
        d3.timer(function() {
          if (me.idle = Math.abs(me.desiredFocus[0] - me.currentFocus[0]) < .5 && Math.abs(me.desiredFocus[1] - me.currentFocus[1]) < .5) {
            me.currentFocus = me.desiredFocus;
          } else {
            me.currentFocus[0] += (me.desiredFocus[0] - me.currentFocus[0]) * .14;
            me.currentFocus[1] += (me.desiredFocus[1] - me.currentFocus[1]) * .14;
          }
          me.deep.css(transform, "translate(" + (window.innerWidth / 2 - me.currentFocus[0]) / me.depth + "px," + (me.height / 2 - me.currentFocus[1]) / me.depth + "px)");
          return me.idle;
        });
      }
        
    }
  }

  return Hexbin;
});


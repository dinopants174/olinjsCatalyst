var React = require('react');
var ReactDOM = require('react-dom');

function cleanupData (data_orig) {
  var str = JSON.stringify(data_orig);
  str = str.replace(/inspired/g, 'children');
  data_orig = JSON.parse(str);
  return data_orig
};


function createChart(dom, props){
    var width = props.width;
    var height = props.height;

    var margin = {top: 20, right: 80, bottom: 20, left: 80};
    var data = cleanupData(props.data);
  
    console.log(data);
    var i = 0;
    // var sum = data.reduce(function(memo, num){ return memo + num.count; }, 0);
    var chart = d3.select(dom).append('svg').attr('class', 'd3').attr('width', width + margin.right + margin.left).attr('height', height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // var outerRadius = props.width/2.2;
  // var innerRadius = props.width/8;

  // var arc = d3.svg.arc()
  //     .outerRadius(outerRadius)
  //     .innerRadius(innerRadius);

  // var colors = ['#FD9827', '#DA3B21', '#3669C9', '#1D9524', '#971497'];

  var root = data[0];
  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  // var pie = d3.layout.pie()
  //     .value(function (d) { return d.count; });

  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Declare the nodes…
  var node = chart.selectAll("g.node")
    .data(nodes, function(d) { return d._id || (d._id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("image")
      .attr("xlink:href", "http://www.clker.com/cliparts/1/4/5/a/1331068897296558865Sitting%20Racoon.svg")
      .attr("x", "-12px")
      .attr("y", "-12px")
      .attr("width", "24px")
      .attr("height", "24px");


  nodeEnter.append("text")
    .attr("x", function(d) { 
      return d.children || d._children ? 
      (15) * -1 : + 15 })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { 
      return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.title; })
    .style("fill-opacity", 1);

  // Declare the links…
  var link = chart.selectAll("path.link")
    .data(links, function(d) { return d.target._id; });

  // Enter the links.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .style("stroke", "black")
    .attr("d", diagonal);

  // var g = chart.selectAll(".arc")
  //       .data(pie(data))
  //       .enter().append("g")
  //       .attr("class", "arc")
  //       .on("click", function(d) {
  //         alert('you clicked ' + d.data.name)
  //       })
  //       .on('mouseover', function (d, i) {
  //         d3.select(this)
  //           .transition()
  //           .duration(500)
  //           .ease('bounce')
  //           .attr('transform', function (d) {
  //             var dist = 10;
  //             d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
  //             var x = Math.sin(d.midAngle) * dist;
  //             var y = -Math.cos(d.midAngle) * dist;
  //             return 'translate(' + x + ',' + y + ')';
  //           });
  //         d3.select(this).append("text").style("fill", function(d) { return colors[i]; }).attr("id", "percent")
  //         .attr('transform', "translate(0,-5)")
  //         .attr("text-anchor", "middle").attr("dy", ".35em").style("font", "bold 15px Arial")
  //         .text(function(d) { return (((d.value/sum)*100).toFixed(1) + " %"); });
  //         g.filter(function(e) { return e.value != d.value; }).style('opacity',0.5);
  //       }).on('mouseout', function (d, i) {
  //           d3.select(this)
  //           .transition()
  //           .duration(500)
  //           .ease('bounce')
  //           .attr('transform', 'translate(0,0)');
  //           d3.select("#percent").remove();
  //           g.filter(function(e) { return e.value != d.value; }).style('opacity',1)
  //         });

  // g.append("path")
  //   .style("fill", function(d, i) { return colors[i]; })
  //   .transition().delay(function(d, i) { return i * 400; }).duration(500)
  //   .attrTween('d', function(d) {
  //        var i = d3.interpolate(d.startAngle, d.endAngle);
  //        return function(t) {
  //            d.endAngle = i(t);
  //          return arc(d);
  //        }
  //   });
  // var center = g.filter(function(d) { return d.endAngle - d.startAngle > .1; }).append("text").style("fill", "white")
  //   .attr('transform', function(d){
  //     return "translate(" + arc.centroid(d) + ")";
  //   })
  //   .attr("text-anchor", "middle").attr("dy", ".35em")
  //   .text(function(d) { return d.value; });

    // var legend = chart.selectAll(".legend")
    // .data(data)
    // .enter().append("g")
    // .attr("class", "legend")
    // .attr("transform", function (d, i) {
    //   return "translate(150," + (-i * 20) + ")";
    // });

    // var rect = legend.append("rect")
    //     .attr("width", 18)
    //     .attr("height", 18)
    //     .style("fill", function(d, i) { return colors[i]; }).style('opacity', 0);

    // var name = legend.append("text")
    //     .attr("x", 24)
    //     .attr("y", 12)
    //     .text(function (d) {
    //       var text = d.name;
    //       if(text.length >30){
    //         text = text.substring(0,26);
    //         text = text + '...';
    //       }
    //     return text;
    // }).style('opacity', 0);
    // rect.transition().delay(function(d, i) { return i * 400; }).duration(1000).style('opacity',1);
    // name.transition().delay(function(d, i) { return i * 400; }).duration(1000).style('opacity',1);
 
};

var PieChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
  },

  getDefaultProps: function() {
    return {
      width: 500,
      height: 350,
      title: '',
      Legend: true,
    };
  },

  render: function() {
    return (
      <div>
        <h4> {this.props.title} </h4>
      </div>
    );
  },
  componentDidMount: function() {
    var dom =  ReactDOM.findDOMNode(this);
    createChart(dom, this.props);
  },
  shouldComponentUpdate: function() {
      var dom =  ReactDOM.findDOMNode(this);
      createChart(dom, this.props);
      return false;
  }
});

module.exports = PieChart;
// var ProgressChart=React.createClass({
//     propTypes: {
//         width:React.PropTypes.number,
//         height:React.PropTypes.number,
//         chartId:React.PropTypes.string
//     },

//     getDefaultProps: function() {
//         return {
//             width: 200,
//             height: 200,
//             chartId: 'v_chart'
//         };
//     },
//     getInitialState:function(){
//         return {percent:0};
//     },
//     componentWillMount:function(){

//         this.setState({percent:.87});
//     },
//     componentWillUnmount:function(){


//     },
//     updateData:function(){

//         var value=(Math.floor(Math.random() * (80) + 10))/100;

//         this.setState({percent:value});
//     },
//     render:function(){

//         var color = ['#404F70','#67BAF5','#2d384d'];

//         var outerRadius=(this.props.height/2)-10;
//         var innerRadius=outerRadius-20;

//         var arc=d3.svg.arc()
//             .innerRadius(innerRadius)
//             .outerRadius(outerRadius)
//             .startAngle(0)
//             .endAngle(2*Math.PI);


//         var arcLine=d3.svg.arc()
//             .innerRadius(innerRadius)
//             .outerRadius(outerRadius)
//             .cornerRadius(20)
//             .startAngle(-0.05);

//         var transform='translate('+this.props.width/2+','+this.props.height/2+')';
//         var style1={
//             filter:'url(#inset-shadow1)'
//         };
//         var style2={
//             filter:'url(#inset-shadow2)'
//         };
//         var styleText= {
//             'fontSize': '40px'
//         };
//         return (
//             <div>
//                 <svg id={this.props.chartId} width={this.props.width}
//                      height={this.props.height} onClick={this.updateData}>

//                     <g transform={transform}>
//                         <InsetShadow id="inset-shadow1" stdDeviation="5" floodColor="black" floodOpacity=".5"/>
//                         <InsetShadow id="inset-shadow2" stdDeviation="1" floodColor="white" floodOpacity=".5"/>

//                         <path fill={color[0]} d={arc()} style={style1}></path>
//                         <path fill={color[1]} d={arcLine({endAngle:(2*Math.PI)*this.state.percent})}
//                               style={style2}></path>
//                         <circle r={innerRadius} cx="0" cy="0"
//                                 fill={color[2]} fillOpacity="1"/>
//                         <text textAnchor="middle" dy="15" dx="5" fill={d3.rgb(color[1]).brighter(2)}
//                             style={styleText}>{this.state.percent*100+'%'}</text>
//                     </g>
//                 </svg>
//             </div>
//         );
//     }
// });

// module.exports=ProgressChart;

// function DataGenerator(random) {
//   var id = 0;
//   return function() {
//     return {
//       id: ++id,
//       x: random(),
//       y: random()
//     };
//   }
// }


// var generateDatum = DataGenerator(d3.random.normal(5000, 1000));

// var ChartMixin = {
//   propTypes: {
//     xScale: React.PropTypes.func.isRequired,
//     yScale: React.PropTypes.func.isRequired,
//     data: React.PropTypes.array.isRequired,
//     transitionDuration: React.PropTypes.number.isRequired
//   },

//   componentDidMount: function() {
//     d3.select(ReactDOM.findDOMNode(this))
//       .call(this.renderData);
//   },

//   componentDidUpdate: function(prevProps, prevState) {
//     this.xScale0 = prevProps.xScale;
//     this.yScale0 = prevProps.yScale;
//     d3.select(ReactDOM.findDOMNode(this)).transition().duration(this.props.transitionDuration)
//       .call(this.renderData);
//   },

//   render: function() {
//     return (
//       <g {...this.props} />
//     );
//   }
// };

// var Axis = React.createClass({
//   propTypes: {
//     scale: React.PropTypes.func.isRequired,
//     orient: React.PropTypes.string.isRequired,
//     transitionDuration: React.PropTypes.number.isRequired
//   },

//   componentDidMount: function() {
//     this.axis = d3.svg.axis()
//       .scale(this.props.scale)
//       .orient(this.props.orient);
//     d3.select(ReactDOM.findDOMNode(this)).call(this.axis);
//   },

//   componentDidUpdate: function(prevProps, prevState) {
//     this.axis
//       .scale(this.props.scale)
//       .orient(this.props.orient);

//     d3.select(ReactDOM.findDOMNode(this)).transition().duration(this.props.transitionDuration)
//       .call(this.axis);
//   },

//   render: function() {
//     return (<g {...this.props} />);
//   }
// });

// var Dots = React.createClass({
//   mixins: [ChartMixin],

//   renderData: function(g) {
//     var x = this.props.xScale;
//     var y = this.props.yScale;
//     var x0 = this.xScale0 || x;
//     var y0 = this.yScale0 || y;
//     var data = this.props.data;

//     g.each(function() {
//       var c = d3.select(this).selectAll('circle').data(data, function(d) { return d.id; });
//       c.enter().append('circle')
//         .attr('cx', function(d) { return x0(d.x); })
//         .attr('cy', function(d) { return y0(d.y); })
//         .style('opacity', 1e-6);
//       d3.transition(c)
//         .attr('cx', function(d) { return x(d.x); })
//         .attr('cy', function(d) { return y(d.y); })
//         .attr('r', function(d) { return 3; })
//         .style('opacity', 1);
//       c.exit()
//         .remove();
//     });
//   },


// });

// var Labels = React.createClass({
//   mixins: [ChartMixin],

//   renderData: function(g) {
//     var x = this.props.xScale;
//     var y = this.props.yScale;
//     var x0 = this.xScale0 || x;
//     var y0 = this.yScale0 || y;
//     var data = this.props.data;
    
//     g.each(function() {
//       var c = d3.select(this).selectAll('text').data(data, function(d) { return d.id; });
//       c.enter().append('text')
//         .attr('x', function(d) { return x0(d.x); })
//         .attr('y', function(d) { return y0(d.y); })
//         .attr('dy', -10)
//         .style('opacity', 1e-6);
//       d3.transition(c)
//         .attr('x', function(d) { return x(d.x); })
//         .attr('y', function(d) { return y(d.y); })
//         .style('opacity', 1)
//         .text(function(d) { return d.id; });
//       c.exit()
//         .remove();
//     });
//   }
// });


// var Chart = React.createClass({
//   getInitialState: function() {
//     return {
//       width: 500,
//       height: 500,
//       data: d3.range(20).map(generateDatum)
//     };
//   },

//   // componentDidMount: function() {
//   //   setInterval(function() {
//   //     this.setState({
//   //       data: this.state.data.slice(10).concat(d3.range(10).map(generateDatum))      
//   //     });
//   //   }.bind(this), 1500);
//   // },

//   render: function() {
//     var x = d3.scale.linear()
//       .domain(d3.extent(this.state.data, function(d) { return d.x; }))
//       .range([60, this.state.width - 30])
//       .nice();

//     var y = d3.scale.linear()
//       .domain(d3.extent(this.state.data, function(d) { return d.y; }))
//       .range([this.state.height - 30, 30])
//       .nice();

//     return (
//       <svg width={this.state.width} height={this.state.height}>
//         <Axis className='x axis' scale={x} orient='bottom' transform='translate(0, 470)'  transitionDuration={1000} />
//         <Axis className='y axis' scale={y} orient='left' transform='translate(60, 0)'  transitionDuration={1000} />
//         <Dots className='dots' xScale={x} yScale={y} data={this.state.data} transitionDuration={1000} />
//         <Labels className='labels' xScale={x} yScale={y} data={this.state.data} transitionDuration={1000} />
//       </svg>
//     );
//   }
// })





// var BarChart = React.createClass({
//   getDefaultProps: function() {
//     return {
//       width: 600,
//       height: 300
//     }
//   },

//   render: function() {
//     return (
//       <Chart width={this.props.width} height={this.props.height}>
//         <DataSeries data={[ 30, 10, 5, 8, 15, 10 ]} width={this.props.width} height={this.props.height} color="cornflowerblue" />
//       </Chart>
//     );
//   }
// });

// var Chart = React.createClass({
//         render: function() {
//           return (
//             <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
//           );
//         }
// });

// var Bar = React.createClass({
//   getDefaultProps: function() {
//     return {
//       width: 0,
//       height: 0,
//       offset: 0
//     }
//   },

//   render: function() {
//     return (
//       <rect fill={this.props.color}
//         width={this.props.width} height={this.props.height} 
//         x={this.props.offset} y={this.props.availableHeight - this.props.height} />
//     );
//   }
// });

// var DataSeries = React.createClass({
//   getDefaultProps: function() {
//     return {
//       title: '',
//       data: []
//     }
//   },

//   render: function() {
//     var props = this.props;

//     var yScale = d3.scale.linear()
//       .domain([0, d3.max(this.props.data)])
//       .range([0, this.props.height]);

//     var xScale = d3.scale.ordinal()
//       .domain(d3.range(this.props.data.length))
//       .rangeRoundBands([0, this.props.width], 0.05);

//     var bars = _.map(this.props.data, function(point, i) {
//       return (
//         <Bar height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} color={props.color} key={i} />
//       )
//     });

//     return (
//       <g>{bars}</g>
//     );
//   }
// });

// module.exports = Chart;
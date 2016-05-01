var React = require('react');
var ReactDOM = require('react-dom');

function cleanupData (data_orig, type) {
  if (type == 'inspirations'){
    var str = JSON.stringify(data_orig);
    str = str.replace(/inspirations/g, 'parents');

    data_orig = JSON.parse(str);
  } else {
    var str = JSON.stringify(data_orig);
    str = str.replace(/inspired/g, 'parents');

    data_orig = JSON.parse(str);
  }

  return data_orig
};


function createChart(dom, props, chart_type){

    d3.select(".d3").remove();

    var width = parseInt(d3.select('.upclose').style('width'), 10)-150;
    var height = props.height;

    var margin = {top: 0, right: 225, bottom: 0, left: 0};
    var data = cleanupData(props.data, chart_type);
  
    function elbow(d, i) {
    return "M" + d.source.y + "," + d.source.x
         + "H" + d.target.y + "V" + d.target.x
         + (d.target.children ? "" : "h" + 20);
    }

    console.log(data);
    var i = 0;

    var svg = d3.select(dom).append('svg').attr('class', 'd3').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var root = data[0];

  var tree = d3.layout.tree()
    .separation(function(a, b) { return a.parent === b.parent ? 1 : .5; })
    .children(function(d) { return d.parents; })
    .size([height, width]);


  var nodes = tree.nodes(root),
    links = tree.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", elbow);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("text")
      .attr("class", "name")
      .attr("x", 2)
      .attr("y", -6)
      .text(function(d) { return d.title; });


  // node.append('foreignObject')
  //       .attr("x", function (d) { return d.x; })
  //       .attr("y", function (d) { return d.y; })
  //       .attr("width", 50)
  //       .attr("height", 50)   
  //       .append("iframe")
  //       .attr("src", function(d) {
  //           return "https://www.youtube.com/watch?v=hQ7aBnDZXjY";  //src for each frame
  //       })
  //       .attr("width", 50)
  //       .attr("height", 50);
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

  toggleTree: function() {
    console.log(document.getElementById("toggle"));
    if(document.getElementById("toggle").value=="Show Inspired"){
      document.getElementById("toggle").value="Show Inspirations";
      $('#type_inspir').text('Inspired')
      var dom =  ReactDOM.findDOMNode(this);
      createChart(dom, this.props, 'inspired');
    }

    else if(document.getElementById("toggle").value=="Show Inspirations"){
      document.getElementById("toggle").value="Show Inspired";
      $('#type_inspir').text('Inspirations')
      var dom =  ReactDOM.findDOMNode(this);
      createChart(dom, this.props, 'inspirations');
    }
  },


  render: function() {
    return (
      <div>
        <h4> {this.props.title} </h4>
        <input type="button" id="toggle" onClick={this.toggleTree} value="Show Inspired"/>
        <br/>
        <h4 style={{'font-size':'50px'}} id="type_inspir"> Inspirations </h4>
      </div>
    );
  },
  componentDidMount: function() {
    var dom =  ReactDOM.findDOMNode(this);
    createChart(dom, this.props, 'inspirations');
  }
});

module.exports = PieChart;
var React = require('react');
var ReactDOM = require('react-dom');

/*Function to cleanup data to have the write format for a tree object (inspirations keys need to be changed to children keys and remove
all empty lists of children*/
//Input: original data array and board type
//Output: cleanuped data
function cleanupData (data_orig, type) {
    String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.split(search).join(replacement);
  };

  if (data_orig[0][type].length == 0) {
    if (type == 'inspirations'){
      var str = JSON.stringify(data_orig);
      str = str.replace(/inspirations/g, 'children');

      data_orig = JSON.parse(str);
    } else {
      var str = JSON.stringify(data_orig);
      str = str.replace(/inspired/g, 'children');

      data_orig = JSON.parse(str);
    }
  } else {
    if (type == 'inspirations'){
      var str = JSON.stringify(data_orig);
      str = str.replace(/inspirations/g, 'children');
      str = str.replaceAll(',"children":[]', '');

      data_orig = JSON.parse(str);
    } else {
      var str = JSON.stringify(data_orig);
      str = str.replace(/inspired/g, 'children');
      str = str.replaceAll(',"children":[]', '');

      data_orig = JSON.parse(str);
    }
  }

      console.log(data_orig);

  return data_orig
};

/*Creates d3 chart, removes all d3 elements and popups to regenerate the d3 tree*/
function createChart(dom, props, chart_type){

    //REMOVES all tree and popups to be re-rendered
    d3.select(".d3").remove();
    d3.select(dom).selectAll('.popup').remove();
    d3.select(dom).selectAll('.popup2').remove();


    //Sets width, height and margin
    var width = parseInt(d3.select('.upclose').style('width'), 10);
    var height = props.height;


    var margin = {top: 0, right: 50, bottom: 0, left: 200};

    //Cleans up data
    var data = cleanupData(props.data, chart_type);


    //Setting up root and transition duration
    var i = 0,
        duration = 750,
        root;


    var tree = d3.layout.tree()
        .size([height, width]);


    //Creation of d3 svg elements and g elements for tree structure
    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select(dom).append('svg').attr('class', 'd3').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).attr('position', 'relative')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = data[0];
    root.x0 = height / 2;
    root.y0 = width / 2;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    try {
      root.children.forEach(collapse);
      update(root);
    } catch (error) {
      console.log("no children")
    }

    function update(source) {
      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * 180; });

      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });

      //Appends circle to each node
      nodeEnter.append("circle")
          .attr("r", 30)
          .style("fill", function(d) { return d._children ? "#428F89" : "#fff"; })
          .on("click", click); //click function expands that node and shows more children


      //Appends piece text underneath each circle. Each title also has click function to open up the video for that piece
      nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -30 : 25; })
          .attr("dy", "1.75em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.title; })
          .style("fill-opacity", 1e-6)
          .on("click", function(d) {
                //Removes all initial popups
                d3.select(dom).selectAll('.popup').remove();
                d3.select(dom).selectAll('.popup2').remove();

                //Finds coordinates of mouse
                coordinates = d3.mouse(d3.select('svg').node());
                var x = coordinates[0];
                var y = coordinates[1];

                //Appends div with iframe at the location of mouse click
                var popupdiv = d3.select(dom).append("div").attr("class", "popup");
                    popupdiv.style('display', 'inline-block');
                    popupdiv.html("<div class='iframeWrapper'>" + d.src + "</div>");
                    popupdiv.style("left", (x) + "px")   
                      .style("top", (y+130) + "px");

                //Appends exit div that will remove the popup
                var popupexit = d3.select(dom).append("div").attr("class", "popup2");
                    popupexit.style('display', 'inline-block');
                    popupexit.html("<h4 class='exitIframe'>X</h4>");
                    popupexit.style("left", (x) + "px")   
                      .style("top", (y+130) + "px")
                      .on("click", function(d) {
                          d3.select(dom).selectAll('.popup').remove();
                          d3.select(dom).selectAll('.popup2').remove();
                      });
          });

      //Node render transition, and adding of children with text
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
          .attr("r", 10)
          .style("fill", function(d) { return d._children ? "#428F89" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 10);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      console.log("LOok at me");
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
     
      update(d);
    }
};

var PieChart = React.createClass({

  propTypes: {
      data: React.PropTypes.array.isRequired,
      title: React.PropTypes.string.isRequired,
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
    //toggleTree changes between inspired and inspirations, and creates new chart depending on which one
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
        <h4 style={{'fontSize':'50px'}} id="type_inspir"> Inspirations </h4>
      </div>
    );
  },

  componentDidMount: function() {
    //Creates Inspirations Chart Initially
    var dom =  ReactDOM.findDOMNode(this);
    createChart(dom, this.props, 'inspirations');
  }
});

module.exports = PieChart;
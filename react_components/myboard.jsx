var React = require('react');
var ReactDOM = require('react-dom');
var Dashboard = require('./dashboard.jsx');

var MyBoard = React.createClass({

	rawMarkup: function(elem) {
    	return { __html: elem };
  	},

    render: function(){
        var parent = this; 

        if (this.props.subpage === "uploads") {
            var subpage = <div><div className='centering-div'>
                   <h1>My Uploads</h1>
                </div>
                <Dashboard boardtype={this.props.subpage} uploadslist={this.props.uploads} deleteInspir={this.props.deleteInspir}/></div>
        } else if (this.props.subpage === "inspirations") {
            var subpage = <div><div className='centering-div'>
                   <h1>My Inspirations</h1>
                </div>
                <Dashboard boardtype={this.props.subpage} uploadslist={this.props.inspirations} deleteInspir={this.props.deleteInspir}/></div>
        } else {
            var subpage = <div className='centering-div'>
                   <h1>Profile Page...</h1>
                </div>
        }

        return(
            <div id= "feed"> 
                {subpage}
            </div>
        ); 
    }
});

module.exports = MyBoard;
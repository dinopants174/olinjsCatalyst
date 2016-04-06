var React = require('react');
var ReactDOM = require('react-dom');
var UploadsDasboard = require('./myuploads.jsx');

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
                <UploadsDasboard uploadslist={this.props.uploads}/></div>
        } else if (this.props.subpage === "inspirations") {
            var subpage = <div><div className='centering-div'>
                   <h1>My Inspirations</h1>
                </div>
                <UploadsDasboard uploadslist={this.props.inspirations}/></div>
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
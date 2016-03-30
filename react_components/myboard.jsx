var React = require('react');
var ReactDOM = require('react-dom');

var MyBoard = React.createClass({

	rawMarkup: function(elem) {
    	return { __html: elem };
  	},

    render: function(){
    	var parenThis = this;

    	var images = (this.props.uploads).map(function(elem, i) {
			return <div key={'div'+i} dangerouslySetInnerHTML={parenThis.rawMarkup(elem)} />
		});


        return (
        	<div>
        		{images}
			</div>
        );
    }
});

module.exports = MyBoard;
var React = require('react');
var ReactDOM = require('react-dom');
var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

var Masonry = require('./masonry.jsx');

var masonryOptions = {
    transitionDuration: 0
};


var Feed = React.createClass({ 

	getInitialState: function(){ 
		return{
			images: this.props.feedObjects,
		};
	}, 

	checkIfInInspirations: function(object, inspirations){ 
		var i; 
		for(i = 0; i < inspirations.length; i++){ 
			if(inspirations[i]._id === object._id){ 
				return true;
			}
		}
		return false; 
	},

	handleClick: function(item){ 
		console.log("you've clicked this item", item)
		this.props.addInspir(item)
	},

	rawMarkup: function(e){ 
		return {__html: e}
	},

	render: function(){ 



		var parent = this; 
        var childElements = this.state.images.map(function(element, i){
			var pinButton; 
			if(parent.checkIfInInspirations(element, parent.props.userInspirations)){ 
				pinButton = <button className="button add" disabled> Already Pinned </button>
			}
			else{ 
				pinButton = <button className="button add" onClick = {parent.handleClick.bind(null, element)}> + Add Inspiration </button>
			}
           return (
           		<div key={'div'+i} className="image-div-class">
	                <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
	            	<p>{element.title}</p>
	            	{pinButton}
	            </div>
            );
        });


		return(
			<div id="feed"> 
				<Masonry
	                className={'my-gallery-class'}
	                elementType={'div'}
	                disableImagesLoaded={false}
	            >
	                {childElements}
	            </Masonry>
			</div>
		); 
	}

}); 

module.exports = Feed; 
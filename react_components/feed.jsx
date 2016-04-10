var React = require('react');
var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

// var Lightbox = require('./lightbox.jsx');

var Masonry = require('./masonry.jsx');

var masonryOptions = {
    transitionDuration: 0
};

var Feed = React.createClass({ 

	getInitialState: function(){ 
		return{
			lightboxMode: false,
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

	handleClickToAddToInspiration: function(item){ 
		console.log("you've clicked this item", item)
		this.props.addInspir(item)
	},

	handleClickToViewPiece: function(item){ 
		console.log("item", item)
		alert("You clicked me")
		this.setState({lightboxMode: true})
		// this.setState({clickedItem: item})
		console.log("images", this.state.images); 
	}, 

	rawMarkup: function(e){ 
		return {__html: e}
	},

	render: function(){ 

		var parent = this; 

		if(!this.state.lightboxMode){ 
	        var childElements = this.state.images.map(function(element, i){
				var pinButton; 
				if(parent.checkIfInInspirations(element, parent.props.userInspirations)){ 
					pinButton = <button className="button add" disabled> Already Pinned </button>
				}
				else{ 
					pinButton = <button className="button add" onClick = {parent.handleClickToAddToInspiration.bind(null, element)}> + Add Inspiration </button>
				}
	           return (
	           		<div key={'div'+i} className="image-div-class">
		                <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
		            	<p>{element.title}</p>
		            	<button className = "button expand" onClick = {parent.handleClickToViewPiece.bind(null, element)}> View </button>
		            	{pinButton}
		            </div>
	            );
	        });

	        var something = <Masonry
	                className={'my-gallery-class'}
	                elementType={'div'}
	                disableImagesLoaded={false}
	            >
	                {childElements}
	            </Masonry>
    	}
    	else if(this.state.lightboxMode){ 
    		// <Lightbox pictures = {this.state.images} index = {1} />
    		// var something = <Lightbox
			   //  pictures={[
			   //    'https://pbs.twimg.com/profile_images/269279233/llama270977_smiling_llama_400x400.jpg',
			   //    'https://pbs.twimg.com/profile_images/1905729715/llamas_1_.jpg',
			   //    'http://static.comicvine.com/uploads/original/12/129924/3502918-llama.jpg',
			   //    'http://fordlog.com/wp-content/uploads/2010/11/llama-smile.jpg'
			   //  ]}
		    // keyboard
		    // controls={Controls}/>
    	}

    	return(
			<div id="feed"> 
				{something}
			</div>
		); 
	}

}); 

module.exports = Feed; 
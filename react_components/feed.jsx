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

		// var image_divs = this.state.images.map(function(elem, i) {
		// 	console.log(elem);

		// 	var inInspirations = parent.checkIfInInspirations(elem, parent.props.userInspirations)
		// 	return <td key={'td'+i}><FeedItem item = {elem} pinned = {inInspirations} addInspiration = {parent.props.addInspir}/></td>	
		// });


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


		// return(
		// 	<div key = {this.props.item.title + "button"}> 
		// 		{pinButton}
		// 		<div key={this.props.item.title} dangerouslySetInnerHTML = {parent.rawMarkup(this.props.item.src)}/> 
		// 	</div> 	

		// ); 

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

// var Gallery = React.createClass({

// 	getInitialState: function(){ 
// 	// here i would get if it is already part of inspirations
// 		return {pinned: this.props.pinned}
// 	}, 

// 	handleClick: function(item){ 
// 		console.log("you've clicked this item", item)
// 		this.props.addInspiration(item)
// 	},

// 	rawMarkup: function(e){ 
// 		return {__html: e}
// 	},

//     render: function () {
// 		var parent = this; 
//         var childElements = this.props.images.map(function(element, i){
//            return (
//            		<div key={'div'+i} className="image-div-class">
// 	                <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
// 	            	<p>{element.title}</p>
// 	            	<a href="" className="button add"> + Add Inspiration</a>
// 	            </div>
//             );
//         });

//         return (
//             <Masonry
//                 className={'my-gallery-class'}
//                 elementType={'div'}
//                 disableImagesLoaded={false}
//             >
//                 {childElements}
//             </Masonry>
//         );
//     }
// });

// 	render: function (){ 
// 		var parent = this;

// 		var pinButton; 
// 		if(this.state.pinned){ 
// 			pinButton = <button> Already Pinned </button>
// 		}
// 		else{ 
// 			pinButton = <button onClick = {this.handleClick.bind(null, this.props.item)}> Pin This Item </button>
// 		}

// 		return(
// 			<div key = {this.props.item.title + "button"}> 
// 				{pinButton}
// 				<div key={this.props.item.title} dangerouslySetInnerHTML = {parent.rawMarkup(this.props.item.src)}/> 
// 			</div> 	

// 		); 
// 	}
// })


module.exports = Feed; 
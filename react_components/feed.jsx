var React = require('react');
// var ReactDOM = require('react-dom');

var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

var Lightbox = require('./lightbox.jsx');

var Masonry = require('./masonry.jsx');

// var Lightbox = require('./react-lightbox.jsx'); 

var masonryOptions = {
    transitionDuration: 0
};

var Feed = React.createClass({ 
	whiteContentStyles: {
        position: 'fixed',
        top: '25%',
        left: '20%',
        right: '50%',
        width: '60vw',
        backgroundColor: '#fff',
        color: '#7F7F7F',
        padding: '20px',
        border: '2px solid #ccc',
        borderRadius: '20px',
        boxShadow: '0 1px 5px #333',
        zIndex:'101'
    },

    blackOverlayStyles: {
        background: 'gray',
        opacity: '.8',
        position: 'fixed',
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
        zIndex: '100'
    },

    closeTagStyles: {
        float: 'right',
        marginTop: '-30px',
        marginRight: '-30px',
        cursor: 'pointer',
        color: '#fff',
        border: '1px solid #AEAEAE',
        borderRadius: '30px',
        background: '#605F61',
        fontSize: '31px',
        fontWeight: 'bold',
        display: 'inline-block',
        lineHeight: '0px',
        padding: '11px 3px',
        textDecoration: 'none'
    },

	getInitialState: function(){ 
		return{
			lightboxMode: false,
			images: this.props.feedObjects,
			display: false, 
			tree: {}
		};
	}, 

	checkIfInInspirations: function(object, inspirations){ 
		console.log("these are object and inspirations", object)
		console.log("inspirations now user", inspirations)
		var i; 
		for(i = 0; i < inspirations.length; i++){ 
			if(inspirations[i]._id === object._id){ 
				return true;
			}
		}
		return false; 
	},

	handleClickToAddInspiration: function(item){ 
		console.log("you've clicked this item", item)
		this.props.addInspir(item)
	},

	openLightbox: function(item){ 
		var parent = this; 
		var pieceTree; 
		this.props.getPiece(item, function(tree){ 
			parent.setState({tree: tree})
			parent.setState({display: true});
		});
	},

	closeLightbox: function(){
		this.setState({tree : {}})
        this.setState({display: false});
    },
	rawMarkup: function(e){ 
		return {__html: e}
	},

	componentDidMount: function(){
        document.addEventListener("keydown", function (e) {
            if ( (this.props.display) && (e.keyCode === 27) ){
                this.props.closeLightbox();
            }
        }.bind(this));
    }, 

	render: function(){ 
		var parent = this; 
        var childElements = this.state.images.map(function(element, i){
			var pinButton; 
			if(parent.checkIfInInspirations(element, parent.props.userInspirations)){ 
				pinButton = <button className="button add" disabled> Already Pinned </button>
			}
			else{ 
				pinButton = <button className="button add" onClick = {parent.handleClickToAddInspiration.bind(null, element)}> + Add Inspiration </button>
			}
           return (
           		<div key={'div'+i} className="image-div-class">
	                <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
	            	<p>{element.title}</p>
	            	{pinButton}
	            	<button className = "button expand" onClick = {parent.openLightbox.bind(null, element)}> View </button>
	            </div>
            );
        });

        if (this.state.display){
            return (
            	<div> 
            	<div id="feed"> 
					<Masonry
		                className={'my-gallery-class'}
		                elementType={'div'}
		                disableImagesLoaded={false}
		            >  
		            {childElements}
		            </Masonry>
				</div>
                <div>
                    <div style={this.blackOverlayStyles} onClick={this.closeLightbox} />
                    <div style={this.whiteContentStyles}>
                        <a style={this.closeTagStyles} onClick={this.closeLightbox}>&times;</a>
                        <div className = 'upclose' dangerouslySetInnerHTML={this.rawMarkup(this.state.tree.src)}/>
                    </div> 
            	</div>
            	</div>
            );<div dangerouslySetInnerHTML={this.rawMarkup(this.state.tree.src)}/>
        } else {
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
	}

}); 

module.exports = Feed; 
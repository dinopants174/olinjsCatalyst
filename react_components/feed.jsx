var React = require('react');
// import SearchInput, {createFilter} from 'react-search-input'
// var SearchInput = require('react-search-input'); 
var SearchBar = require('./search.jsx'); 

var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

var Masonry = require('./masonry.jsx');
var Barchart = require('./d3Chart.jsx');

var masonryOptions = {
    transitionDuration: 0
};

var Feed = React.createClass({ 
	whiteContentStyles: {
        position: 'fixed',
        top: '20%',
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
			tree: {},
            expandBoolean: false,
            treeBoolean: false, 
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

	handleClickToAddInspiration: function(item){ 
		this.props.addInspir(item)
	},

	openLightbox: function(item, lightboxType){ 
		var parent = this; 
		var pieceTree; 
        if (lightboxType === 'expand') {
            this.props.getPiece(item, function(tree){ 
                parent.setState({tree: tree})
                parent.setState({display: true})
                parent.setState({expandBoolean: true});
            });
        } else {
            this.props.getPiece(item, function(tree){ 
                parent.setState({tree: tree})
                parent.setState({display: true})
                parent.setState({treeBoolean: true});
            });  
        }
	},

	closeLightbox: function(){
		this.setState({tree : {}})
        this.setState({display: false})
        this.setState({expandBoolean: false})
        this.setState({treeBoolean: false});
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

    pinnedButton: function(item){ 
    	var pinButton; 
			if(this.checkIfInInspirations(item, this.props.userInspirations)){ 
				pinButton = <button className="button add" onClick = {this.props.deleteElement.bind(null, item, "inspirations")} style={{"color":"#999"}}> <i className="fa fa-times" aria-hidden="true"></i> </button>
			}
			else{ 
				pinButton = <button className="button add" onClick = {this.handleClickToAddInspiration.bind(null, item)}> <i className="fa fa-star-o" aria-hidden="true"></i> </button>
			}
			return pinButton
    },

	render: function(){ 
		var parent = this; 
        console.log("images", this.state.images)
        if (this.state.images > 0){ 

        var childElements = this.state.images.map(function(element, i){
		   var pinButton = parent.pinnedButton(element)
           return (
           		<div key={'div'+i} className="image-div-class">
                    <p id="title">{element.title} by {element.author.name}</p>
	                <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
	            	{pinButton}
	            	<button className = "button expand" onClick = {parent.openLightbox.bind(null, element, 'tree')}> <i className="fa fa-tree" aria-hidden="true"></i> </button>
                    <button className = "button expand" onClick = {parent.openLightbox.bind(null, element, 'expand')}> <i className="fa fa-expand" aria-hidden="true"></i> </button>
	            </div>
            );
        });

        return (
        	<div>
                <SearchBar pieces = {this.state.images} pinnedButton = {this.pinnedButton} openLightbox = {this.openLightbox}/>

            	<div id="feed"> 
                    <h2> Feed </h2>
					<Masonry
		                className={'my-gallery-class'}
		                elementType={'div'}
		                disableImagesLoaded={false}
		            >  
		            {childElements}
		            </Masonry>
				</div>
                  {this.state.display ? (
                    <div className="overlay">
                        <div style={this.blackOverlayStyles} onClick={this.closeLightbox} />
                        <div style={this.whiteContentStyles}>
                            <a style={this.closeTagStyles} onClick={this.closeLightbox}>&times;</a>
                            <div className = 'upclose'>
                                <Barchart data={[this.state.tree]} title={this.state.tree.title} />
                            </div>
                            <div> {this.pinnedButton(this.state.tree)}</div>
                        </div> 
                    </div>
                  ) : 
                  null} 
        	</div>
        );
        } 
        else{ 
            return( 
                <h4> No feed posts yet! Welcome to our site! </h4>
            )

        }
	}

}); 

module.exports = Feed; 

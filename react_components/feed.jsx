var React = require('react');
// import SearchInput, {createFilter} from 'react-search-input'
// var SearchInput = require('react-search-input'); 
var Search = require('react-search'); 

var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

var Masonry = require('./masonry.jsx');
var Barchart = require('./d3Chart.jsx');
var DisplayIFrame = require('./displayIFrame.jsx');

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
            keys:[{'author':['fbId', 'name', 'proPic', 'inspirations', 'inspirations', 'uploads']}, 'src', 'date', 'title', 'inspirations', 'inspired'], 
            key:'title',
            searchResults: [],
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


    handleSearchResults: function(input, output){ 
        console.log("input and output" , input, output)
        console.log("search results before", this.state.searchResults)
        this.setState({searchResults: output})
    }, 

	render: function(){ 
		var parent = this; 
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

        var results = this.state.searchResults.map(function(result, i){
            var pinButton = parent.pinnedButton(result);  
            return (
                <div key={'div'+i} className="image-div-class">
                    <p id="title">{result.title} by {result.author.name}</p>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(result.src)}/>
                    {pinButton}
                    <button className = "button expand" onClick = {parent.openLightbox.bind(null, result, 'tree')}> <i className="fa fa-tree" aria-hidden="true"></i> </button>
                    <button className = "button expand" onClick = {parent.openLightbox.bind(null, result, 'expand')}> <i className="fa fa-expand" aria-hidden="true"></i> </button>
                </div>
            ); 
        }); 

        return (
        	<div> 
                <div id = "searchbar">   
                    <div id = "search ">  
                        <h2>Search for Piece by Title </h2>
                        <Search 
                            items={this.state.images} 
                            keys={this.state.keys} 
                            searchKey={this.state.key}
                            placeholder = "Search by title"
                            onChange = {(input, resolve)=> {this.handleSearchResults(input, resolve)}}
                            className = "searchcontainer"/> 
                    </div> 
                    <div> 
                        {(this.state.searchResults.length > 0) ? (
                            <div> 
                                <p> <b> Search Results: </b></p> 
                                {results} 
                            </div>) : 
                        null}
                    </div> 
                </div>

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

}); 

module.exports = Feed; 

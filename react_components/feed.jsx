var React = require('react');
// import SearchInput, {createFilter} from 'react-search-input'
// var SearchInput = require('react-search-input'); 
var SearchBar = require('./search.jsx'); 

var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

var Masonry = require('./masonry.jsx');
var Barchart = require('./d3Chart.jsx');
// var Dropdown = require('./dropdown.jsx'); 

var masonryOptions = {
    transitionDuration: 0
};

var Feed = React.createClass({ 
	whiteContentStyles: {
        position: 'fixed',
        top: '10%',
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
            dropdownBoolean: false, 
            favItem: '',
            keys:[{'author':['fbId', 'name', 'proPic', 'inspirations', 'inspirations', 'uploads']}, 'src', 'date', 'title', 'inspirations', 'inspired'], 
            key:'title',
            searchResults: [],
            newBoard: false,
            newBoardName: '',
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
        console.log("in handle click to add inspiration")
        $("#favButton"+item._id).css({'color' : '#428f89'})
        // THIS WILL CHANGE: this.props.addInspir(item)
        this.openLightbox(item, 'dropdown')
	},

    handleUnclickInspiration: function(item){ 
        this.setState({dropdownItem: ''})
        $("#favButton"+item._id).css({'color' : 'black'})
        this.props.deleteElement.bind(null, item, "inspirations")
    },

	openLightbox: function(item, lightboxType){
        console.log('in open lightbox') 
		var parent = this; 
		var pieceTree; 
        if (lightboxType === 'expand') {
            this.props.getPiece(item, function(tree){ 
                parent.setState({tree: tree})
                parent.setState({display: true})
                parent.setState({expandBoolean: true});
            });
        } 
        if (lightboxType === 'tree'){
            this.props.getPiece(item, function(tree){ 
                parent.setState({tree: tree})
                parent.setState({display: true})
                parent.setState({treeBoolean: true});
            });  
        }
        if (lightboxType === 'dropdown'){
            console.log("is it a dropdown?")
            this.setState({dropdownBoolean: true, favItem: item, display : true, expandBoolean: false, treeBoolean: false, newBoard: false});
        }
	},

	closeLightbox: function(){
		this.setState({tree : {}})
        this.setState({display: false})
        this.setState({expandBoolean: false})
        this.setState({treeBoolean: false})
        this.setState({dropdownBoolean: false})
        this.setState({favItem: ''})
        this.setState({newBoard: false});
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
				pinButton = <button className="button add" onClick = {this.openLightbox.bind(null, item, 'dropdown')} style={{"color":"#999"}}> <i className="fa fa-times" id = {"favButton"+item._id} aria-hidden="true"></i> </button>
			}
			else{ 
				pinButton = <button className="button add" onClick = {this.openLightbox.bind(null, item, 'dropdown')}> <i className="fa fa-star-o" id = {"favButton"+item._id} aria-hidden="true"></i> </button> 

            }
			return pinButton
    },

    makeANewBoard: function(){ this.setState({newBoard: true}) }, 

    handleBoardNameChange: function(e) {
        this.setState({newBoardName: e.target.value});
    },

    saveNewBoard: function(){ 
        console.log('this is the name of the board', this.state.newBoardName);
        this.props.saveNewBoard(this.state.newBoardName);  
    }, 

	render: function(){ 
		var parent = this; 
        var length_images = this.state.images.length;
        if (length_images > 0){ 

            var childElements = this.state.images.map(function(element, i){
    		   var pinButton = parent.pinnedButton(element)
               return (
               		<div key={'div'+i} className="image-div-class">
                        <p id="title">{element.title} by {element.author.name}</p>
    	                <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
                        <div className = "dropdown">  
    	            	{pinButton}
                        </div> 
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
                                {this.state.expandBoolean ? (
                                    <div> 
                                    <div id = "upclose" dangerouslySetInnerHTML={this.rawMarkup(this.state.tree.src)}/>
                                    <div> {this.pinnedButton(this.state.tree)}</div>
                                    </div> 
                                    ): null}
                                {this.state.treeBoolean ? (
                                    <div>
                                    <div className = 'upclose'>
                                        <Barchart data={[this.state.tree]} title={this.state.tree.title} />
                                    </div>
                                    <div> {this.pinnedButton(this.state.tree)}</div>
                                    </div>
                                    ): null}
                                {this.state.dropdownBoolean ? (
                                    <div className='centering-div'>
                                        <h4> Which board do you want to save this piece to? </h4>
                                        <div className="image-div-class">
                                            <p id="title">{this.state.favItem.title} by {this.state.favItem.author.name}</p>
                                            <div dangerouslySetInnerHTML={parent.rawMarkup(this.state.favItem.src)}/>
                                        </div>
                                        <div> 
                                            <h4> <b> Boards </b> </h4>
                                            <div onClick = {this.makeANewBoard}> Make a new Board </div>
                                            {this.state.newBoard ? (
                                                <div id='embed-form'> 
                                                    <p> New Board Name </p> 
                                                    <input type="text" className='embed-code' placeholder="Your name" 
                                                        value={this.state.text} onChange={this.handleBoardNameChange}/> 
                                                    <button onClick = {this.saveNewBoard}> Save </button> 

                                                </div>
                                            ): null}
                                        </div> 
                                    </div> 
                                    ): null}             
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

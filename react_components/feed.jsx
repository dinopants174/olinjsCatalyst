var React = require('react');
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
        height: '80%',
        top: '10%',
        left: '20%',
        right: '50%',
        width: '60vw',
        overflow: 'scroll',
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
        marginTop: '-23spx',
        marginRight: '-17px',
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
        textDecoration: 'none', 
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
            favItem: {},
            keys:[{'author':['fbId', 'name', 'proPic', 'inspirations', 'inspirations', 'uploads']}, 'src', 'date', 'title', 'inspirations', 'inspired'], 
            key:'title',
            searchResults: [],
            newBoard: false,
            newBoardName: '',
            boardsADD: [],
            boardsDELETE: []
		};
	}, 

    componentWillReceiveProps: function() {
        this.setState({tree : {}})
        this.setState({display: false})
        this.setState({expandBoolean: false})
        this.setState({treeBoolean: false})
        this.setState({dropdownBoolean: false})
        this.setState({favItem: {}})
        this.setState({newBoard: false})
        this.setState({newBoardName: ''}),
        this.setState({boardsADD: []})
        this.setState({boardsDELETE: []});
    },

    /* This should be updated to check if it's in any board*/
	checkIfInInspirations: function(object, boards, string){ 
		var i; 
        switch (string){ 
            case "check": 
                for(i = 0; i < boards.length; i++){ 
                    if(this.checkIfObjectInBoard(object, boards[i].pieces, "check")){ 
                        return true; 
                    }
                }
                return false;
                break; 
            case "getid":
                var boardsUsed = []; 
                 for(i = 0; i < boards.length; i++){ 
                    if(this.checkIfObjectInBoard(object, boards[i].pieces)){
                        console.log("item" + object.title + "in" + boards[i].title) 
                        boardsUsed.push(boards[i]._id); 
                    }
                }
                return boardsUsed;
                break;
            default: 
                console.log("wrong string, not accept:", string) 
        }
        
	},

    checkIfObjectInBoard: function(piece, boardPieces){ 
        var i; 
        for(i = 0; i < boardPieces.length; i++){ 
            if(boardPieces[i]._id === piece._id){ 
                return true;
            }
        }
        return false;
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
        } 
        if (lightboxType === 'tree'){
            this.props.getPiece(item, function(tree){ 
                parent.setState({tree: tree})
                parent.setState({display: true})
                parent.setState({treeBoolean: true});
            });  
        }
        if (lightboxType === 'dropdown'){
            this.setState({dropdownBoolean: true, favItem: item, display : true, expandBoolean: false, treeBoolean: false, newBoard: false});
        }
	},

    sortBoardsForMostRecent: function(boards){
        var most_recent_date = boards[0].dateCreated; 
        var sorted_array = []; 

        boards.forEach(function(b){ 
            if (b.dateCreated > most_recent_date){ 
                sorted_array.push(b)
            }
        })
    },

	closeLightbox: function(){
		this.setState({tree : {}})
        this.setState({display: false})
        this.setState({expandBoolean: false})
        this.setState({treeBoolean: false})
        this.setState({dropdownBoolean: false})
        this.setState({favItem: {}})
        this.setState({newBoard: false})
        this.setState({newBoardName: ''}),
        this.setState({boardsADD: []})
        this.setState({boardsDELETE: []});
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
			if(this.checkIfInInspirations(item, this.props.boards, "check")){ 
				pinButton = <button className="button add" style={{"color":"#999"}} onClick = {this.something.bind(null, item)}> <i className="fa fa-times" id = {"favButton"+item._id} aria-hidden="true"></i> </button>
			}
			else{ 
				pinButton = <button className="button add" onClick = {this.openLightbox.bind(null, item, 'dropdown')}> <i className="fa fa-star-o" id = {"favButton"+item._id} aria-hidden="true"></i> </button> 
            }
			return pinButton
    },

    makeANewBoard: function(){ 
        if(this.state.newBoard) { this.setState({newBoard: false}) } 
        else {this.setState({newBoard: true})}
    }, 

    handleBoardNameChange: function(e) {
        this.setState({newBoardName: e.target.value})
    },

    saveNewBoard: function(){ 
        console.log('this is the name of the board', this.state.newBoardName);
        this.setState({newBoard: false})
        this.setState({newBoardName: ''})
        this.props.saveNewBoard(this.state.newBoardName);  
    }, 

    reverseBoards: function(boards){ 
        var reversedBoards = []
        for (var i = 1; i < (boards.length + 1); i++){ 
            reversedBoards.push(boards[boards.length-i])   
        }
        return reversedBoards;             
    },

    updateItemInBoards : function(){    
        console.log("HERE ARE YOU BOARDS", this.state.boardsADD);
        console.log("HERE IS YOUR TYPE BOARDS", typeof(this.state.boardsADD));

        if(this.state.boardsADD.length > 0){ 
            // $("#favButton"+this.state.favItem._id).css({'color' : '#428f89'})
            console.log("about to add" + this.state.favItem.title + "to board" + this.state.boardsADD)
            console.log("boards ADD" + this.state.boardsADD +  "and type:" + typeof(this.state.boardsADD))
            this.props.addInspir(this.state.favItem, this.state.boardsADD) 
        }
        if(this.state.boardsDELETE.length > 0){ 
            console.log("boards to delete in updateiteminboards", this.state.boardsDELETE); 
            this.props.deleteElement(this.state.favItem, "not upload board", this.state.boardsDELETE); 
        }
    },

    handleBoardClickCheck: function(piece, b){
        var index = this.state.boardsADD.indexOf(b._id)
        if ((index ===-1) && (!this.checkIfObjectInBoard(piece, b.pieces, "check"))){ 
            var updatedBoard = this.state.boardsADD; 
            updatedBoard.push(b._id); 
            this.setState({boardsADD: updatedBoard})
            console.log("boards aDD", this.state.boardsADD); 
        }
    }, 

    handleBoardClickUnCheck: function(piece, b){ 
        var index = this.state.boardsADD.indexOf(b._id)

        if(this.checkIfObjectInBoard(piece, b.pieces, "check")){ 
            console.log("going to delete this piece from this board, ", piece.title, "board", b.title)
            var updatedBoardDelete = this.state.boardsDELETE; 
            updatedBoardDelete.push(b._id); 
            this.setState({boardsDELETE: updatedBoardDelete})
        }else if(index > -1){ 
            var arrayToSplice = this.state.boardsADD; 
            arrayToSplice.splice(index, 1); 
            this.setState({boardsADD : arrayToSplice})
        }
    },

    something: function(item){ 
        var boardsWithItem = this.checkIfInInspirations(item, this.props.boards, "getid"); 
        console.log("type of boards with the item", boardsWithItem)
        this.props.deleteElement(item, "not uploads", boardsWithItem); 
    },

	render: function(){ 
		var parent = this; 
        var length_images = this.state.images.length;
        console.log("clicked board ids", this.state.boardsADD); 
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
            console.log("normal", this.props.boards)
            console.log("reversal", this.reverseBoards(this.props.boards))

            var allBoards = this.reverseBoards(this.props.boards).map(function(board){ 
                    if(parent.checkIfObjectInBoard(parent.state.favItem, board.pieces, "check") || (parent.state.boardsADD.indexOf(board._id) > -1)){ 
                        return (
                            <div key = {"inboard" + board._id} className = "panel-body stuff" onClick = {parent.handleBoardClickUnCheck.bind(null, parent.state.favItem, board)}> 
                                {board.title} <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Check_mark_23x20_02.svg/1081px-Check_mark_23x20_02.svg.png"/> 
                            </div> 

                        ); 

                    }else if (!parent.checkIfObjectInBoard(parent.state.favItem, board.pieces, "check") || (parent.state.boardsADD.indexOf(board._id) < 0 )){ 
                        return (
                            <div key = {"inboard" + board._id} className = "panel-body stuff"> 
                                <div key = {"notinboard" + board._id} onClick = {parent.handleBoardClickCheck.bind(null, parent.state.favItem, board)}>
                                    <div id = "boardtitle"> {board.title} </div> 
                                </div>
                            </div> 
                        )
                    }    
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
                                        <div className="image-div-class centering-div">
                                            <p id="title">{this.state.favItem.title} by {this.state.favItem.author.name}</p>
                                            <div dangerouslySetInnerHTML={parent.rawMarkup(this.state.favItem.src)}/>
                                        </div>

                                            <div className="panel panel-default">
                                                <div className="panel-heading">
                                                     <h3 className="panel-title pull-left"> Boards </h3>


                                                    {!this.state.newBoard ? (
                                                        <div>
                                                        <button className="btn btn-default pull-right" onClick = {this.makeANewBoard}> New </button>
                                                        <div className="clearfix"></div>
                                                        </div>

                                                    ): (
                                                        <div>
                                                        <button className="btn btn-default pull-right" onClick = {this.makeANewBoard}> Cancel </button>
                                                        <div className="clearfix"></div>
                                                        <div id='embed-form' className = "panel-body"> 
                                                            <p className = "panel-body"> New Board Name </p> 
                                                            <input type="text" className='embed-code' placeholder="Your name" 
                                                                value={this.state.text} onChange={this.handleBoardNameChange}/> 
                                                            <button onClick = {this.saveNewBoard} className="btn btn-default pull-right"> Make New Board </button> 
                                                        </div>
                                                        </div> 

                                                    )}
                                                </div>
                                            {allBoards}

                                            <button onClick = {this.updateItemInBoards} className="btn btn-default pull-right"> Save </button>
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

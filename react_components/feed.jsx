var React = require('react');

var SearchBar = require('./search.jsx');
var Masonry = require('./masonry.jsx');
var Barchart = require('./d3Chart.jsx');

//Masonry Options need as props for masonry
var masonryOptions = {
    transitionDuration: 0
};

var Feed = React.createClass({

    propTypes: {
        deleteElement: React.PropTypes.func.isRequired,
        addInspir: React.PropTypes.func.isRequired,
        feedObjects: React.PropTypes.array.isRequired,
        getPiece: React.PropTypes.func.isRequired,
        saveNewBoard: React.PropTypes.func.isRequired,
        boards: React.PropTypes.array.isRequired,
    },

    getInitialState: function(){
        return{
            lightboxMode: false,
            allFeedItems: this.props.feedObjects,
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
        };
    },

    rawMarkup: function(e){
        //Input: html code
        //Output: html rendered
        return {__html: e}
    },

    /*LIGHTBOX CODE STARTS HERE */
    //Lightbox css styles below
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

    openLightbox: function(item, lightboxType){
        //Input: item to display in lightbox and boolean for what to display on lightbox
        //Output: lightbox opens

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

    closeLightbox: function(){
        //Input: --
        //Output: reset all the boolean states
        this.setState({tree : {}})
        this.setState({display: false})
        this.setState({expandBoolean: false})
        this.setState({treeBoolean: false})
        this.setState({dropdownBoolean: false})
        this.setState({favItem: {}})
        this.setState({newBoard: false})
        this.setState({newBoardName: ''}),
        this.setState({boardsADD: []})
    },

    componentDidMount: function(){
        //Input: --
        //Output: listen for key click on outside of white box on gray
        document.addEventListener("keydown", function (e) {
            if ( (this.props.display) && (e.keyCode === 27) ){
                this.props.closeLightbox();
            }
        }.bind(this));
    },
    /*LIGHTBOX CODE ENDS HERE */

    /* MAKE NEW BOARD CODE */

    makeANewBoard: function(){
        //Input: --
        //Output: set boolean to display make new board div
        if(this.state.newBoard) { this.setState({newBoard: false}) }
        else {this.setState({newBoard: true})}
    },

    handleBoardNameChange: function(e) {
        //Input: key press event
        //Output: --
        //Saves the board name to the newBoardName state
        this.setState({newBoardName: e.target.value})
    },

    saveNewBoard: function(){
        //Input: --
        //Output: saves new board name, closes the make new board div, and sends new board name to server
        this.setState({newBoard: false})
        this.setState({newBoardName: ''})
        this.props.saveNewBoard(this.state.newBoardName);
    },

    /*SAVE NEW BOARD CODE ENDS HERE */
    /*CHECK IF INSPIRATIONS ARE IN BOARD */
	checkIfInInspirations: function(object, boards, string){
        //Input: piece object, all boards, and which string to check if object in boards or get id of board if object in board
		var i;
        switch (string){
            case "check":
                //This case will check all boards to see if the object is in it
                for(i = 0; i < boards.length; i++){
                    if(this.checkIfObjectInBoard(object, boards[i].pieces, "check")){
                        return true;
                    }
                }
                return false;
                break;
            case "getid":
                //This case will check all boards to see if object is in it and then return the board ids
                var boardsUsed = [];
                 for(i = 0; i < boards.length; i++){
                    if(this.checkIfObjectInBoard(object, boards[i].pieces)){
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
        //Input: item clicked and pieces in each board
        // Output: will return true if piece is amonsgt the board pieces
        var i;
        for(i = 0; i < boardPieces.length; i++){
            if(boardPieces[i]._id === piece._id){
                return true;
            }
        }
        return false;
    },

    /* CHECKING BOARD CODE ENDS HERE */

    /* DISPLAYING AND UPDATING BOARD CODE STARTS HERE */

    reverseBoards: function(boards){
        //Input: all boards from server
        //Output will return the boards in reversed order
        var reversedBoards = []
        for (var i = 1; i < (boards.length + 1); i++){
            reversedBoards.push(boards[boards.length-i])
        }
        return reversedBoards;
    },

    updateItemInBoards : function(){
        //Input: --
        //Output: will be called to reset the boards pop up and add the boards to the server
        if(this.state.boardsADD.length > 0){
            this.setState({tree : {}})
            this.setState({display: false})
            this.setState({expandBoolean: false})
            this.setState({treeBoolean: false})
            this.setState({dropdownBoolean: false})
            this.setState({favItem: {}})
            this.setState({newBoard: false})
            this.setState({newBoardName: ''})
            this.setState({boardsADD: []})
            this.props.addInspir(this.state.favItem, this.state.boardsADD)
        }
    },

    handleBoardClickCheck: function(piece, b){
        //Input: piece that is checked in form and board to pin board to
        //Output: will add the board to boardsADD list, which upon save will save the piece to those boards
        var index = this.state.boardsADD.indexOf(b._id)
        if ((index ===-1) && (!this.checkIfObjectInBoard(piece, b.pieces, "check"))){
            var updatedBoard = this.state.boardsADD;
            updatedBoard.push(b._id);
            this.setState({boardsADD: updatedBoard})
        }
    },

    handleBoardClickUnCheck: function(piece, b){
        //Input: piece to uncheck in form and board to uncheck from
        //Output: will remove the board from list of boards to save piece to
        var index = this.state.boardsADD.indexOf(b._id)

        if(index > -1){
            var arrayToSplice = this.state.boardsADD;
            arrayToSplice.splice(index, 1);
            this.setState({boardsADD : arrayToSplice})
        }
    },

    deleteElementFromFeed: function(item){
        //Input: feed item to delete from board of inspirations
        //Output: will delete the item from all boards of inspirations
        var boardsWithItem = this.checkIfInInspirations(item, this.props.boards, "getid");
        this.props.deleteElement(item, "not uploads", boardsWithItem);
    },

    /* DISPLAYING BOARD LOGIC ENDS HERE */
    /* PIN BUTTON */
    pinnedButton: function(item){
        //Input: piece
        //Output: if it is already saved to a board, display the ability to pin
        //if it is not already saved to a board, display light gray box to add to a board
        var pinButton;
            if(this.checkIfInInspirations(item, this.props.boards, "check")){
                pinButton = <button className="button add" style={{"color":"#999"}} onClick = {this.deleteElementFromFeed.bind(null, item)}> <i className="fa fa-times" id = {"favButton"+item._id} aria-hidden="true"></i> </button>
            }
            else{
                pinButton = <button className="button add" onClick = {this.openLightbox.bind(null, item, 'dropdown')}> <i className="fa fa-star-o" id = {"favButton"+item._id} aria-hidden="true"></i> </button>
            }
            return pinButton
    },
    /*PIN BUTTON CODE ENDS HERE */

	render: function(){
		var parent = this;
        var length_images = this.state.allFeedItems.length;
        if (length_images > 0){

            //Map each feed item to display in card view and give it all the buttons
            var childElements = this.state.allFeedItems.map(function(element, i){
    		   var pinButton = parent.pinnedButton(element)
               return (
               		<div key={'div'+i} className="image-div-class">
                        <p id="title">{element.title} by {element.author.name}</p>
    	                <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
                        <div className = "dropdown">
    	            	{pinButton}
                        </div>
    	            	<button className = "button expand" onClick = {parent.openLightbox.bind(null, element, 'tree')}> <i className="fa fa-tree" aria-hidden="true"></i> </button>
    	            </div>
                );
            });

            //Map each board to display on lightgray box to save piece to board
            var allBoards = this.reverseBoards(this.props.boards).map(function(board){
                    //If a piece is already pinned to a board or in the boardsADD list, then display check next to name to show that it is already added or will be added
                    //also allow ability to remove from boardsADD list if they do not actually want to save it to that board
                    if(parent.checkIfObjectInBoard(parent.state.favItem, board.pieces, "check") || (parent.state.boardsADD.indexOf(board._id) > -1)){
                        return (
                            <div key = {"inboard" + board._id} className = "panel-body stuff" onClick = {parent.handleBoardClickUnCheck.bind(null, parent.state.favItem, board)}>
                                {board.title} <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Check_mark_23x20_02.svg/1081px-Check_mark_23x20_02.svg.png"/>
                            </div>

                        );
                    //Else if piece not in a board or not in boardsADD, then do not display check mark and allow ability add board to boardsADD list
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
                    <SearchBar pieces = {this.state.allFeedItems} pinnedButton = {this.pinnedButton} openLightbox = {this.openLightbox}/>
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
                                                            <div className="container embed-text">
                                                                <p className="input_wrapper2">
                                                                    <input type='text'
                                                                            name="title-name"
                                                                            id ="title-name"
                                                                            value={this.state.text}
                                                                            onChange={this.handleBoardNameChange}/>
                                                                    <label htmlFor="title-name">New Board Name</label>
                                                                </p>
                                                            </div>
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

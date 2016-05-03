var React = require('react');
var ReactDOM = require('react-dom');
var Dashboard = require('./dashboard.jsx');

var Masonry = require('./masonry.jsx');

//Masonry Options need as props for masonry
var masonryOptions = {
    transitionDuration: 0
};

var MyBoard = React.createClass({
                        
    propTypes: {
        showMyBoard: React.PropTypes.func.isRequired,
        switchUploads: React.PropTypes.func.isRequired,
        user: React.PropTypes.object.isRequired,
        subpage: React.PropTypes.string.isRequired,
        uploads: React.PropTypes.array.isRequired,
        myBoardsInspirations: React.PropTypes.array.isRequired,
        deleteElement: React.PropTypes.func.isRequired,
        deleteBoard: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            subpage: this.props.subpage,
            elementnum: [], 
            pieces:[],
            inspirations:[],
            boardId: ''
        };
    },

	rawMarkup: function(elem) {
        //Input: html code 
        //Output: html rendered
    	return { __html: elem };
  	},

    componentWillReceiveProps: function() {
        //If new props are received, states will be reset to account for changed boards
            this.setState({
                subpage: this.props.subpage,
                elementnum: [], 
                pieces: [],
                inspirations: [],
                boardId: ''
            });
    },

    switchInspirations: function(listInspirations, boardId) {
        //switches to inspirations subpage and renders specific list of inspirations for specific board
            this.setState({
                subpage: 'inspirations',
                boardId: boardId,
                inspirations: listInspirations
            });
    },

    toggleElement: function (element, element_id) {
        //If board element is toggled, masonry pieces of that specific board is saved in state (either added or removed depending if 
        //the element was opened or closed)
        var parent = this;
        var board_pieces = (this.props.myBoardsInspirations)[element].pieces;

        //Masonry pieces of specific board made
        var masonryPieces = board_pieces.map(function(piece, j){
            return (
                <div key={'div'+j} className="image-div-class">
                    <strong><p id="title">{piece.title}</p></strong>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(piece.src)}/>
                    <button className = "button expand" onClick = {parent.props.deleteElement.bind(null, piece, "inspirations",[element_id])} style={{"color":"#999"}}><i className="fa fa-times" aria-hidden="true"></i></button>
                </div>
            );
        });

        //masonrypieces variable either added to list of pieces that will be displayed or not displayed
        if ((this.state.elementnum).indexOf(element) > -1) {
            $("#title"+element).removeClass('panel-title arrow-up').addClass('panel-title arrow-down');

            var elementIndex = (this.state.elementnum).indexOf(element);
            var updateElementnum = this.state.elementnum;
            updateElementnum.splice(elementIndex,1);

            var updatePieces = this.state.pieces;
            updatePieces.splice(elementIndex,1);

            this.setState({
                elementnum: updateElementnum, 
                pieces: updatePieces
            });
        } else {
            $("#title"+element).removeClass('panel-title arrow-down').addClass('panel-title arrow-up');

            var updateElementnum = this.state.elementnum;
            updateElementnum.push(element);

            var updatePieces = this.state.pieces;
            updatePieces.push(masonryPieces);

            this.setState({
                elementnum: updateElementnum, 
                pieces: updatePieces
            });
        }
    },

    render: function(){
        var parent = this; 

        //All Upload Elements are automatically added into profile page
        var uploadsElements = this.props.uploads.map(function(element, i){

           return (
                <div key={'div'+i} className="image-div-class">
                    <p id="title">{element.title}</p>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
                    <button className = "button expand" onClick = {parent.props.deleteElement.bind(null, element, "uploads",'none')} style={{"color":"#999"}}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                </div>
            );
        });

        //childElements will either have masonry for each board or not depending on whether or not the elementnum is in this.state.elementnum
        var childElements = this.props.myBoardsInspirations.map(function(element, i){
            //If the list of pieces is greater than 0 (this means that at least one board has been toggled)
            if (parent.state.pieces.length > 0){

                var indexOf_elementnum = (parent.state.elementnum).indexOf(i); //finds if element index even exists in elementnum
                if (indexOf_elementnum > -1){ //if so make masonry displayed under
                        return (
                            <div key={'div'+i} className="container piece2">
                                <div className="panel-heading panel-piece2" onClick={parent.toggleElement.bind(null,i,element._id)}>
                                    <h4 id={"title"+i} className="panel-title arrow-down">
                                          {element.title}
                                    </h4>
                                <button className="deleteBoard" onClick={parent.props.deleteBoard.bind(null,element._id)}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <button onClick={parent.switchInspirations.bind(null,element.pieces,element._id)} className="button board">Carousel View</button>
                                <Masonry
                                    className={'my-gallery-class'}
                                    elementType={'div'}
                                    disableImagesLoaded={false}
                                >
                                    {parent.state.pieces[indexOf_elementnum]}
                                </Masonry>
                            </div>
                        )
                } else { //else just show board without div
                        return (
                            <div key={'div'+i} className="container piece2">
                                <div className="panel-heading panel-piece2" onClick={parent.toggleElement.bind(null,i,element._id)}>
                                    <h4 id={"title"+i} className="panel-title arrow-down">
                                          {element.title}
                                    </h4>
                                <button className="deleteBoard" onClick={parent.props.deleteBoard.bind(null,element._id)}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <div></div>
                            </div>
                        )
                }
            } else { //no toggled pieces, all boards are just regular
                    return (
                        <div key={'div'+i} className="container piece2">
                            <div className="panel-heading panel-piece2" onClick={parent.toggleElement.bind(null,i,element._id)}>
                                <h4 id={"title"+i} className="panel-title arrow-down">
                                      {element.title}
                                </h4>
                            <button className="deleteBoard" onClick={parent.props.deleteBoard.bind(null,element._id)}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                            </div>
                            <div></div>
                        </div>
                    )
            }
        });


        //depending on subpage ("uploads", "inspirations", or "main profile page"), we return different views (could be a lot cleaner with more components)
        if (this.state.subpage === "uploads") {
            var subpage = <div><div className='centering-div'>
                   <h1>My Uploads</h1>
                    <button onClick={this.props.switchMyBoard} className="button board"><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
                </div>
                <Dashboard boardtype={this.state.subpage} boardIdd="none" uploadslist={this.props.uploads} deleteElement={this.props.deleteElement}/></div>
        } else if (this.state.subpage === "inspirations") {
            var subpage = <div><div className='centering-div'>
                <h1>My Inspirations</h1>
                    <button onClick={this.props.switchMyBoard} className="button board"><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
                </div>
                <Dashboard boardtype={this.state.subpage} boardIdd={this.state.boardId} uploadslist={this.state.inspirations} deleteElement={this.props.deleteElement}/></div>
        } else {
            var subpage = <div className='centering-div'>
                    <div className="twitter-widget">
                        <div className="header cf">
                          <a target="_blank" className="avatar"><img src={this.props.user.proPic}/></a>
                                <h2>{this.props.user.name}</h2>
                        </div>
                        <div className='centering-div'>
                           <h1>My Inspirations</h1>
                            <br/>
                            <br/>
                            <div id="inspirationslist-myboard">
                                {childElements}
                            </div>
                        </div>
                        <div className='centering-div'>
                           <h1>My Uploads</h1>
                            <button onClick={this.props.switchUploads} className="button board">Carousel View</button>
                           <Masonry
                            className={'my-gallery-class'}
                            elementType={'div'}
                            disableImagesLoaded={false}
                            >  
                            {uploadsElements}
                            </Masonry>
                        </div>
                    </div>
                </div>
        }

        return(
            <div id= "feed"> 
                {subpage}
            </div>
        ); 
    }
});

module.exports = MyBoard;
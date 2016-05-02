var React = require('react');
var ReactDOM = require('react-dom');
var Dashboard = require('./dashboard.jsx');

var Masonry = require('./masonry.jsx');

var masonryOptions = {
    transitionDuration: 0
};

var MyBoard = React.createClass({

    getInitialState: function() {
        return {
            subpage: this.props.subpage,
            elementnum: [], 
            pieces:[],
            inspirations:[]
        };
    },

	rawMarkup: function(elem) {
    	return { __html: elem };
  	},

    componentWillReceiveProps: function() {
            this.setState({
                subpage: this.props.subpage,
                elementnum: [], 
                pieces: [],
                inspirations: []
            });
    },

    switchInspirations: function(listInspirations) {

            this.setState({
                subpage: 'inspirations',
                inspirations: listInspirations
            });
    },

    toggleElement: function (element, element_id) {
        var parent = this;
        var board_pieces = (this.props.myBoardsInspirations)[element].pieces;
        var masonryPieces = board_pieces.map(function(piece, j){
            return (
                <div key={'div'+j} className="image-div-class">
                    <strong><p id="title">{piece.title}</p></strong>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(piece.src)}/>
                    <button className = "button expand" onClick = {parent.props.deleteElement.bind(null, piece, element_id, "inspirations")} style={{"color":"#999"}}><i className="fa fa-times" aria-hidden="true"></i></button>
                </div>
            );
        });

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
        console.log("this.props.uploads",this.props.uploads);
        console.log("this.props.inspirations",this.props.myBoardsInspirations);

        var uploadsElements = this.props.uploads.map(function(element, i){

           return (
                <div key={'div'+i} className="image-div-class">
                    <p id="title">{element.title}</p>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
                    <button className = "button expand" onClick = {parent.props.deleteElement.bind(null, element, 'none', "uploads")} style={{"color":"#999"}}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                </div>
            );
        });

        var childElements = this.props.myBoardsInspirations.map(function(element, i){
            console.log("element",element);
            if (parent.state.pieces.length > 0){
                var indexOf_elementnum = (parent.state.elementnum).indexOf(i);
                if (indexOf_elementnum > -1){
                    console.log('indexof', indexOf_elementnum);
                        return (
                            <div key={'div'+i} className="container piece2">
                                <div className="panel-heading panel-piece2" onClick={parent.toggleElement.bind(null,i,element._id)}>
                                    <h4 id={"title"+i} className="panel-title arrow-down">
                                          {element.title}
                                    </h4>
                                <button className="deleteBoard" onClick={parent.props.deleteBoard.bind(null,element._id)}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <button onClick={parent.switchInspirations.bind(null,element.pieces)} className="button board">Carousel View</button>
                                <Masonry
                                    className={'my-gallery-class'}
                                    elementType={'div'}
                                    disableImagesLoaded={false}
                                >
                                    {parent.state.pieces[indexOf_elementnum]}
                                </Masonry>
                            </div>
                        )
                } else {
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
            } else {
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


        if (this.state.subpage === "uploads") {
            console.log("at uploads");
            var subpage = <div><div className='centering-div'>
                   <h1>My Uploads</h1>
                    <button onClick={this.props.switchMyBoard} className="button board"><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
                </div>
                <Dashboard boardtype={this.state.subpage} boardId="none" uploadslist={this.props.uploads} deleteElement={this.props.deleteElement}/></div>
        } else if (this.state.subpage === "inspirations") {
            console.log("at inspirations");

            var subpage = <div><div className='centering-div'>
                <h1>My Inspirations</h1>
                    <button onClick={this.props.switchMyBoard} className="button board"><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
                </div>
                <Dashboard boardtype={this.state.subpage} boardId={this.state.boardId} uploadslist={this.state.inspirations} deleteElement={this.props.deleteElement}/></div>
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
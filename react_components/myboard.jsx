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
            elementnum: [], 
            pieces:[]
        };
    },

	rawMarkup: function(elem) {
    	return { __html: elem };
  	},

    toggleElement: function (element) {
        var parent = this;
        var board_pieces = (this.props.myBoardsInspirations)[element].pieces;
        var masonryPieces = board_pieces.map(function(piece, j){
            return (
                <div key={'div'+j} className="image-div-class">
                    <p id="title">{piece.title}</p>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(piece.src)}/>
                </div>
            );
        });

        if ((this.state.elementnum).indexOf(element) > -1) {
            $("#title"+element).removeClass('panel-title arrow-up').addClass('panel-title arrow-down');
            // $("#checkbox-board"+element).css({'display':'block'});

            var elementIndex = (this.state.elementnum).indexOf(element);
            var updateElementnum = this.state.elementnum;
            updateElementnum.splice(elementIndex,1);

            var updatePieces = this.state.pieces;
            updatePieces.splice(elementIndex,1);

            console.log(updateElementnum);
            console.log(updatePieces);

            this.setState({
                elementnum: updateElementnum, 
                pieces: updatePieces
            });
        } else {
            $("#title"+element).removeClass('panel-title arrow-down').addClass('panel-title arrow-up');
            // $("#checkbox-board"+element).css({'display':'none'});

            var updateElementnum = this.state.elementnum;
            updateElementnum.push(element);

            var updatePieces = this.state.pieces;
            updatePieces.push(masonryPieces);

            console.log(updateElementnum);
            console.log(updatePieces);

            this.setState({
                elementnum: updateElementnum, 
                pieces: updatePieces
            });
        }
    },

    render: function(){
        var parent = this; 
        console.log("this.props.uploads",this.props.uploads);
        console.log("this.props.inspirations",this.props.inspirations);
        var uploadsElements = this.props.uploads.map(function(element, i){

           return (
                <div key={'div'+i} className="image-div-class">
                    <p id="title">{element.title}</p>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
                    <button className = "button expand" onClick = {parent.props.deleteElement.bind(null, element, "uploads")} style={{"color":"#999"}}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                </div>
            );
        });

        var sidepanel = function() {

            if(parent.props.myBoardsInspirations.length === 0){ 
                return(<h4> You have no inpirations, bitch. Go make some </h4>)
            }
            else{ 
                var childElements = parent.props.myBoardsInspirations.map(function(element, i){
                    if (parent.state.pieces.length > 0){
                        var indexOf_elementnum = (parent.state.elementnum).indexOf(i);
                        if (indexOf_elementnum > -1){
                            console.log('indexof', indexOf_elementnum);
                                return (
                                    <div key={'div'+i} className="container piece2">
                                        <div className="panel-heading panel-piece" onClick={parent.toggleElement.bind(null,i)}>
                                            <h4 id={"title"+i} className="panel-title arrow-down">
                                                  {element.title}
                                            </h4>
                                        </div>
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
                                        <div className="panel-heading panel-piece" onClick={parent.toggleElement.bind(null,i)}>
                                            <h4 id={"title"+i} className="panel-title arrow-down">
                                                  {element.title}
                                            </h4>
                                        </div>
                                        <div></div>
                                    </div>
                                )
                        }
                    } else {
                            return (
                                <div key={'div'+i} className="container piece2">
                                    <div className="panel-heading panel-piece" onClick={parent.toggleElement.bind(null,i)}>
                                        <h4 id={"title"+i} className="panel-title arrow-down">
                                              {element.title}
                                        </h4>
                                    </div>
                                    <div></div>
                                </div>
                            )
                    }
                });

                return(
                    <div>
                        {childElements}
                    </div>
                )
            }
        }

        if (this.props.subpage === "uploads") {
            var subpage = <div><div className='centering-div'>
                   <h1>My Uploads</h1>
                    <button onClick={this.props.switchMyBoard} className="button board"><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
                </div>
                <Dashboard boardtype={this.props.subpage} uploadslist={this.props.uploads} deleteElement={this.props.deleteElement}/></div>
        } else if (this.props.subpage === "inspirations") {
            var subpage = <div><div className='centering-div'>
                   <h1>My Inspirations</h1>
                    <button onClick={this.props.switchMyBoard} className="button board"><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
                </div>
                <Dashboard boardtype={this.props.subpage} uploadslist={this.props.inspirations} deleteElement={this.props.deleteElement}/></div>
        } else {
            var subpage = <div className='centering-div'>
                    <div className="twitter-widget">
                        <div className="header cf">
                          <a target="_blank" className="avatar"><img src={this.props.user.proPic}/></a>
                                <h2>{this.props.user.name}</h2>
                        </div>
                        <div className='centering-div'>
                           <h1>My Inspirations</h1>
                            <button onClick={this.props.switchInspirations} className="button board">Carousel View</button>
                            <div id="inspirationslist-myboard">
                                {sidepanel()}
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
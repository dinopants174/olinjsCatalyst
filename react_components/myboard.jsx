var React = require('react');
var ReactDOM = require('react-dom');
var Dashboard = require('./dashboard.jsx');

var Masonry = require('./masonry.jsx');

var masonryOptions = {
    transitionDuration: 0
};

var MyBoard = React.createClass({

	rawMarkup: function(elem) {
    	return { __html: elem };
  	},

    render: function(){
        var parent = this; 
        var uploadsElements = this.props.uploads.map(function(element, i){

           return (
                <div key={'div'+i} className="image-div-class">
                    <p id="title">{element.title}</p>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
                    <button className = "button expand" onClick = {parent.props.deleteElement.bind(null, element, "uploads")} style={{"color":"#999"}}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                </div>
            );
        });

        var inspirationsElements = this.props.inspirations.map(function(element, i){

           return (
                <div key={'div'+i} className="image-div-class">
                    <p id="title">{element.title}</p>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(element.src)}/>
                    <button className = "button expand" onClick = {parent.props.deleteElement.bind(null, element, "inspirations")} style={{"color":"#999"}}><i className="fa fa-times" aria-hidden="true"></i></button>
                </div>
            );
        });

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
                           <Masonry
                            className={'my-gallery-class'}
                            elementType={'div'}
                            disableImagesLoaded={false}
                            >  
                            {inspirationsElements}
                            </Masonry>
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
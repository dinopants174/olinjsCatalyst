/* DashboardHistory Component that holds the Carousel*/

var React = require('react');
var Carousel = require('./carouselstuff/carousel.jsx');
var Ease = require('ease-functions');

var DashboardHistory = React.createClass({
    
    propTypes: {
        boardtype: React.PropTypes.string.isRequired,
        boardIdd: React.PropTypes.string.isRequired,
        uploadslist: React.PropTypes.array.isRequired,
        deleteElement: React.PropTypes.func.isRequired,
    },

    getInitialState: function () {
        return {
            width: 400,
            layout: 'classic',
            ease: 'linear',
            duration: 400
        };
    },

    componentWillMount: function () {
        this.onSides = function (event) {
            this.setState( {images: this.state.all_info.slice(0, event.target.value) });
        }.bind(this);
        this.onLayout = function (event) {
            this.setState({layout: event.target.value});
        }.bind(this);
        this.onDuration = function (event) {
            this.setState({duration: parseInt(event.target.value) });
        }.bind(this);
        this.onEase = function (event) {
            this.setState({ease:  event.target.value});
        }.bind(this);
    },

    render: function () {
        return (
            <div className="carouselhistory">
                <div>
                <Carousel all_info={this.props.uploadslist}
                		  width={this.state.width}
                          ease={this.state.ease}
                          duration={this.state.duration}
                          layout={this.state.layout}
                          deleteElement={this.props.deleteElement}
                          boardtype={this.props.boardtype}
                          boardIdd={this.props.boardIdd}/>
                </div>
            </div>
        );
    }
});

module.exports = DashboardHistory; 
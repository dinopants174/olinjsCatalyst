/* Carousel Component with opening imaging functionality, deleting image from user's list of saved images
and onhover display different things*/

var React = require('react');
var Util = require('./util');
var Layout = require('./layout');
var Depot = require('./depot');

var Carousel = React.createClass({
    propTypes: {

    },

    getInitialState: function () {
        return {
            all_info: this.props.all_info,
            figures: Layout[this.props.layout].figures(this.props.width, this.props.all_info, 0),
            rotationY: 0
        };
    },

    rawMarkup: function(e){ 
        return {__html: e}
    },

    openImage: function (imagehref) {
        //open imagehref
        window.open(imagehref);
    },

    componentWillMount: function () {
        this.depot = Depot(this.getInitialState(), this.props, this.setState.bind(this));
        this.onRotate = this.depot.onRotate.bind(this);
    },

    componentWillReceiveProps: function (nextProps) {
        this.depot.onNextProps(nextProps);
    },
    
    render: function () {
        var angle = (2 * Math.PI) / this.state.figures.length;
        var translateZ = -Layout[this.props.layout].distance(this.props.width,
            this.state.figures.length);
        var root = this;
        var figures = this.state.figures.map(function (d, i) {
            var font_size = "3.5vw";
            var headline = $('<textarea />').html(d.all_info.title).text();
            if (headline.length > 55) {
                font_size = "2.5vw";
            };

            return (<figure key={i} style={Util.figureStyle(d)}>
                <div className="imagedashdiv">
                    <div className="imagedash" dangerouslySetInnerHTML={root.rawMarkup(d.all_info.src)}/>
                </div>
            </figure>);
        });
        
        if ((figures).length > 1) {
            return (
                <section className='react-3d-carousel'>
                    <div className='carousel'
                         style={{transform: "translateZ("+translateZ+"px)"}}>
                        {figures}
                    </div>
                    <div className='prev' onClick={Util.partial(this.onRotate,+angle)}></div>
                    <div className='next' onClick={Util.partial(this.onRotate,-angle)}></div>
                </section>
            );
        } else {

            return (
                <section className='react-3d-carousel'>
                    <div className='carousel'
                         style={{transform: "translateZ("+translateZ+"px)"}}>
                        {figures}
                    </div>
                </section>
            );
        }
    }
});
module.exports = Carousel;
var React = require('react');
var Carousel = require('./carousel_overlay.jsx')

var Lightbox = React.createClass({
  componentDidMount: function () {
    this.overlay = document.createElement('div');
    this.overlay.className = 'react-lightbox-overlay';
    this.overlay.addEventListener('webkitTransitionEnd', this.handleOverlayMounting);
  },
  componentWillUnmount: function () {
    this.overlay.removeEventListener('webkitTransitionEnd', this.handleOverlayMounting);
  },
  handleOverlayMounting: function () {
    if (!this.overlay.classList.contains('react-lightbox-overlay-open')) {
      React.unmountComponentAtNode(this.overlay);
      document.body.removeChild(this.overlay);
      window.removeEventListener('click', this.closeCarousel);
    }
  },
  // openCarousel: function (index) {
  //   this.overlay.innerHMTL = '';
  //   this.overlay.className = 'react-lightbox-overlay';
  //   document.body.appendChild(this.overlay);
  //   React.render(Carousel({
  //     pictures: this.props.pictures,
  //     current: index,
  //     keyboard: this.props.keyboard,
  //     controls: this.props.controls,
  //     close: this.closeCarousel
  //   }), this.overlay);
  //   requestAnimationFrame(function () {
  //     this.overlay.classList.add('react-lightbox-overlay-open');
  //     window.addEventListener('click', this.closeCarousel);
  //   }.bind(this));
  // },
  closeCarousel: function () {
    this.overlay.classList.remove('react-lightbox-overlay-open');
  },
  // renderPictures: function (picture, index) {

  //   if (typeof picture === 'string') {
  //     return DOM.div({
  //       key: index,
  //       className: 'react-lightbox-image',
  //       onClick: this.openCarousel.bind(this, index),
  //       style: {
  //         backgroundImage: 'url(' + picture + ')'
  //       }
  //     });
  //   } else {
  //     return DOM.div({
  //       key: index,
  //       className: 'react-lightbox-image',
  //       onClick: this.openCarousel.bind(this, index)
  //     }, picture);
  //   }

  // },
  // render: function () {
  //   return DOM.div({
  //     className: 'react-lightbox'
  //   }, (this.props.previews || this.props.pictures || []).map(this.renderPictures));
  // }


  // render: function(picture, index){ 
  //   if (typeof picture === 'string') {
  //     var thing = <div key: {index} className: 'react-lightbox-image' onClick: this.openCarousel.bind(this, index) style: {
  //         backgroundImage: 'url(' + picture + ')'
  //       }> 
  //       </div>
  //   } 
  //   else{ 
  //     var thing = <div key: {index} className:'react-lightbox-image' onClick: this.openCarousel.bind(this, index)> 
  //       picture </div> 
  //   }

  //   return(
  //     <div className: 'react-lightbox'> 
  //       (this.props.previews || this.props.pictures || []).map(thing); 
  //     </div> 
  //   ); 
  // })

  render: function(){ 
    // this.overlay.innerHMTL = '';
    // this.overlay.className = 'react-lightbox-overlay';
    // document.body.appendChild(this.overlay);
    return (
      <Carousel pictures = {this.props.pictures} current= {this.props.index} keyboard = {this.props.keyboard} controls = {this.props.controls} close = {this.closeCarousel} />
    );
  }
}); 

    // React.render(Carousel({
    //   pictures: this.props.pictures,
    //   current: this.props.index,
    //   keyboard: this.props.keyboard,
    //   controls: this.props.controls,
    //   close: this.closeCarousel
    // }), this.overlay);
    // requestAnimationFrame(function () {
    //   this.overlay.classList.add('react-lightbox-overlay-open');
    //   window.addEventListener('click', this.closeCarousel);
    // }.bind(this));

module.exports = Lightbox;
var React = require('react');

var Carousel = React.createClass({
  getInitialState: function () {
    return {
      previous: null,
      current: this.props.current
    };
  },
  componentWillMount: function () {
    //looking for key down
    if (this.props.keyboard) {
      window.addEventListener('keydown', this.handleKeyboardInput);
    }
  },
  componentWillUnmount: function () {
    if (this.props.keyboard) {
      window.removeEventListener('keydown', this.handleKeyboardInput); 
    }
  },
  handleKeyboardInput: function (event) {
    if (event.keyCode === 37) {
      this.backward();
    }
    if (event.keyCode === 39) {
      this.forward();
    }
    if (event.keyCode === 27) {
      this.props.close();
    }
  },
  getNextIndex: function () {
    return this.props.pictures.length === this.state.current + 1 ? 0 : this.state.current + 1;
  },
  getPreviousIndex: function () {
    return this.state.current === 0 ? this.props.pictures.length - 1 : this.state.current - 1;
  },
  forward: function (event) {
    //moving forward along images
    if (event) {
      event.stopPropagation();
    }
    this.setState({
      previous: this.state.current,
      current: this.getNextIndex()
    });
  },
  backward: function (event) {
    //moving backwards
    if (event) {
      event.stopPropagation();
    }
    this.setState({
      previous: this.state.current,
      current: this.getPreviousIndex()
    });
  },
  isForwarding: function () {
    return this.state.previous === this.getPreviousIndex();
  },
  createInitialPictureClass: function (index) {
    var className = 'react-lightbox-carousel-image';
    if (index === this.getPreviousIndex()) {
      return className += ' react-lightbox-carousel-image-backward';
    }
    if (index === this.state.current) {
      return className;
    }
    if (index === this.getNextIndex()) {
      return className += ' react-lightbox-carousel-image-forward';
    }
  },
  createPictureClass: function (index) {
    var className = 'react-lightbox-carousel-image';

    // Set correct classes based on current index
    if (this.state.previous === null) {
      return this.createInitialPictureClass(index);
    }

    // Normal backword behavior
    if (index === this.state.previous && !this.isForwarding()) {
      return className += ' react-lightbox-carousel-image-forward';
    }

    if (index === this.state.current) {
      return className;
    }

    // Reverse with forward behavior
    if (index === this.state.previous && this.isForwarding()) {
      return className += ' react-lightbox-carousel-image-backward';
    }
    if (this.isForwarding()) {
      return className += ' react-lightbox-carousel-image-forward';
    }

    return className += ' react-lightbox-carousel-image-backward';
  },
  renderPictures: function () {
    return this.props.pictures.map(function (picture, index) {

      if (typeof picture === 'string') {
        // return DOM.div({
        //   key: index,
        //   className: this.createPictureClass(index),
        //   style: {
        //     backgroundImage: 'url(' + picture + ')',
        //     visibility: this.state.previous === index || this.state.current === index ? 'visible' : 'hidden'
        //   }
        // });

    // style: {backgroundImage: 'url(' + picture + ')',
    //         visibility: this.state.previous === index || this.state.current === index ? 'visible' : 'hidden'
        
        return (
          <div key= {index} className = {this.createPictureClass(index)}> 
          </div> 
        );
        
      } else {
        // return DOM.div({
        //   key: index,
        //   className: this.createPictureClass(index),
        //   style: {
        //     visibility: this.state.previous === index || this.state.current === index ? 'visible' : 'hidden'
        //   }
        // }, picture);

        return (
          <div key= {index} className = {this.createPictureClass(index)}> 
            picture
          </div> 
        );
      }
    }, this);
  },
  // renderControls: function () {
  //   if (this.props.controls) {
  //     return React.createFactory(this.props.controls)({
  //       backward: this.backward,
  //       forward: this.forward
  //     });

  //     return  
  //   }
  // },
  render: function () {
    var blah = this.renderPictures();
    return (
      <div className= 'react-lightbox-carousel'>
        {blah}
      </div>
      )
  }
});

module.exports = Carousel; 
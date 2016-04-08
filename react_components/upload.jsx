var React = require('react');
var ReactDOM = require('react-dom');
var Masonry = require('./masonry.jsx');

var Upload = React.createClass({

	getInitialState: function() {
	    return {
	    	title: '',
	     	embedcode: ''
	    };
	},

	handleEmbedChange: function(ev) {
		this.setState({
			embedcode: ev.target.value,
		});
	},

	handleTitleChange: function(ev) {
		this.setState({
			title: ev.target.value,
		});
	},

	rawMarkup: function() {
    	return { __html: this.state.embedcode };
  	},

  	embedCodeRawMarkup: function(e) {
		return {__html: e}
  	},

    render: function(){
    	var parent = this;
    	console.log(this.props.inspirations);
        var childElements = this.props.inspirations.map(function(element, i){
			// var pinButton; 
			// if(parent.checkIfInInspirations(element, parent.props.userInspirations)){ 
			// 	pinButton = <button className="button add" disabled> Already Pinned </button>
			// }
			// else{ 
			// 	pinButton = <button className="button add" onClick = {parent.handleClickToAddToInspiration.bind(null, element)}> + Add Inspiration </button>
			// }
           return (
           		<div key={'div'+i} className="image-div-class">
	                <div dangerouslySetInnerHTML={parent.embedCodeRawMarkup(element.src)}/>
	            	<p>{element.title}</p>
	            </div>
            );
        });

        return (
        	<div>
	        	<h1>Upload</h1>
				<div id='embed-form'>
					<br/>
					<input className='embed-code'
								type='text'
								onChange={this.handleTitleChange} 
								placeholder='Title'/>
					<input className='embed-code'
								type='text'
								onChange={this.handleEmbedChange} 
								placeholder='Embed Code'/>
					<br/>
					<div id='embed-background-grid'>
						<div className="embedplayer" dangerouslySetInnerHTML={this.rawMarkup()} />
					</div>
					<br/>
					<div>
						<h2> Choose Inspirations </h2>
						<div id="feed">
							<Masonry
				                className={'my-gallery-class'}
				                elementType={'div'}
				                disableImagesLoaded={false}
				            >
				                {childElements}
				            </Masonry>
				        </div>
					</div>
					<div className='embed-button'>
						<button id='embed-upload' onClick={this.props.uploadCode.bind(null,this.state)}>Upload</button>
					</div>
				</div>
			</div>
        );
    }
});

module.exports = Upload;
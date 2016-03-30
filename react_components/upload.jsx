var React = require('react');
var ReactDOM = require('react-dom');

var Upload = React.createClass({

	getInitialState: function() {
	    return {
	    	title: '',
	     	embedcode: ''
	    };
	},

	handleEmbed: function() {
		// if (this.state.embedcode.length < 5 || this.state.embedcode.length > 20) {
		// 	this.setState({
		// 		errorMessage: 'Username must be between 5 and 20 characters.'
		// 	});
		// 	return;
		// }
		console.log(this.state.embedcode);
		// handles login with site account
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

    render: function(){
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
					<div className='embed-button'>
						<button id='embed-upload' onClick={this.handleEmbed}>Upload</button>
					</div>
				</div>
			</div>
        );
    }
});

module.exports = Upload;
var React = require('react');
var ReactDOM = require('react-dom');
var Masonry = require('./masonry.jsx');

var Upload = React.createClass({

	getInitialState: function() {
	    return {
	    	title: '',
	     	embedcode: '',
	     	checkedInspirations: [],
	    };
	},

    convertMedia: function(html){
        var pattern1 = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
        var pattern2 = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
        var pattern3 = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:jpg|jpeg|gif|png))/gi;
        
        if(pattern1.test(html)){
           	var replacement = '<iframe width="560" height="315" src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
			var html = html.replace(pattern1, replacement);
        }


        if(pattern2.test(html)){
			var replacement = '<iframe width="560" height="315" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>';
			var html = html.replace(pattern2, replacement);
        } 


        if(pattern3.test(html)){
            var replacement = '<a href="$1" target="_blank"><img class="sml" src="$1" /></a><br />';
            var html = html.replace(pattern3, replacement);
        }

        return html;
    },

	handleEmbedChange: function(ev) {
		console.log(ev.target.value);
		console.log(this.convertMedia(ev.target.value));
		this.setState({
			embedcode: this.convertMedia(ev.target.value),
		});
	},

	handleTitleChange: function(ev) {
		this.setState({
			title: ev.target.value,
		});
	},

	handleCheckedInspir: function(elem_id) {
		if ((this.state.checkedInspirations).indexOf(elem_id) === -1){
			var updatedinspirations = this.state.checkedInspirations.concat([elem_id]);
		} else {
			var updatedinspirations = this.state.checkedInspirations.filter(function(id) { return id != elem_id });
		}
		console.log(updatedinspirations);
		this.setState({
			checkedInspirations: updatedinspirations,
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
        var childElements = this.props.inspirations.map(function(element, i){
           return (
           		<div key={'div'+i} className="inspirations-div-class">
	                <div dangerouslySetInnerHTML={parent.embedCodeRawMarkup(element.src)}/>
	            	<p>{element.title}</p>
	            	<input type="checkbox" onChange={parent.handleCheckedInspir.bind(null, element._id)}value="inpiration"/><br/>
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
						<div id="inspirationslist">
							<Masonry
				                className={'my-gallery-class'}
				                elementType={'div'}
				                disableImagesLoaded={false}
				            >
				                {childElements}
				            </Masonry>
				        </div>
					</div>
					<br/>
					<div className='embed-button'>
						<button id='embed-upload' onClick={this.props.uploadCode.bind(null,this.state)}>Upload</button>
					</div>
				</div>
			</div>
        );
    }
});

module.exports = Upload;
var React = require('react');
var ReactDOM = require('react-dom');
var Masonry = require('./masonry.jsx');

var Upload = React.createClass({

	propTypes: {
	  uploadCode: React.PropTypes.func.isRequired,
	  myBoardsInspirations: React.PropTypes.array.isRequired,  
	},

	getInitialState: function() {
	    return {
	    	title: '',
	     	embedcode: '',
	     	checkedInspirations: [],
	     	elementnum: [], 
	     	pieces:[],
	    };
	},

    convertMedia: function(html){
    	//three different possibilities of patterns for videos (youtube link, vimeo link, png link address, else embed code)
        var pattern1 = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
        var pattern2 = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
        var pattern3 = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:jpg|jpeg|gif|png))/gi;
        
        //tests three patterns to find correct src link for iframe or a href
        if(pattern1.test(html)){
           	var replacement = '<iframe width="560" height="315" src="https://player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
			var html = html.replace(pattern1, replacement);
        }


        if(pattern2.test(html)){
			var replacement = '<iframe width="560" height="315" type="text/html" src="https://www.youtube.com/embed/$1?enablejsapi=1&origin=http://example.com" frameborder="0" allowfullscreen></iframe>';
			var html = html.replace(pattern2, replacement);
        } 


        if(pattern3.test(html)){
            var replacement = '<a href="$1" target="_blank"><img class="sml" src="$1" /></a><br />';
            var html = html.replace(pattern3, replacement);
        }

        //returns the iframe or a href html or regular html code (if none fit)
        return html;
    },

	handleEmbedChange: function(ev) {
		//sets embedcode to the converted embed code
		this.setState({
			embedcode: this.convertMedia(ev.target.value),
		});
	},

	handleTitleChange: function(ev) {
		//sets title every time input changes
		this.setState({
			title: ev.target.value,
		});
	},

	handleCheckedInspir: function(elem_id) {
		//Detects if inspiration is checked and then adds or removes it into updatedinspirations that is then set
        if (document.getElementById('checkbox-piece'+elem_id).checked) {
        	if ((this.state.checkedInspirations).indexOf(elem_id) === -1){
				var updatedinspirations = this.state.checkedInspirations.concat([elem_id]);
			} else {
				var updatedinspirations = this.state.checkedInspirations;
			}
        } else {
        	var updatedinspirations = this.state.checkedInspirations.filter(function(id) { return id != elem_id });
        }

		this.setState({
			checkedInspirations: updatedinspirations,
		});
	},


	handleCheckedBoard: function(board_num) {
		//Detects if board is checked and then adds or removes all inspirations in board to updatedinspirations which also updates checkedinspirations
        if (document.getElementById('checkbox-board'+board_num).checked) {
			var updatedinspirations = this.state.checkedInspirations;
			for (var i = 0, len = this.props.myBoardsInspirations[board_num].pieces.length; i < len; i++) {
				updatedinspirations.push(this.props.myBoardsInspirations[board_num].pieces[i]._id);
			}

			this.setState({
				checkedInspirations: updatedinspirations,
			});
        } else {
			var updatedinspirations = this.state.checkedInspirations;
			for (var i = 0, len = this.props.myBoardsInspirations[board_num].pieces.length; i < len; i++) {
				updatedinspirations.splice(updatedinspirations.indexOf(this.props.myBoardsInspirations[board_num].pieces[i]._id),1);
			}

			this.setState({
				checkedInspirations: updatedinspirations,
			});
        }
	},


	rawMarkup: function() {
        //Input: html code 
        //Output: html rendered
    	return { __html: this.state.embedcode };
  	},

  	embedCodeRawMarkup: function(e) {
        //Input: html code 
        //Output: html rendered
		return {__html: e}
  	},

  	toggleElement: function (element) {
  		//If board is toggled, the pieces of the board are either shown or removed through setting or removing from pieces in state
  		var parent = this;
  		var board_pieces = (this.props.myBoardsInspirations)[element].pieces;
  		var masonryPieces = board_pieces.map(function(piece, j){
			return (
	       		<div key={'div'+j} className="image-div-class">
	            	<strong><p id="title">{piece.title}</p></strong>
					<div dangerouslySetInnerHTML={parent.embedCodeRawMarkup(piece.src)}/>
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

    	//childelements are the boards with masonry depending on whether or not the board was toggled
		var childElements = parent.props.myBoardsInspirations.map(function(element, i){
			if (parent.state.pieces.length > 0){
				var indexOf_elementnum = (parent.state.elementnum).indexOf(i);
				if (indexOf_elementnum > -1){
						return (
							<div key={'div'+i} className="container piece">
				           		<div className="panel-heading panel-piece" onClick={parent.toggleElement.bind(null,i)}>
									<h4 id={"title"+i} className="panel-title arrow-down">
								          {element.title}
									</h4>
					           	</div>
					           	<input type="checkbox" id={'checkbox-board'+i} onChange={parent.handleCheckedBoard.bind(null, i)} value="board"/><br/>
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
							<div key={'div'+i} className="container piece">
				           		<div className="panel-heading panel-piece" onClick={parent.toggleElement.bind(null,i)}>
									<h4 id={"title"+i} className="panel-title arrow-down">
								          {element.title}
									</h4>
					           	</div>
					           	<input type="checkbox" id={'checkbox-board'+i} onChange={parent.handleCheckedBoard.bind(null, i)} value="board"/><br/>
					           	<div></div>
				            </div>
						)
				}
			} else {
					return (
						<div key={'div'+i} className="container piece">
			           		<div className="panel-heading panel-piece" onClick={parent.toggleElement.bind(null,i)}>
								<h4 id={"title"+i} className="panel-title arrow-down">
							          {element.title}
								</h4>
				           	</div>
				           	<input type="checkbox" id={'checkbox-board'+i} onChange={parent.handleCheckedBoard.bind(null, i)} value="board"/><br/>
				           	<div></div>
			            </div>
					)
			}
        });

        return (
        	<div className='centering-div'>
				<div id='embed-form'>
					<h1>Post</h1>
					<br/>
					<div className="container embed-text">
						<p className="input_wrapper">
							<input type='text'
									name="title-name"
									id ="title-name"
									onChange={this.handleTitleChange}/>
							<label htmlFor="title-name">NAME</label>
						</p>
					</div>

					<div className="container embed-text">
						<p className="input_wrapper">
							<input type='text'
									name="embed-name"
									id ="embed-name"
									onChange={this.handleEmbedChange}/>
							<label htmlFor="embed-name">Url/Embed Code</label>
						</p>
						<p>Url/Embed Code Format: Youtube and Vimeo links, SoundCloud Embed Codes (iframes), and Image Addresses (e.g. http://i.imgur.com/Vi6ximE.png)</p>
					</div>
					<br/>
					<div id='embed-background-grid'>
						<div className="embedplayer" dangerouslySetInnerHTML={this.rawMarkup()} />
					</div>
					<br/>
					<div>
						<h2> Choose Boards </h2>
						<div id="inspirationslist">
							{childElements}
				        </div>
					</div>
				</div>
				<div className='embed-button'>
					<button id='embed-upload' onClick={this.props.uploadCode.bind(null,this.state)}>Post</button>
				</div>
			</div>
        );
    }
});

module.exports = Upload;
var React = require('react');
var ReactDOM = require('react-dom');
var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

// var images = ['http://www.google.com/logos/2011/thanksgiving-2011-hp.jpg',
// 'http://searchengineland.com/figz/wp-content/seloads/2014/11/Thanksgiving-2014-Google-logo.png', 
// 'http://www.pawderosa.com/images/puppies.jpg', 
// 'https://i.vimeocdn.com/portrait/10277584_300x300.jpg', 
// 'http://www.tiptopcanning.com/images/big-tomatoes.png']; 


var Feed = React.createClass({ 

	getInitialState: function(){ 
		return{
			images: this.props.feedObjects
		};
	}, 

	rawMarkup: function(e){ 
		return {__html: e}
	},

	render: function(){ 

		var parent = this; 
		var image_divs = this.state.images.map(function(elem, i) {
			return <td key={'td'+i}><div key={'td'+i} dangerouslySetInnerHTML = {parent.rawMarkup(elem.src)}/></td>
		});

		var rows = Array.apply(null, {length: 2}).map(function(elem, i) {
			return <tr key={'tr'+i}>{image_divs.slice(3*(i), 3*(i+1))}</tr>
		})

		return(
			<div id= "feed"> 
				<table id = "feedItems"> 
					<tbody> 
						{rows}
					</tbody>
				</table>
			</div>
		); 
	}

}); 

module.exports = Feed; 
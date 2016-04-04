var React = require('react');
var ReactDOM = require('react-dom');
var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

var Feed = React.createClass({ 

	getInitialState: function(){ 
		return{
			images: this.props.feedObjects
		};
	}, 

	render: function(){ 

		var parent = this; 
		var image_divs = this.state.images.map(function(elem, i) {
			// var boundClick = this.handleClick.bind(this, elem)
			return <td key={'td'+i}><FeedItem item = {elem} addInspiration = {parent.props.addInspir}/></td>
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

var FeedItem = React.createClass({

	getInitialState: function(){ 
	// here i would get if it is already part of inspirations
		return {}
	}, 

	handleClick: function(item){ 
		console.log("you've clicked this item", item)
		this.props.addInspiration(item)
	},

	rawMarkup: function(e){ 
		return {__html: e}
	},

	render: function (){ 
		var parent = this;
		return(
			<div key = {this.props.item.title + "button"}> 
				<button onClick = {this.handleClick.bind(null, this.props.item)}> Pin This Item </button>
				<div key={this.props.item.title} dangerouslySetInnerHTML = {parent.rawMarkup(this.props.item.src)}/> 
			</div> 	

		); 
	}
})


module.exports = Feed; 
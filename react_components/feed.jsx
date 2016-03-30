var React = require('react');
var ReactDOM = require('react-dom');
var dir = require('node-dir'); 
var path = require('path'); 
var fs = require('fs');

var images = ['http://www.google.com/logos/2011/thanksgiving-2011-hp.jpg',
'http://searchengineland.com/figz/wp-content/seloads/2014/11/Thanksgiving-2014-Google-logo.png', 
'http://www.pawderosa.com/images/puppies.jpg', 
'https://i.vimeocdn.com/portrait/10277584_300x300.jpg', 
'http://www.tiptopcanning.com/images/big-tomatoes.png']; 


var Feed = React.createClass({ 

	getInitialState: function(){ 
		console.log("In initial state"); 
		// var result = this.getImagesPath(function(files){ 
		// 	console.log("These are the files", files); 
		// }); 
		// console.log("result", result); 
		return{};
	}, 

	render: function(){ 
		var image_divs = Array.apply(null, {length : 5}).map(function(elem, i) {
			console.log(i)
			console.log(elem)
			console.log('image size', images[i])
			return <td key={'td'+i}><img key={'td'+i} src={images[i]}/></td>
		});

		console.log("image_divs", image_divs)
		var rows = Array.apply(null, {length: 2}).map(function(elem, i) {
			// console.log("slices", image_divs.slice(1*(i), 1*(i+1)))
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
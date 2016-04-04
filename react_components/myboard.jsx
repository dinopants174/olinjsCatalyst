var React = require('react');
var ReactDOM = require('react-dom');

var MyBoard = React.createClass({

	rawMarkup: function(elem) {
    	return { __html: elem };
  	},

    render: function(){
        var parent = this; 
        //rendering the uploads
        console.log("inspirations", this.props.inspirations)
        
        var image_divs = (this.props.uploads).map(function(elem, i) {
            return <td key={'uploads:td'+i}><div key={'uploads:td'+i} dangerouslySetInnerHTML = {parent.rawMarkup(elem.src)}/></td>
        });

        var uploads_rows = Array.apply(null, {length: 2}).map(function(elem, i) {
            return <tr key={'uploads:tr'+i}>{image_divs.slice(3*(i), 3*(i+1))}</tr>
        })

        //rendering the inspirations
        var inspiration_divs = (this.props.inspirations).map(function(elem, i) {
            return <td key={'inspir:td'+i}><div key={'inspir:td'+i} dangerouslySetInnerHTML = {parent.rawMarkup(elem.src)}/></td>
        });

        var inspiration_rows = Array.apply(null, {length: 2}).map(function(elem, i) {
            return <tr key={'inspir:tr'+i}>{inspiration_divs.slice(3*(i), 3*(i+1))}</tr>
        })

        return(
            <div id= "feed"> 
                <table id = "feedItems"> 
                    <tbody> 
                        {uploads_rows}
                        {inspiration_rows}
                    </tbody>
                </table>
            </div>
        ); 
    }
});

module.exports = MyBoard;
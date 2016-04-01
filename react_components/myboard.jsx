var React = require('react');
var ReactDOM = require('react-dom');

var MyBoard = React.createClass({

	rawMarkup: function(elem) {
    	return { __html: elem };
  	},

    render: function(){
        var parent = this; 
        var image_divs = (this.props.uploads).map(function(elem, i) {
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

module.exports = MyBoard;
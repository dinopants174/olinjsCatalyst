// Navigation/header bar on the top of the page. Holds login and search bar
var React = require('react');
var ReactDOM = require('react-dom');

var Navbar = React.createClass({
  propTypes: {

  },
  
  render: function(){
    return (
      <div className="Navbar">
          <ul className="navbar">
            
            <ul className="navbar" style={{float:"right"}}>
              <li className="linav"><a onClick={this.props.switchHome}>Home</a></li>
              <li className="linav"><a onClick={this.props.switchMyBoard}>{this.props.displayName}</a></li>
              <li className="linav logout"><a href="/auth/facebook/logout"><i className="fa fa-facebook">Logout</i></a></li>
            </ul>
          </ul>
      </div>
    );
  }
});

module.exports = Navbar;
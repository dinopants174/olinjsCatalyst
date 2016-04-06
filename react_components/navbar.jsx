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
              <li className="linav dropdown">
                <a className="dropdown-toggle" onClick={this.props.switchMyBoard}>{this.props.displayName}
                <span className="caret"></span></a>
                <ul>
                  <li><a onClick={this.props.switchMyBoardUploads}>My Uploads</a></li>
                  <li><a onClick={this.props.switchMyBoardInspirations}>My Inspirations</a></li>
                </ul>
              </li>  
              <li className="linav logout"><a href="/auth/facebook/logout"><i className="fa fa-facebook">Logout</i></a></li>
            </ul>
          </ul>
      </div>
    );
  }
});

module.exports = Navbar;
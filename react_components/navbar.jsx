// Navigation/header bar on the top of the page. Holds login and search bar
var React = require('react');
var ReactDOM = require('react-dom');

var Navbar = React.createClass({
                        
  propTypes: {
    switchHome: React.PropTypes.func.isRequired,
    switchMyBoard: React.PropTypes.func.isRequired,
    switchMyBoardUploads: React.PropTypes.func.isRequired,
    displayName: React.PropTypes.string.isRequired,
    proPic: React.PropTypes.string.isRequired
  },
  
  collapse: function(){ //do not have this collapse functionality working yet
    document.getElementsByClassName("navbar")[0].classList.toggle("responsive");
  },

  render: function(){
    console.log(this.props);
    return (
      <div className="Navbar">
            <div id="logo">
                <p id="img-title"><img className="img-logo" src="/img/logo_iter2.png" alt=""/>Catalyst</p>
            </div>
            <ul className="navbar" style={{float:"right"}}>
              <li className="linav"><a onClick={this.props.switchHome}>Home</a></li>
              <li className="linav dropdown">
                <a className="dropdown-toggle" onClick={this.props.switchMyBoard}>                
                <img src={this.props.proPic} className="img-circle special-img"/>
                  {this.props.displayName}
                <span className="caret-up"></span></a>
                <ul>
                  <li><a onClick={this.props.switchMyBoardUploads}>My Uploads</a></li>
                  <br/>
                  <li className="last logout"><a href="/auth/facebook/logout"><i className="fa fa-facebook">Logout</i></a></li>
                </ul>
              </li>  
            </ul>
      </div>
    );
  }
});

module.exports = Navbar;
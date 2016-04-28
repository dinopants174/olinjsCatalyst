// Navigation/header bar on the top of the page. Holds login and search bar
var React = require('react');
var ReactDOM = require('react-dom');

var Navbar = React.createClass({
  propTypes: {

  },
  
  collapse: function(){ 
    document.getElementsByClassName("navbar")[0].classList.toggle("responsive");
  },

  render: function(){
    console.log(this.props);
    return (
      <div className="Navbar">
            <div id="logo">
                <img className="img-logo" src="http://placehold.it/140x34/000000/428F89/&amp;text=CATALYST" alt=""/>
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
                  <li><a onClick={this.props.switchMyBoardInspirations}>My Inspirations</a></li>
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
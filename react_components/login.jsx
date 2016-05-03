var React = require('react');
var ReactDOM = require('react-dom');

// Component to control the login page
var loginPage = React.createClass({

	render: function() {
		return (
			<div>
				<div id='login-background-grid'>
				</div>
				<div id="loginpage">
   			 		<form className="login">
  
			  			<fieldset>
				    
				  			<legend className="legend"><img className="img-logo" src="/img/logo_iter2.png" alt=""/>Login</legend>

							<div className="btn-group">
								<a className='btn btn-primary disabled'><i className="fa fa-facebook" style={{"width":"16px", "height":"15px"}}></i></a>
								<a className='btn btn-primary ' href='/auth/facebook' style={{"width":"12em", "margin":"0"}}> Sign in with Facebook</a>
							</div>	
							
							<br/>
							<br/>			        
			  			</fieldset>
			  
					</form>
				</div>
			</div>
		);
	},
});

module.exports = loginPage;
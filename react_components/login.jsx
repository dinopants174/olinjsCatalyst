var React = require('react');
var ReactDOM = require('react-dom');

// Component to control the login page

var loginPage = React.createClass({

	propTypes: {

	},

	onInputFocus: function(input) {
		if (input == 'email') {
			$( "#email" ).animate({"opacity":"0"}, 200);
		} else {
			$( "#password" ).animate({"opacity":"0"}, 200);
		}
	},

	onInputBlur: function(input) {
		if (input == 'email') {
			$( "#email" ).animate({"opacity":"1"}, 200);
		} else {
			$( "#password" ).animate({"opacity":"1"}, 200);
		}
	},

	render: function() {
		return (
			<div>
				<div id='login-background-grid'>
				</div>
				<div id="loginpage">
   			 		<form className="login">
  
			  			<fieldset>
				    
				  			<legend className="legend">Login</legend>
				    
				    		<div className="input">
				    			<input onBlur={this.onInputBlur.bind(null,'email')} onFocus={this.onInputFocus.bind(null,'email')} type="email" placeholder="Email" required />
				      			<span><i id="email" className="fa fa-envelope-o"></i></span>
				    		</div>
				    
				    		<div className="input">
				    			<input onBlur={this.onInputBlur.bind(null,'password')} onFocus={this.onInputFocus.bind(null, 'password')} type="password" placeholder="Password" required />
				      			<span><i id="password" className="fa fa-lock"></i></span>
				    		</div>

							<div className="btn-group">
								<a className='btn btn-primary disabled'><i className="fa fa-facebook" style={{"width":"16px", "height":"15px"}}></i></a>
								<a className='btn btn-primary ' href='/auth/facebook' style={{"width":"12em", "margin":"0"}}> Sign in with Facebook</a>
							</div>	

				    		<button type="submit" className="submit"><i className="fa fa-long-arrow-right"></i></button>
			        
			  			</fieldset>
			  
					</form>
				</div>
			</div>
		);
	},
});

module.exports = loginPage;
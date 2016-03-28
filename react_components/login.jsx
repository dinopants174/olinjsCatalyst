var React = require('react');
var ReactDOM = require('react-dom');

var Login = React.createClass({
    render: function(){
        return (
        	<a href='/auth/facebook'>Login with Facebook</a>
        );
    }
});

module.exports = Login;
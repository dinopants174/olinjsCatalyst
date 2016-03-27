(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Example = require('./example.jsx');
var Login = require('./login.jsx');

var CatalystBox = React.createClass({displayName: "CatalystBox",
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("h1", null, "Welcome to Catalyst"), 
                React.createElement(Example, null), 
                React.createElement(Login, null)
            )
        );
    }
});

ReactDOM.render(
  React.createElement(CatalystBox, null),
  document.getElementById('content')
);
},{"./example.jsx":2,"./login.jsx":3}],2:[function(require,module,exports){
var Example = React.createClass({displayName: "Example",
    render: function(){
        return (
        	React.createElement("p", null, "Hi, hello, I am an example of a react component")
        );
    }
});

module.exports = Example;
},{}],3:[function(require,module,exports){
var Login = React.createClass({displayName: "Login",
    render: function(){
        return (
        	React.createElement("a", {href: "/auth/facebook"}, "Login with Facebook")
        );
    }
});

module.exports = Login;
},{}]},{},[1]);

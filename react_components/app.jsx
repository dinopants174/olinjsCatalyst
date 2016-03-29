var React = require('react');
var ReactDOM = require('react-dom');
var Upload = require('./upload.jsx');
var Navbar = require('./navbar.jsx');
var LoginPage = require('./login.jsx');

var DisplayEnum = Object.freeze({
    DISPLAY_UPLOAD: 0,
    DISPLAY_MYBOARD: 1,
    DISPLAY_HOME: 2,
    DISPLAY_LOGIN: 3,
});

var CatalystBox = React.createClass({

    getInitialState: function() {
        return {
            user: {},
            display: DisplayEnum.DISPLAY_LOGIN,
            displayName: ''
        };
    },

    handleUploadCode: function(username) {

    },

    componentDidMount: function() {
        // this.loginFacebook();
        return null;
    },

    handleUserLogin: function() {
        this.setState({
            display: DisplayEnum.DISPLAY_HOME,
        })
    },

    showUpload: function() {
        console.log("hello")
        this.setState({
            display: DisplayEnum.DISPLAY_UPLOAD,
        });
    },

    showMyBoard: function() {
        this.setState({
            display: DisplayEnum.DISPLAY_MYBOARD,
        });
    },

    showHome: function() {
        this.setState({
            display: DisplayEnum.DISPLAY_HOME,
        });
    },

    render: function() {
        var page;

        // Decide whether to show login page, tinder news wheel, or dashboard
        switch (this.state.display) {
            case DisplayEnum.DISPLAY_UPLOAD:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} switchUpload={this.showUpload} displayName={this.state.user.displayName || ''} />
                        <Upload uploadCode = {this.handleUploadCode} />
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_MYBOARD:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} switchUpload={this.showUpload} displayName={this.state.user.displayName || ''} />
                        <h1>My Board</h1>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_HOME:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} switchUpload={this.showUpload} displayName={this.state.user.displayName || ''} />
                        <h1>Home</h1>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_LOGIN:
                page = (
                    <div>
                        <LoginPage onUserLogin={this.handleUserLogin}/>
                    </div>
                );
                break;
        }

        return (
            <div>
        {page}
            </div>
        );
    }
});

ReactDOM.render(
  <CatalystBox />,
  document.getElementById('content')
);
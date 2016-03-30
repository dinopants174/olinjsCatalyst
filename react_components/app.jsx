var React = require('react');
var ReactDOM = require('react-dom');
var Upload = require('./upload.jsx');
var Navbar = require('./navbar.jsx');
var Feed = require('./feed.jsx'); 

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
            display: DisplayEnum.DISPLAY_UPLOAD,
            displayName: ''
        };
    },

    handleUploadCode: function(username) {

    },

    componentDidMount: function() {
        // this.loginFacebook();
        return null;
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
        console.log("In show home");
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
                        <Upload uploadCode = {this.handleUploadCode}/>
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
                        <h1>Home yooo</h1>
                        <h2> yoooo </h2>
                        <Feed />
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_LOGIN:
                page = (
                    <div>
                        <h1>Login Page</h1>
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
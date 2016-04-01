var React = require('react');
var ReactDOM = require('react-dom');
var Upload = require('./upload.jsx');
var Navbar = require('./navbar.jsx');
var Feed = require('./feed.jsx'); 
var LoginPage = require('./login.jsx');

var MyBoard = require('./myboard.jsx');

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
            displayName: '', 
            feed: []
        };
    },

    handleUploadCode: function(uploadcode) {
        $.ajax({
            url: '/api/user/postUpload2/',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {src: uploadcode.embedcode, title: uploadcode.title},
            success: function(user) {
                this.setState({
                    display: DisplayEnum.DISPLAY_MYBOARD, 
                    user: user,
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/user/postUpload', status, err.toString());
            }.bind(this)
        });
    },

    handleFeed: function(object){ 
        $.ajax({ 
            url: '/api/user/feed',
            dataType: 'json', 
            type: 'GET', 
            success: function(feedItems){ 
                object.display= DisplayEnum.DISPLAY_HOME;
                object.feed = feedItems;
                console.log(object); 
                this.setState(object); 

            }.bind(this), 
            error: function(xhr, status, err){ 
                console.log("cannot get feed, '/api/user/feed'", status, err.toString()); 
            }.bind(this)
        })
    },

    componentDidMount: function() {
        this.loginFacebook();
        return null;
    },

    handleAdd: function(){
        this.setState({
            display: DisplayEnum.DISPLAY_UPLOAD,
        });
    },

    showMyBoard: function() {
        console.log(this.state.user);
        this.setState({
            display: DisplayEnum.DISPLAY_MYBOARD,
        });
    },

    showHome: function() {
        this.handleFeed({}); 
    },

    loginFacebook: function(){
        $.ajax({
            url: '/api/user/2',
            dataType: 'json',
            type: 'GET',
            success: function(user) {
                this.handleFeed({user: user, displayName: user.name});
            }.bind(this),
            error: function(xhr, status, err) {
                console.log("not logged in!")
                this.setState({display: DisplayEnum.DISPLAY_LOGIN});
            }.bind(this)
        });
    },

    render: function() {
        var page;

        // Decide whether to show login page, tinder news wheel, or dashboard
        switch (this.state.display) {
            case DisplayEnum.DISPLAY_UPLOAD:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} displayName={this.state.displayName || ''} />
                        <Upload uploadCode = {this.handleUploadCode} />
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_MYBOARD:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} displayName={this.state.displayName || ''} />
                        <MyBoard uploads={this.state.user.uploads} inspirations={this.state.user.inspirations}/>
                        <input className="add-article" type="button" onClick={this.handleAdd} value="+"/>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_HOME:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} displayName={this.state.displayName || ''} />
                        <Feed feedObjects = {this.state.feed}/>
                        <input className="add-article" type="button" onClick={this.handleAdd} value="+"/>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_LOGIN:
                page = (
                    <div>
                        <LoginPage/>
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
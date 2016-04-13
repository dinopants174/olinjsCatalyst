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
            feed: [],
            subpage: ''
        };
    },

    handleUploadCode: function(uploadcode) {
        $.ajax({
            url: '/api/user/postUpload/',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {src: uploadcode.embedcode, title: uploadcode.title, inspirations: uploadcode.checkedInspirations},
            success: function(user) {
                this.setState({
                    display: DisplayEnum.DISPLAY_HOME, 
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
            url: '/api/pieces/feed',
            dataType: 'json', 
            type: 'GET', 
            success: function(feedItems){ 
                object.display= DisplayEnum.DISPLAY_HOME;
                object.feed = feedItems;
                console.log(object); 
                this.setState(object); 

            }.bind(this), 
            error: function(xhr, status, err){ 
                console.log("cannot get feed, '/api/pieces/feed'", status, err.toString()); 
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
        this.setState({
            display: DisplayEnum.DISPLAY_MYBOARD,
            subpage: 'home',
        });
    },

    showMyBoardInspirations: function() {
        this.setState({
            display: DisplayEnum.DISPLAY_MYBOARD,
            subpage: 'inspirations',
        });
    },

    showMyBoardUploads: function() {
        this.setState({
            display: DisplayEnum.DISPLAY_MYBOARD,
            subpage: 'uploads',
        });
    },

    showHome: function() {
        this.handleFeed({}); 
    },

    loginFacebook: function(){
        $.ajax({
            url: '/api/user/',
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

    addInspiration: function(item){ 
        console.log("you're about to add this inspiration", item)

        $.ajax({ 
            url: '/api/user/postInspiration',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {srcId: item._id}, 
            success: function(userObject){ 
                console.log("alleged user object", userObject)

                userObject.inspirations.forEach(function(i){ 
                    console.log(i)
                })
                
                this.setState({user: userObject}); 
            }.bind(this), 
            error: function(xhr, status, err){ 
                console.log("there has been an error")
                console.error('/api/user/postInspiration', status, err.toString())

            }.bind(this)
        })

    }, 

    deleteInspiration: function(item, boardtype) {
        console.log(boardtype, item);

        if (boardtype==="uploads"){
            console.log(boardtype, item);
        } else {
            $.ajax({ 
                url: '/api/user/deleteInspiration',
                dataType: 'json',
                cache: false,
                type: 'POST',
                data: {srcId: item._id}, 
                success: function(userObject){ 
                    console.log("alleged user object", userObject)

                    userObject.inspirations.forEach(function(i){ 
                        console.log(i)
                    })
                    
                    this.setState({user: userObject}); 
                }.bind(this), 
                error: function(xhr, status, err){ 
                    console.log("there has been an error")
                    console.error('/api/user/postInspiration', status, err.toString())

                }.bind(this)
            }) 
        }
    },

    render: function() {
        var page;

        // Decide whether to show login page, tinder news wheel, or dashboard
        switch (this.state.display) {
            case DisplayEnum.DISPLAY_UPLOAD:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} switchMyBoardInspirations={this.showMyBoardInspirations}
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} />
                        <Upload uploadCode = {this.handleUploadCode} inspirations={this.state.user.inspirations}/>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_MYBOARD:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} switchMyBoardInspirations={this.showMyBoardInspirations}
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} />
                        <button onClick={this.showMyBoardUploads} className="button board">My Uploads</button>
                        <button onClick={this.showMyBoardInspirations} className="button board">My Inspirations</button>
                        <br/>
                        <MyBoard subpage={this.state.subpage} uploads={this.state.user.uploads} inspirations={this.state.user.inspirations} deleteInspir={this.deleteInspiration}/>
                        <input className="add-article" type="button" onClick={this.handleAdd} value="+"/>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_HOME:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} switchMyBoardInspirations={this.showMyBoardInspirations}
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} />
                        <Feed addInspir = {this.addInspiration} feedObjects = {this.state.feed} userInspirations = {this.state.user.inspirations}/>
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
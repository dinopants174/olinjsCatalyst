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
            subpage: '', 
            piece: {}
        };
    },

    handleUploadCode: function(uploadcode) {
        //POST ajax request to post an upload 
        //Input: upload code object with embedcode, title
        //Output: --
        $.ajax({
            url: '/api/user/postUpload/',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {src: uploadcode.embedcode, title: uploadcode.title, inspirations: uploadcode.checkedInspirations},
            success: function(user) {
                this.handleFeed({user : user}); 
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/user/postUpload', status, err.toString());
            }.bind(this)
        });
    },

    handleFeed: function(object){ 
        //GET ajax request to get feed items, and add new display and feed to the object that we are resetting the state with
        //Input: --
        //Output: --
        $.ajax({ 
            url: '/api/pieces/feed',
            dataType: 'json', 
            type: 'GET', 
            success: function(feedItems){ 
                object.display= DisplayEnum.DISPLAY_HOME;
                object.feed = feedItems;
                this.setState(object); 

            }.bind(this), 
            error: function(xhr, status, err){ 
                console.log("cannot get feed, '/api/pieces/feed'", status, err.toString()); 
            }.bind(this)
        })
    },

    createNewBoard: function(boardName){ 
        //POST ajax request to create a new board, and sets state with new user information
        //Input: string of board name
        //Output: --
        $.ajax({
            url: '/api/user/postBoard',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {user: this.state.user, boardTitle: boardName},
            success: function(user) {
                this.setState({user: user})
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/user/postBoard', status, err.toString());
            }.bind(this)
        });  

    },

    componentDidMount: function() {
        //Calls login to facebook as soon as component is mounting
        this.loginFacebook();
        return null;
    },

    handleAdd: function(){
        //Changes the display to the upload page
        this.setState({
            display: DisplayEnum.DISPLAY_UPLOAD,
        });
    },

    showMyBoard: function() {
        //Changes the display to myboard profile page home
        this.setState({
            display: DisplayEnum.DISPLAY_MYBOARD,
            subpage: 'home',
        });
    },

    showMyBoardUploads: function() {
        //Changes the display to my board uploads page
        this.setState({
            display: DisplayEnum.DISPLAY_MYBOARD,
            subpage: 'uploads',
        });
    },

    showHome: function() {
        //calls handleFeed to show the home page
        this.handleFeed({}); 
    },

    loginFacebook: function(){
        //GET ajax request to call handlefeed and put in the user information and displayname obtained from getting user info
        //Input: --
        //Output: --
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

    addInspiration: function(piece, boards){ 
        //POST ajax request to add inspiration to a list of boards, and resetting the user objects
        //Input: piece object and list of board ids
        //Output: --
        $.ajax({ 
            url: '/api/user/postInspiration',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {srcId: piece._id, boardIds: boards}, 
            success: function(user){ 
                this.setState({user: user}); 
            }.bind(this), 
            error: function(xhr, status, err){ 
                console.log("there has been an error")
                console.error('/api/user/postInspiration', status, err.toString())
            }.bind(this)
        })
    }, 

    getPieceAndTree: function(item, callback){ 
        //GET ajax request to get the piece tree information and callsback the tree info
        //Input: item object
        //Output: piece tree item
        $.ajax({ 
            url: '/api/pieces/getPiece/'+ item._id, 
            dataType: 'json', 
            type: 'GET', 
            success: function(piece){ 
                return callback(piece)
            }.bind(this), 
            error: function(xhr, status, err) {
                console.log("error displaying piece")
            }.bind(this)
        })
    }, 

    deleteBoard: function(item_id){
        //POST ajax request to delete board using board id and sets state of user to new userobject
        //Input: id of item
        //Output: --
        $.ajax({
            url: '/api/user/deleteBoard',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {boardId: item_id},
            success: function(userObject) {
                this.setState({user: userObject}); 
            }.bind(this),
            error: function(xhr, status, err){
                console.error('/api/user/deleteBoard', status, err.toString());
            }.bind(this)   
        });
    },

    deleteElement: function(item, boardtype, boardIds) {
        //POST ajax request to either delete upload or delete inspiration
        //Input: deleting upload with item object, "none" boardIds and boardtype of "uploads"; deleting inspiration with item object,
        //list of board ids and boardtype of "inspiration"
        //Output: --
        if (boardtype==="uploads"){
            $.ajax({
                url: '/api/user/deleteUpload',
                dataType: 'json',
                cache: false,
                type: 'POST',
                data: {srcId: item._id},
                success: function(userObject) {
                    this.setState({user: userObject}); 
                }.bind(this),
                error: function(xhr, status, err){
                    console.error('/api/user/deleteUpload', status, err.toString());
                }.bind(this)   
            });
        } else {
            $.ajax({ 
                url: '/api/user/deleteInspiration',
                dataType: 'json',
                cache: false,
                type: 'POST',
                data: {srcId: item._id, boardIds: boardIds}, 
                success: function(userObject){ 
                    this.setState({user: userObject}); 
                }.bind(this), 
                error: function(xhr, status, err){ 
                    console.log("there has been an error")
                    console.error('/api/user/deleteInspiration', status, err.toString())

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
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard}
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} proPic={this.state.user.proPic}/>
                        <Upload uploadCode = {this.handleUploadCode} myBoardsInspirations={this.state.user.myBoards || []}/>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_MYBOARD:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard}
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} proPic={this.state.user.proPic}/>
                        <br/>
                        <MyBoard switchMyBoard={this.showMyBoard} switchUploads={this.showMyBoardUploads}
                        user={this.state.user} subpage={this.state.subpage} uploads={this.state.user.uploads || []} myBoardsInspirations={this.state.user.myBoards || []} 
                        deleteElement={this.deleteElement} deleteBoard={this.deleteBoard}/>
                        <input className="add-article" type="button" onClick={this.handleAdd} value="+"/>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_HOME:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard}
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} proPic={this.state.user.proPic}/>
                        <Feed deleteElement={this.deleteElement} addInspir = {this.addInspiration} feedObjects = {this.state.feed} getPiece = {this.getPieceAndTree} saveNewBoard = {this.createNewBoard} boards = {this.state.user.myBoards}/>
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
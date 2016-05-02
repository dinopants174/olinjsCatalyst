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

    testAddInspiration: function(){
        $.ajax({
            url: '/api/user/postInspiration',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {srcId: '57253346f40d81a96d0d4271',boardId: '5723c80d1a3e5556251be663'},
            success: function(res){
                console.log("Here is the testaddinspiration: ", res);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/user/postInspiration', status, err.toString());
            }.bind(this)
        });
    },

    testAddBoard: function(){
        $.ajax({
            url: '/api/user/postBoard',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {boardTitle: 'Milk'},
            success: function(res){
                console.log("Here is the testaddinspiration: ", res);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/user/postInspiration', status, err.toString());
            }.bind(this)
        });
    },

    testDeletePiece: function(){
        $.ajax({
            url: '/api/user/deleteUpload',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {srcId: '5712c5032eef20e13588d409'},
            success: function(user) {
                console.log("Updated user: ", user);
            }.bind(this),
            error: function(xhr, status, err){
                console.error('/api/user/deleteUpload', status, err.toString());
            }.bind(this)   
        });
    },

    handleUploadCode: function(uploadcode) {
        $.ajax({
            url: '/api/user/postUpload/',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {src: uploadcode.embedcode, title: uploadcode.title, inspirations: uploadcode.checkedInspirations},
            success: function(user) {
                // this.setState({
                //     display: DisplayEnum.DISPLAY_HOME, 
                //     user: user,
                // });
                this.handleFeed({user : user}); 
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
                console.log('feed items', feedItems)
                object.feed = feedItems;
                console.log("object", object); 
                this.setState(object); 

            }.bind(this), 
            error: function(xhr, status, err){ 
                console.log("cannot get feed, '/api/pieces/feed'", status, err.toString()); 
            }.bind(this)
        })
    },

    createNewBoard: function(boardName){ 
        console.log("about to save this board:", boardName); 
        $.ajax({
            url: '/api/user/postBoard',
            dataType: 'json',
            cache: false,
            type: 'POST',
            data: {user: this.state.user, boardTitle: boardName},
            success: function(user) {
                console.log("new user after saving board", user)
                this.setState({user: user})
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/user/postBoard', status, err.toString());
            }.bind(this)
        });  

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

    addInspiration: function(piece, boards){ 
        console.log("you're about to add this inspiration" + piece + "to these boards:" + boards)

        // $.ajax({ 
        //     url: '/api/user/postInspiration',
        //     dataType: 'json',
        //     cache: false,
        //     type: 'POST',
        //     data: {srcId: piece._id, boardId: board._id }, 
        //     success: function(user){ 
        //         console.log(user)
        //         this.setState({user: user}); 
        //     }.bind(this), 
        //     error: function(xhr, status, err){ 
        //         console.log("there has been an error")
        //         console.error('/api/user/postInspiration', status, err.toString())
        //     }.bind(this)
        // })
    }, 

    getPieceAndTree: function(item, callback){ 
        console.log("You're about to get this item", item)
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

    deleteElement: function(item, boardtype) {

        if (boardtype==="uploads"){
            console.log("here");
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
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} proPic={this.state.user.proPic}/>
                        <Upload uploadCode = {this.handleUploadCode} myBoardsInspirations={this.state.user.myBoards || []}/>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_MYBOARD:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} switchMyBoardInspirations={this.showMyBoardInspirations}
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} proPic={this.state.user.proPic}/>
                        <br/>
                        <MyBoard switchMyBoard={this.showMyBoard} switchUploads={this.showMyBoardUploads} switchInspirations={this.showMyBoardInspirations} 
                        user={this.state.user} subpage={this.state.subpage} uploads={this.state.user.uploads || []} myBoardsInspirations={this.state.user.myBoards || []} 
                        deleteElement={this.deleteElement}/>
                        <input className="add-article" type="button" onClick={this.handleAdd} value="+"/>
                    </div>
                );
                break;

            case DisplayEnum.DISPLAY_HOME:
                page = (
                    <div>
                        <Navbar switchHome={this.showHome} switchMyBoard={this.showMyBoard} switchMyBoardInspirations={this.showMyBoardInspirations}
                        switchMyBoardUploads={this.showMyBoardUploads} displayName={this.state.displayName || ''} proPic={this.state.user.proPic}/>
                        <Feed deleteElement={this.deleteElement} addInspir = {this.addInspiration} feedObjects = {this.state.feed} getPiece = {this.getPieceAndTree} saveNewBoard = {this.createNewBoard} boards = {this.state.user.myBoards}/>
                        <input className="add-article" type="button" onClick={this.handleAdd} value="+"/>
                        <button onClick={this.testAddBoard}>Add Board</button> 
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
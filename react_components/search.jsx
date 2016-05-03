var React = require('react'); 
var Search = require('react-search'); 

//SearchBar to filter through different pieces in the feed and display output of search
var SearchBar = React.createClass({

    propTypes: {
        pieces: React.PropTypes.array.isRequired,
        pinnedButton: React.PropTypes.func.isRequired,
        openLightbox: React.PropTypes.func.isRequired,
    },

    getInitialState: function(){ 
		return{ 
			keys:[{'author':['fbId', 'name', 'proPic', 'inspirations', 'inspirations', 'uploads']}, 'src', 'date', 'title', 'inspirations', 'inspired'], 
            key:'title',
            searchResults: [],
		}; 
	}, 

	rawMarkup: function(e){ 
        //Input: html code 
        //Output: html rendered
		return {__html: e}
	},

	handleSearchResults: function(input, output){ 
        //Input: takes input and output of search results and sets searchResults to have the output objects
        //Output: --
        this.setState({searchResults: output})
    }, 

	render: function(){ 
		var parent = this;
		var results = this.state.searchResults.map(function(result, i){
        var pinButton = parent.props.pinnedButton(result);  

        //returns as masonry with image-div-class's
            return (
                <div key={'div'+i} className="image-div-class">
                    <p id="title">{result.title} by {result.author.name}</p>
                    <div dangerouslySetInnerHTML={parent.rawMarkup(result.src)}/>
                    {pinButton}
                    <button className = "button expand" onClick = {parent.props.openLightbox.bind(null, result, 'tree')}> <i className="fa fa-tree" aria-hidden="true"></i> </button>
                    <button className = "button expand" onClick = {parent.props.openLightbox.bind(null, result, 'expand')}> <i className="fa fa-expand" aria-hidden="true"></i> </button>
                </div>
            ); 
        }); 

		return(
			<div> 
				<div id = "searchbar">   
                    <div id = "search ">  
                        <h2>Search for Piece by Title </h2>
                        <Search
                            items={this.props.pieces} 
                            keys={this.state.keys} 
                            searchKey={this.state.key}
                            placeholder = "Search by title"
                            onChange = {(input, resolve)=> {this.handleSearchResults(input, resolve)}}
                            value = "searchcontainer"/> 
                    </div> 
                    <div> 
                        {(this.state.searchResults.length > 0) ? (
                            <div> 
                                <p> <b> Search Results: </b></p> 
                                {results} 
                            </div>) : 
                        null}
                    </div> 
                </div>
			</div>

		)
	}
}); 

module.exports = SearchBar; 
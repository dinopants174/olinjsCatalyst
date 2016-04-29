var React = require('react'); 
var Search = require('react-search'); 

var SearchBar = React.createClass({
	getInitialState: function(){ 
		return{ 
			keys:[{'author':['fbId', 'name', 'proPic', 'inspirations', 'inspirations', 'uploads']}, 'src', 'date', 'title', 'inspirations', 'inspired'], 
            key:'title',
            searchResults: [],
		}; 
	}, 

	rawMarkup: function(e){ 
		return {__html: e}
	},

	handleSearchResults: function(input, output){ 
        console.log("input and output" , input, output)
        console.log("search results before", this.state.searchResults)
        this.setState({searchResults: output})
    }, 

	render: function(){ 
		var parent = this;
		var results = this.state.searchResults.map(function(result, i){
            var pinButton = parent.props.pinnedButton(result);  
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
                            className = "searchcontainer"/> 
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
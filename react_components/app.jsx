var Example = require('./example.jsx');

var CatalystBox = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Welcome to Catalyst</h1>
                <Example />
            </div>
        );
    }
});

ReactDOM.render(
  <CatalystBox />,
  document.getElementById('content')
);
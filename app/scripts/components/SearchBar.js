'use strict';

var React = require('react');

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.searchTextInput.getDOMNode().value
    );
  },
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Søk..."
          value={this.props.searchText}
          ref="searchTextInput"
          onChange={this.handleChange}
          className="u-full-width"
        />
      </form>
    );
  }
});

module.exports = SearchBar;
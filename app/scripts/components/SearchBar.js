'use strict';

var React = require('react');

var SearchBar = React.createClass({
  handleChange: function(e) {
    this.props.onUserInput(
      this.refs.searchTextInput.getDOMNode().value
    );
  },
  handleSearch: function(e) {
    e.preventDefault();
    this.props.onUserSubmit(
      this.refs.searchTextInput.getDOMNode().value
    );
  },
  render: function() {
    return (
      <div className="SearchBar">
      <form onSubmit={this.handleSearch}>
        <input
          type="text"
          placeholder="Søk... skriv søkefrase og avslutt med [Enter]"
          value={this.props.searchText}
          ref="searchTextInput"
          onChange={this.handleChange}
          id="SearchBarInput"
        />
      </form>
        </div>
    );
  }
});

module.exports = SearchBar;
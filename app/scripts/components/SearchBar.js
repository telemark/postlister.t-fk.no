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
      <div className="SearchBar">
      <form>
        <input
          type="text"
          placeholder="Søk... du må bruke minst 3 tegn"
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
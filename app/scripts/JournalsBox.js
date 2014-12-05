'use strict';

var $ = require('jquery');
var React = require('react');
var JournalsList = require('./JournalsList');

var JournalsBox = React.createClass({
  getInitialState: function() {
    return {allJournals:[]};
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      var allJournals = data;
      if (this.isMounted()) {
        this.setState({
          allJournals:allJournals
        });
      }
    }.bind(this));
  },

  render: function() {
    return (
      <div className="vacanciesBox">
        <JournalsList allJournals={this.state.allJournals} />
      </div>
    );
  }
});

module.export = JournalsBox;
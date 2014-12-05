'use strict';

var React = require('react');
var JournalItem = require('./JournalItem');

var JournalsList = React.createClass({
  render: function() {
    return (
      <div className="journalsList">
      {this.props.allJournals.map(function(journal){
        return <JournalItem journal={journal} key={journal.sakId} />;
      })}
      </div>
    );
  }
});

module.exports = JournalsList;
'use strict';

function formatDate(inDate){
  var parseDate = inDate.toString();
  return parseDate.slice(6,8) + '.' + parseDate.slice(4,6) + ' ' + parseDate.slice(0,4);
}

var JournalItem = React.createClass({
  render: function() {
    var journal = this.props.journal;
    return (
      <li className="vacancyItem">
        <span className="vacancyTitle"><a href="https://hrm.btvregion.no/tfk_recruitment" target="_blank">{journal.SA_OFFTITTEL}</a></span>
        <br />
        <span className="vacancyDateDeadline">Journaldato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)}</span>
      </li>
    );
  }
});

var JournalsList = React.createClass({
  render: function() {
    return (
      <ul className="vacanciesList">
      {this.props.allJournals.map(function(journal){
        return <JournalItem journal={journal} key={journal.sakId} />;
      })}
      </ul>
    );
  }
});

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

React.render(
  <JournalsBox source="https://api.t-fk.no/journals" />,
  document.getElementById('journals')
);
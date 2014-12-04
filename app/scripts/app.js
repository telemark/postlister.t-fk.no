'use strict';

function formatDate(inDate){
  return inDate;
}

var JournalItem = React.createClass({
  render: function() {
    var vacancy = this.props.vacancy;
    return (
      <li className="vacancyItem">
        <span className="vacancyTitle"><a href="https://hrm.btvregion.no/tfk_recruitment" target="_blank">{vacancy.SA_OFFTITTEL}</a></span>
        <br />
        <span className="vacancyDateDeadline">Journaldato: {formatDate(vacancy.JOURNPOST_OJ.JP_JDATO)}</span>
      </li>
    );
  }
});

var JournalsList = React.createClass({
  render: function() {
    var limitLength = parseInt(this.props.limitLength || 20, 10);

    return (
      <ul className="vacanciesList">
      {this.props.allVacancies.map(function(vacancy){
        return <JournalItem vacancy={vacancy} key={vacancy.jobid} />;
      })}
      </ul>
    );
  }
});

var JournalsBox = React.createClass({
  getInitialState: function() {
    return {allVacancies:[]};
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      var allVacancies = data;
      if (this.isMounted()) {
        this.setState({
          allVacancies:allVacancies
        });
      }
    }.bind(this));
  },

  render: function() {
    return (
      <div className="vacanciesBox">
        <JournalsList allVacancies={this.state.allVacancies} />
      </div>
    );
  }
});

React.render(
  <JournalsBox source="https://api.t-fk.no/journals" />,
  document.getElementById('journals')
);
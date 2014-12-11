'use strict';

var React = require('react');
var $ = require('jquery');

function formatDate(inDate){
  'use strict';
  var parseDate = inDate.toString();
  return parseDate.slice(6,8) + '.' + parseDate.slice(4,6) + ' ' + parseDate.slice(0,4);
}

function formatDocType(type){
  switch(type){
    case "I":
      return "Innkommende";
    case "U":
      return "Utgående";
    case "X":
      return "Notat";
    case "N":
      return "Notat";
    default:
      return "Ukjent dokumenttype";
  }
}

function formatTilFra(type){
  switch(type){
    case "I":
      return "Fra";
    case "U":
      return "Til";
    default:
      return "Usikker";
  }

}

var JournalDocument = React.createClass({
  render: function(){
    var doc = this.props.doc;
    return (
<div className="journalDocument">
        <a href={doc.DOKBESKRIV_OJ.DOKVERSJON_OJ.VE_FILURL} className="cta--primary">{doc.DOKBESKRIV_OJ.DB_TITTEL}</a>
</div>

    );
  }
});

var JournalItem = React.createClass({
  render: function() {
    var journal = this.props.journal;

    return (
      <div className="journalItem">
        <h2 className="large">{journal.JOURNPOST_OJ.JP_DOKNR} {journal.SA_OFFTITTEL}</h2>
      Dato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)} <br />
      Sak: {journal.SA_OFFTITTEL}<br />
      {formatTilFra(journal.JOURNPOST_OJ.JP_NDOKTYPE)}: {journal.JOURNPOST_OJ.AVSMOT_OJ.AM_NAVN}<br/>
      Dokumentdato: {formatDate(journal.JOURNPOST_OJ.JP_DOKDATO)} Journaldato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)}<br/>
      Dokumentype: {formatDocType(journal.JOURNPOST_OJ.JP_NDOKTYPE)} Tilgangskode: {journal.JOURNPOST_OJ.JP_TGKODE}<br />
      Dokumentansvarlig: {journal.JOURNPOST_OJ.JP_ANSVAVD}<br />
      Saksansvarlig: {journal.SA_ADMKORT}

         <div className="journalDocuments">
         {journal.JOURNPOST_OJ.JP_DOKUMENTER.map(function(doc){
         return <JournalDocument doc={doc} key={doc.DL_DOKID}/>;
         })}
         </div>

      </div>
    );
  }
});

var JournalsList = React.createClass({
  render: function() {
    return (
<div className="journalsList">
      {this.props.allJournals.map(function(journal){
        return <JournalItem journal={journal} key={journal._id} />;
      })}
</div>
    );
  }
});

var JournalsBox = React.createClass({
  getInitialState: function() {
    return {
              allJournals:[],
              allDates: [],
              nowShowing: "sist publiserte"
    };
  },

  componentDidMount: function() {
    $.get(this.props.source + '/journals/latest', function(data) {
      var allJournals = data;
      if (this.isMounted()) {
        this.setState({
          allJournals:allJournals
        });
      }
    }.bind(this));

    $.get(this.props.source + '/journals/date/distinct', function(data) {
      var allDates = data;
      if (this.isMounted()) {
        this.setState({
          allDates:allDates
        });
      }
    }.bind(this));
  },

  handleDateSelect: function(e){
    var date = e.target.value;
    this.getJournalsByDate(date);
  },

  handleDateChange: function(moment, datestring){
    var date = moment.format('YYYYMMDD');
    this.getJournalsByDate(date);
  },

  getJournalsByDate: function(date) {
    $.get(this.props.source + '/journals/date/' + date, function(data) {
      var allJournals = data;
        this.setState({
          allJournals:allJournals,
          nowShowing: formatDate(date)
        });
    }.bind(this));
  },

  render: function() {
    return (
      <div className="journalsBox">
        <h1>Postlister - {this.state.nowShowing}</h1>
<fieldset>
  <label htmlFor="dateSelector" className="dateSelectorLabel">Velg dato</label>
        <select onChange={this.handleDateSelect} id="dateSelector">
{this.state.allDates.map(function(date){
  return (
    <option value={date} key={date} selected="selected">{formatDate(date)}</option>
  )
})}

        </select>
</fieldset>
      <JournalsList allJournals={this.state.allJournals} />
        </div>
    );
  }
});


React.render(
  <JournalsBox source="https://api.t-fk.no" />,
  document.getElementById('journals')
);
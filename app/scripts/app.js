'use strict';

var React = require('react');
var $ = require('jquery');
var cipher = require('util-api-cipher');
var JournalOrderForm = require('./components/JournalOrderForm');
var getArchiveCodes = require('./components/getArchiveCodes');
var SearchBar = require('./components/SearchBar');

function bestillInnsyn(kode){
  if(kode === 'Ugradert'){
    return "hideInnsynsBestilling";
  } else {
    return "showInnsynsBestilling";
  }
}

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

function formatTilFraNavn(type, AVSMOT_OJ){
  var outString = '';

  switch(type){
    case "I":
      outString += "Fra: ";
      break;
    case "U":
      outString += "Til: ";
      break;
    case "N":
      break;
    case "X":
      break;
    default:
      outString += "Usikker: ";
  }

  if(AVSMOT_OJ.PNAVN){
    outString += AVSMOT_OJ.PNAVN + '<br/>';
  } else if(AVSMOT_OJ.AM_NAVN !== ''){
    outString += AVSMOT_OJ.AM_NAVN + '<br/>';
  } else {
    outString += '';
  }

  return outString;
}

var JournalDocument = React.createClass({
  render: function(){
    var doc = this.props.doc;
    return (
<div className="journalDocument">
        <a href={doc.DOKBESKRIV_OJ.DOKVERSJON_OJ.VE_FILURL} className="cta--primary" target="_blank">{doc.DOKBESKRIV_OJ.DB_TITTEL}</a>
</div>

    );
  }
});

var JournalItem = React.createClass({
  render: function() {
    var journal = this.props.journal;

    return (
      <div className="journalItem">
        <h2 className="large">{journal.JOURNPOST_OJ.JP_DOKNR} {journal.JOURNPOST_OJ.JP_OFFINNHOLD}</h2>
      Sak: {journal.SA_OFFTITTEL}<br />
        Saksnummer: {journal.SA_SAKNR}<br />
      <span dangerouslySetInnerHTML={{__html: formatTilFraNavn(journal.JOURNPOST_OJ.JP_NDOKTYPE, journal.JOURNPOST_OJ.AVSMOT_OJ)}} />
      Dokumentdato: {formatDate(journal.JOURNPOST_OJ.JP_DOKDATO)}<br/>
      Journaldato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)}<br/>
      Dokumentnummer: {journal.JOURNPOST_OJ.JP_DOKNR}<br/>
      Dokumenttype: {formatDocType(journal.JOURNPOST_OJ.JP_NDOKTYPE)}<br/>
      Tilgangskode: {journal.JOURNPOST_OJ.JP_TGKODE}<br />
        <span dangerouslySetInnerHTML={{__html: getArchiveCodes(journal.KLASSERING_OJ)}} />
      Dokumentansvarlig: {journal.JOURNPOST_OJ.JP_ANSVAVD}<br />
      Saksansvarlig: {journal.SA_ADMKORT}
      <div className={bestillInnsyn(journal.JOURNPOST_OJ.JP_TGKODE)}>
        <JournalOrderForm journal={journal} />
      </div>
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
              allDepartments: [],
              nowShowing: "sist publiserte",
              selectedDate: '',
              selectedDepartment: '',
              searchText: ''
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
      var latestDate = allDates[allDates.length - 1];
      if (this.isMounted()) {
        this.setState({
          allDates:allDates,
          selectedDate: latestDate
        });
      }
    }.bind(this));

    $.get(this.props.source + '/journals/department/distinct', function(data) {
      var allDepartments = data;
      allDepartments.sort();
      allDepartments.unshift('Alle');
      if (this.isMounted()) {
        this.setState({
          allDepartments:allDepartments
        });
      }
    }.bind(this));
  },

  handleDateSelect: function(e){
    var date = e.target.value;
    var department = this.state.selectedDepartment;
    this.setState({
      selectedDate:date,
      nowShowing:formatDate(date)
    });
    if(department === ''){
      this.getJournalsByDate(date);
    } else {
      var encryptedDepartment = cipher.encrypt(department);
      this.getJournalsByDepartment(encryptedDepartment, date);
    }
  },

  handleDepartmentSelect: function(e){
    var department = e.target.value;
    var date = this.state.selectedDate;
    if(department === 'Alle'){
      this.setState({selectedDepartment:''});
      this.getJournalsByDate(date);
    } else {
      var encryptedDepartment = cipher.encrypt(department);
      this.setState({selectedDepartment:department});
      this.getJournalsByDepartment(encryptedDepartment, date);
    }
  },

  handleSearchInput: function(queryString){
    this.setState({
      searchText: queryString
    });
  },

  handleSearch: function(queryString){
    if (queryString.length >= 3) {
      this.searchJournals(queryString);
    } else if (queryString.length == 0) {
      var date = this.state.selectedDate;
      var department = this.state.selectedDepartment;
      if(department === 'Alle' || department === ''){
        this.getJournalsByDate(date);
      } else {
        var encryptedDepartment = cipher.encrypt(department);
        this.setState({selectedDepartment:department});
        this.getJournalsByDepartment(encryptedDepartment, date);
      }
    }
  },

  getJournalsByDate: function(date) {
    $.get(this.props.source + '/journals/date/' + date, function(data) {
      var allJournals = data;
        this.setState({
          allJournals:allJournals
        });
    }.bind(this));
  },

  getJournalsByDepartment: function(department, date) {
    $.get(this.props.source + '/journals/department/' + department + '?date=' + date, function(data) {
      var allJournals = data;
      this.setState({
        allJournals:allJournals
      });
    }.bind(this));
  },

  searchJournals: function(queryString) {
    $.get(this.props.source + '/journals/' + queryString, function(data) {
      var allJournals = data;
      this.setState({
        allJournals:allJournals
      });
    }.bind(this));
  },

  render: function() {
    return (
      <div className="journalsBox">
        <h1>Postlister - {this.state.nowShowing}</h1>
        <SearchBar
          searchText={this.state.searchText}
          onUserInput={this.handleSearchInput}
          onUserSubmit={this.handleSearch}
        />
<fieldset>
  <label htmlFor="dateSelector" className="dateSelectorLabel">Velg dato</label>
        <select onChange={this.handleDateSelect} id="dateSelector">
{this.state.allDates.map(function(date){
  return (
    <option value={date} key={date} selected="selected">{formatDate(date)}</option>
  )
})}

        </select>

  <label htmlFor="departmentSelector" className="departmentSelectorLabel">Velg avdeling</label>
  <select onChange={this.handleDepartmentSelect} id="departmentSelector">
{this.state.allDepartments.map(function(department){
  return (
    <option value={department} key={department}>{department}</option>
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
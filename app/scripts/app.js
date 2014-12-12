'use strict';

var React = require('react');
var $ = require('jquery');


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

function formatTilFraNavn(AVSMOT_OJ){
  if(AVSMOT_OJ.PNAVN){
    return AVSMOT_OJ.PNAVN;
  } else {
    return AVSMOT_OJ.AM_NAVN;
  }
}


var JournalOrderForm = React.createClass({
  getInitialState: function(){
    return {
      showOrderForm:'hideOrderForm',
      buttonTitle: 'Bestill innsyn',
      innsynBestilt: ''
    }
  },
  buttonHandler: function(e){
    var newState = this.state.showOrderForm === 'hideOrderForm' ? 'showOrderForm' : 'hideOrderForm';
    var newTitle = this.state.buttonTitle === 'Avbryt' ? 'Bestill innsyn' : 'Avbryt';
    this.setState({showOrderForm:newState, buttonTitle: newTitle});
  },
  orderHandler: function(e){
    e.preventDefault();
    this.setState({showOrderForm:'hideOrderForm', buttonTitle: 'Innsyn bestilt'});
  },
  render: function(){
    return (
      <div>
    <button className="button--secondary" onClick={this.buttonHandler}>{this.state.buttonTitle}</button>
      <div className={this.state.showOrderForm}>
        <h3>Innsynsbestilling</h3>
        <form>
          <input type="hidden" name="journalpost" value={this.props.doknr + ' ' + this.props.doktittel} />
          <fieldset>
            <legend>Dokument: {this.props.doknr} {this.props.doktittel}</legend>
          <label htmlFor="bestillersnavn">Navn: </label>
            <input type="text" name="bestillersnavn" placeholder="Fullt navn" autoComplete="name" />
            <label htmlFor="bestillersepost">E-post: </label>
            <input type="text" name="bestillerepost" placeholder="E-post" autoComplete="email" />
            <label htmlFor="bestilleradresse">Postadresse: </label>
            <input type="text" name="bestilleradresse"/>
          </fieldset>
        </form>
          <p>
            Postadresse fylles kun ut dersom du ønsker å motta dokumentene pr post
          </p>
          <button className="button--primary" onClick={this.orderHandler}>Send bestilling</button> <button className="button--secondary" onClick={this.buttonHandler}>Avbryt</button>

      </div>
        </div>
    )
  }
});

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
        <h2 className="large">{journal.JOURNPOST_OJ.JP_DOKNR} {journal.JOURNPOST_OJ.JP_OFFINNHOLD}</h2>
      Dato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)} <br />
      Sak: {journal.SA_OFFTITTEL}<br />
      {formatTilFra(journal.JOURNPOST_OJ.JP_NDOKTYPE)}: {formatTilFraNavn(journal.JOURNPOST_OJ.AVSMOT_OJ)}<br/>
      Dokumentdato: {formatDate(journal.JOURNPOST_OJ.JP_DOKDATO)} Journaldato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)}<br/>
      Dokumentype: {formatDocType(journal.JOURNPOST_OJ.JP_NDOKTYPE)} Tilgangskode: {journal.JOURNPOST_OJ.JP_TGKODE}<br />
      Dokumentansvarlig: {journal.JOURNPOST_OJ.JP_ANSVAVD}<br />
      Saksansvarlig: {journal.SA_ADMKORT}
      <div className={bestillInnsyn(journal.JOURNPOST_OJ.JP_TGKODE)}>
        <JournalOrderForm doknr={journal.JOURNPOST_OJ.JP_DOKNR} doktittel={journal.JOURNPOST_OJ.JP_OFFINNHOLD} />
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
              nowShowing: "sist publiserte",
              selectedDate: ''
    };
  },

  componentDidMount: function() {
    $.get(this.props.source + '/journals/latest', function(data) {
      var allJournals = data;
      var selectedDates = data;
      if (this.isMounted()) {
        this.setState({
          allJournals:allJournals,
          selectedDate: selectedDates.pop()
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
          nowShowing: formatDate(date),
          selectedDate: date
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
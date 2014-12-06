'use strict';

//var React = require('react');
//var $ = require('jquery');

function formatDate(inDate){
  'use strict';
  var parseDate = inDate.toString();
  return parseDate.slice(6,8) + '.' + parseDate.slice(4,6) + ' ' + parseDate.slice(0,4);
}

var JournalDocument = React.createClass({
  render: function(){
    var doc = this.props.doc;
    return (
<div className="journalDocument">
        <a href={doc.DOKBESKRIV_OJ.DOKVERSJON_OJ.VE_FILREF} className="cta--primary clear">{doc.DOKBESKRIV_OJ.DB_TITTEL}</a>
</div>

    );
  }
});

var JournalItem = React.createClass({
  render: function() {
    var journal = this.props.journal;

    return (
      <div className="journalItem clear">
        <span className="large">{journal.JOURNPOST_OJ.JP_DOKNR} {journal.JOURNPOST_OJ.JP_OFFINNHOLD}</span><br/>
      Dato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)} Sak: {journal.SA_OFFTITTEL} Til: {journal.JOURNPOST_OJ.AVSMOT_OJ.AM_NAVN}<br/>
      Dokumentdato: {formatDate(journal.JOURNPOST_OJ.JP_DOKDATO)} Journaldato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)}<br/>
      Dokumentype: {journal.JOURNPOST_OJ.JP_NDOKTYPE} Tilgangskode: {journal.JOURNPOST_OJ.JP_TGKODE}<br />
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
      <div className="journalsBox">
      <JournalsList allJournals={this.state.allJournals} />
        </div>
    );
  }
});


React.render(
  <JournalsBox source="https://api.t-fk.no/journals" />,
  document.getElementById('journals')
);
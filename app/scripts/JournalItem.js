'use strict';

var React = require('react');
var JournalDocument = require('./JournalDocument');
var formatDate = require('./formatDate');

var JournalItem = React.createClass({
  render: function() {
    var journal = this.props.journal;
    return (
      <div className="journalItem">
        <span className="large">{journal.JOURNPOST_OJ.JP_DOKNR} {journal.JOURNPOST_OJ.JP_OFFINNHOLD}</span><br/>
      Dato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)} Sak: {journal.SA_OFFTITTEL} Til: {journal.JOURNPOST_OJ.AVSMOT_OJ.AM_NAVN}<br/>
      Dokumentdato: {formatDate(journal.JOURNPOST_OJ.JP_DOKDATO)} Journaldato: {formatDate(journal.JOURNPOST_OJ.JP_JDATO)}<br/>
      Dokumentype: {journal.JOURNPOST_OJ.JP_NDOKTYPE} Tilgangskode: {journal.JOURNPOST_OJ.JP_TGKODE}<br />
      Dokumentansvarlig: {journal.JOURNPOST_OJ.JP_ANSVAVD}<br />
      Saksansvarlig: {journal.SA_ADMKORT}
        <div>
        {journal.JOURNPOST_OJ.JP_DOKUMENTER.map(function(doc){
          return <JournalDocument doc={doc} />;
        })}
        </div>
      </div>
    );
  }
});

module.exports = JournalItem;
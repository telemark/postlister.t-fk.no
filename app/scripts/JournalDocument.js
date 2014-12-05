'use strict';

var React = require('react');

var JournalDocument = React.createClass({
  render: function(){
    var doc = this.props.doc;
    return (
      <div>
        <a href={doc.DOKBESKRIV_OJ.DOKVERSJON_OJ.VE_FILREF} className="cta--primary">{doc.DOKBESKRIV_OJ.DB_TITTEL}</a>
      </div>

    );
  }
});

module.exports = JournalDocument;
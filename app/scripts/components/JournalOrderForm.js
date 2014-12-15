'use strict';

var React = require('react');
var $ = require('jquery');

var JournalOrderForm = React.createClass({
  getInitialState: function(){
    return {
      showOrderForm:'hideOrderForm',
      buttonTitle: 'Bestill innsyn',
      innsynBestilt: '',
      bestillernavn:'',
      bestillermail:'',
      bestilleraddress:'',
      errormsg:''
    }
  },
  buttonHandler: function(e){
    var newState = this.state.showOrderForm === 'hideOrderForm' ? 'showOrderForm' : 'hideOrderForm';
    var newTitle = this.state.buttonTitle === 'Avbryt' ? 'Bestill innsyn' : 'Avbryt';
    this.setState({showOrderForm:newState, buttonTitle: newTitle});
  },
  orderHandler: function(e){
    e.preventDefault();
    var that = this;
    var mail = {
      subject:'Innsynsbestilling: ' + this.props.doknr + ' ' + this.props.doktittel,
      from: this.state.bestillermail,
      content: this.state.bestillernavn + '\n'+ this.state.bestilleraddress
    };

    $.get('http://ws.t-fk.no/mail.php', mail, function(data){
      console.log(data);
      if(data.results.errorcode === '0'){
        that.setState({showOrderForm:'hideOrderForm', buttonTitle: 'Innsyn bestilt', bestillernavn:'', bestillermail:'', bestilleraddress:''});
      } else {
        var errormsg = 'Noe gikk galt, vennligst kontakt arkivet på <a href="mailto:post.arkiv@t-fk.no">post.arkiv@t-fk.no</a>';
        that.setState({showOrderForm:'hideOrderForm', buttonTitle: 'Bestill innsyn', errormsg: errormsg});
      }
    });

  },
  changeHandlerName: function(e){
    this.setState({bestillernavn : e.target.value});
  },
  changeHandlerMail: function(e){
    this.setState({bestillermail : e.target.value});
  },
  changeHandlerAddress: function(e){
    this.setState({bestilleraddress : e.target.value});
  },
  render: function(){
    return (
      <div>
        <button className="button--secondary" onClick={this.buttonHandler}>{this.state.buttonTitle}</button><span className="orderFormError">{this.state.errormsg}</span>
        <div className={this.state.showOrderForm}>
          <h3>Innsynsbestilling</h3>
          <form onSubmit={this.orderHandler}>
            <fieldset>
              <legend>Dokument: {this.props.doknr} {this.props.doktittel}</legend>
              <label htmlFor="bestillernavn">Navn: </label>
              <input type="text" name="bestillernavn" placeholder="Fullt navn" autoComplete="name" onChange={this.changeHandlerName} />
              <label htmlFor="bestillermail">E-post: </label>
              <input type="text" name="bestillermail" placeholder="E-post" autoComplete="email" onChange={this.changeHandlerMail} />
              <label htmlFor="bestilleraddress">Postadresse: </label>
              <input type="text" name="bestilleraddress" onChange={this.changeHandlerAddress} />
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

module.exports = JournalOrderForm;
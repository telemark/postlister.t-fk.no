'use strict';

var React = require('react');
var $ = require('jquery');

var JournalOrderForm = React.createClass({
  getInitialState: function(){
    return {
      showOrderForm:'hideOrderForm',
      buttonTitle: 'Anmod om innsyn',
      innsynBestilt: '',
      bestillernavn:'',
      bestillermail:'',
      bestillertelefon:'',
      bestillerorganisasjon:'',
      bestillerland:'Norge',
      bestilleraddress:'',
      bestillerzipcode:'',
      bestillercity:'',
      errormsg:''
    }
  },
  buttonHandler: function(e){
    var newState = this.state.showOrderForm === 'hideOrderForm' ? 'showOrderForm' : 'hideOrderForm';
    var newTitle = this.state.buttonTitle === 'Avbryt' ? 'Anmod om innsyn' : 'Avbryt';
    this.setState({showOrderForm:newState, buttonTitle: newTitle});
  },
  orderHandler: function(e){
    e.preventDefault();
    var that = this;
    var payload = {
      navn: this.state.bestillernavn,
      organisasjon: this.state.bestillerorganisasjon,
      land: this.state.bestillerland,
      telefon: this.state.bestillertelefon,
      epost: this.state.bestillermail,
      adresse: this.state.bestilleraddress,
      postnr: this.state.bestillerzipcode,
      poststed: this.state.bestillercity,
      enhet: this.props.journal.JOURNPOST_OJ.JP_ANSVAVD,
      saksnr: this.props.journal.SA_SAKNR,
      dokumentnr: this.props.journal.JOURNPOST_OJ.JP_DOKNR.split('-')[1],
      journalnr: this.props.journal.JOURNPOST_OJ.JP_SEKNR + '/' + this.props.journal.JOURNPOST_OJ.JP_DOKDATO.toString().substr(2,2)
    };

    $.get('https://app.t-fk.no/innsyn.php', payload, function(data){
      if(data.results.errorcode === '0'){
        that.setState({
          showOrderForm:'hideOrderForm',
          buttonTitle: 'Anmodning om innsyn sendt',
          bestillernavn:'',
          bestillermail:'',
          bestillertelefon:'',
          bestillerorganisasjon:'',
          bestillerland:'',
          bestilleraddress:'',
          bestillerzipcode:'',
          bestillercity:''
        });
      } else {
        var errormsg = 'Noe gikk galt, vennligst kontakt arkivet på <a href="mailto:post.arkiv@t-fk.no">post.arkiv@t-fk.no</a>';
        that.setState({
          showOrderForm:'hideOrderForm',
          buttonTitle: 'Anmod om innsyn',
          errormsg: errormsg
        });
      }
    });

  },
  changeHandlerName: function(e){
    this.setState({bestillernavn : e.target.value});
  },
  changeHandlerMail: function(e){
    this.setState({bestillermail : e.target.value});
  },
  changeHandlerPhone: function(e){
    this.setState({bestillertelefon : e.target.value});
  },
  changeHandlerOrganization: function(e){
    this.setState({bestillerorganisasjon : e.target.value});
  },
  changeHandlerCountry: function(e){
    this.setState({bestillerland : e.target.value});
  },
  changeHandlerAddress: function(e){
    this.setState({bestilleraddress : e.target.value});
  },
  changeHandlerZipcode: function(e){
    this.setState({bestillerzipcode : e.target.value});
  },
  changeHandlerCity: function(e){
    this.setState({bestillercity : e.target.value});
  },
  render: function(){
    return (
      <div>
        <button className="button--secondary" onClick={this.buttonHandler}>{this.state.buttonTitle}</button><span className="orderFormError">{this.state.errormsg}</span>
        <div className={this.state.showOrderForm}>
          <h3>Anmodning om innsyn</h3>
          <form onSubmit={this.orderHandler}>
            <fieldset>
              <legend>Dokument: {this.props.journal.JOURNPOST_OJ.JP_DOKNR} {this.props.journal.JOURNPOST_OJ.JP_OFFINNHOLD}</legend>
              <label htmlFor="bestillernavn">Navn: </label>
              <input type="text" name="bestillernavn" placeholder="Fullt navn" autoComplete="name" onChange={this.changeHandlerName} />
              <label htmlFor="bestilleorganisasjon">Organisasjon: </label>
              <input type="text" name="bestillerorganisasjon" placeholder="Organisasjon" autoComplete="organization" onChange={this.changeHandlerOrganization} />
              <label htmlFor="bestilleorland">Land: </label>
              <input type="text" name="bestillerland" placeholder="Land" autoComplete="country" onChange={this.changeHandlerCountry} />
              <label htmlFor="bestillermail">E-post: </label>
              <input type="text" name="bestillermail" placeholder="E-post" autoComplete="email" onChange={this.changeHandlerMail} />
              <label htmlFor="bestillertelefon">Telefon: </label>
              <input type="text" name="bestillertelefon" placeholder="Telefon" autoComplete="phone" onChange={this.changeHandlerPhone} />
              <p>
                Feltene for postadresse fylles kun ut dersom du ønsker å motta dokumentene pr post
              </p>
              <label htmlFor="bestilleraddress">Postadresse: </label>
              <input type="text" name="bestilleraddress" placeholder="Postadresse" autoComplete="address" onChange={this.changeHandlerAddress} />
              <label htmlFor="bestillerzipcode">Postnummer: </label>
              <input type="text" name="bestillerzipcode" placeholder="Postnummer" autoComplete="zipcode" onChange={this.changeHandlerZipcode} />
              <label htmlFor="bestillercity">Poststed: </label>
              <input type="text" name="bestillercity" placeholder="Poststed" autoComplete="city" onChange={this.changeHandlerCity} />
            </fieldset>
          </form>
          <button className="button--primary" onClick={this.orderHandler}>Send anmoding</button> <button className="button--secondary" onClick={this.buttonHandler}>Avbryt</button>

        </div>
      </div>
    )
  }
});

module.exports = JournalOrderForm;
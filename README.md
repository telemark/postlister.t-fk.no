# postlister.t-fk.no

Frontendløsning for postlister.t-fk.no.

Løsningen er laget for å koble seg mot et API som tilsvarer [tfk-api-journals](https://github.com/zrrrzzt/tfk-api-journals)  

## Avhengigheter

Du må ha installert [Node.js](https://nodejs.org), [npm](https://www.npmjs.com/)(blir ofte installert sammen med Node.js), [gulp](http://gulpjs.com/) og [SASS](http://sass-lang.com/) på maskinen som skal bygge løsningen. 
Etter at byggescriptet er kjørt kan mappen **dist** hostes fra en hvilken som helst webserver.

## Installasjon

Fra GitHub

```sh
$ git clone git@github.com:telemark/postlister.t-fk.no.git
```

Gå inn i mappen og kjør setupscriptet

```sh
$ npm run setup
```

## Konfigurasjon

Åpne filen [/app/scripts/app.js](/app/scripts/app.js#L284) i en fritt valgt editor.
Gå til linje 284 og endre ```<JournalsBox source="https://api.t-fk.no" />``` til å peke til din egen api-server

## Utvikling

Start utviklingsserveren

```sh
$ npm run dev
```

## Bygg

Kjør byggescriptet

```sh
$ npm run build
```

Deretter kan du dytte innholdet fra **dist** mappen til en webserver etter eget valg

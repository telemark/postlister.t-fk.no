# postlister.t-fk.no

Frontend for postlister.t-fk.no.

Er laget for å koble seg mot et API som tilsvarer [tfk-api-journals](https://github.com/zrrrzzt/tfk-api-journals)  

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

Deretter kan du dytte innholdet fra dist mappen til en server etter eget valg

# Setting up new Firebase app

``` sh
firebase init
```

## HTTP Functions

See https://firebase.google.com/docs/functions/http-events

``` js
exports.date = functions.https.onRequest((req, res) => {
  // ... To Stuff
  res.status(200).send('Stuff');
});
```
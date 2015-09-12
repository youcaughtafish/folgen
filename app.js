var express = require('express');
var app = express();

var React = require('react'); 
var DOM = React.DOM; 
var body = DOM.body; 
var div = DOM.div; 
var script = DOM.script;

var browserify = require('browserify');

app.set('port', (process.argv[2] || 3000));
app.set('view engine', 'jsx');
app.set('views', __dirname + '/views');
app.engine('jsx', require('express-react-views').createEngine());

require('node-jsx').install();
var FolgenTerminal = require('./views/index.jsx');
var data = {};

app.use('/bundle.js', function(req, res) { 
  res.setHeader('content-type', 'application/javascript'); 
  browserify('./webapp.js') 
    .transform('reactify') 
    .bundle() 
    .pipe(res); 
});

app.use('/', function(req, res) {
  var initialData = JSON.stringify(data); 
  var markup = 
    React.renderToString(
      React.createElement(
        FolgenTerminal, 
        {data: data}
      )
    );

  res.setHeader('Content-Type', 'text/html'); 

  var html = React.renderToStaticMarkup(
    body(null, 
      div({
        id: 'app', 
        dangerouslySetInnerHTML: {
          __html: markup
        }
      }), 
      script({
        id: 'initial-data', 
        type: 'text/plain', 
        'data-json': initialData 
      }), 
      script({src: '/bundle.js'}) 
    )
  );

  res.end(html); 
});

app.listen(app.get('port'), function() {});

console.log('listening on port '+app.get('port'));


console.log("Application starting...");
var express = require('express');
const cookieParser = require("cookie-parser");

var app = express();

app.set('view engine','pug');
app.set('views','./views');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static('./public'));
app.use(require('./routers/index'));

app.listen(process.env.PORT || 3000, function functionName() {
  console.log("Listening...");
})

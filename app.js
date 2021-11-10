const express       = require('express')
const bodyParser    = require("body-parser")
const session       = require('express-session')
const cors          = require('cors')
const fileUpload    = require('express-fileupload')
const cookie        = require('cookie-parser')
const users         = require('./routes/router');
const app           = express()
const port          = process.env.PORT || 3000;


app.set('view engine','ejs')
app.use(fileUpload())
app.use(cors())
app.use(cookie())
app.use(session({ name: 'notifs',secret : 'pesan',resave:false,saveUninitialized:true,cookie:{maxAge:null}}))
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
users(app);

app.listen(port, () => console.log(`port 3000`))
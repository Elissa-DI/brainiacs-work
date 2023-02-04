if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const passport = require('passport')
const app = express()
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config')
const methodOverride = require('method-override')
const mysql2 = require('mysql2')
const router = express.Router()
const multer = require('multer')
const { diskStorage } = require('multer')
const PORT = process.env.PORT || 8080;

const connection = mysql2.createConnection({
    host:'localhost',
    password:'',
    database:'users',
    user:'root'
})

const storage = diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images/uploads')
    },
    filename:function(req,file,cb){
        cb(null,`${file.originalname}`)
    }
})

const upload = multer({ storage })

connection.connect((err)=>{
    if(err) console.log('err found,'+err);
    console.log('db connected!');
})

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
}))
  app.use(passport.initialize())
  app.use(passport.session()) 
  app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
app.post('/login',checkNotAuthenticated, passport.authenticate('local', 
{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
app.post('/register', upload.single('profile_pic'),checkNotAuthenticated, async(req, res) => {
    try {
           const hashedPassword = await bcrypt.hash(req.body.password, 10)
           users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
           })

           let image = req.file.filename


           let sql = `INSERT INTO Our_users (email,name,password, image) VALUES (?,?,?,?) `

           connection.query(sql,[req.body.email,req.body.name,req.body.password, image],(err,result)=>{

            if(err) console.log('error found:',err);
            console.log(result);
           })


           res.redirect('/login')
    } catch {
            res.redirect('/register')
    }
})

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
// })

app.delete('/logout', (req, res) => {
    req.logOut((err) => {
    if (err) {
    console.error(err);
    res.sendStatus(500);
    } else {
    res.redirect('/login');
    }
    });
    });

function checkAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
        return next()
}

res.redirect('/login')
}

function checkNotAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
app.listen(PORT,()=>
{
    console.log(`server running on port ${PORT}`);
}) 
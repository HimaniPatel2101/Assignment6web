// Author
// Name: Himani Manishkumar Patel
// StudentID: 141693200
// Email: hmpatel57@myseneca.ca
const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('./model/User')
const app = express();
const sequelize = require('./DB/connectDB');
const clientSessions = require("client-sessions");
const exphbs = require('express-handlebars');

app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, '/assets')));
app.use(express.static(path.join(__dirname, 'views')));
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}
app.use(clientSessions({
  cookieName: "session",
  secret: "secret_himani",
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60
}));

const port = 3000;

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});
app.get('/assets/logo', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/logo.jpeg'));
});
app.get('/assets/hero', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/hero3.jpeg'));
});
app.get('/assets/plan', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/hero1.jpg'));
});
app.get('/assets/cardlogo1', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/cardlogo1.png'));
});
app.get('/assets/cycle', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/cycle.png'));
});
app.get('/assets/car', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/car.png'));
});
app.get('/assets/rocket', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/rocket.png'));
});
app.get('/assets/cardlogo2', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/cardlogo2.png'));
});
app.get('/assets/cardlogo3', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/cardlogo3.png'));
});
app.get('/assets/cardlogo4', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets/cardlogo4.png'));
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});
app.get('/plans', ensureLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '/views/plans.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/signup.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'));
});


app.get("/logout", function (req, res) {
  req.session.reset();
  res.redirect("/login");
});


app.get("/dashboard/?:f_email/?:f_username/?:f_city", ensureLogin, function (req, res) {
  if (req.params.f_email != null) {
    var someData = {
      email: req.params.f_email,
      username: req.params.f_username,
      city: req.params.f_city,

    };
    res.render('dashboard', {
      data: someData,
      user: req.session.user,
      layout: false
    });
  }
  else {
    res.render('dashboard', {
      data: null,
      layout: false
    });
  }
});
app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
  console.log(req.body, 'keval')
  const email = req.body.f_email;
  const uname = req.body.f_uname;
  const pass = req.body.f_password;
  const dob = req.body.f_dob;
  const street = req.body.f_street;
  const city = req.body.f_city;
  const province = req.body.f_province;

  //hashing the password using bcruptjs
  const password = await bcrypt.hash(pass, 15);
  console.log('hashed password', password);

  sequelize.sync().then(() => {

    //check whether the user is already register
    User.findOne({
      where: {
        email: email,
      }
    }).then((data) => {
      if (data) {
        res.redirect("/signup");
      }
    }).catch((error) => {
      console.log(error);
    })

    // create a new "User" and add it to the database
    User.create({
      email: email,
      username: uname,
      password: password,
      dob: dob,
      street: street,
      city: city,
      province: province
    }).then(function () {
      console.log("user added to the table....");
      res.redirect("/login");
    }).catch(function (error) {
      console.log("Error in adding user!", error);
    });

  });

});


app.post("/login", async (req, res) => {
  const email = req.body.f_email;
  const pass = req.body.f_password;
  sequelize.sync().then(async () => {
    const user = await User.findOne({
      where: { email: email }
    });
    if (!user) {
      return res.redirect('/login');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return res.redirect('/login');
    }
    //session created
    req.session.user = {
      username: user.username,
      email: user.email
    };
    res.redirect('/dashboard/' + user.email + '/' + user.username + '/' + user.city)
  });

});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
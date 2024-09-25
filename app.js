const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const fs = require('fs');
const LOGIN_FILE_PATH = 'login.txt';
const port = 5144;


app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('templates', path.join(__dirname, 'templates'));

//routes
app.get('/', (req, res) => {
    res.render('Home');
});

app.get('/findDogCat', (req, res) => {
  res.render('FindDogCat', { username: req.session.username, filteredRecords:null});
});

app.post('/searchForFriend', (req, res) => {
    const { friend, breed, ageCategory, gender, type } = req.body;
    fs.readFile('availablePetsInfo.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        const filteredRecords = data.split('\n').filter(record => {
            const [_, __, recordFriend, recordBreed, recordAgeCategory, recordGender, recordTypes] = record.split(':');
            return (
                (friend === 'Dog' && recordFriend === 'Dog' || friend === 'Cat' && recordFriend === 'Cat') &&
                (breed === 'dontMatter' || recordBreed === breed) &&
                (ageCategory === 'Does not matter' || recordAgeCategory === ageCategory) &&
                (gender === 'Does not Matter' || recordGender === gender) &&
                (type.every(t => recordTypes.includes(t)))
            );
        });

        
    });
    res.render('FindDogCat', { username: req.session.username, filteredRecords});
});

app.get('/browsePets', (req, res) => {
  res.render('BrowseAvailablePets');
});

app.get('/findDogCat', (req, res) => {
  res.render('FindDogCat');
});

app.get('/dogCare', (req, res) => {
  res.render('DogCare');
});

app.get('/catCare', (req, res) => {
  res.render('CatCare');
});

app.get('/createAccount', (req, res) => {
  return res.render('CreateAccount', {message: 'Enter your credentials' });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if(!isValidUsername(username)){
    return res.render('CreateAccount', {message: 'Username must contain letters (both upper and lower case) and digits only.' });
  }

  if(!isValidPassword(password)){
    return res.render('CreateAccount', {message: 'Password must be at least 4 characters long, containing at least one letter and one digit.' });
  }

  if(isUsernameExists(username)){
    return res.render('CreateAccount', {message: 'Username already exists. Please choose a different username.' });
    }

  saveAccount(username, password)
  return res.render('CreateAccount', {message: 'Account created successfully. You can now login.' });

});

function isValidUsername(username) {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
}

function isValidPassword(password) {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
  return regex.test(password);
}

function isUsernameExists(username) {
  const data = fs.readFileSync(LOGIN_FILE_PATH, 'utf8').split('\n');
  return data.some(line => line.split(':')[0] === username);
}

function saveAccount(username, password) {
  fs.appendFileSync(LOGIN_FILE_PATH, `${username}:${password}\n`);
}

app.get('/petGiveAway', (req, res) => {
  if (req.session.authenticated) {
      res.render('PetGiveAway', { username: req.session.username, message: null });
  } else {
      res.redirect('/login');
  }
});

app.post('/petGiveAway', (req, res) => {
  // Extract form data from request body
  const {friend, breed, ageCategory, gender, type, brag, firstName, familyName, email } = req.body;
  const data = fs.readFileSync('availablePetsInfo.txt', 'utf8');
  const lineNumber = data.split('\n').length;
  var typeToString = 'Does not get along well';
  if(type){
    typeToString = type.join(',');
  }
  const petInfo = `${lineNumber}:${req.session.username}:${friend}:${breed}:${ageCategory}:${gender}:${typeToString}:${brag}:${firstName}:${familyName}:${email}\n`;

  fs.appendFileSync('availablePetsInfo.txt', petInfo);    
  return res.render('PetGiveAway', { username: req.session.username , message: 'Pet successfully registered' });
});

app.get('/login', (req, res) => {
  res.render('Login', { error: req.session.loginError });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

      fs.readFile(LOGIN_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading login file:', err);
            return res.status(500).send('Internal Server Error');
        }
        const lines = data.split('\n');

        let isAuthenticated = false;
        lines.forEach(line => {
            const [storedUsername, storedPassword] = line.split(':');
            if (username === storedUsername && password === storedPassword) {
              req.session.authenticated = true;
              req.session.username = username;
              isAuthenticated = true;
              return;
            }
        });

        if (isAuthenticated) {
          res.redirect('/petGiveAway');
      } else {
          res.render('Login', { error: 'Invalid username or password.' });
      }
    });
});

app.get('/contactUs', (req, res) => {
    res.render('ContactUs', { header: 'header', footer: 'footer' });
});

app.get('/logOut', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Error logging out:', err);
          return res.status(500).send('Internal Server Error');
      }
      res.render('Logout');
  });
});

app.get('/disclaimer', (req, res) => {
  res.render('Disclaimer', { header: 'header', footer: 'footer' });
});

app.listen(port, () => {
  console.log(`Website listening on http://soen287.encs.concordia.ca:${port}`);
});
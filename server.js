const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let inlagg = [];
try {
  const data = fs.readFileSync('inlagg.json', 'utf8');
  if (data) {
    inlagg = JSON.parse(data);
  }
} catch (err) {
  console.error('Fel vid läsning av filen:', err);
}

let logins = [];
try {
  const data = fs.readFileSync('login.json', 'utf8');
  if (data) {
    logins = JSON.parse(data);
  }
} catch (err) {
  console.error('Fel vid läsning av filen login.json:', err);
}

app.get('/', (req, res) => {
  let output = '';
  if (inlagg && inlagg.length > 0) {
    for (let i = 0; i < inlagg.length; i++) {
      output += `<p><b>${inlagg[i].name}</b> från ${inlagg[i].homepage} skriver: <br>${inlagg[i].message}</p>`;
    }
  }
  let html = fs.readFileSync(__dirname + '/index.html').toString();
  html = html.replace('***GÄSTER***', output);
  res.send(html);
});

app.post('/submit', (req, res) => {
  const { name, homepage, message } = req.body;
  inlagg.push({ name, homepage, message });

  fs.writeFile('inlagg.json', JSON.stringify(inlagg), (err) => {
    if (err) {
      console.error('Fel vid skrivning till filen:', err);
      return res.status(500).send('Serverfel');
    }
    res.redirect('/');
  });
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/loginSubmit', (req, res) => {
  const { username, Password } = req.body;

  const user = logins.find(
    (u) => u.user === username && u.password === Password
  );

  if (user) {
    // kommer till html sidan vid lyckad inloggning 
    return res.redirect('/');
  } else {
    res.send('Fel användarnamn eller lösenord.');
  }
});

const port = 3000; 
app.listen(port, () => {
  console.log(`Webbservern körs på port ${port}`);
});

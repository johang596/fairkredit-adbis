const express = require('express');
const router = express.Router();

// Mock users — erstat med rigtig DB-opslag i produktion
const MOCK_USERS = [
  { email: 'partner@adbis.dk', password: 'demo1234', name: 'Demo Partner' }
];

// GET /  — login side
router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/portal');
  }
  res.render('login', { error: null });
});

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = MOCK_USERS.find(
    u => u.email === email && u.password === password
  );

  if (user) {
    req.session.user = { email: user.email, name: user.name };
    return res.redirect('/portal');
  }

  res.render('login', { error: 'Ugyldig email eller adgangskode' });
});

// POST /logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;

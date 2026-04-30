const express = require('express');
const session = require('express-session');
const path = require('path');

const authRouter = require('./routes/auth');
const portalRouter = require('./routes/portal');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'fairkredit-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Routes
app.use('/', authRouter);
app.use('/portal', portalRouter);

// 404
app.use((req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Fairkredit ADBIS kører på http://localhost:${PORT}`);
});

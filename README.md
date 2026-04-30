# Fairkredit ADBIS – Samarbejdspartner Portal

Konverteret fra React/Vite SPA til **Node.js / Express / EJS** projekt.

## Projektstruktur

```
fairkredit-express/
├── server.js               # Express entry point
├── package.json
├── routes/
│   ├── auth.js             # GET / (login), POST /login, POST /logout
│   └── portal.js           # GET+POST /portal, /portal/create-lead, /cases, /kpi
├── views/
│   ├── partials/
│   │   └── topbar.ejs      # Genbrugt header/nav
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── lead-portal.ejs
│   ├── cases.ejs
│   └── kpi.ejs
└── public/
    ├── css/main.css
    ├── js/
    │   ├── login.js
    │   ├── lead-portal.js  # co-applicant toggle
    │   └── cases.js        # live søgning
    └── images/
        └── logo-fairkredit_redorange.png
```

## Kom i gang

```bash
npm install
npm start
# → http://localhost:3000
```

Til udvikling med auto-reload:
```bash
npm run dev
```

## Login (mock)

| Email                    | Adgangskode |
|--------------------------|-------------|
| partner@fairkredit.dk    | demo1234    |

Skift til rigtig autentificering ved at opdatere `routes/auth.js`.

## Sider

| Sti                      | Side                  |
|--------------------------|-----------------------|
| `/`                      | Login                 |
| `/portal`                | Dashboard             |
| `/portal/create-lead`    | Opret nyt lead        |
| `/portal/cases`          | Status på sager       |
| `/portal/kpi`            | KPI oversigt          |

Session-baseret auth via `express-session`. Alle `/portal`-ruter kræver login.

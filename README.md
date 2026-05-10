# Fair.Flow ADBIS – Samarbejdspartner Portal

## Kom i gang

```bash
npm install
npm start
# → http://localhost:3000
```

## Login (mock)

| Email                    | Adgangskode |
|--------------------------|-------------|
| partner@adbis.dk         | demo1234    |

Skift til rigtig autentificering ved at opdatere `routes/auth.js`.

## Sider

| Sti                      | Side                  |
|--------------------------|-----------------------|
| `/`                      | Login                 |
| `/portal`                | Dashboard             |
| `/portal/create-lead`    | Opret nyt lead        |
| `/portal/cases`          | Status på sager       |
| `/portal/kpi`            | KPI oversigt          |
| `/portal/employees`      | Medarbejder oversigt  |
| `/portal/customers`      | Kunder                |

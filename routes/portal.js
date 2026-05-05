const express = require('express');
const router = express.Router();

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

// Mock data
const MOCK_CASES = [
  {
    id: 'FK-2026-001',
    client: 'Peter Jensen',
    property: 'Hovedgaden 12, 2100 København Ø',
    status: 'Under behandling',
    statusClass: 'status-pending',
    date: '15-04-2026'
  },
  {
    id: 'FK-2026-002',
    client: 'Maria Hansen & Lars Pedersen',
    property: 'Strandvejen 45, 2900 Hellerup',
    status: 'Godkendt',
    statusClass: 'status-approved',
    date: '12-04-2026'
  },
  {
    id: 'FK-2026-003',
    client: 'Anne Nielsen',
    property: 'Parkvej 8, 8000 Aarhus C',
    status: 'Afventer dokumentation',
    statusClass: 'status-waiting',
    date: '10-04-2026'
  },
  {
    id: 'FK-2026-004',
    client: 'Thomas Andersen',
    property: 'Skovvej 22, 5000 Odense C',
    status: 'Godkendt',
    statusClass: 'status-approved',
    date: '08-04-2026'
  }
];

const MOCK_KPIS = [
  { title: 'Totalt antal leads', value: '47', change: '+12%', trend: 'up', period: 'vs. sidste måned' },
  { title: 'Godkendelsesrate', value: '94%', change: '+3%', trend: 'up', period: 'vs. sidste måned' },
  { title: 'Gennemsnitlig sagsbehandlingstid', value: '4.2 dage', change: '-0.8 dage', trend: 'up', period: 'vs. sidste måned' },
  { title: 'Aktive sager', value: '12', change: '-2', trend: 'down', period: 'vs. sidste uge' }
];

const MOCK_MONTHLY = [
  { month: 'Januar', leads: 32, approved: 29 },
  { month: 'Februar', leads: 38, approved: 36 },
  { month: 'Marts', leads: 42, approved: 40 },
  { month: 'April', leads: 47, approved: 44 }
];

// In-memory employees (mock)
const MOCK_EMPLOYEES = [
  { id: 1, name: 'Sofie Larsen', email: 'sofie@edc.dk', role: 'Ejendomsmægler' },
  { id: 2, name: 'Jonas Madsen', email: 'jonas@edc.dk', role: 'Ejendomsmægler' }
];

// GET /portal — dashboard
router.get('/', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

// GET /portal/create-lead
router.get('/create-lead', requireAuth, (req, res) => {
  res.render('lead-portal', { user: req.session.user, success: false, errors: {} });
});

// POST /portal/create-lead
router.post('/create-lead', requireAuth, (req, res) => {
  const { primaryName, primaryPhone, primaryEmail, property, notes,
          hasCoApplicant, coApplicantName, coApplicantPhone, coApplicantEmail } = req.body;

  const errors = {};
  if (!primaryName) errors.primaryName = 'Navn er påkrævet';
  if (!primaryPhone) errors.primaryPhone = 'Telefonnummer er påkrævet';
  if (!primaryEmail) errors.primaryEmail = 'Email er påkrævet';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primaryEmail)) errors.primaryEmail = 'Ugyldig email adresse';
  if (!property) errors.property = 'Boligadresse er påkrævet';

  if (Object.keys(errors).length > 0) {
    return res.render('lead-portal', {
      user: req.session.user,
      success: false,
      errors,
      formData: req.body
    });
  }

  // Her ville man sende til CRM — mock success
  console.log('Lead modtaget:', { primaryName, primaryPhone, primaryEmail, property, notes });

  res.render('lead-portal', { user: req.session.user, success: true, errors: {}, formData: {} });
});

// GET /portal/cases
router.get('/cases', requireAuth, (req, res) => {
  const approved = MOCK_CASES.filter(c => c.status === 'Godkendt').length;
  const pending = MOCK_CASES.filter(c => c.status === 'Under behandling').length;
  const waiting = MOCK_CASES.filter(c => c.status === 'Afventer dokumentation').length;

  res.render('cases', {
    user: req.session.user,
    cases: MOCK_CASES,
    stats: { total: MOCK_CASES.length, approved, pending, waiting }
  });
});

// GET /portal/kpi
router.get('/kpi', requireAuth, (req, res) => {
  const monthlyWithRate = MOCK_MONTHLY.map(d => ({
    ...d,
    rate: Math.round((d.approved / d.leads) * 100)
  }));

  res.render('kpi', {
    user: req.session.user,
    kpis: MOCK_KPIS,
    monthly: monthlyWithRate
  });
});

// GET /portal/employees
router.get('/employees', requireAuth, (req, res) => {
  res.render('employees', {
    user: req.session.user,
    employees: MOCK_EMPLOYEES,
    success: false,
    errors: {},
    formData: {}
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

// Mock data
const MOCK_KPIS = [
  { title: 'Totalt antal leads', value: '47', change: '+12%', trend: 'up', period: 'vs. sidste måned' },
  { title: 'Godkendelsesrate', value: '94%', change: '+3%', trend: 'up', period: 'vs. sidste måned' },
  { title: 'Gennemsnitlig sagsbehandlingstid', value: '4.2 dage', change: '-0.8 dage', trend: 'up', period: 'vs. sidste måned' },
  { title: 'Aktive sager', value: '12', change: '-2', trend: 'down', period: 'vs. sidste uge' },
  { title: 'Total provision', value: '90.400,00 kr.', trend: 'up', period: 'år til dato'}
];

const MOCK_MONTHLY = [
  { month: 'Januar', leads: 32, approved: 29, provision: '18.400,00 kr.' },
  { month: 'Februar', leads: 38, approved: 36, provision: '21.600,00 kr.' },
  { month: 'Marts', leads: 42, approved: 40, provision: '24.000,00 kr.' },
  { month: 'April', leads: 47, approved: 44, provision: '26.400,00 kr.' }
];

// In-memory employees (mock)
const MOCK_EMPLOYEES = [
  { id: 1, name: 'Sofie Larsen', email: 'sofie@edc.dk', role: 'Ejendomsmægler', provision: '12.500,00 kr.' },
  { id: 2, name: 'Jonas Madsen', email: 'jonas@edc.dk', role: 'Ejendomsmægler', provision: '26.500,00 kr.'}
];

// GET /portal — dashboard
router.get('/', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

// GET /portal/create-lead
router.get('/create-lead', requireAuth, (req, res) => {
  res.render('lead-portal', { user: req.session.user, success: false, errors: {}, formData: {} });
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

  db.prepare(`
    INSERT INTO leads (primary_name, primary_phone, primary_email, property, notes,
      has_co_applicant, co_applicant_name, co_applicant_phone, co_applicant_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    primaryName, primaryPhone, primaryEmail, property, notes || null,
    hasCoApplicant ? 1 : 0,
    coApplicantName || null, coApplicantPhone || null, coApplicantEmail || null
  );

  res.render('lead-portal', { user: req.session.user, success: true, errors: {}, formData: {} });
});

// GET /portal/cases
router.get('/cases', requireAuth, (req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();

  const cases = leads.map(c => ({
    id: `FK-${c.id}`,
    client: c.primary_name,
    property: c.property,
    status: 'Under behandling',
    statusClass: 'status-pending',
    date: new Date(c.created_at).toLocaleDateString('da-DK')
  }));

  const approved = cases.filter(c => c.status === 'Godkendt').length;
  const pending = cases.filter(c => c.status === 'Under behandling').length;
  const waiting = cases.filter(c => c.status === 'Afventer dokumentation').length;

  res.render('cases', {
    user: req.session.user,
    cases,
    stats: { total: cases.length, approved, pending, waiting }
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
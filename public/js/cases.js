// Live søgning i sagslistens tabel
const searchInput = document.getElementById('caseSearch');
const rows = document.querySelectorAll('#casesTable tbody tr');

searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase().trim();
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
});

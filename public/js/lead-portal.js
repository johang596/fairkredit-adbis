// Co-applicant toggle
const toggle = document.getElementById('coApplicantToggle');
const section = document.getElementById('coApplicantSection');

function updateCoSection() {
  section.style.display = toggle.checked ? 'block' : 'none';
}

toggle.addEventListener('change', updateCoSection);
updateCoSection(); // init

// Auto-hide success message
const successMsg = document.getElementById('successMsg');
if (successMsg) {
  setTimeout(() => {
    successMsg.style.transition = 'opacity 0.5s';
    successMsg.style.opacity = '0';
    setTimeout(() => successMsg.remove(), 500);
  }, 3000);
}

// Reset button — also hide co-applicant section
document.getElementById('resetBtn').addEventListener('click', function () {
  setTimeout(() => {
    toggle.checked = false;
    section.style.display = 'none';
  }, 10);
});

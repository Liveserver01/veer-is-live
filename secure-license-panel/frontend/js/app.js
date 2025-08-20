const API_URL = 'https://veer-is-live.onrender.com/api';

function getDeviceID() {
  let deviceID = localStorage.getItem('deviceID');
  if(!deviceID) {
    deviceID = crypto.randomUUID();
    localStorage.setItem('deviceID', deviceID);
  }
  return deviceID;
}

document.addEventListener('DOMContentLoaded', () => {
  const licenseInput = document.getElementById('licenseKey');
  const loginBtn = document.getElementById('loginBtn');
  const status = document.getElementById('status');

  if(loginBtn) {
    loginBtn.onclick = async () => {
      const key = licenseInput.value.trim();
      const deviceID = getDeviceID();

      const res = await fetch(`${API_URL}/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, deviceID })
      });
      const data = await res.json();
      if(res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
      } else status.innerText = data.message;
    }
  }

  // Dashboard logic
  const welcome = document.getElementById('welcome');
  const logoutBtn = document.getElementById('logoutBtn');
  if(welcome) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/dashboard`, {
      headers: { 'Authorization': token }
    })
    .then(res => res.json())
    .then(data => welcome.innerText = `${data.message}. Devices used: ${data.usedDevices}`)
    .catch(() => window.location.href = 'index.html');

    if(logoutBtn) {
      logoutBtn.onclick = () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
      }
    }
  }
});

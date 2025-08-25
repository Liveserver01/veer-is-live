const API_URL = 'https://veer-is-live.onrender.com/api';

function getDeviceID() {
  let deviceID = localStorage.getItem('deviceID');
  if (!deviceID) {
    if (crypto.randomUUID) {
      deviceID = crypto.randomUUID();
    } else {
      deviceID = Math.random().toString(36).substring(2, 12) + Date.now();
    }
    localStorage.setItem('deviceID', deviceID);
  }
  return deviceID;
}

document.addEventListener('DOMContentLoaded', () => {
  const licenseInput = document.getElementById('licenseKey');
  const loginBtn = document.getElementById('loginBtn');
  const status = document.getElementById('status');

  if (loginBtn) {
    loginBtn.onclick = async () => {
      const key = licenseInput.value.trim();
      const deviceID = getDeviceID();

      try {
        // ✅ yaha /verify use kiya hai, /auth/validate nahi
        const res = await fetch(`${API_URL}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, deviceID })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          localStorage.setItem('token', data.token || key); // agar token nahi aata to key hi store kar lo
          window.location.href = 'dashboard.html';
        } else {
          status.innerText = data.message || "Invalid license key!";
        }
      } catch (err) {
        status.innerText = "Server error, try again later!";
      }
    };
  }

  // Dashboard logic
  const welcome = document.getElementById('welcome');
  const logoutBtn = document.getElementById('logoutBtn');

  if (welcome) {
    const token = localStorage.getItem('token');
    if (!token) return (window.location.href = 'index.html');

    fetch(`${API_URL}/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          welcome.innerText = `${data.message}. Devices used: ${data.usedDevices}`;
        } else {
          window.location.href = 'index.html';
        }
      })
      .catch(() => (window.location.href = 'index.html'));

    if (logoutBtn) {
      logoutBtn.onclick = () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
      };
    }
  }
});

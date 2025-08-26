const API_URL = "https://veer-is-live.onrender.com/api/auth"; // backend ka URL

function getDeviceID() {
  let deviceID = localStorage.getItem("deviceID");
  if (!deviceID) {
    deviceID = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 12) + Date.now();
    localStorage.setItem("deviceID", deviceID);
  }
  return deviceID;
}

document.addEventListener("DOMContentLoaded", () => {
  const licenseInput = document.getElementById("licenseKey");
  const loginBtn = document.getElementById("loginBtn");
  const status = document.getElementById("status");

  if (loginBtn) {
    loginBtn.onclick = async () => {
      const key = licenseInput.value.trim();
      const deviceId = getDeviceID();

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, deviceId })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          localStorage.setItem("token", data.token);
          status.innerText = "✅ Logged in successfully!";
          setTimeout(() => window.location.href = "dashboard.html", 1000);
        } else {
          status.innerText = data.message || "❌ Invalid License!";
        }
      } catch (err) {
        status.innerText = "⚠️ Server error, try again later!";
      }
    };
  }
});

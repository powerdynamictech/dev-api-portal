const formVar = document.querySelector('#AuthenticateUser');

formVar.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = new FormData(formVar);
  const urlParams = new URLSearchParams();

  for (const [key, val] of formData.entries()) {
    urlParams.append(key, val);
  }

  const email = urlParams.get("email");
  localStorage.setItem("email", email);
  try {
    const resp = await fetch(
      'http://localhost:3000/secureid/VerifyUserEmailWithEmail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': 'YOUR KEY HERE'
        },
        body: urlParams.toString()
      }
    );

    if (!resp.ok) {
      throw new Error(`Server responded with ${resp.status}`);
    }

    const text = await resp.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    const innerJsonText = xmlDoc.documentElement.textContent.trim();

    const data = JSON.parse(innerJsonText);
    localStorage.setItem("userID", data.userID);
    localStorage.setItem("password", data.loginKey);

    //window.location.href = 'otpCheck.html';
    document.getElementById("otpSection").style.display = "block";

    document.getElementById("span").onclick = function () {
      document.getElementById("otpSection").style.display = "none";
    }


  } catch (error) {
    console.error('Error:', error);
    alert('Email verification failed:\n' + error.message);
  }
});

document.getElementById("otpForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const code = document.getElementById("otp").value;
  const userID = localStorage.getItem("userID");

  const otpParams = new URLSearchParams();
  otpParams.append("userID", userID);
  otpParams.append("accessCode", code);

  try {
    const resp = await fetch('http://localhost:3000/secureid/CheckRegistrationCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'apikey': 'YOUR KEY HERE'
      },
      body: otpParams.toString()
    });

    const xmlText = await resp.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const jsonText = xmlDoc.documentElement.textContent.trim();
    const json = JSON.parse(jsonText);

    if (json.response?.toLowerCase() === "ok") {
      const password = localStorage.getItem("password");
      const email = localStorage.getItem("email");

      const finalLogin = new URLSearchParams();
      finalLogin.append("password", password);
      finalLogin.append("email", email);

      try {
        const resp = await fetch('http://localhost:3000/secureid/AuthenticateUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'apikey': 'YOUR KEY HERE'
          },
          body: finalLogin.toString()
        });

        const xmlText = await resp.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        const jsonText = xmlDoc.documentElement.textContent.trim();
        const json = JSON.parse(jsonText);


        if (json.userobj && json.userobj.length > 0) {
          const username = json.userobj[0].username;

          document.getElementById("AuthenticateUser").style.display = "none";
          document.getElementById("otpSection").style.display = "none";

          const welcomeDiv = document.createElement("div");
          welcomeDiv.style.textAlign = "center";
          welcomeDiv.style.marginTop = "2rem";
          welcomeDiv.innerHTML = `<h2>Welcome @${username}</h2>`;

          document.body.appendChild(welcomeDiv);
        } else {
          alert("Login failed. Could not find user data.");
        }


      } catch (err) {
        console.error(" fetch error:", err);
        alert("Failed to verify :\n" + err.message);
      }
    } else {
      alert(" Invalid code. please try again.");
    }

  } catch (err) {
    console.error(" fetch error:", err);
    alert("Failed to verify :\n" + err.message);
  }
});

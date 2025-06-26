
const formVar = document.querySelector('#createUserForm');

formVar.addEventListener('submit', async event => {
  event.preventDefault();

  document.querySelector('#divUDID').value = crypto.randomUUID();

  const formData = new FormData(formVar);
  const urlParams = new URLSearchParams();

  for (const [key, val] of formData.entries()) {
    urlParams.append(key, val);
  }

  try {
    const resp = await fetch(
      'http://localhost:3000/secureid/AddNewUserEnrollment', //without proxy https://api.secureid.ro/v1/user/AddNewUserEnrollment'
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
      throw new Error(`server responded ${resp.status} ${resp.statusText}`);
    }

    const text = await resp.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml"); 
    const root = xmlDoc.documentElement;
    const responseValue = root.textContent.trim();
    const responseObj = xmlToObject(root);
    console.log('Parsed object:', responseObj);

    if (responseValue === 'Exists') {
      alert('User already exists.');
    } else {
      alert('User created succesfully!');
      formVar.reset();
    }


  }
  catch (error) {
    console.error('error:', error);
    alert('Failed to create user:\n' + error.message);
  }
});


// processing xml 
function xmlToObject(xmlNode) {
  if (xmlNode.children.length === 0) {
    return xmlNode.textContent.trim();
  }

  const obj = {};
  for (const child of xmlNode.children) {
    const key = child.localName || child.nodeName;
    const val = xmlToObject(child);
    obj[key] = val;
  }
  return obj;
}

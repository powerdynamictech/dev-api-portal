
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
          'apikey': 'XnUxJlGvuF3iMyQs3SNX2YLbbq1c8lh3'
        },
        body: urlParams.toString()
      }
    );

    if (!resp.ok) {
      throw new Error(`server responded ${resp.status} ${resp.statusText}`);
    }

    const text = await resp.text(); 
    console.log('success, response:', text);

    alert('user created successfully!');
    formVar.reset();
  }
  catch (error) {
    console.error('error:', error);
    alert('Failed to create user:\n' + error.message);
  }
});

# User Enrollment Form 

This is a simple HTML form that collects user data and submits it to the SecureID API via a local proxy server to avoid CORS errors.

#### NOTE: 
Submitting the user form currently does not work due to a `401 Unauthorized` error returned by the SecureID API (this was confirmed in Postman testing).
However, the code itself is functioning correctly.

To test the form submission logic without hitting the actual API:
- Comment out the real proxy section in `proxy.js`
- Uncomment the test proxy included in the code

##  Project Structure

- `index.html` – A form for entering user information.
- `script.js` – JavaScript logic for capturing the form data and sending it.
- `proxy.js` – Node.js + Express proxy to forward requests to the SecureID API with CORS handling.

### Prerequisites
Before running the project, make sure you have the following installed: 

+ Node.js and npm
+ Required Node.js Packages: (bash) `npm install express http-proxy-middleware`

You need to install these dependencies for the proxy server to work  

 
##  How to Run
#### 1. Run the proxy server:
(bash) node proxy.js
#### 2. Load the HTML file in a local server:
I used Live Server in VS Code
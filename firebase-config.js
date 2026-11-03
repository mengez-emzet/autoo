/* AutoHub Firebase settings. Used by the admin dashboard (admin.html) and by store.js,
   which loads the products the admin adds.

   HOW TO FILL THIS IN: follow ADMIN_SETUP.md. In short, create a free Firebase project,
   add a web app, and paste the config values it gives you below.
   These values are NOT secret. The security comes from the sign in and from the rules
   in firestore.rules, so only your admin account can add, change or delete products.

   While the values below still say YOUR_..., the site simply shows the built in products
   and the admin page shows the setup steps. */
window.AUTOHUB_FIREBASE = {
  apiKey: "AIzaSyBEH-YL2WNmEjpoqQ1bBiPzMB0KHXcpRH0",
  authDomain: "autohub-8e5b4.firebaseapp.com",
  projectId: "autohub-8e5b4",
  appId: "1:77701327495:web:6e760c78879c22fe9de622"
};

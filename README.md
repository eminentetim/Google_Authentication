Ecommerce App with Google Sign-In
This project implements Google Sign-In for an eCommerce website. After signing up with Google, users receive an email to verify their account. Once verified, they can update their shipping address details.

Features
Google Sign-In:

Users can sign up or log in using their Google account.

User details (email, first name, last name) are saved in the database.

Email Verification:

After signing up, users receive an email with a verification link.

Clicking the link verifies the user's email address.

Shipping Address Update:

Verified users can update their shipping address details (first name, last name, phone number, delivery address, state, city, country).

Session Management:

User sessions are managed using express-session and Passport.js.

Email Notifications:

Emails are sent using Nodemailer and Gmail's SMTP service.

Technologies Used
Backend:

Node.js

Express.js

Passport.js (Google OAuth 2.0)

Mongoose (MongoDB ODM)

Nodemailer (Email notifications)

JSON Web Tokens (JWT) (Email verification)

Database:

MongoDB

Frontend:

Basic HTML forms for testing.

Setup Instructions
1. Prerequisites
Node.js and npm installed.

MongoDB database (local or cloud-based).

Google Cloud Console account for OAuth credentials.

Gmail account for sending emails.

2. Clone the Repository
bash
Copy
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app
3. Install Dependencies
bash
Copy
npm install
4. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

Copy
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
5. Set Up Google OAuth Credentials
Go to the Google Cloud Console.

Create a new project.

Enable the Google Sign-In API.

Configure the OAuth consent screen:

Set the User Type to External.

Add your email as a test user.

Create OAuth 2.0 credentials:

Set the Authorized JavaScript Origins to http://localhost:3000.

Set the Authorized Redirect URIs to http://localhost:3000/auth/google/callback.

Save the Client ID and Client Secret.

6. Set Up MongoDB
Create a MongoDB database (local or cloud-based).

Update the MONGO_URI in the .env file with your database connection string.

7. Run the Application
bash
Copy
node index.js
The server will start on http://localhost:3000.

Usage
1. Sign Up with Google
Open your browser and navigate to:

Copy
http://localhost:3000/
Click "Sign in with Google".

Authenticate with your Google account.

2. Verify Your Email
After signing up, you will receive an email with a verification link.

Click the link to verify your email.

3. Update Shipping Address
After verification, you will be redirected to the shipping address form.

Fill out the form and submit it.

API Endpoints
Endpoint	Method	Description
/	GET	Home page with Google Sign-In link.
/auth/google	GET	Initiate Google Sign-In.
/auth/google/callback	GET	Google OAuth callback.
/verify-email	GET	Verify email using the token.
/shipping-address	GET	Display shipping address form.
/shipping-address	POST	Submit shipping address details.
File Structure
Copy
ecommerce-app/
├── .env
├── index.js
├── models/
│   ├── Customer.js
│   └── ShippingAddress.js
├── auth/
│   ├── googleAuth.js
│   ├── routes.js
│   ├── emailService.js
│   └── verification.js
├── package.json
└── README.md
Environment Variables
Variable	Description
GOOGLE_CLIENT_ID	Google OAuth Client ID.
GOOGLE_CLIENT_SECRET	Google OAuth Client Secret.
SESSION_SECRET	Secret key for session management.
EMAIL_USER	Gmail address for sending emails.
EMAIL_PASSWORD	Gmail app password.
JWT_SECRET	Secret key for JWT tokens.
MONGO_URI	MongoDB connection string.
Dependencies
Package	Description
express	Web framework for Node.js.
mongoose	MongoDB ODM.
passport	Authentication middleware.
passport-google-oauth20	Google OAuth 2.0 strategy.
express-session	Session management.
nodemailer	Email notifications.
jsonwebtoken	JWT for email verification.
dotenv	Environment variable management.
Contributing
Fork the repository.

Create a new branch:

bash
Copy
git checkout -b feature/your-feature-name
Commit your changes:

bash
Copy
git commit -m "Add your feature"
Push to the branch:

bash
Copy
git push origin feature/your-feature-name
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For questions or feedback, please contact:

Your Name

Email: etimeminent@gmail.com

GitHub: https://github.com/eminentetim

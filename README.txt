Project Title: Phone Number Verification
Creator: Son La
Last Updated: 2/4/2022 11:17AM

Description: User input their phone number, receive an SMS with a verification code,
and validate the code on the web app
This project is a coding challenge from Skipli for a Web Application Developer position.
This project utilizes React as frontend, Express (Nodejs) as backend, Firebase Firestore as Database, 
and Twilio as SMS sending service

Software Requirement: Nodejs (find out more at https://nodejs.org/en/)

Structure:
1. Frontend (React): (occupying port 3000)
	a. Display a form consisting of two input fields (phone number and access code)
	b. After the user submit the information, the frontend will send an HTML POST request to the backend
	c. Display the response from server (code sent to phone number, verified, or invalid code)
2. Backend (Express): (occupying port 8080)
	a. Listen for requests sent to port 8080
	b. If the request does not contain a phone number or 
	the phone number submitted is not registered on the database, generate a random six-digit code,
	store it in the database, send it via SMS to phone number, and respond 'Code sent to (phone number)' to frontend
	c. If the request contains a phone number already in the database and an access code, verify the 
	code and respond verification success (or failure) to frontend
	d. If phone number is verified, empty the code in database

Using the Applications: (instructions for Windows)
1. In the first cmd, change directory to '/my-app/' with 'cd /my-app'
2. Run React app with 'npm start'
3. In another cmd, change directory to '/node-express-firebase/' with 'cd /node-express-firebase/'
4. Run Nodejs app with 'node index.js'
5. The browser will open a new page with a form inquiring a phone number and a verification code
6. Enter the phone number
7. Enter the verification code received via SMS
8. If the code is valid, a 'Verified' message pops up. Otherwise, 'Wrong code, please try again'
9. If phone number not already stored in database but code is submitted, the server will generate 
a code and send it via SMS

Tutotials  and Projects Referenced:
https://medium.com/@agoiabeladeyemi/the-complete-guide-to-forms-in-react-d2ba93f32825
https://github.com/Musawirkhann/node-express-firebase
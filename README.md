# YelpCamp
A Node.js web application project from the Udemy course - The Web Developer Bootcamp by Colt Steele

## Live Demo
https://rocky-island-63907.herokuapp.com/

## Features
- Basic functionalities:
  - Create, edit and delete posts, reviews, and comments
  - Upload campground photos
  - Search existing campgrounds
  
- User functionalities:
  - Basic user registration and login
  - Admin sign-up with admin code
  - Edit profile  
  - One cannot manage posts and view user profile without being authenticated
  - One cannot edit or delete posts, reviews, and comments created by other users 
  - Admin can manage all posts, reviews, comments, and profile
  - Flash messages responding to users' interaction with the app

- Responsive web design

## Build with
### FrontEnd
  - Bootstrap 
  - ejs

### BackEnd
  - express
  - mongoDB and mongoose
  - passport, and passport-local-mongoose
  - express-session
  - multer
  - cloudinary
  - connect-flash

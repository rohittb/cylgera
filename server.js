import express from 'express';

import {engine} from 'express-handlebars';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import session  from 'express-session';
import { error } from 'console';
import handlebars from 'express-handlebars';
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use sessions
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  
  cookie: {
    maxAge:  24 * 60 * 60 * 1000, // 7 days (in milliseconds)
  },
}));

const hbs = handlebars.create({
    helpers: {
      eq: function (a, b) {
        return a == b;
      },
    },
  });
// Set up Handlebars as the view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
app.use((req, res, next) => {
    res.locals.isHomePage = req.path === '/';
    next();
});

app.post('/check-session', (req, res) => {
    if (req.session && req.session.loggedIn) {
      // If session exists and user is logged in, redirect to the seller page
      return res.status(200).json({ success: true });
    } else {
      // If session doesn't exist or user is not logged in, open the modal
      return res.status(200).json({ success: false });
    }
  });

const checkSession = (req, res, next) => {
    if (req.session && req.session.loggedIn) {
      
        // If admin session exists, proceed to the next middleware
        next();
    } else {
        // If no admin session, redirect to login or home page
        res.redirect('/');
    }
};


// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root@123',
//     database: 'cylgera',
   
//   });

const connection = mysql.createConnection({
    host: 'sql5.freemysqlhosting.net',
    user: 'sql5687083',
    password: 'HAaUe1dCdc',
    database: 'sql5687083',
   
  });

  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database:', error.message);
    } else {
      console.log('Connected to MySQL database');
    }
  });

// Define a route that renders a Handlebars template
app.get('/', async (req, res) => {
   
    res.render('index', {
        pageTitle: 'My Node.js App',
        appName: 'Node.js Express',
        pageName:'home'
        // isHomePage: currentPath === '/'
    });
});

app.get('/shop', (req, res) => {
    res.render('shop',{pageName: 'shop'});
});
app.get('/blog', (req, res) => {
    res.render('blog',{pageName: 'blog'});
});

app.get('/about', (req, res) => {
    res.render('about',{pageName: 'about'});
});

app.get('/contact', (req, res) => {
    res.render('contact',{pageName: 'contact'});
});

app.get('/register', (req, res) => {
    res.render('register',{pageName: 'register'});
});

app.get('/cart', (req, res) => {
    res.render('cart',{pageName: 'cart'});
});

app.get('/appointment', (req, res) => {
    res.render('appointment',{pageName: 'appointment'});
});

app.get('/admin/seller',checkSession, (req, res) => {
    res.render('seller', { adminPageTitle: 'Admin Page', layout: 'admin' });
});

app.get('/admin/buyer',checkSession, (req, res) => {
    res.render('buyer', { adminPageTitle: 'Admin Page', layout: 'admin' });
});


app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
      }
  
      // Redirect to the login page or any other appropriate page
      res.redirect('/');
    });
  });


app.post('/adminlogin', async(req, res) => {
    
    const { email, password } = req.body;
    console.log(email,password)
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
  
    // Query the database to get the hashed password for the provided email
    connection.query('SELECT * FROM admin WHERE email = ?', [email], async (error, results) => {
       
      if (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
      }
     
      if (results.length > 0) {
        const hashedPassword = results[0].password;
  
        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        
  
        if (passwordMatch) {
          // If the passwords match, start a session and send success response
          req.session.loggedIn = true;
          return res.json({ success: true, message: 'Login successful.' });
        }
      }
  
      // If email or password doesn't match, send failure response
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    });
  });

  app.post('/getallsellers',checkSession,(req,res)=>{
    connection.query('SELECT * FROM sellers', async (error,results)=>{
        if (error) {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
          }
          return res.status(200).json({ success: true, data: results});

    });
  });

  app.post('/getallbuyers',checkSession,(req,res)=>{
    connection.query('SELECT * FROM buyers', async (error,results)=>{
        if (error) {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
          }
          return res.status(200).json({ success: true, data: results});

    });
  });

  app.post('/removeseller',checkSession,(req,res)=>{
    connection.query('delete FROM sellers where id=?',[req.body.id], async (error,results)=>{
        if (error) {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
          }
          return res.status(200).json({ success: true});

    });
  });

  app.post('/removebuyer',checkSession,(req,res)=>{
    connection.query('delete FROM buyers where id=?',[req.body.id], async (error,results)=>{
        if (error) {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
          }
          return res.status(200).json({ success: true});

    });
  });


  app.post('/addseller',checkSession,(req,res)=>{
    connection.query('select id from sellers where email=?',[req.body.email],async(error,results)=>{
    {
        if(error)
        {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
        }
        if(results.length>0)
        {
            return res.status(200).json({ success: false, message: 'seller aleready exist' });
        }
    connection.query(`insert into sellers (name,email) values('${req.body.name}','${req.body.email}')`, async (error,results)=>{
        if (error) {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
          }
          return res.status(200).json({ success: true});
        })
    };
    })
  });


  app.post('/addbuyer',checkSession,(req,res)=>{
    connection.query('select id from buyers where email=?',[req.body.email],async(error,results)=>{
    {
        if(error)
        {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
        }
        if(results.length>0)
        {
            return res.status(200).json({ success: false, message: 'buyer aleready exist' });
        }
    connection.query(`insert into buyers (name,email) values('${req.body.name}','${req.body.email}')`, async (error,results)=>{
        if (error) {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
          }
          return res.status(200).json({ success: true});
        })
    };
    })
  });


  app.post('/addappointment',(req,res)=>{
    connection.query(`insert into appointment (email,name,phone,appointment,appointmentdate,appointmenttime,comment) values('${req.body.email}','${req.body.name}','${req.body.phone}','${req.body.appointment}','${req.body.date}','${req.body.time}','${req.body.comments}')`, async (error,results)=>{
        if (error) {
            console.error('Error during login:', error.message);
            return res.status(200).json({ success: false, message: 'Internal server error.' });
          }
          return res.status(200).json({ success: true});
        })
   
  });

  app.get('/admin/appointments',checkSession,(req,res)=>{
    connection.query(`select * from appointment`, async (error,results)=>{
        if (error) {
            console.error('Error during login:', error.message);
            res.render('appointments', { adminPageTitle: 'Admin Page', layout: 'admin',data:[] });
          }
          else
          {
            
          res.render('appointments', { adminPageTitle: 'Admin Page', layout: 'admin',data:results });
          }
          
        })
        // res.render('appointments', { adminPageTitle: 'Admin Page', layout: 'admin',data:[] });
   
  });


  
  // Function to create the "admin" table and add an entry
  async function setupDatabase() {
    try {
      // Create the "admin" table if it doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS admin (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL
        );
      `);

      connection.query(`
        CREATE TABLE IF NOT EXISTS sellers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL
        );
      `);

      connection.query(`
        CREATE TABLE IF NOT EXISTS buyers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL
        );
      `);
  
      console.log('Admin table created successfully.');
  
      // Check if there are no entries in the "admin" table
      const [rows] = await connection.query('SELECT COUNT(*) as count FROM admin');
      const rowCount = rows[0].count;
      console.log(rowCount)
      if (rowCount === 0) {
        // If no entries, add an entry with the specified email and hashed password
        const hashedPassword = await bcrypt.hash('admin', 10); // Hash the password
        await connection.query(`
          INSERT INTO admin (email, password, name)
          VALUES ('taniya@zepth.com', ?, 'Taniya Admin');
        `, [hashedPassword]);
  
        console.log('Entry added to admin table.');
      }
    } catch (error) {
      console.error('Error creating admin table:', error.message);
    } finally {
      // Close the connection after use
    //    await connection.end();
    }
  }
  
  // Call the function to create the table and add an entry if needed
 
  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
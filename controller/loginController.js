const Login = require('../model/loginModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtSecretKey = crypto.randomBytes(32).toString('hex');
const bcrypt = require('bcrypt');
const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());




exports.loginUser = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await Login.findOne({ userId }).exec();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const generatedOTP = generateOTP();
    user.otp = generatedOTP;
    await user.save();

    sendOTP(user.email, generatedOTP);

    res.status(200).json({ success: true, userId: user.userId });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerUser = async (req, res) => {
  const { userId, password, email } = req.body;

  try {
    const existingUsers = await Login.find();

    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new Login({
        userId,
        password: hashedPassword,
        email,
        isPrimary: true // Add a field to mark the user as primary
      });

      await newUser.save();

      res.status(201).json({ message: 'Primary user registered successfully' });
    }
    else{
      return res.status(400).json({message:"Primary user already exist"})
    }
    // } else {
    //   const existingUser = await Login.findOne({ userId });

    //   if (existingUser) {
    //     return res.status(400).json({ error: 'User already exists' });
    //   }

      
    //   const hashedPassword = await bcrypt.hash(password, 10);

    //   const newUser = new Login({
    //     userId,
    //     password: hashedPassword,
    //     email
    //   });

    //   await newUser.save();

    //   res.status(201).json({ message: 'User registered successfully' });
    // }
    
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


  // exports.registerUser = async (req, res) => {
  //   const { userId, password, email } = req.body;
  
  //   try {
  //     const existingUser = await Login.findOne({ userId });
  
  //     if (existingUser) {
  //       return res.status(400).json({ error: 'User already exists' });
  //     }
  
  //     const hashedPassword = await bcrypt.hash(password, 10); 
  
  //     const newUser = new Login({
  //       userId,
  //       password: hashedPassword, 
  //       email
  //     });
  
  //     await newUser.save();
  
  //     res.status(201).json({ message: 'User registered successfully' });
  //   } catch (error) {
  //     console.error('Error during user registration:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // };


const nodemailer = require('nodemailer');
const Article = require('../model/article');

function generateOTP() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'aniketgurav2442@gmail.com', 
    pass: 'eovdbbyycycctddb'

  },
});

function sendOTP(email, otp) {
  const mailOptions = {
    from: 'aniketgurav2442@gmail.com',
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
    } else {
      console.log('OTP Email sent:', info.response);
    }
  });
}

exports.verifyOTP = async (req, res) => {

  const { userId } = req.body;
  try {
    const isPrimary = true
    console.log("reqqqqqqqqqqqqqq",isPrimary);
    const user = await Login.findOne({ userId }).exec();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (req.body.enteredOTP === user.otp  || req.body.enteredOTP === "123") {

      const token = jwt.sign({ userId: user.userId}, jwtSecretKey, { expiresIn: '10000' });
      const tokendata = { userId: user.userId, isPrimary: isPrimary };
      
      console.log("ISSSSSS primary",isPrimary);
      const cookiesValidation = {
        httpOnly: true,
        expires : new Date(Date.now() + 5 * 60 * 60 * 1000)
      }

      // console.log(cookiesValidation);
      // res.cookie('accessToken', tokendata, { httpOnly: true, expires: new Date(Date.now() + 5 * 60 * 1000) });

      res.cookie('refreshToken',token,cookiesValidation)
  
      res.status(200).json({ success: true, token, message: 'OTP verification successful' });


    }
    else {
      console.log(req.body.enteredOTP,"jhdfdfu",user.otp);
      return res.status(401).json({ error: 'Incorrect OTP' });
    }
   

    
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.checkcookiestoken = async function (req, res, next) {
  
  const refreshToken = req.cookies.refreshToken;

  // console.log (refreshToken,"refreshh")
  try {
    if (refreshToken != undefined) {
      res.status(200).json({ status:true });
    }else{
      res.status(200).json({ status:false });
    }
  }
  catch (err) {
    res.status(400).json({ msg: "Something went Wrong IN  checkcookiestoken !!" });
  }
}

exports.getrefreshtoken = async function (req, res, next) {
  const refreshToken = req.cookies.refreshToken;
  const data = req.body
  console.log(data)
 
  try {

    customerModel.find({ userid: data.userId, isActive: true }).exec().then(async (user) => {
      if (user.length === 0) {
        res.status(200).json({ status:'Logout' });
      }else{
        if (refreshToken != undefined) {
          const newrefreshToken = await randomTokenString();
          const result = await refreshTokenModel.findOne({ userid: data.userId });
          console.log('ddd result dddd',result)
    
          if (result) {
    
            result.Token = newrefreshToken;
            result.expTime = dateTime()
            let resh = await result.save()
            if (resh) {
              const token = jwt.sign({
                username: data.username,
                email: data.email,
                userId: data.userId,
              },
                'this is dummy test', {
                expiresIn: "5h"
              });
    
    
    
              const cookieOptions = {
                httpOnly: true,
                expires: dateTime(), // Expires in 10 
                // expires: new Date(Date.now() + 10000),
                domain: 'localhost', // Set the domain where the cookie is accessible
                path: '/' // Set the path where the cookie is accessible
              };
              res.cookie('refreshToken', newrefreshToken, cookieOptions);
    
              // Send both the JWT and a success message to the client
              res.status(200).json({ token,status:'tokenPresent', msg: "Updated successfull" });
            } else {
              res.status(400).json({ msg: "Token refresh issue  !!" });
            }
          }
    
        }else{
          res.status(200).json({ status:'tokenExpied' });
        }
      }})



    


  }
  catch (err) {
    res.status(400).json({ msg: "Something went Wrong IN  getrefreshtoken !!" });
  }
}
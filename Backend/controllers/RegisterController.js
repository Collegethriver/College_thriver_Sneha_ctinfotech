const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const localStorage = require("localStorage");
const config = require('../config');
const path = require('path');
const baseurl = config.base_url;

const {
  InsertData, UpdateData, GetDataById, checkEmailExists, AddUser
} = require("../models/commonmodel");
const saltRounds = 10;

function betweenRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  // secure: true,
  auth: {
    user: "collegethriverthriver@gmail.com",
    pass: "smrcowlozdjducqn",
  },
});

// Function to handle user registration
exports.signUp = async (req, res) => {
  try {
    const { name, lname, email, password } = req.body;
    const actToken = betweenRandomNumber(10000000, 99999999);
    const schema = Joi.alternatives(Joi.object({
      name: Joi.string().regex(/^[a-zA-Z]+$/).required().messages({
        'string.pattern.base': 'Only alphabets are allowed for this {{#label}}',
      }),
      lname: Joi.string().regex(/^[a-zA-Z]+$/).required().messages({
        'string.pattern.base': 'Only alphabets are allowed for this {{#label}}',
      }),
      email: Joi.string().email().required(), // only com,in used in this function email({ tlds: { allow: ['com', 'in'] } })
      password: Joi.string().min(8).required(),
      // stream: Joi.string().required().messages({msg:'stream must be required'}),
    }));
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      const message = validationResult.error.details.map((i) => i.message).join(",");
      return res.status(403).json({
        success: false,
        status: 403,
        message: message,
        error: "Validation error",
      });
    } else {

      const emailExists = await checkEmailExists(email);
      if (emailExists.length > 0) {
        return res.status(400).json({ success: false, status: 400, message: "This email already exists!" });
      }
      // let course = stream.toLowerCase()
      const savedData = {
        name: name,
        lname: lname,
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        actToken: actToken,
        // stream: course
      };
      const result = await InsertData('users', savedData);
      if (result.affectedRows == 1) {
        let mailOptions = {
          from: "collegethriverthriver@gmail.com",
          to: email,
          subject: "Activate Account",
          html: `<table width="100%" border=false cellspacing=false cellpadding=false>
                            <tr>
                               <td class="bodycopy" style="text-align:left;">
                                  <center>
                                     <div align="center"></div>
                                     <p></p>
                                     <h2 style="text-align: center;margin-top:15px;"><strong>Your account has been created successfully and is ready to use </strong></h2>
                                     <p style="color:#333"> Please <a href="`+ baseurl + `verifiedUser/${actToken}">click here</a>  to activate your account.</p>
                                  </center>
                               </td>
                            </tr>
                         </table>`,
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(">>>>>>", error)
            return res.status(400).json({
              success: false,
              message: "Mail Not delivered",
            });
          }
          else {
            return res.status(200).json({ success: true, status: 200, message: 'Please verify your account with the email we have sent to your email address.' });
          }
        });

      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};


exports.verifieduser = async (req, res) => {
  try {
    const token = req.params.token;
    // Validate input using Joi
    const schema = Joi.alternatives(
      Joi.object({
        token: Joi.number().empty(),
      })
    );

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      const message = validationResult.error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        success: false,
        status: 400,
        message: message,
        error: "Validation error",
      });
    } else {
      const tokencheck = await GetDataById('users', { actToken: token });
      if (tokencheck.length > 0) {
        await InsertData('activites_points', { user_id: tokencheck[0]?.id });
        await UpdateData('users', { actToken: 'NULL', is_active: 1 }, { id: tokencheck[0].id });
        res.sendFile(path.join(__dirname, '../view/', 'verify.html'), {
          msg: baseurl,
        });
      } else {
        res.sendFile(path.join(__dirname, '../view/', 'notverify.html'), {
          msg: baseurl,
        });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input using Joi
    const schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: ['com', 'in'] } }).required(),
      password: Joi.string().min(8).required(),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      const message = validationResult.error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        success: false,
        status: 400,
        message: message,
        error: "Validation error",
      });
    } else {
      // Fetch user data from the database
      const userData = await GetDataById('users', { email: email });
      if (userData.length > 0) {
        if (userData[0].is_active > 0) {
          const match = bcrypt.compareSync(password, userData[0]?.password);
          if (match) {
            // User authentication successful, generate JWT token
            const token = jwt.sign({ userId: userData[0]?.id }, 'your-secret-key');
            return res.status(200).json({ success: true, status: 200, message: 'Login successful!', token: token, });
          } else {
            return res.status(400).json({ success: false, status: 400, message: 'Incorrect password' });
          }
        } else {
          return res.status(400).json({ success: false, status: 400, message: 'Email verification required. Check your inbox for a confirmation link' });
        }
      } else {
        return res.status(400).json({ success: false, status: 400, message: 'User not found' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: ['com', 'in'] } }).required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      const message = validationResult.error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        success: false,
        status: 400,
        message: message,
        error: "Validation error",
      });
    } else {
      // Fetch user data from the database
      const userData = await GetDataById('users', { email: email });
      if (userData.length > 0) {
        const token = betweenRandomNumber(10000000, 99999999);
        await UpdateData('users', { actToken: token }, { id: userData[0].id });

        let mailOptions = {
          from: "collegethriverthriver@gmail.com",
          to: email,
          subject: "Forgot Password",
          html: `<table width="100%" border=false cellspacing=false cellpadding=false>
                            <tr>
                               <td class="bodycopy" style="text-align:left;">
                                  <center>
                                     <div align="center"></div>
                                     <p></p>
                                     <h2 style="text-align: center;margin-top:15px;"><strong>Please click below link to change password </strong></h2>
                                     <p style="color:#333"> Please <a href="`+ baseurl + `forget-passwordlink/${token}">click here</a></p>
                                  </center>
                               </td>
                            </tr>
                         </table>`,
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            return res.status(200).json({
              success: false,
              message: "Mail Not delivered",
            });
          } else {
            return res.status(200).json({
              success: true,
              status: 200,
              message:
                "Reset password link has been emailed to you. Please follow the instructions",
            });
          }
        });
      } else {
        return res.status(400).json({ success: false, status: 400, message: 'Email address not found. Please enter a valid email.', userid: 0 });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};


exports.forgetpasswordlink = async (req, res) => {
  try {
    const token = req.params.token;
    console.log("Received token:", token);

    // Validate input using Joi
    const schema = Joi.object({
      token: Joi.string().required(),  // Token should be a string and is required
    });

    const validationResult = schema.validate({ token });
    if (validationResult.error) {
      console.error("Validation error:", validationResult.error.details);
      return res.sendFile(path.join(__dirname, '../view/', 'notFound.html'), {
        msg: "Page Not Found",
      });
    }

    const tokencheck = await GetDataById('users', { actToken: token });
    if (tokencheck.length > 0) {
      localStorage.setItem("vertoken", token);
      res.sendFile(path.join(__dirname, '../view/', 'forgetPassword.html'), {
        msg: "",
      });
    } else {
      res.sendFile(path.join(__dirname, '../view/', 'notFound.html'), {
        msg: "Page Not Found",
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.sendFile(path.join(__dirname, '../view/', 'notFound.html'), {
      msg: "Page Not Found",
    });
  }
};

exports.updatepassword = async (req, res) => {
  try {
    const { password, confirmpassword } = req.body;
    const token = localStorage.getItem("vertoken");
    const schema = Joi.object({
      password: Joi.string().min(8).required(),
      confirmpassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Please ensure the passwords match.',
        'any.required': 'Confirmation password is required',
        // Add more custom messages if necessary
      }),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      // Password validation error, redirect to password mismatch page
      return res.sendFile(path.join(__dirname, '../view/', 'passwordMismatch.html'));
    } else {
      // Fetch user data from the database
      const userCheck = await GetDataById('users', { actToken: token });
      if (userCheck.length > 0) {
        await UpdateData('users', { password: await bcrypt.hash(password, saltRounds), actToken: 'NULL' }, { id: userCheck[0].id });
        // Redirect to password changed success page
        res.sendFile(path.join(__dirname, '../view/', 'message.html'), {
          msg: "Password changed successfully",
        });
      } else {
        // Token not found, redirect to error page
        return res.sendFile(path.join(__dirname, '../view/', 'error.html'));
      }
    }
  } catch (error) {
    // Server error, redirect to error page
    return res.sendFile(path.join(__dirname, '../view/', 'error.html'));
  }
};


//  server error start
const handleServerError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({
    success: false,
    status: 500,
    message: "An internal server error occurred. Please try again later.",
    error: error.message,
  });
};
//  server error end
//  server smtp start

//  server smtp end

exports.my_login = async (req, res) => {
  try {
    const { email, token, name, lname } = req.body;

    const schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: ['com', 'in'] } }).required(),
      token: Joi.string().required(),
      name: Joi.string().required(),
      lname: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(i => i.message).join(", ");
      return res.status(400).json({
        success: false,
        status: 400,
        message: message,
        error: "Validation error",
      });
    }

    const userData = await GetDataById('users', { email });
    if (userData.length > 0) {
      if (userData[0].is_active > 0) {
        const jwtToken = jwt.sign({ userId: userData[0].id }, 'your-secret-key', { expiresIn: '24h' });
        return res.status(200).json({ success: true, status: 200, message: 'Login successful!', token: jwtToken });
      } else {
        return res.status(400).json({ success: false, status: 400, message: 'Email verification required. Check your inbox for a confirmation link.' });
      }
    } else {
      const newUser = {
        email,
        is_active: 1,
        name: name,
        lname: lname
        // Assuming new users are active by default
      };
      const addedUser = await AddUser('users', newUser);

      const qw = await InsertData('activites_points', { user_id: addedUser?.insertId });
      const jwtToken = jwt.sign({ userId: addedUser.insertId }, 'your-secret-key', { expiresIn: '24h' });
      return res.status(200).json({ success: true, status: 200, message: 'User created and login successful!', token: jwtToken });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "An internal server error occurred. Please try again later.",
      error: error.message
    });
  }
};
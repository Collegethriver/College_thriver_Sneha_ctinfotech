const Joi = require("joi");
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const config = require('../config');
const moment = require('moment');

const {
  mentorsInsert,
  mentorsUpdate,
  mentorsProfile,
  allmentors,
  mentorsDelete,
  getDataWhere
} = require("../models/mentors");
const { GetAllData, GetDataById, fetchUsersById } = require("../models/commonmodel");

const saltRounds = 10;

const baseurl = config.base_url;

// Controller function to add a new mentor
exports.add = async (req, res) => {
  try {
    const { mentors_name, userId } = req.body;
    const schema = Joi.alternatives(Joi.object({
      mentors_name: Joi.string().required(),
      userId: Joi.number().required(),
    }));
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        message: message,
        error: "Validation error",
        success: false,
      });
    } else {
      const savedData = {
        name: mentors_name,
        user_id: userId,
      };
      const result = await mentorsInsert('mentors', savedData);
      // console.log('result =', result);
      if (result.affectedRows == 1) {
        return res.status(200).json({ success: true, message: 'mentors added successfully!' });
      } else {
        return res.status(400).json({ success: false, message: 'Error adding mentors. Please try again later.' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error.message,
    });
  }
};

// Controller function to update mentor details
exports.update = async (req, res) => {

  try {
    const { id, mentors_name, userId } = req.body;
    const schema = Joi.alternatives(Joi.object({
      mentors_name: Joi.string().required(),
      userId: Joi.number().required(),
      id: Joi.number(),
    }));
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        message: message,
        error: "Validation error",
        success: false,
      });
    } else {

      const UpdateData = {
        name: mentors_name,
        user_id: userId,
      };
      const wherecondition = {
        id: id
      };

      const result = await mentorsUpdate('mentors', UpdateData, wherecondition);
      if (result.affectedRows == 1) {
        return res.status(200).json({ success: true, message: 'mentors details updated successfully!' });
      } else {
        return res.status(400).json({ success: false, message: 'Error updating mentors details. Please try again later.' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error.message,
    });
  }
};

// Controller function to get all mentors
exports.all_mentors = async (req, res) => {
  try {
    // let userId = req.authUser
    // let getUsers = await fetchUsersById(userId);
    // // console.log(favcheck)
    // let course = getUsers[0].stream
    const mentorsAvailability = await allmentors('mentors');
    // const mentorExists = mentorsAvailability.filter(mentor => {
    //   return mentor.beforeMentored == 'yes' && mentor.mentorExperince !== null
    // })

    // if (mentorExists.length > 0) {
    const now = moment();
    const availableMentors = mentorsAvailability.filter(mentor => {
      const dateFrom = moment(mentor.date_from, 'YYYY-MM-DD');
      const dateTo = moment(mentor.date_to, 'YYYY-MM-DD');
      const timeFrom = moment(mentor.time_from, 'HH:mm');
      const timeTo = moment(mentor.time_to, 'HH:mm');
      // const mentorsExpertise = mentor.expertise
      const currentDate = now.format('YYYY-MM-DD');
      const currentTime = now.format('HH:mm');

      return (now.isBetween(dateFrom, dateTo, 'day', '[]') &&
        currentTime >= timeFrom.format('HH:mm') &&
        currentTime <= timeTo.format('HH:mm'))
    });
    if (availableMentors.length > 0) {
      await Promise.all(
        availableMentors.map(async (item) => {
          if (item.dob != null) {
            // Convert dob to mm/dd/yyyy format
            const dobDate = new Date(item.dob);
            const mm = String(dobDate.getMonth() + 1).padStart(2, '0'); // January is 0!
            const dd = String(dobDate.getDate()).padStart(2, '0');
            const yyyy = dobDate.getFullYear();
            item.dob = mm + '/' + dd + '/' + yyyy;
          } else {
            item.dob = null;
          }

          if (item.profile_image != null) {
            item.profile_image = baseurl + "profile/" + item.profile_image;
          } else {
            item.profile_image = null;
          }
        })
      );
      return res.status(200).json({ success: true, message: 'all mentors found successfully', all_mentors: availableMentors });
    } else {
      return res.status(400).json({ success: false, message: 'mentors are not available', all_mentors: [] });
    }
    // } else {
    //   return res.status(400).json({ success: false, message: 'mentors not found', availableMentors: [] });
    // }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error.message,
    });
  }
};

// Controller function to view mentor profile
exports.view_profile = async (req, res) => {

  const {
    id
  } = req.body;

  const wherecondition = {
    id: id
  };

  const result = await mentorsProfile('mentors', wherecondition);
  if (result) {
    return res.status(200).json({ success: true, message: 'mentors found!', data: result });
  } else {
    return res.status(400).json({ success: false, message: 'mentors not found. Please check your details.', data: '' });
  }
};

// Controller function to delete a mentor
exports.delete = async (req, res) => {
  const {
    id
  } = req.body;

  const wherecondition = {
    id: id
  };

  const result = await mentorsDelete('mentors', wherecondition);
  if (result.affectedRows == 1) {
    return res.status(200).json({ success: true, message: 'mentors deleted successfully' });
  } else {
    return res.status(400).json({ success: false, message: 'Error deleting mentors. Please try again later.' });
  }
};


// mentor panel start //

// Render mentor signup page
exports.mentorsignuppage = async (req, res) => {
  try {
    const message = req.query.msg || ""; // Retrieve message from query parameter or set it to empty string if not available
    res.render(path.join(__dirname, '../view/', 'mentorSingup.ejs'), { baseurl: baseurl, msg: message, req: req });
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle mentor signup form submission
exports.mentorsignup = async (req, res) => {
  try {

    const { firstname, lastname, email, password, dob, branch, collegename, city,
      phonenumber, address, zipcode, career, expertise, beforeMentored, mentorExperince,
      MentorName, contactWithMentor, additionalInfo, additionalResorce, dateFrom, dateTo, daysTimesFrom, daysTimesTo
    } = req.body;
    console.log(' req.body>>>>>>>>>>>>>>>>>', req.body);
    // Validate input using Joi
    const schema = Joi.object({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      c_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Your password and confirmation password do not match',
      }),
      dob: Joi.date().required(),
      branch: Joi.string().required(),
      collegename: Joi.string().required(),
      city: Joi.string().required(),
      phonenumber: Joi.number().min(10).required(),
      address: Joi.string().required(),
      zipcode: Joi.string().required(),
      career: Joi.string().required(),
      expertise: Joi.string().required(),
      beforeMentored: Joi.string().required(),
      mentorExperince: Joi.string().required(),
      MentorName: Joi.string().required(),
      contactWithMentor: Joi.string().required(),
      additionalInfo: [Joi.string().empty().optional().allow('')],
      additionalResorce: [Joi.string().empty().optional().allow('')],
      dateFrom: Joi.string().required(),
      dateTo: Joi.string().required(),
      daysTimesFrom: Joi.string().required(),
      daysTimesTo: Joi.string().required()
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      const message = validationResult.error.details.map((i) => i.message).join(",");
      res.redirect(`/mentor-signup?msg=${encodeURIComponent(message)}&firstname=${encodeURIComponent(firstname)}&lastname=${encodeURIComponent(lastname)}&email=${encodeURIComponent(email)}&dob=${encodeURIComponent(dob)}&branch=${encodeURIComponent(branch)}&collegename=${encodeURIComponent(collegename)}&city=${encodeURIComponent(city)}`);
    } else {

      const emailExists = await getDataWhere('mentors', `where email = '${email}'`);

      if (emailExists.length > 0) {
        res.redirect(`/mentor-signup?msg=${encodeURIComponent("This email already exists!")}&firstname=${encodeURIComponent(firstname)}&lastname=${encodeURIComponent(lastname)}&email=${encodeURIComponent(email)}&dob=${encodeURIComponent(dob)}&branch=${encodeURIComponent(branch)}&collegename=${encodeURIComponent(collegename)}&city=${encodeURIComponent(city)}`);
      } else {
        if (req.file) {
          const file = req.file;
          console.log('file>>>>>>>>>>>>>>>>>>>>>>>', file);
          image = file.filename;
        } else {
          image = null
        }
        let course = expertise.toLowerCase()
        const savedData = {
          name: firstname,
          lname: lastname,
          profile_image: image,
          email: email,
          password: await bcrypt.hash(password, saltRounds),
          dob: dob,
          branch: branch,
          clg_name: collegename,
          ethnicity: city,
          is_active: 1,
          PhoneNumber: phonenumber,
          address: address,
          zip_code: zipcode,
          career: career,
          expertise: course,
          beforeMentored: beforeMentored,
          mentorExperince: mentorExperince,
          MentorName: MentorName,
          contactWithMentor: contactWithMentor,
          additionalInfo: additionalInfo,
          additionalResorce: additionalResorce,
          date_from: dateFrom,
          date_to: dateTo,
          time_from: daysTimesFrom,
          time_to: daysTimesTo
        };
        const result = await mentorsInsert('mentors', savedData);
        // console.log('result =', result);
        if (result.affectedRows == 1) {
          // return res.status(200).json({success : true, message : 'mentors added successfully!'});
          res.redirect(`/mentor-login?msg=${encodeURIComponent("mentors added successfully!")}`);
        } else {
          // return res.status(400).json({success : false, message : 'Error adding mentors. Please try again later.'});
          res.redirect(`/mentor-signup?msg=${encodeURIComponent("Error adding mentors. Please try again later.!")}`);
        }
        console.log(">>>>>>>>>>>>>>>>>>>>2222222222222");

      }
      // console.log(">>>>>>>>>>>>>>>>>>>>emailExists",emailExists.length); return;
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Render mentor login page
exports.mentorloginpage = async (req, res) => {
  try {
    // const message = 'Mentor Added Successfully' || ""; // Retrieve message from query parameter or set it to empty string if not available
    res.render(path.join(__dirname, '../view/', 'mentorLogin.ejs'), { baseurl: baseurl, msg: null });
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle mentor login form submission
exports.mentorlogin = async (req, res) => {
  try {

    const { email, password } = req.body;
    // Validate input using Joi
    const schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: ['com', 'in'] } }).required().messages({ 'string.empty': 'Email cannot be empty' }),
      password: Joi.string().min(8).max(16).required().messages({ 'string.empty': 'Password cannot be empty' })
    });
    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      console.log('validationResult.error', validationResult.error);
      const message = validationResult.error.details.map((i) => i.message).join(",");
      res.redirect(`/mentor-login?msg=${encodeURIComponent(message)}`);

    } else {
      // Fetch user data from the database
      const userData = await mentorsProfile('mentors', { email: email });
      if (userData.length > 0) {
        if (userData[0].is_active > 0) {
          const match = bcrypt.compareSync(password, userData[0]?.password);
          if (match) {
            // User authentication successful, generate JWT token
            const token = jwt.sign({ userId: userData[0]?.id }, 'your-secret-key', { expiresIn: '24h' });
            req.session.mentortoken = token;
            req.session.loggedOut = false;
            localStorage.setItem("mentortoken", token);
            const chats = await getDataWhere('chats', `where mentor_id=${userData[0]?.id}`);
            console.log('chats', chats);
            await Promise.all(chats.map(async (chat) => {
              const user = await GetDataById('users', { id: chat.user_id });
              console.log('user<<<<<<<<<<<<<<<<<<<<<________________', user);
              chat.user = user[0];
              console.log('chat.user.>>>>>>>>>>>>>>>', chat.user);
              if (chat.user.profile_image) {
                chat.user.profile_image = `${config.base_url}profile/${chat.user.profile_image}`
              }
              return chat
            }))
            if (chats.length != 0) {
              results = chats
            } else {
              results = []
            }
            let mentorsData = await mentorsProfile('mentors', { id: userData[0]?.id });
            res.render(path.join(__dirname, '../view/', 'chat-box.ejs'), { baseurl: baseurl, mentordata: mentorsData, msg: "", session: req.session, token: token, result: results });
          } else {
            res.render(path.join(__dirname, '../view/', 'mentorLogin.ejs'), { baseurl: baseurl, msg: 'Incorrect password' });
          }
        } else {
          res.render(path.join(__dirname, '../view/', 'mentorLogin.ejs'), { baseurl: baseurl, msg: 'Email verification required. Check your inbox for a confirmation link' })
        }
      } else {
        res.render(path.join(__dirname, '../view/', 'mentorLogin.ejs'), { baseurl: baseurl, msg: 'User not found' })
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle mentor logout
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect('/mentor-login');
    });

    // res.redirect(`/mentor-login`);
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Render chat box for a specific mentor
exports.chatbox = async (req, res) => {
  try {

    const token = jwt.sign({ userId: req.params.mentorsId }, 'your-secret-key');
    req.session.mentor_Id = req.authUser;
    localStorage.setItem("mentortoken", token);

    const chats = await getDataWhere('chats', `where mentor_id=${req.params.mentorsId}`);

    await Promise.all(chats.map(async (chat) => {
      const user = await GetDataById('users', { id: chat.user_id });
      chat.user = user[0];
      if (chat.user.profile_image) {
        chat.user.profile_image = `${config.base_url}profile/${chat.user.profile_image}`
      }
      return chat
    }))
    if (chats.length != 0) {
      results = chats
    } else {
      results = []
    }
    let mentorsData = await mentorsProfile('mentors', { id: req.params.mentorsId });
    res.render(path.join(__dirname, '../view/', 'chat-box.ejs'), {
      baseurl: baseurl,
      mentordata: mentorsData, msg: "", session: req.session,
      token: token, result: results
    });

  } catch (error) {
    return handleServerError(res, error);
  }
};

// Render edit profile page for mentor
exports.mentoreditprofile = async (req, res) => {
  try {
    console.log(req.session); //return;
    const mentorId = req.params.mentorsId;
    const result = await mentorsProfile('mentors', { id: mentorId });
    mentorsData = result;
    res.render(path.join(__dirname, '../view/', 'editprofile.ejs'), { baseurl: baseurl, mentordata: mentorsData, session: req.session, msg: result, alertmsg: '' });
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle mentor profile update
exports.mentorupdateprofile = async (req, res) => {
  try {

    const { mentorId, name, lname, email, gender, dob, ethnicity,
      PhoneNumber, address, zip_code, career, expertise, beforeMentored, mentorExperince,
      MentorName, contactWithMentor, additionalInfo, additionalResorce, dateFrom, dateTo, daysTimesFrom, daysTimesTo

    } = req.body;

    const result = await mentorsProfile('mentors', { id: mentorId });
    let mentorsData = result;
    // Validate input using Joi
    const schema = Joi.object({
      mentorId: Joi.string().min(1).required(),
      name: Joi.string().min(1).required(),
      lname: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
      gender: Joi.string().valid('male', 'female').required(),
      dob: [Joi.string().empty().optional().allow('')],
      ethnicity: [Joi.string().min(1).empty().optional().allow('')],
      PhoneNumber: [Joi.string().min(10).empty().optional().allow('')],
      address: [Joi.string().empty().optional().allow('')],
      zip_code: [Joi.string().empty().optional().allow('')],
      career: [Joi.string().empty().optional().allow('')],
      expertise: [Joi.string().empty().optional().allow('')],
      beforeMentored: [Joi.string().empty().optional().allow('')],
      mentorExperince: Joi.string().optional(),
      MentorName: Joi.string().optional(),
      contactWithMentor: Joi.string().optional(),
      additionalInfo: Joi.string().optional(),
      additionalResorce: Joi.string().optional(),
      dateFrom: Joi.string().optional(),
      dateTo: Joi.string().optional(),
      daysTimesFrom: Joi.string().optional(),
      daysTimesTo: Joi.string().optional()
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      const message = validationResult.error.details.map((i) => i.message).join(",");
      // return res.render(path.join(__dirname, '../view/', 'editprofile.ejs'), {baseurl: baseurl, alertmsg: message });
      return res.render(path.join(__dirname, '../view/', 'editprofile.ejs'), {
        baseurl: baseurl,
        mentordata: mentorsData,
        session: req.session, // Pass session data
        msg: result,
        alertmsg: message
      });

    } else {
      // Fetch user data from the database
      const userData = await mentorsProfile('mentors', { id: mentorId });
      if (userData.length === 0) {
        return res.render(path.join(__dirname, '../view/', 'editprofile.ejs'), { baseurl: baseurl, alertmsg: 'User not found' });
      }
      let course = expertise.toLowerCase()
      const user = userData[0];
      let Updatefield = {
        name: name,
        lname: lname,
        email: email,
        gender: gender,
        dob: dob,
        ethnicity: ethnicity,
        PhoneNumber: PhoneNumber,
        address: address,
        zip_code: zip_code,
        career: career,
        expertise: course,
        beforeMentored: beforeMentored,
        mentorExperince: mentorExperince,
        MentorName: MentorName,
        contactWithMentor: contactWithMentor,
        additionalInfo: additionalInfo,
        additionalResorce: additionalResorce,
        date_from: dateFrom,
        date_to: dateTo,
        time_from: daysTimesFrom,
        time_to: daysTimesTo
      };

      if (req.file) {
        const file = req.file;
        Updatefield.profile_image = file.filename;
        if (userData[0]?.profile_image) {
          if (fs.existsSync(path.join(__dirname, '..', 'public/profile/', userData[0]?.profile_image))) {
            fs.unlinkSync(path.join(__dirname, '..', 'public/profile/', userData[0]?.profile_image));
          }
        }
      } else {
        // Assuming userData is defined earlier in your code
        Updatefield.profile_image = userData[0]?.profile_image;
      }
      // Update profile information
      await mentorsUpdate('mentors', Updatefield, { id: mentorId });
      req.session.message = 'Profile updated successfully';
      res.redirect(`/mentor-editprofile/${mentorId}`);
      // return res.render(path.join(__dirname, '../view/', 'editprofile.ejs'), { baseurl: baseurl,alertmsg:'', msg: userData});
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Render mentor profile page
exports.mentorprofile = async (req, res) => {
  try {

    const result = await mentorsProfile('mentors', { id: req.params.mentorsId });
    let mentorsData = result;
    res.render(path.join(__dirname, '../view/', 'profile.ejs'), { baseurl: baseurl, mentordata: mentorsData, session: req.session, msg: result });
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Render change password page for mentor
exports.changepassword = async (req, res) => {
  try {
    console.log('req.params', req.params);
    // return false
    let mentordata = await mentorsProfile('mentors', { id: req.params.mentorsId });
    console.log('mentordata>>>>>>>>>>>>', mentordata);
    res.render(path.join(__dirname, '../view/', 'changePassword.ejs'), { baseurl: baseurl, mentordata: mentordata, session: req.session, msg1: "", msg: "" });
  } catch (error) {
    return handleServerError(res, error);
  }
};

//function to use update mentor password
exports.updatementorPassword = async (req, res) => {
  try {
    const { mentorId, current_password, new_password, cnew_password } = req.body;

    // Validate input using Joi
    const schema = Joi.object({
      mentorId: Joi.string().min(1).required(),
      current_password: Joi.string().min(8).required(),
      new_password: Joi.string().min(8).required(),
      cnew_password: Joi.string().min(8).required().valid(Joi.ref('new_password')).messages({
        'any.only': 'Passwords do not match',
      }),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      const message = validationResult.error.details.map((i) => i.message).join(",");
      req.session.message = message;
      res.redirect(`/changepassword/${mentorId}`);
    } else {
      console.log(">>>>>>>>>>>>>>", req.body);

      //  return;
      // Fetch user data from the database
      const userData = await mentorsProfile('mentors', { id: mentorId });
      console.log(">>>>>>>>>>>>>>", userData);
      // return
      if (userData.length === 0) {
        req.session.message = 'User not found';
        res.redirect(`/changepassword/${mentorId}`);
      }
      const user = userData[0];
      // Check if current password matches
      const isPasswordValid = bcrypt.compareSync(current_password, user.password);
      if (isPasswordValid) {
        // Password is correct, proceed with password update
        const hashedPassword = bcrypt.hashSync(new_password, 10); // Hash new password
        await mentorsUpdate('mentors', { password: hashedPassword }, { id: mentorId });
        msg1 = 'Password updated successfully';
        res.render(path.join(__dirname, '../view/', 'changePassword.ejs'), { baseurl: baseurl, mentordata: userData, msg1: 'Password updated successfully' });
      } else {
        // Password is incorrect, render view with error message
        req.session.message = 'Current password is incorrect'
        res.render(path.join(__dirname, '../view/', 'changePassword.ejs'), { baseurl: baseurl, mentordata: userData, session: req.session, msg1: "", msg: "" });
      }

    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.livechatm = async (req, res) => {
  try {
    console.log(req.session);
    req.params.mentorsId//return;
    res.render(path.join(__dirname, '../view/', 'livechatNew.ejs'), { baseurl: baseurl, msg: req.params.mentorsId, session: req.session });

  } catch (error) {
    return handleServerError(res, error);
  }
};

//Function to use get chat list of particular mentor
exports.getMyChats = async (req, res) => {
  try {
    let { mentor_id } = req.params;

    mentor_id = parseInt(mentor_id);

    const chats = await getDataWhere('chats', `where mentor_id=${mentor_id}`);

    await Promise.all(chats.map(async (chat) => {
      const user = await GetDataById('users', { id: chat.user_id });
      chat.user = user[0];
      if (chat.user.profile_image) {
        chat.user.profile_image = `${config.base_url}profile/${chat.user.profile_image}`
      }
      return chat
    }))
    if (chats.length != 0) {
      return res.status(200).json({ success: true, message: 'chats found!', data: chats });
    } else {
      return res.status(400).json({ success: false, message: 'mentors not found. Please check your details.', data: '' });
    }
  } catch (error) {
    console.log(error);
    return handleServerError(res, error);
  }

};

// mentor panel end //

//  server error start
const handleServerError = (res, error) => {
  console.log(error);
  return res.status(500).json({
    success: false,
    message: "An internal server error occurred. Please try again later.",
    status: 500,
    error: error.message,
  });
};
//  server error end
const Joi = require("joi");
const path = require('path');
const bcrypt = require("bcrypt");
const fs = require('fs');
const {
  InsertData, UpdateData, DeleteById, GetAllData, GetDataById, checkEmailExists, GetTopStudent, Jointbl, GetDataByIdmessage,
  getDataWhere
} = require("../models/commonmodel");
const saltRounds = 10;
const config = require('../config');


// const baseurl = "http://192.168.1.40:4000";
const baseurl = config.base_url;

exports.updatenew = async (req, res) => {
  try {
    console.log('>>>>>>>>>>>>>>>uploadprofile',req.file);
    // return false;
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.uploadprofile = async (req, res) => {
  try {
      if (req.file) {
        const file = req.file; 
        const Updatefield = {
          profile_image: file.filename,
        };
        const wherecondition = {
          id:req.authUser    
        };
        const userCheck = await GetDataById('users', wherecondition);
        if (userCheck[0]?.profile_image) {
          if (fs.existsSync( path.join(__dirname, '..', 'public/profile/', userCheck[0]?.profile_image))) {
            fs.unlinkSync(path.join(__dirname, '..', 'public/profile/', userCheck[0]?.profile_image));
          }
        }
        
        const result = await UpdateData('users',Updatefield,wherecondition);
        if(result.affectedRows == 1){
          return res.status(200).json({ success:true, status: 200, message:'User profile updated successfully!' });
        }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating user profile. Please try again later.' });
        }
      }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    
    const {
      name,
      lname,
      // email,
      gender,
      dob,
      ethnicity,
      hgh_scl_name,
      school_year,
      gpa,
      group_affiliation,
      graduation_month,
      graduation_year
    } = req.body;



    const schema = Joi.alternatives(Joi.object({
      name : Joi.string().regex(/^[a-zA-Z\s]+$/).empty().messages({
        'string.pattern.base': 'Only alphabets are allowed for this {{#label}}',
      }),
      lname : Joi.string().regex(/^[a-zA-Z\s]+$/).empty().messages({
        'string.pattern.base': 'Only alphabets are allowed for this {{#label}}',
      }),
      gender : Joi.string().allow('').optional(),
      dob : Joi.string().allow('').optional(),
      ethnicity : Joi.string().allow('').optional(),
      // ethnicity : Joi.array().items(Joi.string()).min(1).empty(),
      hgh_scl_name :  Joi.string().allow('').optional(),
      school_year : Joi.string().allow('').optional(),
      // gpa : Joi.string().empty(), 
      gpa : Joi.number().allow('').optional(),
      group_affiliation : Joi.string().allow('').optional(),
      graduation_month : Joi.string().allow('').optional(),
      graduation_year : Joi.string().allow('').optional(),
    }));
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      const message = validationResult.error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        success : false,
        status: 400,
        message : message,
        error : "Validation error",
      });
    } else { 
    const wherecondition = {
      id:req.authUser   
    };
    const userDeatils = await GetDataById('users',wherecondition);
    const Updatefield = {
      name : name ? name : userDeatils[0]?.name,
      lname : lname ? lname : userDeatils[0]?.lname,
      // email : email ? email : userDeatils[0]?email.,
      gender : gender ? gender : userDeatils[0]?.gender,
      dob : dob ? dob : userDeatils[0]?.dob,
      ethnicity : ethnicity ? ethnicity : userDeatils[0]?.ethnicity,
      hgh_scl_name : hgh_scl_name ? hgh_scl_name : userDeatils[0]?.hgh_scl_name,
      school_year : school_year ? school_year : userDeatils[0]?.school_year,
      gpa : gpa ? gpa : userDeatils[0]?.gpa,
      group_affiliation : group_affiliation ? group_affiliation : userDeatils[0]?.group_affiliation,
      graduation_month : graduation_month ? graduation_month : userDeatils[0]?.graduation_month,
      graduation_year : graduation_year ? graduation_year : userDeatils[0]?.graduation_year
    };
    const result = await UpdateData('users',Updatefield,wherecondition);
    if(result.affectedRows == 1){
      return res.status(200).json({ success:true, status: 200, message:'User details updated successfully!' });
    }else{
      return res.status(400).json({ success:false, status: 400, message:'Error updating user details. Please try again later.' });
    }
  }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.all_users = async (req, res) => {
  try {
    const result = await GetAllData('users');
    if(result){
      return res.status(200).json({ success:true, status: 200, message:'User found..', data:result });
    }else{
      return res.status(400).json({ success:false, status: 400, message:'User not found. Please check your details.', data:'' });
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.view_profile = async (req, res) => {
  try {
      const wherecondition = {
        id:req.authUser    
      };

      const result = await GetDataById('users',wherecondition);
      if(result){
        result[0].profile_image = result[0]?.profile_image ?  baseurl + "/profile/" + result[0]?.profile_image : null;
        return res.status(200).json({ success:true, status: 200, message:'User found..',data:result });
      }else{
        return res.status(400).json({ success:false, status: 400, message:'User not found. Please check your details.',data:'' });
      }
  } catch (error) {
    return handleServerError(res, error);
  }
};

function calculateRoadmapProgress(user) {
  // Placeholder implementation - replace with actual logic
  // Let's assume roadmap_progress is derived from some user attributes or activities
  let progress = 0;

  // Example logic:
  if (user) {
    progress = (user/325) * 100; // Each activity gives 10 progress points
  }
  return progress;
}


exports.reward = async (req, res) => {
  try {
    let rewardData = {};
    const result = await Jointbl('activites_points', 'users', req.authUser);
    
    if (result) {
      rewardData.name = result[0]?.name ? `${result[0].name} ${result[0].lname}` : null;
      rewardData.profileImg = result[0]?.profile_image ? `${baseurl}/profile/${result[0].profile_image}` : null;
      rewardData.reward_points = result[0]?.all_points ? result[0].all_points : null;

      // Calculate roadmap progress using the user data
      let roadmap_progress = calculateRoadmapProgress(result[0]?.all_points);

      // Compare reward_points with roadmap_progress
      if (rewardData.reward_points > roadmap_progress) {
        rewardData.progress_status = "Reward points exceed progress.";
      } else {
        rewardData.progress_status = "Progress is greater or equal to reward points.";
      }

      rewardData.roadmap_progress = parseFloat(roadmap_progress).toFixed(1);

      return res.status(200).json({ success: true, status: 200, message: 'User found.', data: rewardData });
    } else {
      return res.status(400).json({ success: false, status: 400, message: 'User not found. Please check your details.', data: '' });
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    const wherecondition = {
      id:req.authUser    
    };

    const result = await DeleteById('users',wherecondition);
    if(result.affectedRows == 1){
      return res.status(200).json({ success:true, status: 200, message:'User deleted successfully' });
    }else{
      return res.status(400).json({ success:false, status: 400, message:'Error deleting user. Please try again later.' });
    }
  } catch (error) {
    return handleServerError(res, error);
  }  
};


exports.changepassword = async (req, res) => { 
  try {
    const {password, confirmpassword} = req.body;
    const userid = req.authUser;
    const schema = Joi.object({
      password : Joi.string().min(8).required(),
      confirmpassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Please ensure the passwords match.',
        'any.required': 'Confirmation password is required',
        // Add more custom messages if necessary
      }),
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
      const userCheck = await GetDataById('users', {id : userid});
      if (userCheck.length > 0) {
         await UpdateData('users',{password :  await bcrypt.hash(password, saltRounds)},{id : userid});
         return res.status(200).json({ success: true, status: 200, message: 'changed password successfully' });
      } else {
        return res.status(400).json({ success: false, status: 400, message: 'Error change password. Please try again later' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.topstudent = async (req, res) => {
  try {
      
      const collegeData = await GetTopStudent('activites_points', 'id, user_id, all_points', 'all_points', 'DESC');
      for (const student of collegeData) {
          const UserDetails = await GetDataById('users', { id: student?.user_id });
          const fullName = UserDetails[0]?.name ? `${UserDetails[0]?.name} ${UserDetails[0]?.lname}`: null;
          student.fullname = fullName;
          student.title_clg = UserDetails[0]?.hgh_scl_name ? `${UserDetails[0]?.hgh_scl_name}`: null;
          student.profile_image = UserDetails[0]?.profile_image ?  baseurl + "/profile/" + UserDetails[0]?.profile_image : null;
      }
        // return false;
      if(collegeData){
        return res.status(200).json({ success:true, status: 200, message:'Top student found..' ,topstudentCount :collegeData.length, data:collegeData });
      }else{
        return res.status(400).json({ success:false, status: 400, message:'Top student not found. Please check your details.', topstudentCount :0, data:'' });
      }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.chat_with_mentor = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);

    // Retrieve chat data
    const chat = await getDataWhere('chats', `WHERE mentor_id=${id} AND user_id=${req.authUser}`);

    if (chat.length > 0) {
      // If chat exists, retrieve mentor's name
      const mentor = await getDataWhere('mentors', `WHERE id=${id}`);

      if (mentor.length > 0) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: 'Chat Retrieved Successfully',
          chat: chat[0],
          mentor_name: mentor[0].name, // Include mentor's name in response
          mentor_profile:mentor[0].profile_image,
          mentor_profile_url : mentor[0].profile_image ? baseurl + 'profile/'+ mentor[0].profile_image : null
        });
      }
    }

    // If chat doesn't exist, create a new chat
    const data = {
      user_id: req.authUser,
      mentor_id: id
    };

    const result = await InsertData('chats', data);
    const chatData = await getDataWhere('chats', `WHERE id=${result.insertId}`);

    // Retrieve mentor's name for the newly created chat
    const mentor = await getDataWhere('mentors', `WHERE id=${id}`);
    if (mentor.length > 0) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'Chat Created Successfully',
        chat: chatData[0],
        mentor_name: mentor[0].name, // Include mentor's name in response
        mentor_profile:mentor[0].profile_image,
        mentor_profile_url : mentor[0].profile_image ? baseurl + 'profile/'+ mentor[0].profile_image :null
      });
    }

    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to retrieve mentor information'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal Server Error'
    });
  }
};

exports.sendMessage = async (req,res)=>{
  const {chat_id, sender_id , isMentor , content} = req.body;
    const userid = req.authUser;
    const schema = Joi.object({
      chat_id : Joi.number().required(),
      sender_id: Joi.number().required(),
      isMentor: Joi.number().required(),
      content:Joi.string().required()
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
    }
    else{
      const data ={
        chatId:chat_id,
        sender_id:sender_id,
        isMentor:isMentor,
        content:content
      }
      const result  = await InsertData('message',data);

      const wherecondition = {
        id:chat_id    
      };

      const chat = await GetDataById('chats',wherecondition);

      console.log(">>>>>>>>",chat[0]);

      const user_id = chat[0].user_id;
      const mentor_id = chat[0].mentor_id
      const io = req.app.get('io');
      if(isMentor){
        console.log('here is the console')
        io.to(user_id.toString()).emit('new-message', {
          sender:sender_id,
          isMentor:1,
          message:content
         });
      }
      else{
        io.to(mentor_id.toString()).emit('new-message',{
          sender:sender_id,
          isMentor:0,
          message:content
         });
      }
      return res.status(200).json({ success: true, message: 'Message sent successfully.' });

    }
}

exports.getAllMessages = async(req,res)=>{
  let {chatId} = req.params;

  chatId = parseInt(chatId);

  const wherecondition = {
    chatId:chatId   
  };




  const message = await GetDataByIdmessage('message',chatId );

  return res.status(200).json({ success: true, message: 'Message sent successfully.',messages:message });

}

exports.geUserChats = async (req, res) => {
  try {
  const chats = await getDataWhere('chats',`where user_id=${req.authUser}`);

  console.log('chats',chats)

  await Promise.all(chats.map(async(chat)=>{
    const mentor = await GetDataById('mentors', {id:chat.mentor_id});
    chat.mentor = mentor[0];
    if(chat.mentor.profile_image){
      chat.mentor.profile_image = `${config.base_url}profile/${chat.mentor.profile_image}`
    }
    return chat
  }))
  if (chats.length!=0) {
    return res.status(200).json({ success: true, message: 'chats found!', data: chats });
  } else {
    return res.status(400).json({ success: false, message: 'mentors not found. Please check your details.', data: '' });
  }
  } catch (error) {
    console.log(error);
    return handleServerError(res, error);
  }
  
};


//  server error start
const handleServerError = (res, error) => {
  return res.status(500).json({
    success: false,
    message: "An internal server error occurred. Please try again later.",
    status: 500,
    error: error.message,
  });
};
//  server error end


exports.livechat = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'view', 'livechatNew.html');
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      console.log('File does not exist!');
    }
  } catch (error) {
    return handleServerError(res, error);
  }
}; 
const Joi = require("joi");
const path = require('path');
const bcrypt = require("bcrypt");
const fs = require('fs');
const {
  InsertData, UpdateData, DeleteById, GetAllData, GetDataById, filterData, GetPointsUserId, whereDataRes
} = require("../models/commonmodel");

// screen first start //
exports.collegematchone = async (req, res) => {
    try {
      const { firstGen, address, city, state, zip, college_year } = req.body; 
      const schema = Joi.alternatives(Joi.object({
        firstGen : Joi.string().empty(),
        address : Joi.string().empty(),
        city: Joi.string().empty(),
        state: Joi.string().empty(),
        zip: Joi.number().empty(),
        college_year: Joi.number().empty(),
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
        
        const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
        const Updatefield = {
          points_11	 : 25,
          first_gen : firstGen ? firstGen : getActivityData[0]?.first_gen,
          address : address ? address : getActivityData[0]?.address,
          city : city ? city : getActivityData[0]?.city,
          state : state ? state : getActivityData[0]?.state,
          zip_code : zip ? zip : getActivityData[0]?.zip_code,
          college_year : college_year ? college_year : getActivityData[0]?.college_year,
        };

        const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
        if(result.affectedRows == 1){
          const points = await GetPointsUserId({ user_id: req.authUser });
          await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
          if(getActivityData[0]?.first_gen == ''){
            return res.status(200).json({ success:true, status: 200, message:'College match details insert successfully!' });
          }
            return res.status(200).json({ success:true, status: 200, message:'College match details updated successfully!' });
        }else{
            return res.status(400).json({ success:false, status: 400, message:'Error updating College match details. Please try again later.' });
        }
      }
    } catch (error) {
      return handleServerError(res, error);
    }
};

// Handle updating college match details - Part Two
exports.collegematchtwo = async (req, res) => {
  try {
    const { college_location, sat_score, act_score } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      college_location : Joi.string().empty(),
      sat_score : Joi.number().empty(),
      act_score: Joi.number().empty(),
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
  
      const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
      const Updatefield = {
        points_12	 : 25,
        college_location : college_location ? college_location : getActivityData[0]?.college_location,
        sat_score : sat_score ? sat_score : getActivityData[0]?.sat_score,
        act_score : act_score ? act_score : getActivityData[0]?.act_score,
     };
     
      const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
      
      if(result.affectedRows == 1){
        const points = await GetPointsUserId({ user_id: req.authUser });
        await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
        if(getActivityData[0]?.college_location == ''){
          return res.status(200).json({ success:true, status: 200, message:'College match details insert successfully!' });
        }
          return res.status(200).json({ success:true, status: 200, message:'College match details updated successfully!' });
      }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating College match details. Please try again later.' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle updating college match details - Part Three
exports.collegematchthree = async (req, res) => {
    console.log("college-match-THREE =====>",req.body);
    // return false
  try {
    const { planned_major, social_activity, attendtype } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      planned_major : Joi.string().empty(),
      social_activity : Joi.string().empty(),
      attendtype: Joi.string().empty(),
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
  
      
      const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
      const Updatefield = {
        points_13	 : 25,
        planned_major : planned_major ? planned_major : getActivityData[0]?.planned_major,
        social_activities : social_activity ? social_activity : getActivityData[0]?.social_activities,
        attend_type : attendtype ? attendtype : getActivityData[0]?.attend_type,
     };
     
      const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
      
      if(result.affectedRows == 1){
        const points = await GetPointsUserId({ user_id: req.authUser });
        await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
       
        if(getActivityData[0]?.planned_major == ''){
          return res.status(200).json({ success:true, status: 200, message:'College match details insert successfully!' });
        }
          return res.status(200).json({ success:true, status: 200, message:'College match details updated successfully!' });
      }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating College match details. Please try again later.' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle updating college match details - Part Fourth
exports.collegematchfour = async (req, res) => {
  try {
    const { householdincome, military_affil, paycollege } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      householdincome : Joi.string().empty(),
      military_affil : Joi.string().empty(),
      paycollege: Joi.string().empty(),
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
  
      
      const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
      const Updatefield = {
        points_14	 : 25,
        household_income : householdincome ? householdincome :  getActivityData[0]?.household_income,
        military_affiliation : military_affil ? military_affil :  getActivityData[0]?.military_affiliation,
        pay_college : paycollege ? paycollege :  getActivityData[0]?.pay_college,
     };
     
      const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
      
      if(result.affectedRows == 1){
        const points = await GetPointsUserId({ user_id: req.authUser });
        await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
       
        if(getActivityData[0]?.planned_major == ''){
          return res.status(200).json({ success:true, status: 200, message:'College match details insert successfully!' });
        }
          return res.status(200).json({ success:true, status: 200, message:'College match details updated successfully!' });
      }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating College match details. Please try again later.' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.getcollegematchone = async (req, res) => {
  try {
      const wherecondition = {
        user_id:req.authUser    
      };

      const points = await GetDataById('activites_points',wherecondition);
      if(points){
        return res.status(200).json({ success:true, status: 200, message:'User found..', all_points:points });
      }else{
        return res.status(400).json({ success:false, status: 400, message:'User not found. Please check your details.',all_points:'' });
      }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// screen first end //
// screen second start //

// Handle college screen one activity
exports.collegescreenone = async (req, res) => {
 
  try {
    const { college_fair_21 } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      college_fair_21 : Joi.string().required(),
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
      const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
      const Updatefield = {
        points_21	 : 25,
        activity_21	 : college_fair_21,
      };
      const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
      if(result.affectedRows == 1){
        const points = await GetPointsUserId({ user_id: req.authUser });
        await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
        if(getActivityData[0]?.activity_21 == null){
          return res.status(200).json({ success:true, status: 200, message:'Activity insert successfully!' });
        }
          return res.status(200).json({ success:true, status: 200, message:'Activity updated successfully!' });
      }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating activity. Please try again later.' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle college screen two activity
exports.collegescreentwo = async (req, res) => {

  const userCheck = await GetDataById('activites_points', {user_id:req.authUser});
  if(userCheck[0]?.activity_22){
    if (fs.existsSync( path.join(__dirname, '..', 'public/clg_campus/', userCheck[0]?.activity_22))) {
      fs.unlinkSync(path.join(__dirname, '..', 'public/clg_campus/', userCheck[0]?.activity_22));
    }
}
  await updateActivity(req, res, 'points_22', 'activity_22', 'College Campus uploaded successfully!');
};

// Handle college screen three activity
exports.collegescreenthree = async (req, res) => {
 
  try {
    const { clg_attending_23 } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      clg_attending_23 : Joi.string().required(),
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
      const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
      const Updatefield = {
        points_23	 : 25,
        activity_23	 : clg_attending_23,
      };
      const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
      if(result.affectedRows == 1){
        const points = await GetPointsUserId({ user_id: req.authUser });
        await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
        if(getActivityData[0]?.activity_23 == null){
          return res.status(200).json({ success:true, status: 200, message:'Activity insert successfully!' });
        }
          return res.status(200).json({ success:true, status: 200, message:'Activity updated successfully!' });
      }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating activity. Please try again later.' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle college screen four activity
exports.collegescreenfour = async (req, res) => {
  const userCheck = await GetDataById('activites_points', {user_id:req.authUser});
  if(userCheck[0]?.activity_24){
    if (fs.existsSync( path.join(__dirname, '..', 'public/commitmentLetter/', userCheck[0]?.activity_24))) {
      fs.unlinkSync(path.join(__dirname, '..', 'public/commitmentLetter/', userCheck[0]?.activity_24));
    }
  }
  await updateActivity(req, res, 'points_24', 'activity_24', 'Commitment letter uploaded successfully!');
};

// Handle college search
exports.collegesearch = async (req, res) => {
  try {
    const { searchname } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      searchname : Joi.string().allow('').optional(),
    })); 
    let result = '';
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
      // console.log(">>>>>>>>>>>>>>>>>>>searchname",searchname);
      const favcheck = await whereDataRes('favourite_college', { user_id: req.authUser });
      if(searchname == ''){
         result = await GetAllData('colleges_live'); 
      }else{
       result = await filterData('colleges_live','instnm',searchname); 
      }
      if(result){

        await Promise.all(
          result.map(async (item) => {
            // Check if the current college item's ID exists in the favcheck array
            const isFavorite = favcheck.some(entry => entry.college_id === item.id);
        
            // If the college is a favorite, handle it here
            if (isFavorite) {
              item.isFavorite = true;
            } else {
              item.isFavorite = false;
            }
          })
        );
          return res.status(200).json({ success:true, status: 200, recordCount:result.length, message:result });
      }else{
          return res.status(400).json({ success:false, status: 400, recordCount:0, message:'Error updating College match details. Please try again later.' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// screen second end //
// screen third start //

// Handle scholar search activity
exports.scholarsearch = async (req, res) => {
 
  try {
    const { scholar_search_31 } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      scholar_search_31 : Joi.string().required(),
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
      const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
      const Updatefield = {
        points_31	 : 25,
        activity_31	 : scholar_search_31,
      };
      const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
      if(result.affectedRows == 1){
        const points = await GetPointsUserId({ user_id: req.authUser });
        await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
        if(getActivityData[0]?.activity_31 == null){
          return res.status(200).json({ success:true, status: 200, message:'Activity insert successfully!' });
        }
          return res.status(200).json({ success:true, status: 200, message:'Activity updated successfully!' });
      }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating activity. Please try again later.' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle scholar shortlist activity
exports.scholarshortlist = async (req, res) => {
 
  try {
    const { shortlist_32 } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      shortlist_32 : Joi.string().required(),
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
      const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
      const Updatefield = {
        points_32	 : 25,
        activity_32	 : shortlist_32,
      };
      const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
      if(result.affectedRows == 1){
        if(getActivityData[0]?.activity_32 == null){
          const points = await GetPointsUserId({ user_id: req.authUser });
          await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
          return res.status(200).json({ success:true, status: 200, message:'Activity insert successfully!' });
        }
          return res.status(200).json({ success:true, status: 200, message:'Activity updated successfully!' });
      }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating activity. Please try again later.' });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Handle scholar apply activity
exports.scholarapply = async (req, res) => {
  try {

    const { scholar_apply_33 } = req.body; 
    const schema = Joi.alternatives(Joi.object({
      scholar_apply_33 : Joi.string().required(),
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
      const getActivityData = await GetDataById('activites_points',{user_id:req.authUser });
      const Updatefield = {
        points_33	 : 25,
        activity_33	 : scholar_apply_33,
      };
      const result = await UpdateData('activites_points',Updatefield,{ id:getActivityData[0]?.id });
      if(result.affectedRows == 1){
        if(getActivityData[0]?.activity_33 == null){
          const points = await GetPointsUserId({ user_id: req.authUser });
          await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
          return res.status(200).json({ success:true, status: 200, message:'Activity insert successfully!' });
        }
          return res.status(200).json({ success:true, status: 200, message:'Activity updated successfully!' });
      }else{
          return res.status(400).json({ success:false, status: 400, message:'Error updating activity. Please try again later.' });
      }
    }
  } catch (error) {
   return handleServerError(res, error);
  }
};

// Handle scholar college board activity
exports.scholarcollegeBoard = async (req, res) => {
 
  const userCheck = await GetDataById('activites_points', {user_id:req.authUser});
  if(userCheck[0]?.activity_34){  
    if (fs.existsSync( path.join(__dirname, '..', 'public/collegeBoards/', userCheck[0]?.activity_34))) {
      fs.unlinkSync(path.join(__dirname, '..', 'public/collegeBoards/', userCheck[0]?.activity_34));
    }
  }  
  await updateActivity(req, res, 'points_34', 'activity_34', 'College Boards uploaded successfully!');
 
};

// Handle scholar FAFSA activity
exports.scholarfafsa = async (req, res) => {

  const userCheck = await GetDataById('activites_points', {user_id:req.authUser});
  if(userCheck[0]?.activity_35){
     if (fs.existsSync( path.join(__dirname, '..', 'public/fafsas/', userCheck[0]?.activity_35))) {
      fs.unlinkSync(path.join(__dirname, '..', 'public/fafsas/', userCheck[0]?.activity_35));
    }
  }
  await updateActivity(req, res, 'points_35', 'activity_35', 'FAFSA uploaded successfully!');
};
// screen third end //

//this function used to be update activity
const updateActivity = async (req, res, pointsField, activityField, successMessage) => {
  try {
    const getActivityData = await GetDataById('activites_points', { user_id: req.authUser });
    const updateField = {
      [pointsField]: 25,
      [activityField]: req.file.filename,
    };
    const result = await UpdateData('activites_points', updateField, { id: getActivityData[0]?.id });

    if (result.affectedRows == 1) {
      const points = await GetPointsUserId({ user_id: req.authUser });
      await UpdateData('activites_points', {all_points:points[0]?.total_points}, { id: getActivityData[0]?.id });
      if (getActivityData[0]?.[activityField] === null) {
        return res.status(200).json({ success: true, status: 200, message: successMessage });
      }
      return res.status(200).json({ success: true, status: 200, message: successMessage });
    } else {
      return res.status(400).json({ success: false, status: 400, message: `Error updating ${successMessage}. Please try again later.` });
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.userpoints = async (req, res) => {
  try {
      const wherecondition = {
        user_id:req.authUser    
      };

      const points = await GetDataById('activites_points',wherecondition);
      if(points){
        return res.status(200).json({ success:true, status: 200, message:'User found..', all_points:points[0]?.all_points });
      }else{
        return res.status(400).json({ success:false, status: 400, message:'User not found. Please check your details.',all_points:'' });
      }
  } catch (error) {
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
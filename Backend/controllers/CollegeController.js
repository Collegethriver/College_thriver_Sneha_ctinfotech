const Joi = require("joi");
const path = require("path");
const bcrypt = require("bcrypt");
const fs = require("fs");
const {
  InsertData,
  UpdateData,
  GetAllData,
  GetDataById,
  whereDataRes,
  getDataWhere,
  deleteFavCollege,
  favTableJoin,
  userJoincollegeData,
  fetchJoin,

  GetAllCollages
} = require("../models/commonmodel");

exports.allcollege = async (req, res) => {
  try {
    const favcheck = await whereDataRes('favourite_college', { user_id: req.authUser });
    console.log(favcheck)
    const collegeData = await GetAllData("colleges_live");
    console.log(collegeData)
    await Promise.all(
      collegeData.map(async (item) => {
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

    if (collegeData.length > 0) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "College found..",
        collegeDetails: collegeData,
      });
    } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "College not found. Please check your details.",
        collegeDetails: "",
      });
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.favcollege = async (req, res) => {
  try {
    const { college_id, favourite } = req.body;

    // Validating request body using Joi
    const schema = Joi.object({
      favourite: Joi.string().required(), // Removed .empty()
      college_id: Joi.string().required(), // Removed .empty()
    });
    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      // Return 400 status code with validation error messages
      const message = validationResult.error.details.map((i) => i.message).join(",");
      return res.status(400).json({
        success: false,
        status: 400,
        message: message,
        error: "Validation error",
      });
    } else {
      // Check if the college is already in user's favorites
      const usercheck = await getDataWhere("favourite_college", `where user_id = ${req.authUser} and college_id = ${college_id}`);


      if (favourite == 1) {
        if (favourite == 1 && usercheck.length === 0) {
          // Add college to favorites
          await InsertData("favourite_college", {
            user_id: req.authUser,
            college_id: college_id,
          });
          return res.status(200).json({
            success: true,
            status: 200,
            message: "College has been added to favorites.",
          });
        } else {
          return res.status(200).json({
            success: true,
            status: 200,
            message: "College has already been added to favorites.",
          });
        }
      } else {
        // Remove college from favorites
        const deleteUser = await deleteFavCollege("favourite_college", `where user_id = ${req.authUser} and college_id = ${college_id}`);

        return res.status(200).json({
          success: true,
          status: 200,
          message: "The college has been removed from the favorites list.",
        });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};


exports.collegefairs = async (req, res) => {
  try {
    const { firstGen, address, city, state, zip, college_year } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        firstGen: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.number().required(),
        college_year: Joi.number().required(),
      })
    );
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      const message = validationResult.error.details
        .map((i) => i.message)
        .join(",");
      return res.status(400).json({
        success: false,
        status: 400,
        message: message,
        error: "Validation error",
      });
    } else {
      const usercheck = await GetDataById("tblname", { id: req.authUser });
      const Updatefield = {
        first_gen: firstGen,
        address: address,
        city: city,
        state: state,
        zip_code: zip,
        college_year: college_year,
      };

      const result = await UpdateData("tblname", Updatefield, {
        id: req.authUser,
      });

      if (result.affectedRows == 1) {
        if (usercheck[0]?.first_gen == "") {
          return res.status(200).json({
            success: true,
            status: 200,
            message: "College match details insert successfully!",
          });
        }
        return res.status(200).json({
          success: true,
          status: 200,
          message: "College match details updated successfully!",
        });
      } else {
        return res.status(400).json({
          success: false,
          status: 400,
          message:
            "Error updating College match details. Please try again later.",
        });
      }
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.fetchCollegeData = async (req, res) => {
  try {
    const { user_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: [Joi.string().empty().required()]
      })
    )
    console.log(req.authUser)
    const existingFavCollege = await favTableJoin(req.authUser)
    if (existingFavCollege.length != 0) {
      await Promise.all(
        existingFavCollege.map(async (item) => {
          item.isFavorite = true;
        })
      );
      // const fetchedData = favTableJoin(req.authUser)
      res.status(200).json({
        success: true,
        status: 200,
        message_status: "data fetched",
        message: existingFavCollege
      })
    }
    else {
      res.status(200).json({
        success: true,
        status: 200,
        message_status: "data not found",
        message: []
      })
    }
  }
  catch (error) {
    console.log(error)
  }
}
function calculateTentativeAverage(user) {
  // Weighted average calculation (you can adjust weights as per importance)
  const weightedSat = user.sat_score / 1600;
  const weightedAct = user.act_score / 36;
  const weightedGpa = user.gpa / 4.0;

  const tentativeAverage = (weightedSat + weightedAct + weightedGpa) / 3;

  return tentativeAverage;
}
exports.recommendedCollege = async (req, res) => {
  try {
    
    const studentdata = await userJoincollegeData(req.authUser);
    console.log("Student Data:", studentdata);
    
    if (!studentdata || studentdata.length === 0) {
      console.log("No student data found.");
      return res.status(404).json({ success: false, status: 404, message: "Student data not found." });
    }
    
    const student = studentdata[0];
    // console.log("Student:", student);
    let student_gpa=student.gpa;
    let student_sat_score=student.sat_score;
    let student_act_score=student.act_score
    let obj={
      student_gpa:student_gpa,
      student_sat_score:student_sat_score,
      student_act_score:student_act_score
    }
    const colleges = await GetAllCollages(obj);
    // console.log("Colleges:", colleges);
    
    // const matchedColleges = colleges.filter(college =>
    //   student.sat_score >= college.sat_score ||
    //   student.act_score >= college.act_score ||
    //   student.gpa >= college.gpa
    // );
    // console.log('matchedColleges', matchedColleges);
    // return false
    res.status(200).json({
      success: true,
      status: 200,
      matchedCollegesTotal: colleges.length,
      message: colleges // Return matched colleges
    });
  } catch (error) {
    console.error(error);
    return handleServerError(res, error);
  }
};

// exports.recommendedCollege = async (req, res) => {
//   try {
//     const colleges = await GetAllData("colleges_live");
//     console.log("Colleges:", colleges);

//     const studentdata = await userJoincollegeData(req.authUser);
//     console.log("Student Data:", studentdata);

//     if (!studentdata || studentdata.length === 0) {
//       console.log("No student data found.");
//       return res.status(404).json({ success: false, status: 404, message: "Student data not found." });
//     }

//     const student = studentdata[0];
//     console.log("Student:", student);

//     const requireCollegeTests = true;

//     const matchCollegeState = (student, college) => {
//       if (student.college_location) {
//         switch (student.college_location) {
//           case "In State":
//             return student.state.toUpperCase() === college.stabbr;
//           case "Out of State":
//             return student.state.toUpperCase() !== college.stabbr;
//           default:
//             return true;
//         }
//       }
//       return true;
//     };

//     const filterCollege = (student, college) => {
//       if (requireCollegeTests) {
//         if (college.gpa) {
//           if (student.gpa === college.gpa) {
//             return matchCollegeState(student, college);
//           } else {
//             return (
//               matchCollegeState(student, college) &&
//               college.gpa <= student.gpa
//             );
//           }
//         } else {
//           return false;
//         }
//       } else {
//         return (
//           matchCollegeState(student, college) &&
//           college.gpa &&
//           student.gpa <= college.gpa + 0.5 // Allow a tolerance of 0.5 GPA
//         );
//       }
//     };

//     const matchedColleges = colleges.filter((college) =>
//       filterCollege(student, college)
//     );

//     console.log(`Matching ${student.name} from ${student.state} (${student.college_location}) with ${matchedColleges.length} colleges...`);
//     console.log("Matched Colleges:", matchedColleges);

//     const scoreCollege = (student, college) => {
//       const gpaMax = 4.0;
//       const satMax = 1600.0;
//       const actMax = 36.0;

//       let score = 0;

//       if (college.gpa && student.gpa) {
//         const gpaDifference = Math.abs(college.gpa - student.gpa);
//         console.log(`GPA Difference for ${college.name || "unknown college"}:`, gpaDifference);
//         score += (gpaMax - gpaDifference);
//       }

//       if (college.sat_avg && student.sat_score) {
//         const satDifference = Math.abs(college.sat_avg - student.sat_score);
//         console.log(`SAT Difference for ${college.name || "unknown college"}:`, satDifference);
//         score += (satMax - satDifference);
//       }

//       if (college.actcmmid && student.act_score) {
//         const actDifference = Math.abs(college.actcmmid - student.act_score);
//         console.log(`ACT Difference for ${college.name || "unknown college"}:`, actDifference);
//         score += (actMax - actDifference);
//       }

//       console.log(`Score for ${college.name || "unknown college"}:`, score);
//       return score;
//     };

//     matchedColleges.sort((collegeA, collegeB) => {
//       return scoreCollege(student, collegeB) - scoreCollege(student, collegeA); // Higher score is better
//     });

//     res.status(200).json({
//       success: true,
//       status: 200,
//       matchedCollegesTotal: matchedColleges.length,
//       message: matchedColleges // Return top 10 matched colleges
//     });
//   } catch (error) {
//     console.error(error);
//     return handleServerError(res, error);
//   }
// };

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

const db = require("../utils/database");

module.exports = {
    // Function to insert data into a table
    InsertData: (async (tbl, insertdata) => {
        return db.query(`INSERT INTO ${tbl} SET ?`, insertdata);
    }),

    // Function to update data in a table based on a condition
    UpdateData: (async (tbl, updatedata, wherecondition) => {
        console.log('update----->', updatedata);
        return db.query(`UPDATE ${tbl} SET ? WHERE ?`, [updatedata, wherecondition]);
    }),

    // Function to get data from a table based on a condition
    GetDataById: (async (tbl, wherecondition) => {
        return db.query(`SELECT * FROM ${tbl} WHERE ?`, wherecondition);
    }),

    // Function to get messages from a table based on chatId, ordered by id descending
    GetDataByIdmessage: (async (tbl, chatId) => {
        return db.query(`SELECT * FROM ${tbl} WHERE chatId = ? ORDER BY id DESC`, chatId);
    }),

    // Function to get data from a table based on a custom where condition
    getDataWhere: (async (table, where) => {
        return db.query(`SELECT * FROM ${table} ${where}`);
    }),

    // Function to get all data from a table
    GetAllData: (async (tbl) => {
        return db.query(`SELECT * FROM ${tbl}`);
    }),

    GetAllCollages: (async (obj) => {
        return db.query(`SELECT * 
FROM colleges_live
WHERE gpa <= ${obj.student_gpa}
  AND sat_avg <= ${obj.student_sat_score}
  AND actcmmid <= ${obj.student_act_score}
  AND (gpa > 0 OR sat_avg > 0 OR actcmmid > 0);
`);
    }),

    // Function to delete data from a table based on a condition
    DeleteById: (async (tbl, wherecondition) => {
        return db.query(`DELETE FROM ${tbl} WHERE ?`, wherecondition);
    }),

    // Function to check if an email exists in the users table
    checkEmailExists: (async (wherecondition) => {
        return db.query(`SELECT * FROM users WHERE email = ?`, [wherecondition]);
    }),

    // Function to get data from a table based on a condition and return the result
    whereDataRes: (async (tbl, wherecondition) => {
        return db.query(`SELECT * FROM ${tbl} WHERE ?`, wherecondition);
    }),

    // Function to filter data in a table based on a column and a condition
    filterData: (async (tbl, column_name, wherecondition) => {
        return db.query(`SELECT * FROM ${tbl} WHERE ${column_name} LIKE ?`, ['%' + wherecondition + '%']);
    }),

    // Function to get user points based on a condition, summing specific columns
    GetPointsUserId: (async (wherecondition) => {
        return db.query(`SELECT *, points_11 + points_12 + points_13 + points_14 + points_21 + points_22 + points_23 + points_24 + points_31 + points_32 + points_33 + points_34 + points_35 AS total_points FROM activites_points WHERE ?`, wherecondition);
    }),

    // Function to get top students from a table, ordering by a specific column
    GetTopStudent: (async (tbl, selectcolumn, columnName, type) => {
        return db.query(`SELECT ${selectcolumn} FROM ${tbl} ORDER BY ${columnName} ${type}`);
    }),

    // Function to join two tables based on a user ID
    Jointbl: (async (tbl, tbl2, userId) => {
        return db.query(`SELECT * FROM ${tbl} JOIN ${tbl2} ON ${tbl}.user_id = ${tbl2}.id WHERE ${tbl}.user_id = ?`, [userId]);
    }),

    // Function to add a favourite college for a user
    addfavCollage: (async (user_id, college_id) => {
        return db.query(`INSERT INTO favourite_college(user_id, college_id) VALUES(?, ?)`, [user_id, college_id]);
    }),

    // Function to fetch favourite college by ID
    fetchFavCollegeById: (async (id) => {
        return db.query('SELECT * FROM favourite_college WHERE id = ?', [id]);
    }),

    // Function to delete favourite college based on a condition
    deleteFavCollege: (async (table, where) => {
        return db.query(`DELETE FROM ${table} ${where}`);
    }),

    // Function to join favourite colleges with colleges_live based on user ID
    favTableJoin: (async (user_id) => {
        return db.query('SELECT favourite_college.college_id, colleges_live.* FROM favourite_college INNER JOIN colleges_live ON favourite_college.college_id = colleges_live.id WHERE favourite_college.user_id = ?', [user_id]);
    }),

    // Function to join users with activites_points based on user ID
    userJoincollegeData: (async (user_id) => {
        return db.query('SELECT users.*, activites_points.* FROM users INNER JOIN activites_points ON activites_points.user_id = users.id WHERE users.id = ?', [user_id]);
    }),

    // Function to add a user
    AddUser: (async (tbl, insertdata) => {
        return db.query(`INSERT INTO ${tbl} SET ?`, insertdata);
    }),

     // Function to fetch user by ID
     fetchUsersById: (async (id) => {
        return db.query('SELECT * FROM users WHERE id = ?', [id]);
    }),
};

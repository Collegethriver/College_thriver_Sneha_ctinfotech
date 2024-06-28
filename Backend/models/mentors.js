const db = require("../utils/database");

module.exports = {
    // Function to insert data into a table for mentors
    mentorsInsert: (async (tbl, insertdata) => {
        return db.query(`INSERT INTO ${tbl} SET ?`, insertdata);
    }),
      
    // Function to update mentor data in a table based on a condition
    mentorsUpdate: (async (tbl, updatedata, wherecondition) => {
        return db.query(`UPDATE ${tbl} SET ? WHERE ?`, [updatedata, wherecondition]);
    }),

    // Function to get mentor profile data from a table based on a condition
    mentorsProfile: (async (tbl, wherecondition) => {
        return db.query(`SELECT * FROM ${tbl} WHERE ?`, wherecondition);
    }),

    // Function to get all mentor data from a table
    allmentors: (async (tbl) => {
        return db.query(`SELECT * FROM ${tbl}`);
    }),

    // Function to delete mentor data from a table based on a condition
    mentorsDelete: (async (tbl, wherecondition) => {
        return db.query(`DELETE FROM ${tbl} WHERE ?`, wherecondition);
    }),

    // Function to get data from a table based on a custom where condition
    getDataWhere: (async (table, where) => {
        return db.query(`SELECT * FROM ${table} ${where}`);
    }),
};

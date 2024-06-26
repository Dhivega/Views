const { name } = require("ejs");
const db = require("../db/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");

//register
exports.reg = async (req, res) => {
  const { fname, lname, email, phone, password, designation, address } =
    req.body;

  try {
    const existingUser = await db.query(
      "SELECT * FROM employees WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const sql = `
      INSERT INTO employees (firstname, lastname, email, ph_no, password, Designation, Address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      fname,
      lname,
      email,
      phone,
      hashedPassword,
      designation,
      address,
    ];

    await db.query(sql, values);

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//log
exports.log = async (req, res) => {
  const { email, password, fname } = req.body;

  try {
    const results = await db.query("SELECT * FROM employees WHERE email = ?", [
      email,
    ]);

    if (results.length > 0) {
      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log("User data verified successfully");
        return res.json({ success: true, data: results });
      } else {
        console.log("Incorrect password");
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });
      }
    } else {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch all users
exports.getAllUsers = (req, res) => {
  const query =
    "SELECT user_id, firstname AS name, email AS mail,password AS password, Designation, Manager, status_id AS status, role_id FROM employees";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch user data" });
    }
    results.forEach((element) => {
      element.statusName = element.status == 1 ? "Active" : "In Active";
      if (element.role_id == 1) {
        element.roleName = "admin";
      } else if (element.role_id == 2) {
        element.roleName = "user";
      } else if (element.role_id == 3) {
        element.roleName = "PM";
      }
    });

    res.json({ success: true, data: results });
  });
};

// Add a new user
exports.addUser = (req, res) => {
  const { name, mail, password, Designation, Manager, status, role_id } =
    req.body;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Error saving user data" });
    }

    const query =
      "INSERT INTO employees (firstname, email,password,Designation, Manager, status_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [name, mail, hashedPassword, Designation, Manager, status || 1, role_id],
      (err, result) => {
        if (err) {
          console.error("Error saving user data:", err);
          return res.status(500).json({ message: "Error saving user data" });
        }
        res.json({ success: true, message: "User added successfully!" });
      }
    );
  });
};

// Update a user
exports.updateUser = (req, res) => {
  const { user_id, name, mail, password, Designation, Manager, status, role } =
    req.body;

  if (password) {
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error updating user data" });
      }

      const query =
        "UPDATE employees SET firstname = ?, email = ?, password = ?, Designation = ?, Manager = ?, status_id = ?, role_id = ? WHERE user_id = ?";
      db.query(
        query,
        [
          name,
          mail,
          hashedPassword,
          Designation,
          Manager,
          status,
          role || null,
          user_id,
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating user data:", err);
            return res
              .status(500)
              .json({ success: false, message: "Error updating user data" });
          }
          res.json({ success: true, message: "User updated successfully!" });
        }
      );
    });
  } else {
    const query =
      "UPDATE employees SET firstname = ?, email = ?, Designation = ?, Manager = ?, status_id = ?, role_id = ? WHERE user_id = ?";
    db.query(
      query,
      [name, mail, Designation, Manager, status, role || null, user_id],
      (err, result) => {
        if (err) {
          console.error("Error updating user data:", err);
          return res
            .status(500)
            .json({ success: false, message: "Error updating user data" });
        }
        res.json({ success: true, message: "User updated successfully!" });
      }
    );
  }
};

// Delete a user
exports.deleteUser = (req, res) => {
  const user_id = req.params.user_id;
  const query = "DELETE FROM employees WHERE user_id = ?";
  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("Error deleting user data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error deleting user data" });
    }
    res.json({ success: true, message: "User deleted successfully!" });
  });
};

//admin projects

// Add a new project
exports.addProject = async (req, res) => {
  const {
    code,
    Description,
    Project_manager,
    Solution,
    Activity_type,
    subsidiary,
    Complementary_desc,
  } = req.body;

  try {
    const sql = `INSERT INTO projects (code, Description, Project_manager, Solution, Activity_type, subsidiary,Complementary_desc) VALUES (?, ?, ?, ?, ?, ?,?)`;
    const values = [
      code,
      Description,
      Project_manager,
      Solution,
      Activity_type,
      subsidiary,
      Complementary_desc,
    ];

    await db.query(sql, values);

    res
      .status(201)
      .json({ success: true, message: "Project added successfully" });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  const {
    code,
    Description,
    Project_manager,
    Solution,
    Activity_type,
    subsidiary,
    Complementary_desc,
    Project_id,
  } = req.body;

  try {
    const sql = `UPDATE projects SET code=?, Description=?, Project_manager=?, Solution=?, Activity_type=?, subsidiary=?, Complementary_desc=? WHERE Project_id=?`;
    const values = [
      code,
      Description,
      Project_manager,
      Solution,
      Activity_type,
      subsidiary,
      Complementary_desc,
      Project_id,
    ];

    await db.query(sql, values);

    res
      .status(200)
      .json({ success: true, message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  const Project_id = req.params.Project_id;

  try {
    const sql = `DELETE FROM projects WHERE Project_id=?`;
    await db.query(sql, [Project_id]);

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch all projects
exports.getAllProjects = async (req, res) => {
  try {
    const query = `SELECT * FROM projects  WHERE code NOT IN ('DEV.H.01', 'DEV.I.01', 'DEV.I.02')`;
    const projects = await db.query(query);

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch all progress
exports.getAllProgress = async (req, res) => {
  try {
    const query = `SELECT * FROM projects  WHERE code NOT IN ('DEV.H.01', 'DEV.I.01', 'DEV.I.02')`;
    const projects = await db.query(query);

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a project progress
exports.updateProgress = async (req, res) => {
  const {
    code,
    Description,
    start_date,
    end_date,
    actual_step,
    critical,
    weather,
    past_two_weaks_review,
    coming_two_weaks_review,
    major_problem,
    Project_id,
  } = req.body;
  console.log(req.body);

  try {
    const sql = `UPDATE projects SET code=?, Description=?, start_date=?, end_date=?, actual_step=?, critical=?, weather=?, past_two_weaks_review=?, coming_two_weaks_review=?, major_problem=? WHERE Project_id=?`;

    const values = [
      code,
      Description,
      start_date,
      end_date,
      actual_step,
      critical,
      weather,
      past_two_weaks_review,
      coming_two_weaks_review,
      major_problem,
      Project_id,
    ];

    await db.query(sql, values);

    res
      .status(200)
      .json({ success: true, message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Weekly report:
//1st 3 default row in userpage
exports.getreport = (req, res) => {
  const query =
    "SELECT code as code,Description as description,Solution as solution,activity_Type as activity_Type,subsidiary as subsidiary,Complementary_desc as Complementary_desc  FROM projects WHERE code IN ('DEV.H.01', 'DEV.I.01', 'DEV.I.02')";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch user data" });
    }
    res.json({ success: true, data: results });
  });
};
//fetching project
exports.getProj = (req, res) => {
  const query =
    "SELECT code as code,Description as description,Solution as solution,activity_type as activity_Type,subsidiary as subsidiary,Complementary_desc as Complementary_desc FROM projects WHERE code NOT IN ('DEV.H.01', 'DEV.I.01', 'DEV.I.02')";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch user data" });
    }
    res.json({ success: true, data: results });
  });
};

exports.saveReport = (req, res) => {
  const {
    year,
    month,
    reportData,
    weekno1,
    weekno2,
    weekno3,
    weekno4,
    weekno5,
  } = req.body;
  console.log(req.body);

  if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No report data provided" });
  }

  const insertQuery = `
    INSERT INTO weekly_report (user_id, code, year, month, weekno1, weekno2, weekno3, weekno4, weekno5, data1, data2, data3, data4, data5)
    VALUES ?
  `;

  const updateQuery = `
    UPDATE weekly_report
    SET weekno1 = ?, weekno2 = ?, weekno3 = ?, weekno4 = ?, weekno5 = ?, data1 = ?, data2 = ?, data3 = ?, data4 = ?, data5 = ?
    WHERE user_id = ? AND year = ? AND month = ? AND code = ?
  `;

  const checkQuery = `
    SELECT report_id FROM weekly_report
    WHERE user_id = ? AND year = ? AND month = ? AND code = ?
  `;

  const insertValues = [];
  const updatePromises = [];

  reportData.forEach((row) => {
    const { user_id, code, data1, data2, data3, data4, data5 } = row;

    const updateValues = [
      weekno1,
      weekno2,
      weekno3,
      weekno4,
      weekno5,
      data1 || "",
      data2 || "",
      data3 || "",
      data4 || "",
      data5 || "",
      user_id,
      year,
      month,
      code,
    ];

    updatePromises.push(
      new Promise((resolve, reject) => {
        db.query(checkQuery, [user_id, year, month, code], (error, results) => {
          if (error) {
            return reject(error);
          }
          if (results.length > 0) {
            db.query(updateQuery, updateValues, (updateError) => {
              if (updateError) {
                return reject(updateError);
              }
              resolve();
            });
          } else {
            insertValues.push([
              user_id || null,
              code || null,
              year,
              month,
              weekno1,
              weekno2,
              weekno3,
              weekno4,
              weekno5,
              data1 || "",
              data2 || "",
              data3 || "",
              data4 || "",
              data5 || "",
            ]);
            resolve();
          }
        });
      })
    );
  });

  Promise.all(updatePromises)
    .then(() => {
      if (insertValues.length > 0) {
        db.query(insertQuery, [insertValues], (insertError, results) => {
          if (insertError) {
            console.error("Error inserting data:", insertError);
            return res
              .status(500)
              .json({ success: false, message: "Failed to save report" });
          }
          res.json({ success: true, message: "Report saved successfully!" });
        });
      } else {
        res.json({ success: true, message: "Report updated successfully!" });
      }
    })
    .catch((error) => {
      console.error("Error saving report:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to save report" });
    });
};

exports.fetchWeeklyReportByUserYearMonth = (req, res) => {
  const { user_id, year, month } = req.query;

  if (!user_id || !year || !month) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters" });
  }

  const weeklyReportQuery = `
    SELECT * FROM weekly_report
    WHERE user_id = ? AND year = ? AND month = ?
  `;

  db.query(
    weeklyReportQuery,
    [user_id, year, month],
    (error, weeklyReportResults) => {
      if (error) {
        console.error("Error fetching weekly report data:", error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to fetch report data" });
      }

      const codes = weeklyReportResults.map((row) => row.code);

      if (codes.length === 0) {
        return res.json({ success: true, data: [] });
      }

      const projectDetailsQuery = `
      SELECT code, 
             Description AS description, 
             Solution AS solution, 
             Activity_type AS activity_type, 
             subsidiary, 
             Complementary_desc AS Complementary_desc
      FROM projects
      WHERE code IN (?)
    `;

      db.query(projectDetailsQuery, [codes], (projectError, projectResults) => {
        if (projectError) {
          console.error("Error fetching project data:", projectError);
          return res
            .status(500)
            .json({ success: false, message: "Failed to fetch project data" });
        }

        // Create a map for project details
        const projectDetailsMap = projectResults.reduce((map, project) => {
          map[project.code] = project;
          return map;
        }, {});

        // Combine weekly report entries with corresponding project details
        const combinedResults = weeklyReportResults.map((report) => {
          const projectDetails = projectDetailsMap[report.code] || {};
          return {
            ...report,
            description: projectDetails.description,
            solution: projectDetails.solution,
            activity_type: projectDetails.activity_type,
            subsidiary: projectDetails.subsidiary,
            Complementary_desc: projectDetails.Complementary_desc,
          };
        });

        res.json({ success: true, data: combinedResults });
      });
    }
  );
};

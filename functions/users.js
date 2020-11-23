let hash = require("password-hash")
const APIDB = require("./db");

module.exports = {
	addUser: (req , res) => {
		let user_id  	      = "u" + APIDB.uniqID();
		let settings_color_id = "sc" + APIDB.uniqID();
		let color_id          = "2020125-68097";
		let fname    	      = req.body.fname;
		let lname    	      = req.body.lname;
		let username 	      = req.body.username;
		let password 	      = req.body.password;
		let date_created  	  = APIDB.dateToday();
		let date_modified     = APIDB.dateToday();
		let status            = 1;
		let password_hash     = hash.generate(password);

		let sql1 = "SELECT * FROM users WHERE username = ?";
		let sql2 = "INSERT INTO users (user_id , fname , lname , username , password , date_created , date_modified , status) VALUES (?,?,?,?,?,?,?,?)";
		let sql3 = "INSERT INTO settings_color (settings_color_id , user_id , color_id , date_modified , status) VALUES (?,?,?,?,?)";

		con.query(sql1 , username , (err , result) => {
			if (result.length > 0) {
				res.send({ success: false });
			} else {
				con.query(sql2 , [user_id , fname , lname , username , password_hash , date_created , date_modified , status] , (err , result) => {
					if (err) {
						res.send({ success: "err" });
					} else {

						con.query(sql3 , [settings_color_id , user_id , color_id , date_modified , status] , (err , result) => {
							res.send({ success: true });
						});
					}
				});		
			}
		});
	} ,

	updateUser: (req , res) => {
		let user_id  	  = req.body.user_id;
		let fname    	  = req.body.fname;
		let lname    	  = req.body.lname;
		let username 	  = req.body.username;
		let password 	  = req.body.new_password; 
		let date_modified = APIDB.dateToday();
		let password_hash = hash.generate(password);

		let sql1 = "UPDATE users SET fname = ? , lname = ? , username = ? , password = ? , date_modified = ? WHERE user_id = ?";
		con.query(sql1 , [fname , lname , username , password_hash , date_modified , user_id] , (err , result) => {
			if (err) {
				res.send({ success: "err" });
			} else {
				res.send({ success: true });
			}
		});	 
	} ,

	deleteUser: (req , res) => {
		let user_id = req.body.user_id;
		let status  = 0;
		let sql1 = "UPDATE users SET status = ? WHERE user_id = ?";
		con.query(sql1 , [status , user_id] , (err ,result) => {
			if (err) {
				res.send({ success: "err" });
			} else {
				res.send({ success: true });
			}
		});
	} ,

	updateProfile: (req , res) => {
		let user_id       = req.body.user_id;
		let fname         = req.body.fname;
		let lname         = req.body.lname;
		let username      = req.body.username;
		let date_modified = APIDB.dateToday();

		let sql1 = "UPDATE users SET fname = ? , lname = ? , username = ? , date_modified = ? WHERE user_id = ?";
		con.query(sql1 , [fname , lname , username , date_modified , user_id] , (err , result) => {
			if (err) {
				res.send({ success: false });
			} else {
				res.send({ success: true });
			}
		});
	} ,

	updatePass: (req , res) => {
		let user_id       = req.body.user_id;
		let new_password  = req.body.new_password;
		let date_modified = APIDB.dateToday();
		let password_hash = hash.generate(new_password);

		let sql1 = "UPDATE users SET password = ? , date_modified = ? WHERE user_id = ?";
		con.query(sql1 , [password_hash , date_modified , user_id] , (err , result) => {
			if (err) {
				res.send({ success: false });
			} else {
				res.send({ success: true });
			}
		}); 
	} ,

	getUsers: (req , res) => {
		let status = 1;
		let sql1 = "SELECT * FROM users WHERE status = ?";

		con.query(sql1 , status , (err , result) => {
			res.send(result);
		});
	} ,

	getMyProfile: (req , res) => {
		let user_id = req.params.user_id;

		let sql1 = "SELECT * FROM users WHERE user_id = ?";
		con.query(sql1 , user_id , (err , result) => {
			res.send(result);
		});	 
	} ,

	checkUsernames: (req , res) => {
		let user_id  = req.params.user_id;
		let sql1 = "SELECT * FROM users WHERE user_id != ?";

		con.query(sql1 , user_id , (err , result) => {
			res.send(result);
		});
	} ,

	checkOldPassword: (req , res) => {
		let user_id = req.params.user_id;
		let old_password = req.params.old_password;
		let i      = 0;
		let verify = "";

		let sql1 = "SELECT * FROM users WHERE user_id = ?";
		con.query(sql1 , user_id , (err ,result) => {
			for (i; i < result.length; i++) {
				verify = hash.verify(old_password , result[i].password);
			}

			if (verify) {
				res.send({ success: true });
			} else {
				res.send({ success: false });
			}
 		});
	} ,

	getAdmin: (req , res) => {
		let user_id = req.params.user_id;
		let status  = 9;
		let sql1 = "SELECT * FROM users WHERE user_id = ? AND status = ?";

		con.query(sql1 , [user_id , status] , (err , result) => {
			res.send(result);
		})
	} ,

	login: (req , res) => {
		let username      = req.body.username;
		let password      = req.body.password;
		let i = 0;
		let verify = "";
		let token  = "";
		let name   = "";

		let sql1 = "SELECT * FROM users WHERE username = ?";
		con.query(sql1 , username , (err , result) => {
			for (i; i < result.length; i++) {
				verify = hash.verify(password , result[i].password);
				token  = result[i].user_id;
				name   = result[i].fname + " " + result[i].lname;
			}

			if (verify) {
				res.send({ success: true , token: token , name: name });
			} else {
				res.send({ success: false });
			}
		});
	} ,
}
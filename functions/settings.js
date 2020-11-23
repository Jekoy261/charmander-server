const APIDB    = require("./db");
const APIBILLINGS = require("./billing");
module.exports = {
	
	addEmail: (req , res) => {
		let id            	  = "e" + APIDB.uniqID();
		let email         	  = req.body.email;
		let created_date  	  = APIDB.dateToday();
		let modified_date 	  = APIDB.dateToday();
		let status        	  = 1;

		let sql1 = "INSERT INTO email (email_id , email , created_date , modified_date , status) VALUES (?,?,?,?,?)";

		con.query(sql1 , [ id , email , created_date , modified_date , status ] , (err , result) => {
			res.send({ success: true });
		});
	} ,

	updateEmail: (req , res) => {
		let email_id      = req.body.email_id;
		let email 		  = req.body.email;
		let modified_date = APIDB.dateToday();
		let sql1 = "UPDATE email SET email = ?, modified_date = ? WHERE email_id = ?";
		con.query(sql1 , [email, modified_date , email_id] , (err , result) => {
			res.send({ success: true });
		});

	} ,

	getEmails: (req , res) => {
		let status = 1;
		let sql1   = "SELECT * FROM email WHERE status = ?";

		con.query(sql1 , status , (err , result) => {
			res.send(result);
		});

	} ,

	addGetEmails: (req, res) => {
		let sql1 = "SELECT * FROM email";

		con.query(sql1, function(err, result){
			if (err) throw err;
			res.send(result);
		});
	},

	countEmail: (req, res) => {
		let sql1 = "SELECT COUNT(email) as count_email FROM email";

		con.query(sql1, function(err, result){
			if(err) throw err;
			res.send(result);
		})
	},

	getEmailById: (req, res) => {
		let email_id = req.params.id;
		let sql1     = "SELECT * FROM email WHERE email_id !=?";

		con.query(sql1, email_id, (err, result) => {
			res.send(result);
		});
	},

	deleteEmail: (req, res) => {
		let email_id = req.body.email_id;
		let modified_date = APIDB.dateToday();
		let sql1 = "UPDATE email SET status = 0, modified_date = ? WHERE email_id = ?";

		con.query(sql1, [modified_date, email_id], function(err, result){
			if (err) throw err;
			res.send({success: true});
		});
	},

	getDeletedEmail: (req, res) => {
		let sql1 = "SELECT * FROM email WHERE status = 0";

		con.query(sql1, function(err, result){
			if(err) throw err;
			res.send(result);
		});
	},

	retrieveEmail: (req, res) => {
		let email_id = req.body.email_id;
		let sql1 = "UPDATE email SET status = 1 WHERE email_id = ?";

		con.query(sql1, email_id, function(err, result){
			if(err) throw err;
			res.send({success: true});
		});
	} ,

	permanentDeleteEmail: (req, res) => {
		let email_id = req.body.email_id;
		let sql1 = "DELETE FROM email WHERE email_id = ?";

		con.query(sql1, email_id, function(err, result){
			if(err) throw err;
			res.send({success: true});
		});
	} ,

	getColors: (req , res) => {
		let status = 1;
		let sql1   = "SELECT * FROM colors WHERE status = ?"
		
		con.query(sql1 , status , (err , result) => {
			res.send(result);
		});
	} ,

	getActiveColor: (req , res) => {
		let user_id      = req.params.user_id;
		let sql1 = "SELECT * FROM settings_color INNER JOIN colors ON settings_color.color_id=colors.color_id WHERE settings_color.user_id = ?";

		con.query(sql1 ,  user_id , (err , result) => {
			res.send(result);
		});
	} ,

	checkColors: (req , res) => {
		let user_id        = req.params.user_id;
		let color_id       = req.params.color_id;
		let color_status1  = 1;
		let color_status2  = 0;
		let i 			   = 0;
		let color_id_exist = "";
		let sql1 = "SELECT * FROM settings_color WHERE color_id = ? AND user_id = ?";
		let sql2 = "UPDATE settings_color SET color_id = ? WHERE user_id = ?";
		
		con.query(sql1 , [color_id , user_id] , (err , result) => {
			if (result.length > 0) {
				res.send({ success: false });
			} else {
				con.query(sql2 , [ color_id , user_id] , (err , result) => {
					res.send({ success: true });
				});
			}
		});
	} , 

	updateColors: (req , res) => {
		let user_id      = req.body.user_id;
		let color_id     = req.body.color_id;
		let color_status = 1;
		let sql1 = "UPDATE settings_color SET color_id = ? WHERE user_id = ?";
		con.query(sql1 , [color_id , user_id] , (err , result) => {
			res.send({ success: true });
		});
	} ,

	getDarkColor: (req , res) => {
		let dark_id = APIDB.uniqID();
		let user_id = req.params.user_id;
		let status1 = 1;
		let status2 = 0;

		let sql1 = "SELECT * FROM dark_mode WHERE user_id = ?";
		let sql2 = "INSERT INTO dark_mode (dark_id , user_id , status) VALUES (?,?,?)";

		con.query(sql1 , user_id , (err , result) => {

			if (result.length > 0) {
				res.send({ success: true });
			} else {

				con.query( sql2 , [dark_id , user_id , status2 ] , (err , result) => {
					res.send({ success: false });
				});
			}
		});
	} ,

	getActiveDarkMode: (req , res) => {
		let user_id = req.params.user_id;
		let status  = 1;

		let sql1 = "SELECT * FROM dark_mode WHERE user_id = ? AND status = ?";

		con.query(sql1 , [user_id , status], (err , result) => {
			if (result.length > 0) {
				res.send({ success: true });
			} else {
				res.send({ success: false });
			}
		});
	} ,

	updateDarkColor: (req , res) => {
		let user_id = req.params.user_id;
		let status1 = req.params.status;
		let status2 = 0;
		let status3 = 1;

		let sql1 = "UPDATE dark_mode SET status = ? WHERE user_id = ?";
		
		if (status1 == "false") {
			con.query(sql1 , [status2 , user_id] , (err , result) => {
				res.send({ success: true });
			});
		} else if (status1 == "true"){
			con.query(sql1 , [status3 , user_id] , (err , result) => {
				res.send({ success: true });
			});
		}
	} ,

	setEmailTime: (req, res) => {
		let set_hour = req.body.set_hour;
		let set_min = req.body.set_min;
		let sql1 = "UPDATE email SET email_time_hour = ?, email_time_minute = ? WHERE status = 2";

		con.query(sql1, [set_hour, set_min], function(err, result){
			if(err) throw err;
			res.send({success: true});
		});

		module.exports.getEmailTime();
	},

	getEmailTime: (req, res) => {
		let set_hour = 10;
		let set_min = 0;
		let set_time = "";
		let sql1 = "SELECT * FROM email WHERE status = 2";

		con.query(sql1, function(err, result){
			if(err) throw err;
			if(result.length > 0){
				if(result[0].email_time_hour == 24){
					set_time ='0 0 */1 * *';
				}else{
					set_hour = result[0].email_time_hour;
					set_min = result[0].email_time_minute;
					set_time ='' + set_min + ' ' + set_hour + ' * * *';
				}
			}else{
				set_time = '0 10 * * *';
			}
			if(result.length > 0){
				cron.schedule(set_time, () =>{
					APIBILLINGS.billingEmail();
				},{
					scheduled: true
				});	
			}
		});
	},

	getSetTime: (req, res) =>{
		let sql1 = "SELECT email_time_hour, email_time_minute FROM email WHERE status = 2";
		con.query(sql1, function(err, result){
			if(err) throw err;
			res.send(result);
		});
	} ,

	getEmailSender: (req, res) => {
		let sql1 = "SELECT * FROM email WHERE status = 2";
		con.query(sql1, function(err, result){
			if(err) throw err;
			res.send(result);
		});
	},

	setEmailSender: (req, res) => {
		let email_id = req.body.email_id;
		let email_sender = req.body.email_sender;
		let email_pass = req.body.email_pass;
		let date_modified = APIDB.dateToday();
		let sql1 = "UPDATE email SET email = ?, modified_date = ?, sender_password = ? WHERE email_id = ?";

		con.query(sql1, [email_sender, date_modified, email_pass, email_id], function(err,result){
			if(err) throw err;
			res.send({success: true});
		});
	},

	checkSetEmail: (req, res) => {
		let email_sender = req.params.sender;
		let sql1 = "SELECT * FROM email WHERE email = ?";

		con.query(sql1, email_sender, function(err, result){
			if(err) throw err;
			res.send(result);
		})
	},
}
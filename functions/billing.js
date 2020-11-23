const path     = require('path');
const fs       = require('fs');
const APIDB    = require("./db");
let nodemailer = require('nodemailer');

module.exports = {
	/****************** BILLINGS ******************/
	/*********************************************/
	addBilling: (req , res) => {
		let billing_id      = APIDB.uniqID();
		let bill_id         = req.body.account_name;
		let soa_number      = req.body.soa_number;
		let month_year      = req.body.start_date;
		let date_recieved   = req.body.date_recieved;
		let amount          = req.body.amount;
		let due_date	    = req.body.due_date;
		let start_date      = req.body.start_date;
		let end_date 	    = req.body.end_date;
		let payment_status1 = 0;
		let payment_status2 = 1;
		let created_by 	    = req.body.created_by;
		let remarks         = req.body.remarks;
		let date_created    = APIDB.dateToday();
		let status          = 1;

		if (Math.sign(amount) === -1) {
		
			let sql1 = "SELECT * FROM billings WHERE soa_number = ?";
			let sql2 = "INSERT INTO billings (billing_id , bill_id , soa_number , month_year , bill_received_date , amount , due_date , billing_period_start , billing_period_end , payment_status , created_by , remarks , date_created , date_modified , status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

			con.query(sql1 , soa_number , (err , result) => {
				if (result.length > 0) {

					res.send({ success: false });

				} else {
					con.query(sql2 , [billing_id , bill_id , soa_number , month_year , date_recieved , amount , due_date , start_date , end_date , payment_status2 , created_by , remarks , date_created , date_created , status] , (err , result) => {
						res.send({ success: true });
					});
				}
			});		
		
		} else {
		
			let sql1 = "SELECT * FROM billings WHERE soa_number = ?";
			let sql2 = "INSERT INTO billings (billing_id , bill_id , soa_number , month_year , bill_received_date , amount , due_date , billing_period_start , billing_period_end , payment_status , created_by , remarks , date_created , date_modified , status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

			con.query(sql1 , soa_number , (err , result) => {
				if (result.length > 0) {

					res.send({ success: false });

				} else {
					con.query(sql2 , [billing_id , bill_id , soa_number , month_year , date_recieved , amount , due_date , start_date , end_date , payment_status1 , created_by , remarks , date_created , date_created , status] , (err , result) => {
						res.send({ success: true });
					});
				}
			});			
		}
	} ,

	checkTrashBillings: (req , res) => {
		let soa_number = req.params.soa_number;
		let status     = 0;

		let sql1 = "SELECT * FROM billings WHERE soa_number = ? AND status = ?";
		con.query(sql1 , [soa_number , status] , (err , result) => {
			console.log(err);

			if (result.length > 0) {
				res.send({ success: true });
			} else {
				res.send({ success: false });
			}
		});
	} ,

	updateBilling: (req , res) => {
		let billID       = req.body.billID;
		let billingID    = req.body.billingID;
		let soaNumber    = req.body.soaNumber;
		let billStart    = req.body.billStart;
		let billEnd      = req.body.billEnd;
		let amount 		 = req.body.amount;
		let dueDate 	 = req.body.dueDate;
		let dateReceived = req.body.dateReceived;
		let createdBy 	 = req.body.createdBy;
		let remarks      = req.body.remarks;
		let dateModified = APIDB.dateToday();

		let sql1 = "SELECT soa_number FROM billings WHERE soa_number = ?";
		let sql2 = "SELECT soa_number FROM billings WHERE soa_number = ? AND billing_id = ?";
		let sql3 = "SELECT * FROM billings WHERE bill_id = ? AND billing_id = ?";
		let sql4 = "UPDATE billings SET bill_id='" + billID + "', soa_number='" + soaNumber + "', month_year='" + billStart + "', bill_received_date='" + dateReceived + "', amount=" + amount + ", due_date='" + dueDate + "', billing_period_start='" + billStart + "', billing_period_end='" + billEnd + "', created_by='" + createdBy + "', remarks='" + remarks + "', date_modified='" + dateModified + "' WHERE billing_id='" + billingID + "'";
		
		con.query(sql1 , soaNumber , (err, result) => {

			if (result.length > 0) {

				con.query(sql2 , [soaNumber , billingID] , (err , result) => {
					if (result.length > 0) { 
				
						con.query(sql4 , (err , result) => {
							res.send({ success: true });
						});
				
					} else {
						res.send({ success: false });
					}

				});

			} else {

				con.query(sql3 , [billID , billingID] , (err , result) => {
					if (result.length > 0) {
						con.query(sql4 , (err , result) => {
							res.send({ success: true });
						});
					} else {
						res.send({ msg: "error" });
					}
				});
			}
		});
	} , 

	deleteBilling: (req , res) => {

		let billing_id = req.body.billing_id;
		let status     = 0;
		let sql1 = "UPDATE billings SET status = ? WHERE billing_id = ?";
		con.query( sql1 , [status , billing_id] , (err , result) => {
			if(err) throw err;
			res.send({ success: true });
		});

	} ,

	retrieveBilling: (req , res) => {
		let id     = req.body.id;
		let status = 1;
		let sql1   = "UPDATE billings SET status = ? WHERE billing_id = ?";

		con.query(sql1 , [status , id] , (err, result) => {
			res.send({ success: true });
		});
	} ,

	permanentDeleteBilling: (req , res) => {
		let id   = req.body.id;
		let sql1 = "DELETE FROM billings WHERE billing_id = ?";

		con.query(sql1 , id , (err, result) => {
			res.send({ success: true });
		});
	} ,

	getBillings: (req , res) => {
		let status = 1;
		let sql1   = "SELECT billings.billing_id, billings.bill_id, billings.soa_number, bills.account_name, bills.account_number, billings.billing_period_start, billings.billing_period_end, billings.payment_status , billings.amount, billings.due_date, billings.bill_received_date, billings.created_by , billings.remarks FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE billings.status = ? ORDER BY billings.date_modified DESC";

		con.query(sql1 , status , (err , result) => {
			res.send(result);
		});
	} ,

	getBillingById: (req , res) => {
		let id = req.params.id;
		let sql1 = "SELECT billings.billing_id, billings.bill_id, billings.soa_number, bills.account_name, bills.account_number, billings.billing_period_start, billings.billing_period_end, billings.amount, billings.due_date, billings.bill_received_date, billings.created_by , billings.remarks FROM billings INNER JOIN bills ON billings.bill_id=bills.bill_id WHERE billings.billing_id = ?";

		con.query(sql1 , id , (err , result) => {
			res.send(result);
		});
	} ,

	getBillingDueDate: (req, res) => {
		con.query("SELECT billings.bill_id, billings.billing_id, bills.account_name, billings.due_date FROM billings INNER JOIN bills On billings.bill_id = bills.bill_id WHERE billings.payment_status = 0 AND billings.status = 1 ORDER BY billings.due_date", function(err, result){
			if(err) throw err;
			res.send(result);
		});
	} ,

	getBillingAmount: (req, res) =>{
		let billing_id = req.params.id;
		let sql1 = "SELECT amount FROM billings WHERE billing_id=?";
		con.query(sql1, [billing_id], function(err, result){
			if(err) throw err;
			res.send(result);
		});
	} ,

	getDeletedBillings: (req , res) => {
		let status = 0;
		let sql1   = "SELECT billings.billing_id, billings.bill_id, billings.soa_number, bills.account_name, bills.account_number, billings.billing_period_start, billings.billing_period_end, billings.payment_status , billings.amount, billings.due_date, billings.bill_received_date, billings.created_by , billings.date_modified FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE billings.status = ?";

		con.query(sql1 , status , (err , result) => {
			if(err) throw err;
			res.send(result);
		});
	} ,

	billingNotification: (req, res) =>{
		con.query("SELECT billings.bill_id, billings.billing_id, bills.account_name, billings.due_date , billings.soa_number , billings.amount FROM billings INNER JOIN bills On billings.bill_id = bills.bill_id WHERE billings.payment_status = 0 ORDER BY billings.due_date DESC", function(err, result){
			if(err) throw err;
			let today = new Date();
			for(var c = 0; c < result.length; c++){
				let year     = result[c].due_date.getFullYear();
				let yearNow  = today.getFullYear();
				let todayDate = moment(today, ["MM-DD-YYYY"]);
				let fullDate = moment(result[c].due_date, ["MM-DD-YYYY"]);
				let minusDay = moment(fullDate).diff(todayDate, 'days');
				if( year <= yearNow && minusDay <= 6){
					if(minusDay < 0){
						minusDay *= -1;
						minusDay = "This billing was due " + minusDay + " day/s ago pay it now!!";
					} else if(minusDay == 0){
						minusDay="This billing is due today";
					} else if(minusDay == 1){
						minusDay = "This billing is due tommorrow";
					}else if(minusDay == 6){
						minusDay = "This billing is due 1 week from now";
					}
					else{
						minusDay = "This billing is due " + (minusDay+1) + " days from now";
					}
					notifier.notify({
						title: "PROJECT CHARMANDER: " + result[c].account_name + " billing",
						message: minusDay,
						icon: '../src/assets/images/baseline_sms_black_18dp.png',
						sound: true,
						wait: true
					});
				}
			}
		});
	} ,

	billingEmail: (res, req) => {
		let dueOnWeek = [];
		let dueTom = [];
		let dueToday = [];
		let today = new Date();
		let emailReceivers = "";
		let emailBody = ``;
		let sql1 = "SELECT * FROM email WHERE status = ?";

		con.query("SELECT billings.billing_id, bills.account_name, billings.due_date, billings.amount FROM billings INNER JOIN bills ON billings.bill_id=bills.bill_id WHERE payment_status = 0 ORDER BY billings.due_date ASC", function(err, result){
			if(err) throw err;
			for(var a = 0; a < result.length; a++){
				let year     = result[a].due_date.getFullYear();
				let yearNow  = today.getFullYear();
				let todayDate = moment(today).format("YYYY-MM-DD");
				let fullDate = moment(result[a].due_date).format("YYYY-MM-DD");
				let minusDay = moment(fullDate).diff(todayDate, 'days');
				if(year <= yearNow && minusDay <= 6){
					if(minusDay > 1 && minusDay <= 6){
						dueOnWeek.push(result[a]);
					}else if(minusDay == 1){
						dueTom.push(result[a]);
					}else if(minusDay == 0){
						dueToday.push(result[a]);
					}
				}

			}

			if(dueToday.length > 0){
				emailBody += `<table border="0" cellpadding="0" cellspacing="0" width="100%" >
					<tr><td bgcolor=#D5000 style="text-align: center; color:#ffffff; font-family: Arial, sans-serif; font-size: 24px;">Billing/s due for today</td></tr>`;
				for(var b = 0; b < dueToday.length; b++){
					emailBody += `<tr><td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
						<p><b>` + dueToday[b].account_name + `</b></p> 
						<p>Billing ID: <a href="http://localhost:8080/#/view/`+ dueToday[b].billing_id +`" >` + dueToday[b].billing_id + `</a></p>
						<p>Due Date: ` + moment(dueToday[b].due_date).format("MMMM DD, YYYY") + `</p>
						<p>Amount: ` + dueToday[b].amount + `</p></tr>`;
				}

				emailBody += `</table>`;

			}
			if(dueTom.length > 0){
				emailBody += `<table border="0" cellpadding="0" cellspacing="0" width="100%">
					<tr><td bgcolor=#66BB6 style="text-align: center; font-family: Arial, sans-serif; font-size: 24px;">Billing/s due for tomorrow</td></tr>`;
				for(var b = 0; b < dueTom.length; b++){
					emailBody += `<tr><td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
						<p><b>` + dueTom[b].account_name + `</b></p>
						<p>Billing ID: <a href="http://localhost:8080/#/view/`+ dueTom[b].billing_id +`" >` + dueTom[b].billing_id + `</a></p>
						<p>Due Date: ` + moment(dueTom[b].due_date).format("MMMM DD, YYYY") + `</p>
						<p>Amount: ` + dueTom[b].amount + `</p></td></tr>`;
				}
				emailBody += `</table>`;
			}
			if(dueOnWeek.length > 0){
				emailBody += `<table border="0" cellpadding="0" cellspacing="0" width="100%">
					<tr><td bgcolor=#1E88E style="text-align: center; font-family: Arial, sans-serif; font-size: 24px;">Billing/s due with in this week</td></tr>`;
				for(var b = 0; b < dueOnWeek.length; b++){
					emailBody += `<tr><td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
						<p><b>` + dueOnWeek[b].account_name + `</b></p>
						<p>Billing ID: <a href="http://localhost:8080/#/view/`+ dueOnWeek[b].billing_id +`" >` + dueOnWeek[b].billing_id + `</a></p>
						<p>Due Date: ` + moment(dueOnWeek[b].due_date).format("MMMM DD, YYYY") + `</p>
						<p>Amount: ` + dueOnWeek[b].amount + `</p></tr>`;
				}
				emailBody += `</table>`;
			}

			if(dueToday.length > 0 || dueTom.length > 0 || dueOnWeek.length > 0){
				con.query(sql1, 1, function(err, result){
					for(var a = 0; a < result.length; a++){
						emailReceivers += result[a].email;
						if(result.length > 1 && a >= 0 && a < result.length - 1){
							emailReceivers += ", ";
						}
					}

					let getSender = "SELECT * FROM email WHERE status = 2";
					let emailSender = "";
					let senderPassword = "";

					con.query(getSender, function(err, result){
						emailSender = result[0].email;
						senderPassword = result[0].sender_password;
						let transporter = nodemailer.createTransport({
							host: 'smtp.zoho.com',
							port: 465,
							secure: true, // use SSL
							auth: {
								user: emailSender ,
								pass: senderPassword ,
							},
							tls: {
								rejectUnauthorized: false
							}
						});

						const mailOptions = {
							from   : emailSender,
							to     : emailReceivers,
							/*to     : to ,
							cc     : "*******" ,*/
							subject: 'Project Chamander: Due billings',
							html   : `
								<!doctype html>
								<html ⚡4email>
								<head></head>
								<body style="margin: 0; padding: 0;">
								<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
								<td style="padding: 10px 0 30px 0;">
								<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
								<tr><td align="center" bgcolor="#F57C00" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
								<p><h2>Project Charmander</h2></p>
								</td></tr>
								<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">`
								+ emailBody +
								`</td>
								</table>
								</td></tr></table></body>
								</html>` ,
						};
						transporter.sendMail(mailOptions, (error, info) => {
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
						});
					});
				});


			}

		});

	},


	/****************** PAYMENTS *****************/
	/*********************************************/
	addPaymentCash: (req , res) => {
		let payment_id         = "p" + APIDB.uniqID();
		let billing_id         = req.body.billing_id;
		let accountable_person = req.body.accountable_person;
		let voucher_number     = req.body.voucher_number;
		let voucher_date       = req.body.voucher_date;
		let amount             = req.body.amount;
		let cheque_number      = null;
		let cheque_date        = null;
		let bank               = null;
		let prepared_by		   = req.body.prepared_by;
		let received_by		   = req.body.received_by;
		let created_by		   = req.body.created_by;
		let date_created  	   = APIDB.dateToday();
		let date_modified	   = APIDB.dateToday();
		let status 			   = 1;
		let payment_status	   = 1;
		let payment_type       = 0;

		let sql1 = "INSERT INTO bills_payment (bill_payment_id , billing_id , accountable_person , voucher_number , voucher_date , amount , cheque_number , cheque_date , bank , prepared_by , received_by , created_by , date_created , date_modified , payment_type , status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		let sql2 = "UPDATE billings SET payment_status = ? WHERE billing_id = ?";

		con.query(sql1 , [payment_id , billing_id , accountable_person , voucher_number , voucher_date , amount , cheque_number , cheque_date , bank , prepared_by ,received_by , created_by , date_created , date_modified , payment_type , status] , (err , result) => {
			if (err) throw err;
			con.query(sql2, [payment_status, billing_id], function(err,result){
				if(err) throw err;
				res.send({success: true});
			});
		});
	} ,

	checkTrashPayments: (req , res) => {
		let billing_id     = req.params.billing_id;
		let voucher_number = req.params.voucher_number;
		let status         = 0;

		let sql1 = "SELECT * FROM bills_payment WHERE billing_id = ? AND voucher_number = ? AND status = ?";
		con.query(sql1 , [billing_id , voucher_number , status] , (err , result) => {

			if (result.length > 0) {
				res.send({ success: true });
			} else {
				res.send({ success: false });
			}
		});
	} ,

	

	addPaymentQheque: (req , res) => {
		let payment_id         = "p" + APIDB.uniqID();
		let billing_id         = req.body.billing_id;
		let accountable_person = req.body.accountable_person;
		let voucher_number     = req.body.voucher_number;
		let voucher_date       = req.body.voucher_date;
		let amount             = req.body.amount;
		let cheque_number      = req.body.cheque_number;
		let cheque_date        = req.body.cheque_date;
		let bank               = req.body.bank;
		let prepared_by		   = req.body.prepared_by;
		let received_by		   = req.body.received_by;
		let created_by		   = req.body.created_by;
		let date_created  	   = APIDB.dateToday();
		let date_modified	   = APIDB.dateToday();
		let status 			   = 1;
		let payment_status	   = 1;
		let payment_type       = 1;

		let sql1 = "INSERT INTO bills_payment (bill_payment_id , billing_id , accountable_person , voucher_number , voucher_date , amount , cheque_number , cheque_date , bank , prepared_by , received_by , created_by , date_created , date_modified , payment_type , status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		let sql2 = "UPDATE billings SET payment_status = ? WHERE billing_id = ?";

		con.query(sql1 , [payment_id , billing_id , accountable_person , voucher_number , voucher_date , amount , cheque_number , cheque_date , bank , prepared_by ,received_by , created_by , date_created , date_modified , payment_type , status] , (err , result) => {
			if (err) throw err;
			con.query(sql2, [payment_status, billing_id], function(err,result){
				if(err) throw err;
				res.send({success: true});
			});
		});
	} ,

	updatePaymentCash: (req , res) => {
		let bill_payment_id    = req.body.edit_bill_payment_id;
		let accountable_person = req.body.edit_accountable_person;
		let voucher_number     = req.body.edit_voucher_number;
		let voucher_date       = req.body.edit_voucher_date;
		let amount             = req.body.edit_amount;
		let cheque_number      = null;
		let cheque_date        = null;
		let bank 			   = null;
		let prepared_by		   = req.body.edit_prepared_by;
		let received_by		   = req.body.edit_received_by;
		let created_by		   = req.body.edit_created_by;
		let date_modified	   = APIDB.dateToday();
		let status 			   = 1;

		let sql1 = "UPDATE bills_payment SET accountable_person = ? , voucher_number = ? , voucher_date = ? , amount = ? , cheque_number = ? , cheque_date = ? , bank = ? , prepared_by = ? , received_by = ? , created_by = ? , date_modified = ? , status = ?  WHERE bill_payment_id = ?";

		con.query(sql1 , [accountable_person , voucher_number , voucher_date , amount , cheque_number , cheque_date , bank , prepared_by ,received_by , created_by , date_modified , status , bill_payment_id] , (err , result) => {
			if (err) throw err;
			res.send({ success: true });
		});
	} ,

	updatePaymentCheque: (req , res) => {
		let bill_payment_id    = req.body.edit_bill_payment_id;
		let accountable_person = req.body.edit_accountable_person;
		let voucher_number     = req.body.edit_voucher_number;
		let voucher_date       = req.body.edit_voucher_date;
		let amount             = req.body.edit_amount;
		let cheque_number      = req.body.edit_cheque_number;
		let cheque_date        = req.body.edit_cheque_date;
		let bank 			   = req.body.edit_bank;
		let prepared_by		   = req.body.edit_prepared_by;
		let received_by		   = req.body.edit_received_by;
		let created_by		   = req.body.edit_created_by;
		let date_modified	   = APIDB.dateToday();
		let status 			   = 1;

		let sql1 = "UPDATE bills_payment SET accountable_person = ? , voucher_number = ? , voucher_date = ? , amount = ? , cheque_number = ? , cheque_date = ? , bank = ? , prepared_by = ? , received_by = ? , created_by = ? , date_modified = ? , status = ?  WHERE bill_payment_id = ?";

		con.query(sql1 , [accountable_person , voucher_number , voucher_date , amount , cheque_number , cheque_date , bank , prepared_by ,received_by , created_by , date_modified , status , bill_payment_id] , (err , result) => {
			if (err) throw err;
			res.send({ success: true });
		});
	} ,

	deletePayment: (req , res) => {
		let billing_id      = req.body.billing_id;
		let bill_payment_id = req.body.bill_payment_id;
		let status          = 0;
		let payment_status  = 0;
		let sql1 = "UPDATE bills_payment INNER JOIN billings ON bills_payment.billing_id =  billings.billing_id SET bills_payment.status = ?, billings.payment_status = ? WHERE bills_payment.bill_payment_id = ? OR billings.billing_id = ?";

		con.query(sql1 , [status , payment_status, bill_payment_id, billing_id] , (err, result) => {
			if (err) throw err;
			res.send({ success: true });
		});
	} ,

	checkTrashPaymentsRetrieve: (req , res) => {
		let billing_id     = req.params.billing_id;
		let payment_status = 1; 

		let sql1 = "SELECT * FROM billings WHERE billing_id = ? AND payment_status = ?";

		con.query(sql1 , [billing_id , payment_status] , (err , result) => {
			if (result.length > 0) {
				res.send({ success: true });
			} else {
				res.send({ success: false });
			}
		});
	} ,

	retrievePayment: (req , res) => {
		let id         = req.body.id;
		let billing_id = req.body.billing_id;
		let status     = 1;
		let sql1 = "UPDATE bills_payment SET status = ? WHERE bill_payment_id = ?";
		let sql2 = "UPDATE billings SET payment_status = ? WHERE billing_id = ?";

		con.query(sql1 , [status , id] , (err, result) => {
			if (result.affectedRows > 0) {
				
				con.query(sql2 , [status , billing_id] , (err , result) => {
					res.send({ success: true });
				});			
		
			} else {

				res.send({ success: false });
				
			}
		});
	} ,

	permanentDeletePayment: (req , res) => {
		let id   = req.body.id;
		let sql1 = "DELETE FROM bills_payment WHERE bill_payment_id = ?";

		con.query(sql1 , id , (err, result) => {
			res.send({ success: true });
		});
	} ,

	getPayments: (req , res) => {
		let id     = req.params.id;
		let status = 1;
		let sql1   = "SELECT * FROM bills_payment WHERE billing_id = ? AND status = ?";

		con.query(sql1 , [id , status] , (err , result) => {
			if (err) throw err;
			res.send(result);
		});
	} ,

	getDeletedPayments: (req , res) => {
		let status = 0;
		let sql1   = "SELECT * FROM bills_payment WHERE status = ?";

		con.query(sql1 , status , (err , result) => {
			if (err) throw err;
			res.send(result);
		});
	} ,

	

	/***************** ATTACHMENTS ****************/
	/*********************************************/
	addAttachment: (req , res) => {
		let sql1 = "INSERT INTO attachments (attachment_id , billing_id , attachment , created_by , date_created , date_modified , status) VALUES (?,?,?,?,?,?,?)";
		upload(req , res , (err) => {
			console.log(req.file);

			let attachment_id = "a" + APIDB.uniqID();
			let billing_id    = req.body.billing_id;
			let attachment    = req.file.filename;
			let created_by    = req.body.created_by;
			let date_created  = APIDB.dateToday();
			let date_modified = APIDB.dateToday();
			let status        = 1;

			con.query(sql1 , [ attachment_id , billing_id , attachment , created_by , date_created , date_modified , status] , (err , result) => {
				res.send({ success: true });
			});
		});
	} ,

	deleteAttachment: (req , res) => {
		let id     = req.params.id;
		let status = 0;
		let sql1 = "UPDATE attachments SET status = ? WHERE ID = ?";

		con.query(sql1 , [status , id] , (err , result) => {
			res.send({ success: true });
		})

	} ,

	downloadAttachment: (req , res) => {
		let id   = req.params.id;
		let sql1 = "SELECT attachment FROM attachments WHERE attachment_id = ?";
		
		con.query(sql1 , id , (err , result) => {
			res.send({url: path.resolve('../src/assets/uploads', result[0].attachment)});
		});
	} ,

	retrieveAttachment: (req , res) => {
		let id     = req.body.id;
		let status = 1;
		let sql1   = "UPDATE attachments SET status = ? WHERE attachment_id = ?";

		con.query(sql1 , [status , id] , (err, result) => {
			res.send({ success: true });
		});
	} ,

	permanentDeleteAttachment: (req , res) => {
		let id         = req.body.id;
		let attachment = req.body.attachment; 
		let sql1       = "DELETE FROM attachments WHERE attachment_id = ?";

		con.query(sql1 , id , (err, result) => {
			fs.unlinkSync('../src/assets/uploads/' + attachment);
			res.send({ success: true });
		});
	} ,

	getAttachments: (req , res) => {
		let billing_id = req.params.id;
		let status     = 1;
		let sql1 = "SELECT * FROM attachments WHERE billing_id = ? AND status = ?";

		con.query(sql1 , [billing_id , status] , (err , result) => {
			res.send(result);
		});
	} ,

	getDeletedAttachments: (req , res) => {
		let status = 0;
		let sql1   = "SELECT * FROM attachments WHERE status = ?"; 

		con.query(sql1 , status , (err , result) => {
			res.send(result);
		});
	} ,

	getFileType: (req , res) => {
		let attachment_id = req.params.attachment_id;
		let status = 1;
		let sql1 = " SELECT * FROM attachments WHERE status = ? AND attachment_id = ?";

		conq.query(sql1 , [status , attachment_id] , (err , result) => {
			res.send(result);
		});
	} ,
};
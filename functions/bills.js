const APIDB = require("./db");

module.exports = {

	addBill: (req , res) => {
		let billID          = APIDB.uniqID();
		let serviceProvider = req.body.sProvider;
		let accountName     = req.body.aName;
		let accountNumber   = req.body.aNumber;
		let telNo           = req.body.tNum;
		let createdBy       = req.body.cBy;
		let dateCreated     = APIDB.dateToday();
		con.query("INSERT INTO bills(bill_id, bill, account_name, account_number, tel_no, created_by, date_created, date_modified, status) VALUES('" + billID + "', '" + serviceProvider + "', '" + accountName + "', '" + accountNumber + "', '" + telNo + "', '" + createdBy + "', '" + dateCreated + "', '" + dateCreated + "', 1)", function(err, result){
			if(err) throw err;
			res.send(result);
		});
	} ,

	updateBill: (req , res) => {
		let billID    	 = req.body.billID;
		let sProvider 	 = req.body.sProvider;
		let aName     	 = req.body.aName;
		let aNumber   	 = req.body.aNumber;
		let tNum      	 = req.body.tNum;
		let cBy          = req.body.cBy;
		let dateModified = APIDB.dateToday();

		let sql1 = "UPDATE bills SET bill = ?, account_name = ?, account_number = ?, tel_no = ?, created_by = ?, date_modified = ? WHERE bill_id = ?";

		con.query(sql1, [sProvider, aName, aNumber, tNum, cBy, dateModified, billID], (err, result) => {
			if(err) throw err;
			res.send(result);
		});
	} ,

	addServiceProvider: (req , res) => {

		let service_id    = "sp" + APIDB.uniqID();
		let name          = req.body.name;
		let date_created  = APIDB.dateToday();
		let date_modified = APIDB.dateToday();
		let status        = 1;
		let created_by    = req.body.created_by;

		let sql1 = "SELECT * FROM service_provider WHERE name = ?";
		let sql2 = "INSERT INTO service_provider (service_id , name , date_created , date_modified , status, created_by) VALUES (?,?,?,?,?,?)";

		con.query(sql1 , name , (err , result) =>{
			if (result.length > 0) {

				res.send({ success: false });

			} else {

				con.query(sql2 , [service_id , name , date_created , date_modified , status, created_by] , (err , result) => {
					res.send({ success: true });
				});

			}
		})

	} ,

	updateServiceProvider: (req , res) => {
		let service_id    = req.body.service_id; 
		let name          = req.body.name;
		let date_modified = APIDB.dateToday();
		let created_by    = req.body.created_by;

		let sql1 = "UPDATE service_provider SET name = ? , date_modified = ?, created_by = ? WHERE service_id = ?";

		con.query(sql1 , [name , date_modified, created_by , service_id] , (err , result) => {
			res.send({ success: true });
		});
	} ,

	findServiceProvider: (req, res) => {
		let sql1 = "SELECT * FROM service_provider";

		con.query(sql1, function(err, result){
			if(err) throw err;
			res.send(result);
		});
	},

	checkServiceProvider: (req , res) => {
		let service_id = req.params.service_id;

		let sql1 = "SELECT * FROM service_provider WHERE service_id != ?";
		con.query(sql1 , service_id , (err , result) => {
			res.send(result);
		});
	} ,

	deleteServiceProvider: (req , res) => {
		let id     = req.body.id;	
		let status = 0;
		let sql1 = "UPDATE service_provider SET status = ? WHERE id =?"; 

		con.query(sql1 , [status , id] , (err , result) => {
			res.send({ success: true });
		});
	} ,

	getDeletedServiceProviders: (req , res) => {
		let status = 0;
		let sql1   = "SELECT * FROM service_provider WHERE status = ?";

		con.query(sql1 , status , (err , result) => {
			res.send(result);
		});
	} ,

	retrieveServiceProvider: (req , res) => {
		let service_id = req.body.id;
		let status     = 1;
		let sql1       = "UPDATE service_provider SET status = ? WHERE service_id = ?";

		con.query(sql1 , [status , service_id] , (err , result) => {
			res.send({ success: true });
		});
	} ,

	permanentDeleteServiceProvider: (req , res) => {
		let service_id   = req.body.id;
		let sql1 = "DELETE FROM service_provider WHERE service_id = ?";

		con.query(sql1 , service_id , (err, result) => {
			res.send({ success: true });
		});
	} ,

	retrieveBill: (req , res) => {
		let id     = req.body.id;
		let status = 1;
		let sql1   = "UPDATE bills SET status = ? WHERE bill_id = ?";

		con.query(sql1 , [status , id] , (err, result) => {
			res.send({ success: true });
		});
	} ,

	permanentDeleteBill: (req , res) => {
		let id   = req.body.id;
		let sql1 = "DELETE FROM bills WHERE bill_id = ?";

		con.query(sql1 , id , (err, result) => {
			res.send({ success: true });
		});
	} ,

	deleteBill: (req , res) => {
		let billID = req.body.billID;
		con.query("UPDATE bills SET status=0 WHERE bill_id='" + billID + "'", function(err, result){
			if(err) throw err;
			res.send(result);
		});
	} ,

	getBills: (req , res) => {
		con.query("SELECT * FROM bills WHERE status=1 ORDER BY date_modified DESC", function(err, result){
			if(err) throw err;
			res.send(result);
		});
	} ,

	findBill: (req , res) => {
		con.query("SELECT * FROM bills", function(err, result){
			if(err) throw err;
			res.send(result);
		});
	} ,

	getBillByStatus: (req , res) => {
		let sql1 = "SELECT bills.bill, bills.bill_id , bills.account_name , bills.account_number , bills.status, billings.billing_id, billings.soa_number, billings.payment_status, billings.due_date FROM bills INNER JOIN billings ON billings.bill_id=bills.bill_id WHERE billings.status = 1 AND bills.status = 1 ORDER BY billings.due_date ASC LIMIT 100";

		con.query(sql1 , (err, result) => {
			if(err) throw err;
			res.send(result);
		});
	} ,

	getBillByAccountName: (req , res) => {
		let sql1 = "SELECT account_name FROM bills";

		con.query(sql1 , (err , result) => {
			res.send(result);
		});
	} ,

	getBillByAccountNumber: (req , res) => {
		let name = req.params.id;
		let sql1 = "SELECT account_number FROM bills WHERE bill_id = ?";

		con.query(sql1 , name , (err , result) => {
			res.send(result[0]);
		});
	} ,

	getDeletedBills: (req , res) => {
		let status = 0;
		let sql1   = "SELECT * FROM bills WHERE status = ?";

		con.query(sql1 , status , (err , result) => {
			res.send(result);
		});
	} ,

	getBillByBillId: (req, res) => {
		let bill_id = req.params.id;
		let sql1 = "SELECT * FROM bills WHERE bill_id != ?";

		con.query(sql1, bill_id, (err, result) => {
			res.send(result);
		});
	} ,

	getServiceProvider: (req , res) => {
		let status = 1;
		let sql1   = "SELECT * FROM service_provider WHERE status = ? ORDER BY date_modified DESC";

		con.query(sql1 , status , (err , result) => {
			if(err) throw err;
			res.send(result);
		});
	} ,
}
const APIDB = require("./db");
let today = new Date();
let date  = today.getFullYear()+'-'+("0" + (today.getMonth() + 1)).slice(-2);

module.exports = {
	getDisplay: (req , res) => {
		let month  = req.params.month;
		let year   = req.params.year;
		let status = 1;
		let date   = year + "-" + month; 
		let i      = 0;
		let sum_unpaid = 0;
		let sum_paid = 0;
		let payment_status1 = 0;
		let payment_status2 = 1;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE SUBSTRING(due_date, 1, 7) = ? AND billings.status = ? ORDER BY billings.due_date ASC";

		con.query(sql1 , [ date , status ] , (err , result) => {
			res.send(result);
		})
	} ,

	getDisplayTotalPaid: (req , res) => {
		let month 		   = req.params.month;
		let year  	 	   = req.params.year;
		let date  		   = year + "-" + month;
		let i     		   = 0;
		let sum   		   = 0;
		let payment_status = 1;
		let status         = 1;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE SUBSTRING(due_date, 1, 7) = ? AND billings.payment_status = ? AND billings.status = ?";

		con.query(sql1 , [ date , payment_status , status ] , (err , result) => { 
			for (i; i < result.length; i++) {

				if (result[i].amount < 0) {
					sum += result[i].amount * -1;
				} else {
					sum += result[i].amount;
				}
			}

			res.send({ sum_paid: sum });
		});
	} ,

	getDisplayTotalUnpaid: (req , res) => {
		let month 		   = req.params.month;
		let year  	 	   = req.params.year;
		let date  		   = year + "-" + month;
		let i     		   = 0;
		let sum   		   = 0;
		let payment_status = 0;
		let status         = 1;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE SUBSTRING(due_date, 1, 7) = ? AND billings.payment_status = ? AND billings.status = ?";

		con.query(sql1 , [ date , payment_status , status ] , (err , result) => { 
			for (i; i < result.length; i++) {

				if (result[i].amount < 0) {
					sum += result[i].amount * -1;
				} else {
					sum += result[i].amount;
				}
			}

			res.send({ sum_unpaid: sum });
		});
	} ,

	getDisplayRange: (req , res) => {
		let start_date = req.params.start_date;
		let end_date   = req.params.end_date;
		let status     = 1;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE billings.due_date BETWEEN ? AND ? AND billings.status = ? ORDER BY billings.due_date ASC";

		con.query(sql1 , [ start_date , end_date , status ] , (err , result) => {
			res.send(result);
		});
	} ,	

	getDisplayRangeTotalPaid: (req , res) => {
		let start_date     = req.params.start_date;
		let end_date       = req.params.end_date;
		let payment_status = 1;
		let status         = 1;
		let i              = 0;
		let sum            = 0;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE billings.due_date BETWEEN ? AND ? AND billings.payment_status = ? AND billings.status = ?";

		con.query(sql1 , [ start_date , end_date , payment_status , status ] , (err , result) => {
			for (i; i < result.length; i++) {

				if (result[i].amount < 0) {
					sum += result[i].amount * -1;
				} else {
					sum += result[i].amount;
				}
			}

			res.send({ range_total_paid: sum });
		});

	} ,

	getDisplayRangeTotalUnpaid: (req , res) => {
		let start_date     = req.params.start_date;
		let end_date       = req.params.end_date;
		let payment_status = 0;
		let status         = 1;
		let i              = 0;
		let sum            = 0;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE billings.due_date BETWEEN ? AND ? AND billings.payment_status = ? AND billings.status = ?";

		con.query(sql1 , [ start_date , end_date , payment_status , status ] , (err , result) => {
			for (i; i < result.length; i++) {

				if (result[i].amount < 0) {
					sum+= result[i].amount * -1;
				} else {
					sum+= result[i].amount;
				}
			}

			res.send({ range_total_unpaid: sum });
		});
	} ,

	getCountBills: (req , res) => {
		let status1 = 0;
		let status2 = 1;
		let sql1   = "SELECT count(*) AS billsCount FROM bills INNER JOIN billings ON billings.bill_id=bills.bill_id WHERE billings.payment_status = ? AND SUBSTRING(billings.due_date , 1 , 7) = ? AND billings.status = ?";

		con.query(sql1 , [status1 , date , status2] , (err , result) => {
			res.send(result)
		});
	} ,

	getCountBillings: (req , res) => {
		let status1 = 0;
		let status2 = 1;
		let sql1   = "SELECT count(*) AS billingsCount FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE billings.payment_status = ? AND SUBSTRING(billings.due_date , 1 , 7) = ? AND billings.status = ?";

		con.query(sql1 , [status1 , date , status2] , (err , result) => {
			res.send(result)
		});
	} ,

	getSumBillingsPaid: (req , res) => {
		let payment_status = 1;
		let status         = 1;
		let i = 0;
		let sum = 0;
		let sql1 = "SELECT * FROM billings WHERE SUBSTRING(due_date , 1 , 7) = ? AND payment_status = ? AND status = ?";

		con.query(sql1 , [ date , payment_status , status ] , (err , result) => {			
			for (i; i < result.length; i++) {

				if (result[i].amount < 0) {
					sum+= result[i].amount * -1;
				} else {
					sum+= result[i].amount;
				}
			}

			res.send({ totalSumBillingsPaid: sum });
		});
	} ,

	getSumBillingsUnpaid: (req , res) => {
		let payment_status = 0;
		let status         = 1;
		let i = 0;
		let sum = 0;
		let sql1 = "SELECT * FROM billings WHERE SUBSTRING(due_date , 1 , 7) = ? AND payment_status = ? AND status = ?";

		con.query(sql1 , [ date , payment_status , status ] , (err , result) => {

			for (i; i < result.length; i++) {

				if (result[i].amount < 0) {
					sum+= result[i].amount * -1;
				} else {
					sum+= result[i].amount;
				}
			}

			res.send({ totalSumBillingsUnpaid: sum });
		});
	} ,

	getDisplayByBill: (req , res) => {
		let account_name = req.params.account_name;
		let year 		 = req.params.year;
		let status 	     = 1;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE SUBSTRING(billings.due_date, 1, 4) = ? AND billings.bill_id = ? AND billings.status = ? ORDER BY billings.due_date ASC";

		con.query(sql1 , [ year , account_name , status ] , (err , result) => {
			res.send(result);
		});
	} ,

	getDisplayByBillPaid: (req , res) => {
		let account_name   = req.params.account_name;
		let year 		   = req.params.year;
		let payment_status = 1;
		let status 	       = 1;
		let i 			   = 0;
		let sum 		   = 0;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE SUBSTRING(billings.due_date, 1, 4) = ? AND billings.payment_status = ? AND billings.status = ? AND billings.bill_id = ?";
	
		con.query(sql1 , [year , payment_status , status , account_name] , (err , result) => {
			for (i; i < result.length; i++) {

				if (result[i].amount < 0) {
					sum+= result[i].amount * -1;
				} else {
					sum+= result[i].amount;
				}
			}

			res.send({ totalSumBillingsPaid: sum });
		});
	} ,

	getDisplayByBillUnpaid: (req , res) => {
		let account_name   = req.params.account_name;
		let year 		   = req.params.year;
		let payment_status = 0;
		let status 	       = 1;
		let i 			   = 0;
		let sum 		   = 0;

		let sql1 = "SELECT * FROM billings INNER JOIN bills ON bills.bill_id=billings.bill_id WHERE SUBSTRING(billings.due_date, 1, 4) = ? AND billings.payment_status = ? AND billings.status = ? AND billings.bill_id = ?";
	
		con.query(sql1 , [year , payment_status , status , account_name] , (err , result) => {
			for (i; i < result.length; i++) {

				if (result[i].amount < 0) {
					sum+= result[i].amount * -1;
				} else {
					sum+= result[i].amount;
				}
			}

			res.send({ totalSumBillingsUnpaid: sum });
		});
	} ,
}
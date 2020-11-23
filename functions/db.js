let mysql      = require('mysql');
let nodemailer = require('nodemailer');

global.con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "bills_monitoring"
});

module.exports = {
	dbConnection: (req , res) => {
		con.connect((err) => {
		if (err) return console.error(err);
			console.log("Database Connected!");
		});
	} ,

	uniqID: (req , res) => {
		let today     = new Date();
		let date      = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		let time      = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		let uniqID    = today.getFullYear() +""+ (today.getMonth()+1) + "" + today.getDate() + '-' + Math.floor(Math.random() * 1000000);
		return uniqID;
	} ,

	dateToday: (req , res) => {
		let today     = new Date();
		let date      = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		let time      = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		let dateToday = date + ' ' + time;
		return dateToday;
	} ,
};
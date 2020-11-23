let express     = require("express");
let cors        = require('cors');
let multer      = require('multer');
let app         = express();
let port        = 3000;
let bodyParser  = require('body-parser');
global.cron = require('node-cron');

global.notifier = require('node-notifier');
global.moment = require('moment');
global.storage = multer.diskStorage({
	destination: '../src/assets/uploads/' ,

	filename(req , file , cb) {
		cb(null , file.originalname, true);
	}
});
global.upload = multer({ storage: storage }).single('myFile');

const APIDB = require("./functions/db");
APIDB.dbConnection();

const APIUSERS    = require("./functions/users");
const APIBILLS    = require("./functions/bills");
const APIBILLINGS = require("./functions/billing");
const APIREPORTS  = require("./functions/report");
const APISETTINGS = require("./functions/settings");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(process.env.PORT || port, '0.0.0.0', function() {
    console.log('Listening to port:  ' + process.env.PORT || port);
});

/*app.listen(process.env.PORT || port , err => {	
	if (err) console.error(err);
	console.log("Server running at port " , process.env.PORT || port);
});*/

/****************** USERS ********************/
/*********************************************/
app.post("/login/"           , APIUSERS.login);
app.post("/add/user/"        , APIUSERS.addUser);
app.post("/update/user/"     , APIUSERS.updateUser);
app.post("/delete/user/"     , APIUSERS.deleteUser);
app.post("/update/profile/"  , APIUSERS.updateProfile);
app.post("/update/password/" , APIUSERS.updatePass);

app.get("/get/users/"         , APIUSERS.getUsers);
app.get("/get/admin/:user_id" , APIUSERS.getAdmin);
app.get("/get/my/profile/:user_id" , APIUSERS.getMyProfile);
app.get("/check/usernames/:user_id" , APIUSERS.checkUsernames);
app.get("/check/old_password/:user_id/:old_password" , APIUSERS.checkOldPassword);

/****************** BILLS ********************/
/*********************************************/
app.post('/add/new/bills/'		       , APIBILLS.addBill);
app.post('/update/bills/' 		       , APIBILLS.updateBill);
app.post('/delete/bills/' 		       , APIBILLS.deleteBill);
app.post('/retrieve/bill/'		       , APIBILLS.retrieveBill);
app.post('/permanent/delete/bill/' 	   , APIBILLS.permanentDeleteBill);

app.post('/add/new/service_provider/'         , APIBILLS.addServiceProvider);
app.post('/update/service_provider/'  		  , APIBILLS.updateServiceProvider);
app.post('/delete/service_provider/'   		  , APIBILLS.deleteServiceProvider);
app.post('/retrieve/service_provider/' 		  , APIBILLS.retrieveServiceProvider);
app.post('/permanent/delete/service_provider' , APIBILLS.permanentDeleteServiceProvider);

app.get('/get/bills/'                   	   , APIBILLS.getBills);
app.get('/find/bills/'                  	   , APIBILLS.findBill);
app.get("/get/bills/status/"            	   , APIBILLS.getBillByStatus);
app.get("/get/bills/account_name/"      	   , APIBILLS.getBillByAccountName);
app.get("/get/bills/account_number/:id" 	   , APIBILLS.getBillByAccountNumber);
app.get("/get/deleted/bills/"           	   , APIBILLS.getDeletedBills);
app.get("/get/bill/billid/:id"          	   , APIBILLS.getBillByBillId);
app.get("/get/service_provider/"           	   , APIBILLS.getServiceProvider);
app.get("/find/service_provider"			   , APIBILLS.findServiceProvider);
app.get('/check/service_provider/:service_id/' , APIBILLS.checkServiceProvider);
app.get('/get/deleted/service_providers/'      , APIBILLS.getDeletedServiceProviders);

/****************** BILLINGS ******************/
/*********************************************/
app.post("/add/new/billing/" 		  		 , APIBILLINGS.addBilling);
app.post('/edit/billings/'   		  		 , APIBILLINGS.updateBilling);
app.post('/delete/billing/'   		  		 , APIBILLINGS.deleteBilling);
app.post('/retrieve/billing/'         		 , APIBILLINGS.retrieveBilling);
app.post('/permanent/delete/billing/' 		 , APIBILLINGS.permanentDeleteBilling);

app.get('/check/trash/billings/:soa_number' , APIBILLINGS.checkTrashBillings);
app.get("/get/billings/"                    , APIBILLINGS.getBillings);
app.get("/get/view/billing/:id"    			, APIBILLINGS.getBillingById);
app.get("/get/billings/due/date"   			, APIBILLINGS.getBillingDueDate);
app.get("/get/billings/amount/:id" 			, APIBILLINGS.getBillingAmount);
app.get("/get/deleted/billings"    			, APIBILLINGS.getDeletedBillings);
 

/****************** PAYMENTS *****************/
/*********************************************/
app.post("/add/new/payment/cash/"     , APIBILLINGS.addPaymentCash);
app.post("/add/new/payment/cheque/"   , APIBILLINGS.addPaymentQheque);
app.post("/update/payment/cash/"  	  , APIBILLINGS.updatePaymentCash);
app.post("/update/payment/cheque/"    , APIBILLINGS.updatePaymentCheque);

app.post("/delete/payment/"   		  , APIBILLINGS.deletePayment);
app.post('/retrieve/payment/'  		  , APIBILLINGS.retrievePayment);
app.post('/permanent/delete/payment/' , APIBILLINGS.permanentDeletePayment);

app.get('/check/trash/payments/:billing_id/:voucher_number' , APIBILLINGS.checkTrashPayments);
app.get('/check/trash/retrieve/payments/:billing_id' , APIBILLINGS.checkTrashPaymentsRetrieve);
app.get("/get/view/payment/:id"  , APIBILLINGS.getPayments);
app.get("/get/deleted/payments/" , APIBILLINGS.getDeletedPayments);

/**************** ATTACHMENTS ****************/
/*********************************************/
app.post("/add/attachment/storage/" 	 , APIBILLINGS.addAttachment);
app.post('/retrieve/attachment/'    	 , APIBILLINGS.retrieveAttachment);
app.post('/permanent/delete/attachment/' , APIBILLINGS.permanentDeleteAttachment);

app.get("/delete/attachment/:id"    	, APIBILLINGS.deleteAttachment);
app.get("/download/attachment/:id"  	, APIBILLINGS.downloadAttachment);
app.get("/get/view/attachment/:id"  	, APIBILLINGS.getAttachments);
app.get("/get/deleted/attachments/" 	, APIBILLINGS.getDeletedAttachments);
app.get("/get/file/type/:attachment_id" , APIBILLINGS.getFileType);	

/****************** REPORTS ******************/
/*********************************************/
app.get("/get/display/:month/:year/"      , APIREPORTS.getDisplay);
app.get('/get/total/paid/:month/:year/'   , APIREPORTS.getDisplayTotalPaid);
app.get('/get/total/unpaid/:month/:year/' , APIREPORTS.getDisplayTotalUnpaid);

app.get("/get/display/range/:start_date/:end_date"        , APIREPORTS.getDisplayRange);
app.get('/get/display/range/paid/:start_date/:end_date'   , APIREPORTS.getDisplayRangeTotalPaid);
app.get('/get/display/range/unpaid/:start_date/:end_date' , APIREPORTS.getDisplayRangeTotalUnpaid);

app.get("/get/counted/bills/"        			   , APIREPORTS.getCountBills);
app.get("/get/counted/billings/"    			   , APIREPORTS.getCountBillings);

app.get("/get/sum/billings/paid/"  		  , APIREPORTS.getSumBillingsPaid);
app.get("/get/sum/billings/unpaid/" 	  , APIREPORTS.getSumBillingsUnpaid);

app.get("/get/display/by/bill/:account_name/:year/"        , APIREPORTS.getDisplayByBill);
app.get("/get/display/by/bill/paid/:account_name/:year/"   , APIREPORTS.getDisplayByBillPaid);
app.get("/get/display/by/bill/unpaid/:account_name/:year/" , APIREPORTS.getDisplayByBillUnpaid);

/****************** SETTINGS ******************/
/**********************************************/
app.post("/add/new/email/" , APISETTINGS.addEmail);
app.post("/update/email/"  , APISETTINGS.updateEmail);
app.post("/delete/email/", APISETTINGS.deleteEmail);
app.post("/retrieve/email", APISETTINGS.retrieveEmail);
app.post("/permanent/delete/email", APISETTINGS.permanentDeleteEmail);

app.get("/get/emails/"      , APISETTINGS.getEmails);
app.get("/add/get/emails"   , APISETTINGS.addGetEmails);
app.get("/get/email/by/:id" , APISETTINGS.getEmailById);
app.get("/get/deleted/email", APISETTINGS.getDeletedEmail);
app.get("/count/email"      , APISETTINGS.countEmail);

app.post('/update/colors/'           	   , APISETTINGS.updateColors);
app.get('/get/active/color/:user_id' 	   , APISETTINGS.getActiveColor);
app.get('/get/colors/'                     , APISETTINGS.getColors);
app.get('/check/colors/:color_id/:user_id' , APISETTINGS.checkColors); 

app.get("/get/dark/:user_id"      			 , APISETTINGS.getDarkColor);
app.get("/get/dark/mode/:user_id" 		 	 , APISETTINGS.getActiveDarkMode);
app.get("/update/dark/mode/:user_id/:status" , APISETTINGS.updateDarkColor);

/*************** BILLING DUE NOTIFICATION ***************/
/********************************************************/
let notifEveryMinute = '30 * * * *';
let notifEveryHour = '0 */1 * * *';
let notifEveryDay = '0 0 */1 * *';
cron.schedule(notifEveryHour, () => {
	APIBILLINGS.billingNotification();
});
/**************** EMAIL DUE BILLINGS ***************/
/***************************************************/
app.get('/get/set/time', APISETTINGS.getSetTime);
app.get('/get/email/sender', APISETTINGS.getEmailSender);
app.get('/check/set/email/:sender', APISETTINGS.checkSetEmail);

app.post('/set/email/time', APISETTINGS.setEmailTime);
app.post('/set/email/sender', APISETTINGS.setEmailSender);

APISETTINGS.getEmailTime();

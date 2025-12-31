import express from 'express'
import { Login } from '../Controllers/Login.js'
import { userVerification } from '../Middleware/AuthMiddleware.js';
import { Register } from '../Controllers/Register.js';
import { getUserData } from '../Controllers/getUserData.js';
import { Testing } from '../Controllers/Testing.js';
import { sendDataToWebPortal } from '../Controllers/sendDataToWebPortal.js';
import multer from 'multer'
import { UpdatedData } from '../Controllers/UpdateData.js';
import { Forgetpass } from '../Controllers/Forgetpass.js';
import { GetAllData } from '../Controllers/GetAllData.js';
import { AdminLogin } from '../Controllers/AdminLogin.js';
import { AdminRegister } from '../Controllers/AdminRegister.js';
import { AllData, AllDataForDashboard, AllDataForReports, Allusers, DataById } from '../Controllers/Admin-UserRequest.js';
import { Testing1 } from '../Controllers/Testing1.js';
import { POCreation } from '../Controllers/POCreation.js';
import HandleCancelPR from '../Controllers/HandleCancelPR.js';
import VendorOnBoard from '../Controllers/VendorOnBoard.js';
import { SendVendorData } from '../Controllers/SendVendorData.js';
import CreateCategory from '../Controllers/CreateCategory.js';
import { GetCategoryData } from '../Controllers/GetCategoryProduct.js';
import { DeleteEntity, UpdatePassword, UpdateVendor } from '../Controllers/DeleteUserVendor.js';
import {  AddProduct, DeleteCategory, DeleteCategoryproduct, UpdateCategoryproduct } from '../Controllers/DeleteCategoryProduct.js';
import { POData } from '../Controllers/POData.js';
import { GenerateSASUrl } from '../Controllers/GenerateSASURL.js';
import { GR_Invoice } from '../Controllers/GR_Invoice.js';
import { Receipt_Invoice } from '../Controllers/ReceiptInvoice.js';
import { PO_CreationDone } from '../Controllers/POCreationDone.js';

const upload = multer({ storage: multer.memoryStorage() });
const Routers = express.Router();
Routers.post('/',userVerification);
Routers.post('/signup', Register);
Routers.post('/login', Login);
Routers.post('/adminlogin',AdminLogin);
Routers.post('/adminsignup',AdminRegister)
Routers.put('/forgetpass',Forgetpass);
Routers.get('/allData',GetAllData);
Routers.get('/allUsers',Allusers);
Routers.get('/userData',AllData);
Routers.get('/reports',AllDataForReports);
Routers.get('/userData/:id',DataById);
Routers.get('/dashboard',AllDataForDashboard);
Routers.get('/Podata',POData);
Routers.post("/Gr-InvoiceAction",  upload.fields([
    { name: "receiptFiles", maxCount: 20 },
    { name: "invoiceFiles", maxCount: 20 }
  ]), GR_Invoice);
Routers.post("/PaymentAction", upload.array('attachment'), Receipt_Invoice);
Routers.post("/POAction", upload.array('attachment'), PO_CreationDone);

Routers.post('/attachment/:id', GenerateSASUrl);


Routers.post('/sendEmail',upload.array('attachment'),Testing1);
Routers.post('/pocreation',POCreation);
Routers.get('/getData',getUserData);
Routers.put('/updateRequest',upload.array('attachment'),UpdatedData);
Routers.get('/getApprovers',sendDataToWebPortal);
Routers.post('/cancel/:prNo',HandleCancelPR);
Routers.post('/vendor-add',VendorOnBoard);
Routers.get('/vendorData',SendVendorData);
Routers.post('/create-category',CreateCategory);
Routers.get('/getCategory',GetCategoryData);
Routers.delete('/account/:id',DeleteEntity);
Routers.put('/users/:id',UpdatePassword);
Routers.put('/vendors/:id',UpdateVendor);
Routers.delete('/delete-product',DeleteCategoryproduct);
Routers.put('/edit-product',UpdateCategoryproduct);
Routers.post('/add-product',AddProduct);
Routers.delete('/delete-category/:id',DeleteCategory)
export default Routers;


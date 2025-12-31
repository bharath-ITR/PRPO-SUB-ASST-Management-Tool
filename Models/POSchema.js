/* import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
    PONumber:String,
    PR_no: String,
    shippingAddress: String,
    productName: String,
    productDescription: String,
    quantity: String,
    approxCost: String,
    deliveryDate: Date,
    purchaseType: String,
    paymentType: String,
    vendorName: String,
    vendorEmail: String,
    vendorAddress: String,
    vendorPhone: String,

});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
 */


/* 
import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
    PONumber: String,
    PR_no: String,
    shippingAddress: String,
    productName: String,
    productDescription: String,
    quantity: String,
    approxCost: String,

    cgst: String,
    sgst: String,
    totalCost: String,
    deliveryDate: Date,
    purchaseType: String,
    paymentType: String,
    vendorName: String,
    vendorEmail: String,
    vendorAddress: String,
    vendorPhone: String,
    Tax: String,
    quotationNo:String,
    quotationDate:Date,
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
 */

/* 
import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
    PONumber: String,
    PR_no: String,
    Tax: String,
    approxCost: String,
    currentDate: String,
    deliveryDate: String,
    location: String,
    paymentType: String,
    productDescription: String,
    productName: String,
    purchaseType: String,
    quantity: String,
    quotationDate: String,
    quotationNo: String,
    shippingAddress: String,
    unitPrice: String,
    vendorAddress: String,
    vendorEmail: String,
    vendorName: String,
    vendorPhone: String,
    cgst: String,
    sgst: String,
    totalCost: String
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
 */



/* 
import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
    PONumber: String,
    PR_no: String,
    Tax: String,
    approxCost: String,
    currentDate: String,
    deliveryDate: String,
    location: String,
    paymentType: String,
    productDescription: String,
    productName: String,
    purchaseType: String,
    quantity: String,
    quotationDate: String,
    quotationNo: String,
    shippingAddress: String,
    unitPrice: String,
    vendorAddress: String,
    vendorEmail: String,
    vendorName: String,
    vendorPhone: String,
    cgst: String,
    sgst: String,
    igst: String,
    totalCost: String
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
 */

/* 
import mongoose from 'mongoose';

const PurchaseOrderSchema = new mongoose.Schema({
    PONumber: { type: String, required: true, unique: true },
    PR_no: { type: String, required: true },
    Tax: { type: String, required: true },
    approxCost: { type: String, required: true },
    currentDate: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    location: { type: String, required: true },
    paymentType: { type: String, required: true },
    productDescription: { type: String, required: true },
    productName: { type: String, required: true },
    purchaseType: { type: String, required: true },
    quantity: { type: Number, required: true },
    quotationDate: { type: String, required: true },
    quotationNo: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    unitPrice: { type: String, required: true },
    vendorAddress: { type: String, required: true },
    vendorEmail: { type: String, required: true },
    vendorName: { type: String, required: true },
    vendorPhone: { type: String, required: true },
    cgst: { type: String, default: 'USD 0.00' },
    sgst: { type: String, default: 'USD 0.00' },
    igst: { type: String, default: 'USD 0.00' },
    totalCost: { type: String, required: true }
});

const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

export default PurchaseOrder;
 */


import mongoose from 'mongoose';

const PurchaseOrderSchema = new mongoose.Schema({
    PONumber: { type: String, required: true },
    PR_no: { type: String, required: true },
    Tax: { type: String, required: true },
    approxCost: { type: String, required: true },
    totalAmount: { type: String },
    currentDate: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    location: { type: String, required: true },
    paymentType: { type: String, required: true },
    productDescription: { type: String, required: true },
    productName: { type: String, required: true },
    purchaseType: { type: String, required: true },
    quantity: { type: String, required: true },
    quotationDate: { type: String, required: true },
    quotationNo: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    unitPrice: { type: String, required: true },
    currency: { type: String, required: true },
    VendorCompanyName: { type: String, required: true },
    vendorEmail: { type: String, required: true },
    vendorName: { type: String, required: true },
    vendorGSTIN: { type: String, required: true },
    vendorArea: { type: String, required: true },
    vendorStreet: { type: String, required: true },
    vendorCity: { type: String, required: true },
    vendorPostalCode: { type: String, required: true },

    vendorState: { type: String, required: true },
    cgst: { type: String, required: true },
    sgst: { type: String, required: true },
    igst: { type: String, required: true },
    totalCost: { type: String, required: true },
    companyDetails: {
        CompanyID: { type: String, required: true },
        CompanyName: { type: String, required: true },
        GSTIN: { type: String, required: true },
        address: { type: String, required: true },
        nearby: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true }
    }
});

const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

export default PurchaseOrder;

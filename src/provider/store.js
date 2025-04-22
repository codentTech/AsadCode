import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth.slice';
import businessDetailReducer from './features/business-detail/business-detail.slice';
import financialDetailReducer from './features/financial-detail/financial-detail.slice';
import profileFinancialBusinessReducer from './features/profile-financial-business/profile-financial-business.slice';
import profileReducer from './features/profile/profile.slice';
import priceGroupReducer from './features/price-group/price-group.slice';
import discountGroupReducer from './features/discount-group/discount-group.slice';
import faqReducer from './features/faq/faq.slice';
import tagReducer from './features/tag/tag.slice';
import productReducer from './features/product/product.slice';
import customerReducer from './features/customer/customer.slice';
import productCategoryReducer from './features/product-category/product-category.slice';
import userReducer from './features/user/user.slice';
import expenditureReducer from './features/expenditure/expenditure.slice';
import expenditureCategoryReducer from './features/expenditure-category/expenditure-category.slice';
import templateReducer from './features/template/template.slice';
import orderReducer from './features/order/order.slice';
import offerReducer from './features/offer/offer.slice';
import creditNoteReducer from './features/credit-note/credit-note.slice';
import invoiceReducer from './features/invoice/invoice.slice';
import customerCommentReducer from './features/customer-comments/customer-comments.slice';
import deliveryNotesReducer from './features/delivery-notes/delivery-notes.slice';
import uploadFileReducer from './features/upload-file/upload-file.slice';
import invoiceReminderReducer from './features/reminder/reminder.slice';
import unitReducer from './features/unit/unit.slice';
import taxRateReducer from './features/tax-rate/tax-rate.slice';
import settingReducer from './features/setting/setting.slice';
import contactReducer from './features/contact-id/contact.slice';
import dashboardReducer from './features/dashboard/dashboard.service';
import smtpReducer from './features/smtp/smtp.slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    businessDetail: businessDetailReducer,
    financialDetail: financialDetailReducer,
    profileFinancialBusiness: profileFinancialBusinessReducer,
    profile: profileReducer,
    priceGroup: priceGroupReducer,
    discountGroup: discountGroupReducer,
    faq: faqReducer,
    product: productReducer,
    customer: customerReducer,
    productCategory: productCategoryReducer,
    tag: tagReducer,
    expenditure: expenditureReducer,
    expenditureCategory: expenditureCategoryReducer,
    template: templateReducer,
    customerComment: customerCommentReducer,
    offer: offerReducer,
    'credit-note': creditNoteReducer,
    order: orderReducer,
    deliveryNotes: deliveryNotesReducer,
    invoice: invoiceReducer,
    uploadFile: uploadFileReducer,
    invoiceReminder: invoiceReminderReducer,
    unit: unitReducer,
    taxRate: taxRateReducer,
    setting: settingReducer,
    contact: contactReducer,
    dashboard: dashboardReducer,
    smtp: smtpReducer
  }
});

export default store;

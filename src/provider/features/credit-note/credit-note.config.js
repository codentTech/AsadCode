export default {
  name: 'credit-note',
  label: 'credit note',
  viewPageUrl: '/credit-note/view',
  createPageUrl: '/credit-note/create',
  editPageUrl: '/credit-note/edit',
  viewReceiptPageUrl: '/credit-note/view-receipt',
  apiGetAllUrl: '/credit-note/get-all',
  apiCreateHeaderBody: '/credit-note/add-header-and-body',
  apiAddCustomerUrl: '/credit-note/add-customer',
  apiCreateLineItemUrl: '/credit-note/add-line-item',
  apiAddPageStructureUrl: '/credit-note/add-page-structure',
  apiGetSingleDocumentUrl: '/credit-note/', // Use as base, append ID for specific document
  apiUpdateDocumentUrl: '/credit-note/', // Use as base, append ID for specific document
  apiDeleteDocumentUrl: '/credit-note/', // Use as base, append ID for specific document
  apiGetDocumentHistoryUrl: '/credit-note/get-history/', // Append ID for document history
  apiBookAnDocumentUrl: '/credit-note/book/', // Append ID to book an document
  apiDocumentRejectionUrl: '/credit-note/rejection',
  apiAddDocumentTemplateUrl: '/credit-note/add-template',
  apiSaveAsDraftUrl: '/credit-note/save-as-draft/', // Append ID to save as draft
  apiUploadFilesUrl: '/credit-note/upload-files/' // Append ID for uploading files
};

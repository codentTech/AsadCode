import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import striptags from 'striptags';
import {
  getAllSimpleTemplates,
  getAllStandardTemplates
} from '@/provider/features/template/template.slice';
import { getSingleBusinessDetail } from '@/provider/features/business-detail/business-detail.slice';
import { LINE_ITEM_MAIN_HEADING } from '../constants/document.constants';
import documentHeading from '../utils/document-line-items/document-headings';
import { DOCUMENT_MODULE } from '../utils/document-helpers/document-helpers';
import { getUser } from '../utils/users.util';

function useDocumentTemplate({ documentType }) {
  const dispatch = useDispatch();
  const [business, setBusiness] = useState('');
  const [businessData, setBusinessData] = useState('');
  const [productData, setProductData] = useState('');

  const templateData = useSelector(
    (state) => state.template.getSingleTemplate && state.template.getSingleTemplate.data
  );

  const simpleTemplateData = useSelector(
    (state) =>
      state.template.getAllSimpleTemplates && state.template.getAllSimpleTemplates.data
  );

  const standardTemplateData = useSelector(
    (state) =>
      state.template.getAllStandardTemplates &&
      state.template.getAllStandardTemplates.data
  );

  useEffect(() => {
    allSimpleTemplates();
    allStandardTemplates();
    getCurrentBusinessDetail();
  }, []);

  useEffect(() => {
    const response = documentHeading({
      document: DOCUMENT_MODULE(documentType),
      module: documentType
    });
    setProductData(response);
  }, [documentType]);

  const CONTACT_INFO = {
    companyName: 'Company Name',
    contactPerson: 'Contact Person',
    customerNo: 'Company No',
    deliveryDate: 'Delivery Date',
    city: 'City',
    country: 'Country'
  };

  const FROM_CONTACT_INFO = {
    companyName: 'Company Name',
    contactPerson: 'Company Email',
    deliveryDate: 'Date',
    city: 'Company Address',
    country: 'Company Slogan'
  };

  const columns = [
    { field: 'action', headerName: 'Action' },
    { field: 'productName', headerName: 'Product' },
    { field: 'description', headerName: 'Description' },
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'positionNo', headerName: 'Pos' },
    { field: 'unit', headerName: 'Unit' },
    { field: 'netPrice', headerName: 'Price' },
    { field: 'taxRate', headerName: 'Tax' },
    { field: 'discount', headerName: 'Discount' },
    { field: 'totalPrice', headerName: 'Total' }
  ];

  const templateStructure = ({
    tableFooterOptions,
    setTableData,
    setTemplateFooter,
    setTableFooterOptions,
    setTemplateHeader,
    setTemplateContact
  }) => {
    if (templateData) {
      const header = [];
      const contact = [];
      const newTableFooterOptions = { ...tableFooterOptions };

      templateData?.sections?.forEach((section) => {
        const { sectionName } = section;
        if (sectionName === 'offerLogo' || sectionName === 'offerId') {
          header.push(section);
        }
        if (sectionName === 'offerTo' || sectionName === 'offerFrom') {
          contact.push(section);
        }
        if (sectionName === 'table') {
          const tableAttributes = section?.attributes?.map((attribute) => ({
            id: attribute.attributePosition,
            position: attribute.attributePosition || '',
            name: attribute.attributeName || true,
            backgroundColor: attribute.backgroundColor || '#fafafa'
          }));
          tableAttributes.sort((a, b) => {
            return a.position - b.position;
          });
          setTableData(tableAttributes || {});
        }
        if (sectionName === 'tableFooterOptions') {
          const attributes = section?.attributes || [];
          attributes.forEach((attribute) => {
            const { attributeName } = attribute;
            // eslint-disable-next-line no-prototype-builtins
            if (newTableFooterOptions.hasOwnProperty(attributeName)) {
              newTableFooterOptions[attributeName] = true;
            }
          });
        }
        if (sectionName === 'offerFooter') {
          const templateFooterAttributes = {};
          section?.attributes?.forEach((attribute) => {
            templateFooterAttributes[attribute.attributeName] = attribute;
          });
          setTemplateFooter(templateFooterAttributes);
        }
      });
      header.sort((a, b) => {
        return a.sectionPosition - b.sectionPosition;
      });
      contact.sort((a, b) => {
        return a.sectionPosition - b.sectionPosition;
      });
      setTableFooterOptions(newTableFooterOptions);
      setTemplateHeader(header);
      setTemplateContact(contact);
    }
  };

  const allSimpleTemplates = async () => {
    await dispatch(
      getAllSimpleTemplates({
        payload: {
          page: 1,
          pageSize: 100,
          sortColumn: 'id',
          sortOrder: 'DESC',
          condition: { documentType, type: 'SIMPLE' }
        }
      })
    );
  };

  const allStandardTemplates = async () => {
    await dispatch(
      getAllStandardTemplates({
        payload: {
          page: 1,
          pageSize: 100,
          sortColumn: 'id',
          sortOrder: 'DESC',
          condition: { documentType, type: 'STANDARD' }
        }
      })
    );
  };

  const mapColumnNameToProductKey = (columnName) => {
    switch (columnName) {
      case 'Pos':
        return 'positionNo';
      case 'Product':
        return 'productName';
      case 'Description':
        return 'description';
      case 'Pcs':
        return 'quantity';
      case 'Unit':
        return 'unit';
      case 'Price':
        return 'netPrice';
      case 'Tax':
        return 'taxRate';
      case 'Discount':
        return 'lineItemDiscount';
      case 'Total':
        return 'Total';
      default:
        return null;
    }
  };

  const extractTermsFromHtml = (html) => {
    const terms = {};
    // Strip HTML tags
    const textOnly = html ? striptags(html) : '';
    // Extract terms using regex
    const regex = /(Payment terms|Delivery|Warranty):\s*([^\n]+)/g;
    let match;
    while ((match = regex.exec(textOnly)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      terms[key] = value;
    }
    return terms;
  };

  // to remove the html tag
  const stripHTML = (html) => {
    return html && html.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const getCurrentBusinessDetail = async () => {
    if (getUser()) {
      const currentBusiness = await dispatch(
        getSingleBusinessDetail({
          payload: getUser().currentBusinessId
        })
      );
      const businessPayload = currentBusiness.payload;
      setBusinessData(businessPayload);
      setBusiness({
        companyName: businessPayload.businessName,
        contactPerson: businessPayload.businessEmail,
        deliveryDate: '',
        city: businessPayload.address,
        country: businessPayload.slogan
      });
    }
  };

  const modifyTemplateData = ({ data }) => {
    const orderedMergedData = data.reduce((result, item) => {
      const strippedLineItemHeader = striptags(item.lineItemHeader);
      if (strippedLineItemHeader) {
        if (strippedLineItemHeader === LINE_ITEM_MAIN_HEADING) {
          if (!result[strippedLineItemHeader]) {
            result[strippedLineItemHeader] = {
              product: []
            };
          }
          result[strippedLineItemHeader].product.push(item);
        } else {
          if (!result[strippedLineItemHeader]) {
            result[strippedLineItemHeader] = {
              product: [
                {
                  action: 'action',
                  productName: item.lineItemHeader,
                  headingIndex: item.headingIndex
                }
              ]
            };
          }
          result[strippedLineItemHeader].product.push(item);
        }
      }

      return result;
    }, {});

    Object.keys(orderedMergedData).forEach((key) => {
      orderedMergedData[key].product = orderedMergedData[key].product.filter(
        (item) => Object.keys(item).length !== 0
      );
    });

    Object.keys(orderedMergedData).forEach((key) => {
      orderedMergedData[key].product = orderedMergedData[key].product.filter(
        (item) => item.action
      );
    });

    return {
      LINE_ITEM_MAIN_HEADING: orderedMergedData.LINE_ITEM_MAIN_HEADING,
      ...orderedMergedData
    };
  };

  return {
    templateData,
    simpleTemplateData,
    standardTemplateData,
    templateStructure,
    mapColumnNameToProductKey,
    extractTermsFromHtml,
    stripHTML,
    columns,
    business,
    businessData,
    CONTACT_INFO,
    FROM_CONTACT_INFO,
    modifyTemplateData,
    productData
  };
}

export default useDocumentTemplate;

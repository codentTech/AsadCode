import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiscountGroup } from '@/provider/features/discount-group/discount-group.slice';
import { getAllTaxRate } from '@/provider/features/tax-rate/tax-rate.slice';
import { getAllUnit } from '@/provider/features/unit/unit.slice';
import { getAllProduct } from '@/provider/features/product/product.slice';
import { getSingleBusinessDetail } from '@/provider/features/business-detail/business-detail.slice';
import { getUser } from '../utils/users.util';

export default function useDocumentLineItems({ openPopup, openCreateModal }) {
  const dispatch = useDispatch();
  const [filteredDiscountGroup, setFilteredDiscountGroup] = useState([]);

  const defaultTaxRateId = useSelector((state) => state.businessDetail.getSingle);

  const products = useSelector(
    (state) =>
      state.product.getAllProduct &&
      state.product.getAllProduct.data &&
      state.product.getAllProduct.data.data
  );

  const listOfTaxRate = useSelector(
    (state) => state.taxRate.getAllTaxRate && state.taxRate.getAllTaxRate.data
  );

  const listOfTaxUnits = useSelector(
    (state) => state.unit.getAllUnit && state.unit.getAllUnit.data
  );

  const taxRateOptions = listOfTaxRate?.map((taxRate) => ({
    label: `${String(taxRate.taxRate)} %`,
    value: taxRate.id
  }));

  const unitsOptions = listOfTaxUnits?.map((unit) => ({
    label: unit.unit,
    value: unit.id
  }));

  const defaultTaxRate =
    defaultTaxRateId.data &&
    listOfTaxRate?.filter(
      (taxRate) => taxRate.id === defaultTaxRateId.data.defaultTaxRateId
    )[0];

  useEffect(() => {
    listOfAllUnits();
    discountGroups();
    listOfAllTaxRates();
    getAllProducts();
    getCurrentBusinessDetail();
  }, [openPopup, openCreateModal]);

  const columns = [
    {
      field: 'pp',
      headerName: 'Add PP',
      width: '7%',
      type: 'null',
      edit: false
    },
    { field: 'action', headerName: 'Action', width: '7%', type: 'null', edit: false },
    {
      field: 'productName',
      headerName: 'Product',
      width: '30%',
      type: 'text',
      edit: true
    },
    // {
    //   field: 'description',
    //   headerName: 'Description',
    //   width: "7%"
    //   type: 'text',
    //   edit: true
    // },
    {
      field: 'quantity',
      headerName: 'Pcs',
      width: '7%',
      type: 'number',
      edit: true
    },
    {
      field: 'positionNo',
      headerName: 'Pos',
      width: '7%',
      type: 'number',
      edit: true
    },
    { field: 'unitDropdown', headerName: 'Unit', width: '7%', type: 'text', edit: false },
    { field: 'netPrice', headerName: 'Price', width: '10%', type: 'number', edit: true },
    {
      field: 'taxRateDropdown',
      headerName: 'Tax',
      width: '7%',
      type: 'number',
      edit: false
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: '7%',
      type: 'number',
      edit: false
    },
    { field: 'totalPrice', headerName: 'Total', width: '7%', type: 'number', edit: false }
  ];

  // Get current business Details
  const getCurrentBusinessDetail = async () => {
    if (getUser()) {
      await dispatch(
        getSingleBusinessDetail({
          payload: getUser().currentBusinessId
        })
      );
    }
  };

  // Get List of all Product
  const getAllProducts = async () => {
    await dispatch(
      getAllProduct({
        payload: {
          page: 1,
          pageSize: 1000,
          sortColumn: 'id',
          sortOrder: 'DESC',
          condition: ''
        }
      })
    );
  };

  // Options for product for custom Select component
  const options = products?.map((product) => {
    return {
      value: product.id,
      label: product.productName
    };
  });

  // Get List of All Tax Rates
  const listOfAllTaxRates = async () => {
    await dispatch(
      getAllTaxRate({
        payload: {
          sortColumn: 'id',
          sortOrder: 'DESC'
        }
      })
    );
  };

  // Get List of All Units
  const listOfAllUnits = async () => {
    await dispatch(
      getAllUnit({
        payload: {
          sortColumn: 'id',
          sortOrder: 'DESC'
        }
      })
    );
  };

  const discountGroups = async () => {
    const response = await dispatch(getAllDiscountGroup());
    if (response) {
      const discountGroup =
        response?.payload &&
        response?.payload?.map((item) => {
          return {
            label: item.discountGroupName,
            value: item.id
          };
        });
      setFilteredDiscountGroup(discountGroup);
    }
  };

  return {
    filteredDiscountGroup,
    columns,
    unitsOptions,
    taxRateOptions,
    products,
    options,
    defaultTaxRate
  };
}

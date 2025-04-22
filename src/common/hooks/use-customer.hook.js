import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCustomer } from '@/provider/features/customer/customer.slice';
import {
  companyAddressOptionsData,
  contactPersonOptionsData,
  customersOptionsData
} from '../utils/customer-data/customer';

function useCustomer() {
  const dispatch = useDispatch();
  const customer = useSelector(
    (state) => state.customer.getSingle && state.customer.getSingle.data
  );

  const customersList = useSelector(
    (state) =>
      state.customer.getAll &&
      state.customer.getAll.data &&
      state.customer.getAll.data.data
  );

  useEffect(() => {
    handleCustomers();
  }, []);

  const handleCustomers = async () => {
    await dispatch(
      getAllCustomer({
        payload: {
          page: 1,
          pageSize: 100,
          sortColumn: 'id',
          sortOrder: 'DESC',
          condition: { isActive: true }
        }
      })
    );
  };

  // customers options
  const customerOptions = customersOptionsData(customersList);

  // Company address options for the dropdown
  const companyAddressOptions = companyAddressOptionsData(customer);

  // Contact person options for the dropdown
  const contactPersonOptions = contactPersonOptionsData(customer);

  return {
    customer,
    customersList,
    customerOptions,
    companyAddressOptions,
    contactPersonOptions
  };
}

export default useCustomer;

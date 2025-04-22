import { useDispatch } from 'react-redux';
import {
  productGtinUnique,
  productNumberUnique,
  productSkuNumberUnique
} from '@/provider/features/product/product.slice';

function useCreateProductUnique(setError, clearErrors) {
  const dispatch = useDispatch();

  const handleCheckProductNumber = async (event, existNumber = null) => {
    const { value } = event.target;
    if (existNumber && Number(value) === Number(existNumber)) {
      clearErrors('productNumber');
    } else {
      if (value) {
        const response = await dispatch(productNumberUnique({ payload: value }));
        if (response.payload.result === true) {
          setError('productNumber', {
            type: 'custom',
            message: 'Product number is not unique'
          });
        } else {
          clearErrors('productNumber');
        }
      } else {
        clearErrors('productNumber');
      }
    }
  };

  const handleCheckSkuNumber = async (event, existNumber = null) => {
    const { value } = event.target;
    if (existNumber && value === existNumber) {
      clearErrors('sku');
    } else {
      if (value) {
        const response = await dispatch(productSkuNumberUnique({ payload: value }));
        if (response.payload.result === true) {
          setError('sku', {
            type: 'custom',
            message: 'sku number is not unique'
          });
        } else {
          clearErrors('sku');
        }
      } else {
        clearErrors('sku');
      }
    }
  };

  const handleCheckGtinNumber = async (event, existNumber = null) => {
    const { value } = event.target;
    if (existNumber && value === existNumber) {
      clearErrors('tginEan');
    } else {
      if (value) {
        const response = await dispatch(productGtinUnique({ payload: value }));
        if (response.payload.result === true) {
          setError('tginEan', {
            type: 'custom',
            message: 'GTIN/EAN number is not unique'
          });
        } else {
          clearErrors('tginEan');
        }
      } else {
        clearErrors('tginEan');
      }
    }
  };

  return {
    handleCheckProductNumber,
    handleCheckSkuNumber,
    handleCheckGtinNumber
  };
}

export default useCreateProductUnique;

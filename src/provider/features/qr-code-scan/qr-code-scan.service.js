import api from '@/common/utils/api';

const scanQrCode = async (payload) => {
  const response = await api().post('/open-api/delivery-notes/scan-qr-code', payload);
  return response.data;
};

const scanQrCodeService = {
  scanQrCode
};

export default scanQrCodeService;

import BrandBillingHistory from "./components/brand-billing-history/brand-billing-history.component";
import CreatorPaymentHistory from "./components/creator-payment-history/creator-payment-history.component";
import usePaymentHistory from "./use-payment-history.hook";

const PaymentHistoryPage = () => {
  const { isCreator } = usePaymentHistory();
  return isCreator ? <CreatorPaymentHistory /> : <BrandBillingHistory />;
};

export default PaymentHistoryPage;

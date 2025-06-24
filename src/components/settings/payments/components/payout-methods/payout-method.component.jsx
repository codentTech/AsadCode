import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { Edit2, Eye, EyeOff, Plus, Shield, Trash2 } from "lucide-react";
import { useState } from "react";

const PayoutMethodsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("paypal");
  const [showBankDetails, setShowBankDetails] = useState(false);

  // Sample data
  const [payoutMethods, setPayoutMethods] = useState([
    {
      id: 1,
      type: "paypal",
      email: "creator@example.com",
      isDefault: true,
      isVerified: true,
      lastUsed: "2 days ago",
    },
    {
      id: 2,
      type: "stripe",
      last4: "4242",
      brand: "Visa",
      isDefault: false,
      isVerified: true,
      lastUsed: "1 week ago",
    },
    {
      id: 3,
      type: "bank",
      accountNumber: "****1234",
      bankName: "Chase Bank",
      isDefault: false,
      isVerified: false,
      lastUsed: "Never",
    },
  ]);

  const paymentIcons = {
    paypal: "🅿️",
    stripe: "💳",
    bank: "🏦",
  };

  const getStatusColor = (method) => {
    if (!method.isVerified) return "text-yellow-600 bg-yellow-100";
    if (method.isDefault) return "text-green-600 bg-green-100";
    return "text-blue-600 bg-blue-100";
  };

  const getStatusText = (method) => {
    if (!method.isVerified) return "Pending Verification";
    if (method.isDefault) return "Default Method";
    return "Active";
  };

  const setAsDefault = (id) => {
    setPayoutMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const deleteMethod = (id) => {
    if (window.confirm("Are you sure you want to remove this payout method?")) {
      setPayoutMethods((prev) => prev.filter((method) => method.id !== id));
    }
  };

  return (
    <SidebarLayout>
      <div className="max-w-8xl mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Payout Methods</h1>
          <p className="text-sm mt-1">Manage how you receive payments for your collaborations</p>
        </div>

        {/* Payout Methods List */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Payout Methods</h2>
            <CustomButton
              text="Add Method"
              className="btn-primary"
              icon={Plus}
              onClick={() => setShowAddForm(true)}
            />
          </div>

          <div className="divide-y divide-gray-200">
            {payoutMethods.map((method) => (
              <div key={method.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{paymentIcons[method.type]}</div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {method.type === "paypal"
                            ? "PayPal"
                            : method.type === "stripe"
                              ? "Stripe Card"
                              : "Bank Account"}
                        </h3>
                        <span
                          className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${getStatusColor(method)}
                        `}
                        >
                          {getStatusText(method)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        {method.type === "paypal" && method.email}
                        {method.type === "stripe" && `${method.brand} •••• ${method.last4}`}
                        {method.type === "bank" &&
                          `${method.bankName} •••• ${method.accountNumber}`}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">Last used: {method.lastUsed}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.isDefault && method.isVerified && (
                      <button
                        onClick={() => setAsDefault(method.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Set as Default
                      </button>
                    )}

                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {!method.isDefault && (
                      <button
                        onClick={() => deleteMethod(method.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Method Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Payout Method</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Method Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["paypal", "stripe", "bank"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMethod(type)}
                    className={`
                      p-4 border-2 rounded-lg text-center transition-colors
                      ${
                        selectedMethod === type
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{paymentIcons[type]}</div>
                    <div className="text-sm font-medium capitalize">
                      {type === "paypal"
                        ? "PayPal"
                        : type === "stripe"
                          ? "Credit Card"
                          : "Bank Account"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {selectedMethod === "paypal" && (
                <CustomInput
                  label="PayPal Email"
                  name="paypalEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  isRequired={true}
                />
              )}

              {selectedMethod === "stripe" && (
                <>
                  <CustomInput
                    label="Card Number"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    isRequired={true}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <CustomInput
                      label="Expiry Date"
                      name="expiryDate"
                      placeholder="MM/YY"
                      isRequired={true}
                    />
                    <CustomInput label="CVV" name="cvv" placeholder="123" isRequired={true} />
                  </div>
                </>
              )}

              {selectedMethod === "bank" && (
                <>
                  <CustomInput
                    label="Bank Name"
                    name="bankName"
                    placeholder="Enter your bank name"
                    isRequired={true}
                  />
                  <CustomInput
                    label="Account Number"
                    name="accountNumber"
                    type={showBankDetails ? "text" : "password"}
                    placeholder="Enter account number"
                    isRequired={true}
                  />
                  <CustomInput
                    label="Routing Number"
                    name="routingNumber"
                    placeholder="Enter routing number"
                    isRequired={true}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBankDetails(!showBankDetails)}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {showBankDetails ? (
                      <EyeOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    {showBankDetails ? "Hide" : "Show"} account details
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <CustomButton
                text="Cancel"
                className="btn-secondary"
                onClick={() => setShowAddForm(false)}
              />
              <CustomButton text="Add Method" className="btn-primary" />
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Secure & Protected</h3>
              <p className="text-sm text-blue-700 mt-1">
                All payment information is encrypted and secured. We never store sensitive financial
                data on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PayoutMethodsPage;

"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircle, Check, Edit2, Mail, Phone, Plus, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schemas
const emailSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

const phoneSchema = yup.object().shape({
  phone: yup.string().required("Phone number is required"),
});

// Contact Method Card Component
const ContactMethodCard = ({ method, onEdit, onDelete, onSetPrimary, onVerify }) => {
  const isPrimary = method.isPrimary;
  const isVerified = method.isVerified;

  return (
    <div
      className={`
      p-4 border rounded-lg transition-all duration-200
      ${isPrimary ? "border-indigo-200 bg-indigo-50" : "border-gray-200 bg-white"}
      hover:shadow-sm
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div
            className={`
            flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
            bg-blue-600}
          `}
          >
            {method.type === "email" ? (
              <Mail className={`h-4 w-4 text-blue-600`} />
            ) : (
              <Phone className="h-4 w-4 text-blue-600" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{method.value}</p>
            <div className="flex items-center space-x-2 mt-1">
              {isPrimary && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Primary
                </span>
              )}
              {isVerified ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {!isVerified && (
            <button
              onClick={() => onVerify(method.id)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Verify
            </button>
          )}

          {!isPrimary && isVerified && (
            <button
              onClick={() => onSetPrimary(method.id)}
              className="text-xs text-gray-600 hover:text-gray-800 font-medium"
            >
              Set Primary
            </button>
          )}

          <button onClick={() => onEdit(method)} className="p-1 text-gray-400 hover:text-gray-600">
            <Edit2 className="h-4 w-4" />
          </button>

          {!isPrimary && (
            <button
              onClick={() => onDelete(method.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ContactMethodsPage() {
  // Sample data
  const [emailMethods, setEmailMethods] = useState([
    { id: 1, type: "email", value: "john.doe@example.com", isPrimary: true, isVerified: true },
    { id: 2, type: "email", value: "john.work@company.com", isPrimary: false, isVerified: false },
  ]);

  const [phoneMethods, setPhoneMethods] = useState([
    { id: 1, type: "phone", value: "+1 (555) 123-4567", isPrimary: true, isVerified: true },
    { id: 2, type: "phone", value: "+1 (555) 987-6543", isPrimary: false, isVerified: false },
  ]);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  // Email form
  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Phone form
  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const onAddEmail = async (data) => {
    try {
      const newEmail = {
        id: Date.now(),
        type: "email",
        value: data.email,
        isPrimary: emailMethods.length === 0,
        isVerified: false,
      };
      setEmailMethods([...emailMethods, newEmail]);
      emailForm.reset();
      setShowEmailForm(false);
      alert("Email added successfully! Please check your inbox to verify.");
    } catch (error) {
      alert("Failed to add email. Please try again.");
    }
  };

  const onAddPhone = async (data) => {
    try {
      const newPhone = {
        id: Date.now(),
        type: "phone",
        value: data.phone,
        isPrimary: phoneMethods.length === 0,
        isVerified: false,
      };
      setPhoneMethods([...phoneMethods, newPhone]);
      phoneForm.reset();
      setShowPhoneForm(false);
      alert("Phone number added successfully! Please verify via SMS.");
    } catch (error) {
      alert("Failed to add phone number. Please try again.");
    }
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    if (method.type === "email") {
      emailForm.setValue("email", method.value);
      setShowEmailForm(true);
    } else {
      phoneForm.setValue("phone", method.value);
      setShowPhoneForm(true);
    }
  };

  const handleDelete = (id, type) => {
    if (window.confirm("Are you sure you want to remove this contact method?")) {
      if (type === "email") {
        setEmailMethods(emailMethods.filter((email) => email.id !== id));
      } else {
        setPhoneMethods(phoneMethods.filter((phone) => phone.id !== id));
      }
    }
  };

  const handleSetPrimary = (id, type) => {
    if (type === "email") {
      setEmailMethods(
        emailMethods.map((email) => ({
          ...email,
          isPrimary: email.id === id,
        }))
      );
    } else {
      setPhoneMethods(
        phoneMethods.map((phone) => ({
          ...phone,
          isPrimary: phone.id === id,
        }))
      );
    }
    alert("Primary contact method updated successfully!");
  };

  const handleVerify = (id, type) => {
    if (type === "email") {
      setEmailMethods(
        emailMethods.map((email) => (email.id === id ? { ...email, isVerified: true } : email))
      );
      alert("Email verified successfully!");
    } else {
      setPhoneMethods(
        phoneMethods.map((phone) => (phone.id === id ? { ...phone, isVerified: true } : phone))
      );
      alert("Phone number verified successfully!");
    }
  };

  return (
    <SidebarLayout>
      {/* Header */}
      <div className="bg-primary p-6 rounded-lg text-white mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Email & Phone Numbers</h1>
        <p className="text-sm sm:text-base">Add or remove contact methods for your account</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between gap-6">
          {/* Email Addresses Section */}
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Email Addresses</h2>
                </div>

                <CustomButton
                  text="Add Email"
                  className="btn-primary"
                  icon={Plus}
                  onClick={() => {
                    setEditingMethod(null);
                    emailForm.reset();
                    setShowEmailForm(true);
                  }}
                />
              </div>

              {/* Email List */}
              <div className="space-y-3 mb-6">
                {emailMethods.map((email) => (
                  <ContactMethodCard
                    key={email.id}
                    method={email}
                    onEdit={handleEdit}
                    onDelete={(id) => handleDelete(id, "email")}
                    onSetPrimary={(id) => handleSetPrimary(id, "email")}
                    onVerify={(id) => handleVerify(id, "email")}
                  />
                ))}
              </div>

              {/* Add Email Form */}
              {showEmailForm && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    {editingMethod ? "Edit Email Address" : "Add New Email Address"}
                  </h3>
                  <form onSubmit={emailForm.handleSubmit(onAddEmail)} className="space-y-4">
                    <div className="max-w-md">
                      <CustomInput
                        label="Email Address"
                        name="email"
                        type="email"
                        register={emailForm.register}
                        errors={emailForm.formState.errors}
                        placeholder="Enter email address"
                        isRequired={true}
                        icon={Mail}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <CustomButton
                        text={editingMethod ? "Update" : "Add Email"}
                        className="btn-primary"
                        type="submit"
                        disabled={emailForm.formState.isSubmitting}
                      />
                      <CustomButton
                        text="Cancel"
                        className="btn-secondary"
                        onClick={() => {
                          setShowEmailForm(false);
                          setEditingMethod(null);
                          emailForm.reset();
                        }}
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Phone Numbers Section */}
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Phone Numbers</h2>
                </div>

                <CustomButton
                  text="Add Phone"
                  className="btn-primary"
                  icon={Plus}
                  onClick={() => {
                    setEditingMethod(null);
                    phoneForm.reset();
                    setShowPhoneForm(true);
                  }}
                />
              </div>

              {/* Phone List */}
              <div className="space-y-3 mb-6">
                {phoneMethods.map((phone) => (
                  <ContactMethodCard
                    key={phone.id}
                    method={phone}
                    onEdit={handleEdit}
                    onDelete={(id) => handleDelete(id, "phone")}
                    onSetPrimary={(id) => handleSetPrimary(id, "phone")}
                    onVerify={(id) => handleVerify(id, "phone")}
                  />
                ))}
              </div>

              {/* Add Phone Form */}
              {showPhoneForm && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    {editingMethod ? "Edit Phone Number" : "Add New Phone Number"}
                  </h3>
                  <form onSubmit={phoneForm.handleSubmit(onAddPhone)} className="space-y-4">
                    <div className="max-w-md">
                      <CustomInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        register={phoneForm.register}
                        errors={phoneForm.formState.errors}
                        placeholder="Enter phone number"
                        isRequired={true}
                        icon={Phone}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <CustomButton
                        text={editingMethod ? "Update" : "Add Phone"}
                        className="btn-primary"
                        type="submit"
                        disabled={phoneForm.formState.isSubmitting}
                      />
                      <CustomButton
                        text="Cancel"
                        className="btn-secondary"
                        onClick={() => {
                          setShowPhoneForm(false);
                          setEditingMethod(null);
                          phoneForm.reset();
                        }}
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mr-3 flex-shrink-0">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Important Security Information
              </h3>
              <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                <li>• We'll send verification codes to new contact methods</li>
                <li>
                  • Primary contacts are used for account recovery and important notifications
                </li>
                <li>• You must have at least one verified contact method</li>
                <li>• Unverified contact methods will be automatically removed after 7 days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

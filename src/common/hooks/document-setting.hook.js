import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { getDocumentSetting } from '@/provider/features/setting/setting.slice';
import { defaultStatus } from '../constants/document-setting.constant';
import DOCUMENT from '../constants/document.constants';
import currentYear from '../utils/current-date/current-year';
import { getAllOffers } from '@/provider/features/offer/offer.slice';
import { getAllOrders } from '@/provider/features/order/order.slice';
import { getAllInvoice } from '@/provider/features/invoice/invoice.slice';
import { getAllDeliveryNotes } from '@/provider/features/delivery-notes/delivery-notes.slice';
import { getAllCreditNotes } from '@/provider/features/credit-note/credit-note.slice';

function useDocumentSetting(document) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [taggedEmails, setTaggedEmails] = useState([]);
  const [selectedTriggerAction, setSelectedTriggerAction] = useState('');
  const [selectedTriggerPoint, setSelectedTriggerPoint] = useState('');
  const [attachPdfToggle, setAttachPdfToggle] = useState(false);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [toggleSuffixSwitch, setToggleSuffixSwitch] = useState(false);
  const [disableOffset, setDisableOffset] = useState(false);
  const [reminderValues, setReminderValues] = useState([
    {
      fee: '',
      reminderLevel: 0
    },
    {
      fee: '',
      reminderLevel: 0
    },
    {
      fee: '',
      reminderLevel: 0
    }
  ]);

  const documentSetting = useSelector(
    (state) => state.setting.getDocumentSetting && state.setting.getDocumentSetting.data
  );

  const validationSchema = yup.object().shape({
    expiry: yup
      .number()
      .typeError(`${document} expiry must be a numeric value`)
      .min(1, `${document} expiry must be at least 1`)
      .max(9999999999, `${document} expiry must be at most 10 digits`),

    prefix: yup
      .string()
      .nullable()
      .test(
        'prefix',
        `${document} number prefix must be at most 150 characters`,
        function (value) {
          if (!value || value.length === 0) {
            return true;
          }

          return (
            value.length <= 150 ||
            this.createError({
              message: `${document} number prefix must be at most 150 characters`
            })
          );
        }
      )
      .default(null),

    suffix: yup
      .string()
      .nullable()
      .test(
        'suffix',
        `${document} number suffix must be at most 150 characters`,
        function (value) {
          if (!value || value.length === 0) {
            return true;
          }

          return (
            value.length <= 150 ||
            this.createError({
              message: `${document} number suffix must be at most 150 characters`
            })
          );
        }
      )
      .default(null),

    offset: yup
      .number()
      .typeError(`${document} number offset must be a numeric value`)
      .min(0, `${document} number offset must be at least 0`)
      .max(9999999999, `${document} number offset must be at most 10 digits`),

    triggerAction: yup.string().required('Please select a trigger action')
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    toggleSwitch
      ? setValue('prefix', `${currentYear()}-`)
      : setValue('prefix', documentSetting && documentSetting.prefix);
  }, [toggleSwitch]);

  useEffect(() => {
    toggleSuffixSwitch
      ? setValue('suffix', `-${currentYear()}`)
      : setValue('suffix', documentSetting && documentSetting.suffix);
  }, [toggleSuffixSwitch]);

  useEffect(() => {
    setToggleSwitch(documentSetting && documentSetting.isYearlyPrefix);
    setToggleSuffixSwitch(documentSetting && documentSetting.isYearlySuffix);
  }, [documentSetting]);

  useEffect(() => {
    getCurrentDocumentSetting();
    setSelectedTriggerPoint(defaultStatus);
  }, []);

  useEffect(() => {
    getDocumentData();
  }, [document]);

  const handleToggleSwitch = () => {
    setToggleSwitch(!toggleSwitch);
  };

  const handleToggleSuffixSwitch = () => {
    setToggleSuffixSwitch(!toggleSuffixSwitch);
  };

  const getCurrentDocumentSetting = async () => {
    const response = await dispatch(
      getDocumentSetting({
        payload: {
          condition: { module: document }
        }
      })
    );
    const setting = response.payload;
    if (setting) {
      setValue('expiry', setting.documentSetting.expiryDays);
      setValue('prefix', setting.prefix);
      setValue('suffix', setting.suffix);
      setValue('offset', setting.offset);

      setTaggedEmails(
        setting.receiverEmails.map((item) => ({
          id: item.email.id,
          email: item.email.email
        }))
      );

      setValue('triggerAction', setting.documentSetting.triggerAction);
      setSelectedTriggerAction(setting.documentSetting.triggerAction);
      setSelectedTriggerPoint(setting.documentSetting.triggerPoint);

      if (document === DOCUMENT.INVOICE) {
        setReminderValues(
          setting.reminderFees
            ?.flatMap((reminder) => [
              {
                fee: reminder.reminderLevel === 1 ? reminder.fee : '',
                reminderLevel: reminder.reminderLevel === 1 ? reminder.reminderLevel : 0
              },
              {
                fee: reminder.reminderLevel === 2 ? reminder.fee : '',
                reminderLevel: reminder.reminderLevel === 2 ? reminder.reminderLevel : 0
              },
              {
                fee: reminder.reminderLevel === 3 ? reminder.fee : '',
                reminderLevel: reminder.reminderLevel === 3 ? reminder.reminderLevel : 0
              }
            ])
            .filter((value, index, self) => {
              // Keep only the first occurrence of each reminderLevel
              return (
                index ===
                self.findIndex((level) => level.reminderLevel === value.reminderLevel)
              );
            })
        );
      }
    }
  };

  const addEmail = () => {
    const trimmedEmail = email.trim();
    if (trimmedEmail) {
      if (validateEmail(trimmedEmail)) {
        setTaggedEmails([...taggedEmails, { email: trimmedEmail }]);
        setEmail(''); // Clear the input field
      }
    }
  };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const removeEmail = (index) => {
    const updatedEmails = [...taggedEmails];
    updatedEmails.splice(index, 1);
    setTaggedEmails(updatedEmails);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleTriggerAction = (e) => {
    setValue('triggerAction', e.target.value); // Update the value in the validation context
    setSelectedTriggerAction(e.target.value);
  };

  const getDocumentData = async () => {
    const payload = {
      page: 1,
      pageSize: 1,
      sortColumn: 'id',
      sortOrder: 'DESC',
      condition: { $not: { status: 'DRAFT' } }
    };
    const response =
      document === DOCUMENT.OFFER
        ? await dispatch(getAllOffers({ payload }))
        : document === DOCUMENT.ORDER
        ? await dispatch(getAllOrders({ payload }))
        : document === DOCUMENT.INVOICE
        ? await dispatch(getAllInvoice({ payload }))
        : document === DOCUMENT.DELIVERY_NOTES
        ? await dispatch(getAllDeliveryNotes({ payload }))
        : document === DOCUMENT.CREDIT_NOTE
        ? await dispatch(getAllCreditNotes({ payload }))
        : null;

    const data = response.payload?.data;
    Array.isArray(data) && data.length && setDisableOffset(true);
  };

  return {
    email,
    setEmail,
    setValue,
    setTaggedEmails,
    register,
    handleSubmit,
    errors,
    taggedEmails,
    selectedTriggerAction,
    selectedTriggerPoint,
    setSelectedTriggerAction,
    setSelectedTriggerPoint,
    getCurrentDocumentSetting,
    addEmail,
    removeEmail,
    documentSetting,
    handleInputKeyDown,
    handleTriggerAction,
    reminderValues,
    attachPdfToggle,
    setAttachPdfToggle,
    setReminderValues,
    handleToggleSwitch,
    toggleSwitch,
    toggleSuffixSwitch,
    handleToggleSuffixSwitch,
    disableOffset
  };
}

export default useDocumentSetting;

/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getExpenditureHistory,
  getSingleExpenditure,
} from "@/provider/features/expenditure/expenditure.slice";

export default function useViewExpenditureHistory(id) {
  const [historyData, setHistoryData] = useState(null);
  const [singleExpenditureData, setSingleExpenditureData] = useState(null);
  const dispatch = useDispatch();
  const getTheOfferHistory = async () => {
    const response = await dispatch(getExpenditureHistory({ payload: id }));
    const payload = response?.payload;

    setHistoryData(payload);
  };

  const getExpenditureSingle = async () => {
    const data = await dispatch(
      getSingleExpenditure({
        payload: id,
      })
    );

    setSingleExpenditureData(data.payload);
  };
  useEffect(() => {
    if (!historyData && !singleExpenditureData) {
      getTheOfferHistory();
      getExpenditureSingle();
    }
  }, [historyData, singleExpenditureData]);
  if (!historyData) {
    return "loading";
  }

  const ignoreFields = [
    "id",
    "updatedAt",
    "createdAt",
    "partialPayments",
    "isLatest",
    "originalExpenditureId",
    "receiptDate",
    "createdBy",
    "updatedBy",
    "expenditureCategoryId",
    "businessDetailId",
  ];
  const getFormattedTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][date.getDay()];
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${dayOfWeek}, ${month} ${day} ${hours}:${minutes}`;
  };
  const generateChangeString = (current, next, additionalObject) => {
    let changeString = "";

    for (const key in current) {
      if (
        !ignoreFields.includes(key) &&
        current[key] !== undefined &&
        current[key] !== (next ? next[key] : "") &&
        current[key] !== (additionalObject ? additionalObject[key] : "")
      ) {
        if (
          typeof current[key] === "object" &&
          typeof next?.[key] === "object" &&
          typeof additionalObject?.[key] === "object" &&
          !Array.isArray(current[key]) &&
          !Array.isArray(next?.[key]) &&
          !Array.isArray(additionalObject?.[key])
        ) {
          changeString += generateChangeString(
            current[key],
            next?.[key],
            additionalObject?.[key]
          );
        } else if (
          Array.isArray(current[key]) &&
          Array.isArray(next[key]) &&
          Array.isArray(additionalObject[key])
        ) {
          if (
            current[key].length === next[key].length &&
            current[key].length === additionalObject[key].length
          ) {
            // Compare array elements
            let arrayChangeString = "";
            for (let i = 0; i < current[key].length; i++) {
              const currentElement = current[key] ? current[key][i] : "";
              const nextElement = next[key] ? next[key][i] : "";
              const additionalElement = additionalObject[key]
                ? additionalObject[key][i]
                : "";
              if (
                typeof currentElement === "object" &&
                typeof nextElement === "object" &&
                typeof additionalElement === "object"
              ) {
                arrayChangeString += generateChangeString(
                  currentElement,
                  nextElement,
                  additionalElement
                );
              }
            }
            if (arrayChangeString !== "") {
              changeString += `<p className="border-b border-solid border-b-disabled-input px-1 py-[5px] text-xs font-normal not-italic leading-[18px] text-text-medium-gray">Change ${key} from  <span className="text-xs font-medium not-italic leading-[18px] text-text-black"> ${JSON.stringify(
                current[key]
              )} </span> to  <span className="text-xs font-medium not-italic leading-[18px] text-text-black"> ${JSON.stringify(
                next[key]
              )} at ${getFormattedTimestamp(additionalObject.updatedAt)} </span></p> \n`;
            }
          } else {
            changeString += `<p className=" border-b border-solid border-b-disabled-input px-1 py-[5px] text-xs font-normal not-italic leading-[18px] text-text-medium-gray">Change ${key} from  <span className="text-xs font-medium not-italic leading-[18px] text-text-black"> ${JSON.stringify(
              current[key]
            )} to ${JSON.stringify(next[key])} </span> at ${getFormattedTimestamp(
              additionalObject.updatedAt
            )}  </p> \n`;
          }
        } else {
          changeString += `<p className="border-b border-solid border-b-disabled-input px-1 py-[5px] text-xs font-normal not-italic leading-[18px] text-text-medium-gray">Change ${key} from <span className="text-xs font-medium not-italic leading-[18px] text-text-black"> ${JSON.stringify(
            current?.[key] ?? ""
          )} to ${JSON.stringify(next?.[key] ?? "")} </span> at ${getFormattedTimestamp(
            additionalObject?.updatedAt
          )}</p> \n`;
        }
      }
    }

    return changeString;
  };
  const generateChangeData = () => {
    let changeData = `<p>  <span className="text-xs font-medium not-italic leading-[18px] text-text-black"> Created at ${getFormattedTimestamp(
      singleExpenditureData?.createdAt
    )} </span></p> \n`;
    changeData += "\n";

    const lastIndex = historyData.length - 1;
    const currentObject = historyData[lastIndex];

    // Compare the last object with additionalObjecttt
    const lastObjectChangeString = generateChangeString(
      currentObject,
      singleExpenditureData,
      singleExpenditureData
    );

    if (lastObjectChangeString !== "") {
      changeData += `<p className=" border-b border-solid border-b-disabled-input px-1 py-[5px] text-xs font-normal not-italic leading-[18px] text-text-medium-gray"> <span className="text-xs font-medium not-italic leading-[18px] text-text-black">New Changes detected in item : </span></p>\n`;
      changeData += lastObjectChangeString;
      changeData += "\n";
    }

    for (let i = historyData.length - 2; i >= 0; i--) {
      const previousObject = historyData[i];
      const nextObject = historyData[i + 1];

      const changeString = generateChangeString(
        previousObject,
        nextObject,
        singleExpenditureData
      );

      if (changeString !== "") {
        changeData += ` <span className="text-xs font-medium not-italic leading-[18px] text-text-black">New Changes detected in item :</span>\n`;
        changeData += changeString;
        changeData += "\n";
      }
    }
    singleExpenditureData?.partialPayments.forEach((element) => {
      changeData += `<p className=" border-b border-solid border-b-disabled-input px-1 py-[5px] text-xs font-normal not-italic leading-[18px] text-text-medium-gray">added partialPayment  <span className="text-xs font-medium not-italic leading-[18px] text-text-black"> € ${
        element.partialPayment
      } </span>  at ${getFormattedTimestamp(element.createdAt)}</p>\n`;
    });
    return changeData;
  };
  const changeData = generateChangeData();

  return { historyData, changeData };
}

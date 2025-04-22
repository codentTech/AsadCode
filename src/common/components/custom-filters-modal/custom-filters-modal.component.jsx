import React from "react";
import PropTypes from "prop-types";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "../custom-switch/custom-switch.component";
import CustomInput from "../custom-input/custom-input.component";

export default function FiltersModal({
  show,
  onClose,
  handleSubmit,
  register,
  onSubmitFilterForm,
  selectedNoOfItems,
  setSelectedNoOfItems,
  selectedNetPrice,
  setSelectedNetPrice,
  selectedGrossPrice,
  setSelectedGrossPrice,
}) {
  return (
    <form onSubmit={handleSubmit(onSubmitFilterForm)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
            Body Text
          </p>
          <div className="flex items-center rounded-md border border-gray-300 px-3 py-1 text-sm">
            <div className="relative flex items-center">
              <select
                {...register("selectedOption")}
                name="selectedOption"
                className=" mr-2 pl-2 pr-2 outline-none"
              >
                <option value="start">Start with</option>
                <option value="contains">Contain</option>
                <option value="end">End with</option>
              </select>
            </div>
            <input
              {...register("bodyText")}
              name="bodyText"
              type="text"
              className="appearance-none border-l border-gray-300 bg-transparent px-2 py-1.5 text-sm outline-none"
              placeholder="Enter text"
            />
          </div>
        </div>
        {/* <hr />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
            No of Product
          </p>
          <div className="mt-2 flex items-center">
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="No items"
                checked={selectedNoOfItems === 'noItems'}
                onChange={() => {
                  setSelectedNoOfItems('noItems');
                }}
              />
              <label
                htmlFor="No items"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                No items
              </label>
            </div>
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="1-30 items"
                checked={selectedNoOfItems === '1-30'}
                onChange={() => {
                  setSelectedNoOfItems('1-30');
                }}
              />
              <label
                htmlFor="1-30 items"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                1 - 30 items
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="50-100 items"
                checked={selectedNoOfItems === '50-100'}
                onChange={() => {
                  setSelectedNoOfItems('50-100');
                }}
              />
              <label
                htmlFor="50-100 items"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                50 - 100 items
              </label>
            </div>
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="above 100 items"
                checked={selectedNoOfItems === '50 - 100'}
                onChange={() => {
                  setSelectedNoOfItems('50 - 100');
                }}
              />
              <label
                htmlFor="above 100 items"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                Above 100 items
              </label>
            </div>
          </div>
        </div> */}
        <hr />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
            Net Price
          </p>
          <div className="mt-2 flex items-center">
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="netPriceRange"
                value="100-999"
                checked={selectedNetPrice === "100-999"}
                onChange={() => {
                  setSelectedNetPrice("100-999");
                }}
              />
              <label
                htmlFor="netPriceRange"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                €100 - €999
              </label>
            </div>
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="netPriceRange"
                value="1000-2000"
                checked={selectedNetPrice === "1000-2000"}
                onChange={() => {
                  setSelectedNetPrice("1000-2000");
                }}
              />
              <label
                htmlFor="netPriceRange"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                €1000 - €2000
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="netPriceRange"
                value="2000-above"
                checked={selectedNetPrice === "2000-above"}
                onChange={() => {
                  setSelectedNetPrice("2000-above");
                }}
              />
              <label
                htmlFor="netPriceRange"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                €2000 - above
              </label>
            </div>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
            Gross Price
          </p>
          <div className="mt-2 flex items-center">
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="grossPriceRange"
                value="100-999"
                checked={selectedGrossPrice === "100-999"}
                onChange={() => {
                  setSelectedGrossPrice("100-999");
                }}
              />
              <label
                htmlFor="grossPriceRange"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                €100 - €999
              </label>
            </div>
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="grossPriceRange"
                value="1000-2000"
                checked={selectedGrossPrice === "1000-2000"}
                onChange={() => {
                  setSelectedGrossPrice("1000-2000");
                }}
              />
              <label
                htmlFor="grossPriceRange"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                €1000 - €2000
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex min-w-[194px] items-center gap-4">
              <input
                type="radio"
                className="h-4 w-4 bg-unchecked checked:bg-checked"
                name="grossPriceRange"
                value="2000-above"
                checked={selectedGrossPrice === "2000-above"}
                onChange={() => {
                  setSelectedGrossPrice("2000-above");
                }}
              />
              <label
                htmlFor="grossPriceRange"
                className="text-sm font-normal not-italic leading-[17.5px] text-text-black"
              >
                €2000 - above
              </label>
            </div>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
            VAT
          </p>
          <div className="flex items-center gap-2">
            <label className="group-label text-xs font-medium leading-6">
              Enable
            </label>
            <CustomSwitch
              type="switch"
              className="h-4 h-5 w-4 flex-col-reverse"
              name="isVat"
              register={register}
            />
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
            Delivery Date
          </p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex min-w-[180px] items-center">
              <CustomInput
                label="Start Date"
                placeholder="03/13/2023"
                type="date"
                name="deliveryDateStart"
                register={register}
              />
            </div>
            <div className="flex min-w-[180px] items-center">
              <CustomInput
                label="End Date"
                placeholder="03/13/2023"
                type="date"
                name="deliveryDateEnd"
                register={register}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="mb-8 flex flex-col gap-2 ">
          <p className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
            Creation Date
          </p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex min-w-[180px] items-center">
              <CustomInput
                label="Start Date"
                placeholder="03/13/2023"
                type="date"
                name="creationDateStart"
                register={register}
              />
            </div>
            <div className="flex min-w-[180px] items-center">
              <CustomInput
                label="End Date"
                placeholder="03/13/2023"
                type="date"
                name="creationDateEnd"
                register={register}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-[40px] mt-5 flex w-full max-w-[380px] justify-between bg-white ">
        <CustomButton
          onClick={onClose}
          text="Clear all"
          className="btn-cancel"
        />
        <CustomButton
          text="Apply Filters"
          type="submit"
          className="btn-primary"
        />
      </div>
    </form>
  );
}

FiltersModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmitFilterForm: PropTypes.func.isRequired,
  setSelectedNoOfItems: PropTypes.func.isRequired,
  setSelectedNetPrice: PropTypes.func.isRequired,
  setSelectedGrossPrice: PropTypes.func.isRequired,
  filterModalCloseHandler: PropTypes.func.isRequired,
  selectedNoOfItems: PropTypes.string.isRequired,
  selectedNetPrice: PropTypes.string.isRequired,
  selectedGrossPrice: PropTypes.string.isRequired,
};

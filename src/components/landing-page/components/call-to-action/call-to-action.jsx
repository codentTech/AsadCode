import CustomButton from "@/common/components/custom-button/custom-button.component";
import { JoinFullOutlined } from "@mui/icons-material";
import React from "react";
import useCallToAction from "./use-call-to-action";
import Modal from "@/common/components/modal/modal.component";
import JoinCleerCut from "../join-cleercut/join-cleercut";

function CallToAction() {
  const { isOpen, setIsOpen, closeModal } = useCallToAction();
  return (
    <section className="py-16 bg-primary">
      <div className="flex items-center justify-center px-4 md:px-8">
        <div className="w-full md:max-w-[1200px] flex flex-col md:flex-row items-center justify-between bg-white rounded-lg p-4 md:p-12 shadow-xl">
          <div className="w-full">
            <h2 className="text-sm md:text-lg xl:text-xl font-bold mb-1 text-gray-900">
              Ready to elevate your brand? Start your journey with CleerCut today.
            </h2>
            <p className="text-sm md:text-lg xl:text-xl text-gray-600">
              Join thousands of brands already growing with CleerCut's platform.
            </p>
          </div>
          <div className="mt-3 w-full sm:w-[200px]">
            <CustomButton
              text="Join"
              startIcon={<JoinFullOutlined />}
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      </div>

      <Modal title="Join CleerCut" show={isOpen} onClose={closeModal}>
        <JoinCleerCut closeModal={closeModal} />
      </Modal>
    </section>
  );
}

export default CallToAction;

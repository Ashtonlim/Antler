import React, { useEffect } from "react";

const Modal = ({
  title = "Modal Title",
  visible,
  setVisible,
  children,
  allowClose = true,
  footerButtons,
}) => {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    });
  }, [visible, footerButtons]);

  return visible ? (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-4/5 sm:w-3/5 lg:w-2/5">
          {/*content*/}
          <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <div className="text-2xl font-semibold">{title}</div>
              <button
                className="ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setVisible(false)}
              >
                <span className="text-black block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            {children}
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
              {allowClose && (
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => setVisible(false)}
                >
                  Close
                </button>
              )}
              {footerButtons && footerButtons.map((btn) => btn)}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : (
    <></>
  );
};

export default Modal;

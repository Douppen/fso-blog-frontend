import React, { forwardRef, useImperativeHandle, useState } from "react";

const Toggable = forwardRef(({ children, buttonLabel }, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button className="font-semibold" onClick={toggleVisibility}>
          {buttonLabel}
        </button>
      </div>
      <div className="flex flex-col items-center" style={showWhenVisible}>
        {children}
        <button className="mt-2 w-2/3" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </div>
  );
});

Toggable.displayName = "Toggable";

export default Toggable;

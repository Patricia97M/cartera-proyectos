import React, { memo, useMemo } from "react";
import "../styles/components/Switch.css";

interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  id: string;
}

const Switch: React.FC<SwitchProps> = ({ isOn, handleToggle, id }) => {
  const idInput = useMemo(() => {
    return `${id}-input`;
  }, [id]);
  return (
    <div className="switch" id={id}>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="switch-checkbox"
        id={idInput}
        type="checkbox"
      />
      <label className="switch-label" htmlFor={idInput}>
        <span className="switch-button" />
      </label>
    </div>
  );
};

export default memo(Switch);

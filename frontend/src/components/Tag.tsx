import React, { memo } from "react";
import "./../styles/components/Tag.css";

interface ITagProps {
  children: React.ReactNode;
  status: "enabled" | "disabled";
}
const Tag = ({ children, status }: ITagProps) => {
  return (
    <div className={`tag-container tag--${status}}`}>
      <i className="material-icons">brightness_1</i>
      {children}
    </div>
  );
};

export default memo(Tag);

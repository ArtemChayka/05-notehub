import React from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearchChange: (query: string) => void;
  value: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearchChange, value }) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};

export default SearchBox;

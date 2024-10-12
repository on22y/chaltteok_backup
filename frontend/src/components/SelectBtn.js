import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { RxTriangleDown } from 'react-icons/rx';

function SelectBtn({ onYearChange }) {
  const yearOptions = Array.from({ length: 45 }, (_, i) => ({
    value: 1980 + i,
    label: `${1980 + i}`,
  }));

  const [year, setYear] = useState(null);

  const handleYearChange = (selectedOption) => {
    const selectedYear = selectedOption ? selectedOption.value : null;
    setYear(selectedYear);
    onYearChange(selectedYear); // 선택된 년도를 부모 컴포넌트로 전달
    // setYear(selectedOption ? selectedOption.value : null);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#fffbe6',
      border: '3px solid #2F2F2F',
      borderRadius: '30px ',
      fontFamily: 'Jua, sans-serif',
      padding: '5px ',
      fontSize: '18px',
      width: '107px',
      height: '48px ',
      boxShadow: 'none',
      outline: 'none',
      transition: 'border-color 0.2s',
      '&:hover': {
        borderColor: '#2F2F2F',
      },
      '&:focus': {
        borderColor: '#2F2F2F',
      },
      '&:focus-within': {
        borderColor: '#2F2F2F',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#2F2F2F',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#2F2F2F',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#2F2F2F',
      padding: '5px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#fffbe6',
      borderRadius: '10px',
      border: '3px solid #2F2F2F',
    }),
    menuList: (provided) => ({
      ...provided,
      borderRadius: '10px ',
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '::-webkit-scrollbar-track': {
        display: 'none',
      },
      '::-webkit-scrollbar-thumb': {
        display: 'none',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#6EC207' : state.isFocused ? '#C0EBA6' : '#fffbe6',
      color: state.isSelected ? '#2F2F2F' : '#929292',
      fontFamily: 'Jua, sans-serif',
      fontSize: '18px',
      ':active': {
        backgroundColor: state.isSelected ? '#6EC207' : '#C0EBA6', // 클릭 시 기본값 대신 커스텀한 색 유지
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      display: 'none',
    }),
  };

  // dropdown icon 설정
  const customComponents = {
    DropdownIndicator: (props) => {
      return (
        <div {...props.innerProps} style={{ display: 'flex', alignItems: 'center', paddingRight: '10px' }}>
          <RxTriangleDown style={{ width: '30px', height: '30px ', color: '#2F2F2F' }} />
        </div>
      );
    },
  };

  return (
    <div className="selectBtnContainer">
      <Select
        className="Year"
        options={yearOptions}
        value={yearOptions.find((option) => option.value === year)}
        onChange={handleYearChange}
        placeholder="년도"
        styles={customStyles}
        components={customComponents}
        isClearable={false}
      />
    </div>
  );
}

export default SelectBtn;

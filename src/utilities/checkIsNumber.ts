import React from 'react';
import expander from './expander';

const checkIsNumber = (
  e: React.ChangeEvent<HTMLInputElement>,
  ResDiv: HTMLDivElement,
  numSetter: React.Dispatch<React.SetStateAction<number | null>>,
  errorSetter: React.Dispatch<React.SetStateAction<string>>
) => {
  const regEx = new RegExp(/^[0-9]*$/);
  if (regEx.test(e.target.value)) {
    numSetter(+e.target.value);
  } else {
    e.target.value = e.target.value.substring(0, e.target.value.length - 1);
    errorSetter('Must be a number');
    expander(ResDiv, true);
    setTimeout(() => {
      expander(ResDiv, false);
      errorSetter('');
    }, 2400);
    return false;
  }
};

export default checkIsNumber;

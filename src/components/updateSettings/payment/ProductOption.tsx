import React, { useState, useRef } from 'react';
import classes from './PaymentOption.module.scss';
import { PackageOption, UserInfo } from '../../../models';
import {checkIsNumber} from '../../../utilities';

interface PaymentLandingProps {
  userInfo: UserInfo;
  packageOption: PackageOption;
  selectedPackage: PackageOption | undefined;
  setSelectedPackage: React.Dispatch<React.SetStateAction<PackageOption | undefined>>;
  setQuantity: React.Dispatch<React.SetStateAction<number | null>>;
}

const PaymentLanding: React.FC<PaymentLandingProps> = (props) => {
  const packageOption = props.packageOption;
  const [error, setError] = useState<string>('');
  const quantityRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<HTMLInputElement>(null);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const selectionHandler = () => {
    if (quantityRef.current !== null && selectionRef.current !== null) {
      props.setQuantity(+quantityRef.current.value);
      props.setSelectedPackage(packageOption);
      selectionRef.current.checked = true;
    }
  };

  return (
    <div className={classes.wrapper}>
      <div
        className={
          props.selectedPackage && props.selectedPackage.id === packageOption.id
            ? `${classes.packageContainer} ${classes.selected}`
            : classes.packageContainer
        }
        onClick={selectionHandler}
      >
        <h5>{packageOption.title}</h5>
        <p>Number of Lessosn: {packageOption.numberOfLessons}</p>
        <p>
          Cost:{' '}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }).format(packageOption.price / 100)}
        </p>
        <label htmlFor="quantity">Quantity</label>
        <input
          className={classes.quantityInput}
          defaultValue="1"
          type="text"
          name="quantity"
          ref={quantityRef}
          disabled={props.selectedPackage && props.selectedPackage.id === packageOption.id ? false : true}
          onChange={(e) => {
            checkIsNumber(e, responseDivRef.current!, props.setQuantity, setError);
          }}
        />
        <div className={classes.responseDiv} ref={responseDivRef}>
          {error ? <p className={classes.alert}>{error}</p> : <></>}
        </div>
        <input
          className={classes.selectionInput}
          ref={selectionRef}
          type="radio"
          name="option"
          value={packageOption.id}
          onChange={selectionHandler}
        />
      </div>
    </div>
  );
};

export default PaymentLanding;

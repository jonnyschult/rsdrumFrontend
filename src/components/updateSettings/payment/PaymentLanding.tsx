import React, { useState, useEffect, useCallback } from 'react';
import classes from './PaymentLanding.module.scss';
import ProductOption from './ProductOption';
import ErrorPage from '../../ErrorPage/ErrorPage';
import { PackageOption, UserInfo } from '../../../models';
import { useHistory } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { getter } from '../../../utilities';

interface PaymentLandingProps {
  userInfo: UserInfo;
}

const PaymentLanding: React.FC<PaymentLandingProps> = (props) => {
  const token = props.userInfo.token;
  const history = useHistory();
  const [quantity, setQuantity] = useState<number | null>(1);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>();
  const [loadingMain, setLoadingMain] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [packages, setPackages] = useState<PackageOption[]>([]);

  const loadUpHandler = useCallback(async () => {
    try {
      const packagesData = await getter(token, 'payments/getPackages');
      setPackages(packagesData.packages);
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setErrMessage(error.response.data.message);
      } else {
        setErrMessage('Problem getting the packages. Please let site admin Know.');
      }
    } finally {
      setLoadingMain(false);
    }
  }, [token]);

  const checkoutHandler = () => {
    if (quantity && selectedPackage) {
      history.push(`/checkout/${quantity}/${selectedPackage.id}`);
    }
  };

  useEffect(() => {
    loadUpHandler();
  }, [loadUpHandler]);

  if (isError) {
    return <ErrorPage errMessage={errMessage} />;
  } else if (loadingMain) {
    return (
      <div className={classes.loading}>
        <Spinner className={classes.spinner}></Spinner>
      </div>
    );
  } else {
    return (
      <div className={classes.wrapper}>
        <h3>Payment</h3>
        <h5>Select an option</h5>
        <div className={classes.packagesContainer}>
          <form action="">
            {packages.map((packageOption, index) => {
              return (
                <ProductOption
                  packageOption={packageOption}
                  userInfo={props.userInfo}
                  selectedPackage={selectedPackage}
                  setSelectedPackage={setSelectedPackage}
                  setQuantity={setQuantity}
                  key={index}
                />
              );
            })}
          </form>
          <button
            className={classes.submitButton}
            disabled={quantity && selectedPackage ? false : true}
            onClick={checkoutHandler}
          >
            Checkout:{' '}
            {quantity && selectedPackage
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                }).format(quantity * (selectedPackage.price / 100))
              : 0}
          </button>
        </div>
      </div>
    );
  }
};

export default PaymentLanding;

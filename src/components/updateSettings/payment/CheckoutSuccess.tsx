import React, { useEffect, useState } from 'react';
import classes from './CheckoutSuccess.module.scss';
import ReceiptPage from './ReceiptPage';
import ErrorPage from '../../ErrorPage/ErrorPage';
import { useParams } from 'react-router';
import { Payment, UserInfo } from '../../../models';
import { Spinner } from 'reactstrap';
import { getter } from '../../../utilities';

interface CheckoutSuccessProps {
  userInfo: UserInfo;
  receipt?: Payment;
}

interface ParamsType {
  receiptId?: string;
}

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = (props) => {
  const token = props.userInfo.token;
  const params = useParams<ParamsType>();
  const [receipt, setReceipt] = useState<Payment>();
  const [loadingMain, setLoadingMain] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  useEffect(() => {
    const getReceipt = async () => {
      try {
        const data = await getter(token, 'payments/getReceipts', `id=${params.receiptId}`);
        setReceipt(data.receipts[0]);
        setLoadingMain(false);
        setIsError(false);
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
          setErrMessage('Problem fetching your data. Please let site admin Know.');
        }
      }
    };
    getReceipt();
  }, [token, params.receiptId]);

  if (isError) {
    return <ErrorPage errMessage={errMessage} />;
  } else if (loadingMain) {
    return (
      <div className={classes.loading}>
        <Spinner className={classes.bigSpinner}></Spinner>
      </div>
    );
  } else {
    return (
      <div className={classes.wrapper}>
        <h1>Thank You!</h1>
        <ReceiptPage userInfo={props.userInfo} receipt={receipt!} />
      </div>
    );
  }
};

export default CheckoutSuccess;

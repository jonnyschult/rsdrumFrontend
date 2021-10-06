import React, { useState, useEffect } from 'react';
import classes from './PaymentHistory.module.scss';
import ErrorPage from '../../ErrorPage/ErrorPage';
import ReceiptPage from './ReceiptPage';
import { UserInfo, Payment } from '../../../models';
import { Spinner } from 'reactstrap';
import { getter } from '../../../utilities';

interface PaymentHistoryProps {
  userInfo: UserInfo;
  userId?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = (props) => {
  let token = props.userInfo.token;
  let userId = props.userInfo.user.admin ? props.userId : props.userInfo.user.id;
  const [receipts, setReceipts] = useState<Payment[]>([]);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [numOfPackages, setNumOfPackage] = useState<number>(0);
  const [numOfLessons, setNumOfLessons] = useState<number>(0);
  const [loadingMain, setLoadingMain] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  useEffect(() => {
    const getReceipts = async () => {
      try {
        const receiptData = await getter(token, 'payments/getReceipts', `userId=${userId}`);
        if (receiptData.receipts.length > 0) {
          setReceipts(receiptData.receipts);
          let chargedAmout = receiptData.receipts.map((receipt: Payment) => receipt.chargeAmount);
          setTotalPaid(chargedAmout.reduce((total: number, addend: number) => (total += addend)));
          let numOfLessonsMapped = receiptData.receipts.map(
            (receipt: Payment) => receipt.numberOfLessons! * receipt.purchaseQuantity
          );
          setNumOfLessons(numOfLessonsMapped.reduce((total: number, addend: number) => (total += addend)));
          let quantityMapped = receiptData.receipts.map((receipt: Payment) => receipt.purchaseQuantity);
          setNumOfPackage(quantityMapped.reduce((total: number, addend: number) => (total += addend)));
          setIsError(false);
        }
      } catch (error: any) {
        setIsError(true);
        if (
          error.response !== undefined &&
          error.response.data !== undefined &&
          error.response.data.message !== undefined
        ) {
          setErrMessage(error.response.message);
        } else {
          setErrMessage('Problem fetching your receiptData. Please let site admin Know.');
        }
        console.log(error);
      } finally {
        setLoadingMain(false);
      }
    };
    getReceipts();
  }, [token, userId]);

  if (isError) {
    return <ErrorPage errMessage={errMessage} />;
  } else if (loadingMain) {
    return (
      <div className={classes.loadingMain}>
        <Spinner className={classes.bigSpinner}></Spinner>
      </div>
    );
  } else {
    return (
      <div className={classes.wrapper}>
        <h1 className={classes.title}>RECEIPTS</h1>
        <div className={classes.receiptsContainer}>
          {receipts.map((receipt, index) => {
            return <ReceiptPage userInfo={props.userInfo} receipt={receipt} key={index} />;
          })}
        </div>
        <h5>
          {`Packages Puschased: ${numOfPackages}, for ${numOfLessons} Lessons, Total Charged: $${(
            totalPaid / 100
          ).toFixed(2)}`}
        </h5>
      </div>
    );
  }
};

export default PaymentHistory;

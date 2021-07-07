import React from 'react';
import classes from './ReceiptPage.module.scss';
import { Payment, UserInfo } from '../../../models';
import logo from '../../../assets/rsDrumLogo.jpg';

interface ReceiptPageProps {
  userInfo: UserInfo;
  receipt: Payment;
}

const ReceiptPage: React.FC<ReceiptPageProps> = (props) => {
  const receipt = props.receipt;

  return (
    <div className={classes.wrapper}>
      <h3>R.S. Drumming Studio</h3>
      <h5>Bringing the Percussive Arts to Life</h5>
      <img src={logo} alt="" />
      <hr />
      <div className={classes.info}>
        <p>Card Holder:</p>
        <p>{receipt!.cardHoldersName}</p>
      </div>
      <div className={classes.info}>
        <p>Charge:</p>
        <p>{`$${(receipt!.chargeAmount! / 100).toFixed(2)}`}</p>
      </div>
      <div className={classes.info}>
        <p>Purchased:</p>
        <p>{`${receipt!.itemTitle} x ${receipt?.purchaseQuantity}`}</p>
      </div>
      <div className={classes.info}>
        <p>Charge Date:</p>
        <p>{`${new Date(receipt?.chargeDate!).toDateString()}`}</p>
      </div>
    </div>
  );
};

export default ReceiptPage;

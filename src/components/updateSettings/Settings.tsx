import React, { useState } from 'react';
import classes from './Settings.module.scss';
import UpdatePassword from './UpdatePassword';
import UpdateInfo from './UpdateInfo';
import DeleteAccount from './DeleteAccount';
import Payment from './payment/PaymentLanding';
import PaymentHistory from './payment/PaymentHistory';
import AdminSettings from './AdminSettings';
import { UserInfo } from '../../models';

interface SettingsProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  logoutHandler: () => void;
}

const Settings: React.FC<SettingsProps> = (props) => {
  const [updateInfo, setUpdateInfo] = useState<boolean>(true);
  const [updatePassword, setUpdatePassword] = useState<boolean>(false);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);
  const [payment, setPayment] = useState<boolean>(false);
  const [paymentHistory, setPaymentHistory] = useState<boolean>(false);
  const [adminPage, setAdminPage] = useState<boolean>(false);

  const updateInfoHandler = () => {
    setUpdateInfo(true);
    setUpdatePassword(false);
    setDeleteAccount(false);
    setPayment(false);
    setPaymentHistory(false);
    setAdminPage(false);
  };

  const updatePasswordHandler = () => {
    setUpdateInfo(false);
    setUpdatePassword(true);
    setDeleteAccount(false);
    setPayment(false);
    setPaymentHistory(false);
    setAdminPage(false);
  };

  const deleteAccountHandler = () => {
    setUpdateInfo(false);
    setUpdatePassword(false);
    setDeleteAccount(true);
    setPayment(false);
    setPaymentHistory(false);
    setAdminPage(false);
  };

  const paymentHandler = () => {
    setUpdateInfo(false);
    setUpdatePassword(false);
    setDeleteAccount(false);
    setPayment(true);
    setPaymentHistory(false);
    setAdminPage(false);
  };

  const paymentHistroyHandler = () => {
    setUpdateInfo(false);
    setUpdatePassword(false);
    setDeleteAccount(false);
    setPayment(false);
    setPaymentHistory(true);
    setAdminPage(false);
  };

  const adminHandler = () => {
    setUpdateInfo(false);
    setUpdatePassword(false);
    setDeleteAccount(false);
    setPayment(false);
    setPaymentHistory(false);
    setAdminPage(true);
  };

  if (props.userInfo.user.admin) {
    return (
      <div className={classes.wrapper}>
        <h1>Settings</h1>
        <div className={classes.menu}>
          <h5 className={classes.menuItem} onClick={(e) => updateInfoHandler()}>
            User Information
          </h5>
          <h5 className={classes.menuItem} onClick={(e) => updatePasswordHandler()}>
            Reset Password
          </h5>
          <h5 className={classes.menuItem} onClick={(e) => adminHandler()}>
            Admin Settings
          </h5>
        </div>
        <hr className={classes.divide} />
        <div className={classes.componentContainer}>
          {updatePassword ? <UpdatePassword userInfo={props.userInfo} /> : <></>}
          {updateInfo ? <UpdateInfo userInfo={props.userInfo} setUserInfo={props.setUserInfo} /> : <></>}
          {adminPage ? <AdminSettings userInfo={props.userInfo} /> : <></>}
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.wrapper}>
        <h1>Settings</h1>

        <div className={classes.menu}>
          <h5 className={classes.menuItem} onClick={(e) => updateInfoHandler()}>
            User Information
          </h5>
          <h5 className={classes.menuItem} onClick={(e) => updatePasswordHandler()}>
            Reset Password
          </h5>
          <h5 className={classes.menuItem} onClick={(e) => deleteAccountHandler()}>
            Delete Account
          </h5>
          <h5 className={classes.menuItem} onClick={(e) => paymentHandler()}>
            Make Payment
          </h5>
          <h5 className={classes.menuItem} onClick={(e) => paymentHistroyHandler()}>
            Past Payments
          </h5>
        </div>
        <hr className={classes.divide} />

        <div className={classes.componentContainer}>
          {updatePassword ? <UpdatePassword userInfo={props.userInfo} /> : <></>}
          {updateInfo ? <UpdateInfo userInfo={props.userInfo} setUserInfo={props.setUserInfo} /> : <></>}
          {deleteAccount ? (
            <DeleteAccount userInfo={props.userInfo} logoutHandler={props.logoutHandler} />
          ) : (
            <></>
          )}
          {payment ? <Payment userInfo={props.userInfo} /> : <></>}
          {paymentHistory ? <PaymentHistory userInfo={props.userInfo} /> : <></>}
        </div>
      </div>
    );
  }
};

export default Settings;

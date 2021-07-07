import React, { useState } from 'react';
import classes from './PaymentHistoryModal.module.scss';
import PaymentHistory from './PaymentHistory';
import { Modal } from 'reactstrap';
import { UserInfo } from '../../../models';

interface ReceiptsModalProps {
  userInfo: UserInfo;
  userId: string;
}

const ReceiptsModal: React.FC<ReceiptsModalProps> = (props) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <div className={classes.wrapper}>
      <button onClick={toggle}>Payment History</button>
      <Modal isOpen={modal} toggle={toggle} className={classes.modal} contentClassName={classes.modalContent}>
        <PaymentHistory userId={props.userId} userInfo={props.userInfo} />
        <button className={classes.doneBtn} onClick={toggle}>
          Done
        </button>
      </Modal>
    </div>
  );
};

export default ReceiptsModal;

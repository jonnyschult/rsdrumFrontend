import React, { useState } from 'react';
import classes from './AssignmentImgModal.module.scss';
import { Assignment } from '../../models';
import { Modal } from 'reactstrap';

interface AssignmentEditorProps {
  assignment: Assignment;
}

const AssignmentEditor: React.FC<AssignmentEditorProps> = (props) => {
  const assignment = props.assignment;
  const [modal, setModal] = useState<boolean>(false);
  const [switched, setSwitched] = useState<boolean>(false);

  const toggle = () => setModal(!modal);

  return (
    <div className={classes.wrapper}>
      <img src={props.assignment.primaryImg} alt="" className={classes.imgToggler} onClick={toggle} />
      <Modal isOpen={modal} toggle={toggle} className={classes.modal} contentClassName={classes.modalContent}>
        {assignment.auxImg ? (
          <div className={classes.imgsContainer}>
            {switched ? (
              <img className={classes.img} src={assignment.auxImg} alt="" />
            ) : (
              <img className={classes.img} src={assignment.primaryImg} alt="" />
            )}
            <div className={classes.navigation}>
              <button onClick={(e) => setSwitched(!switched)}>&#60;</button>
              <button onClick={(e) => toggle()}>X</button>
              <button onClick={(e) => setSwitched(!switched)}> &#62;</button>
            </div>
          </div>
        ) : (
          <img src={assignment.primaryImg} alt="" />
        )}
      </Modal>
    </div>
  );
};

export default AssignmentEditor;

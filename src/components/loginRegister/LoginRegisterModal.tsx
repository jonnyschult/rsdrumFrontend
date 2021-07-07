import React, { useState } from 'react';
import classes from './LoginRegisterModal.module.scss';
import Register from './Register';
import Login from './Login';
import { Modal } from 'reactstrap';

interface LoginRegisterProps {
  loginHandler: (userToken: string) => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = (props) => {
  const [modal, setModal] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(true);

  const toggle = () => setModal(!modal);
  const registerToggle = () => setRegister(!register);

  return (
    <div className={classes.wrapper}>
      <p
        onClick={(e) => {
          toggle();
          e.preventDefault();
        }}
      >
        Login/Register
      </p>
      <Modal isOpen={modal} toggle={toggle} className={classes.modal} contentClassName={classes.modalContent}>
        <p className={classes.exit} onClick={toggle}>
          &#10006;
        </p>
        <h3 className={classes.title}>{register ? 'Register' : 'Login'}</h3>
        <hr />
        {register ? (
          <Register loginHandler={props.loginHandler} toggle={toggle} />
        ) : (
          <Login loginHandler={props.loginHandler} toggle={toggle} />
        )}
        <hr />
        <p className={classes.switcher} onClick={registerToggle}>
          {register ? 'Login' : 'Register'}
        </p>
      </Modal>
    </div>
  );
};

export default LoginRegister;

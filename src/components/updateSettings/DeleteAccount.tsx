import React, { useState, useRef } from 'react';
import classes from './DeleteAccount.module.scss';
import { UserInfo } from '../../models';
import { Alert, Spinner } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { deleter, expander } from '../../utilities';

interface UpdatePasswordProps {
  userInfo: UserInfo;
  logoutHandler: () => void;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
  const history = useHistory();
  const token = props.userInfo.token;
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const responseDivRef = useRef<HTMLDivElement>(null);

  const deleteAccountHandler = async () => {
    const enteredEmail: string | null = prompt(
      `To confirm your account removal, please copy ${props.userInfo.user.email} below.`
    )!;
    if (enteredEmail === null) {
      return;
    } else if (enteredEmail === props.userInfo.user.email) {
      setLoading(true);
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      try {
        const data = await deleter(token, `users/deleteUser/${props.userInfo.user.id}`);
        console.log(data);
        setResponse(data.message);
        setTimeout(() => {
          props.logoutHandler();
          setResponse('');
          history.push('/home');
        }, 1500);
      } catch (error) {
        console.log(error);
        if (
          error.response !== undefined &&
          error.response.data !== undefined &&
          error.response.data.message !== undefined
        ) {
          setError(error.response.data.message);
        } else {
          setError('Problem fetching your data. Please let site admin Know.');
        }
        setTimeout(() => {
          setError('');
        }, 2500);
      } finally {
        setLoading(false);
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
      }
    } else {
      setError("Emails didn't match.");
      setLoading(false);
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setError('');
      }, 2400);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h4>Delete Account</h4>
      <button className={classes.submitButton} onClick={(e) => deleteAccountHandler()}>
        Delete Account
      </button>
      <div className={classes.responseDiv} ref={responseDivRef}>
        {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
        {error ? <Alert className={classes.alert}>{error}</Alert> : <></>}
        {response ? <Alert className={classes.alert}>{response}</Alert> : <></>}
      </div>
    </div>
  );
};

export default UpdatePassword;

import React, { useState, useEffect, useRef } from 'react';
import classes from './UpdatePassword.module.scss';
import { UserInfo } from '../../models';
import { Spinner } from 'reactstrap';
import { updater, expander } from '../../utilities';

interface UpdatePasswordProps {
  userInfo: UserInfo;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
  const token = props.userInfo.token;
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [large, setLarge] = useState<boolean>(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const updateInfoHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      try {
        const info = {
          password: currentPassword,
          newPassword,
        };
        const data = await updater(token, 'users/updatePassword', info);
        setResponse(data.message);
        setTimeout(() => {
          inputRefs.current.forEach((el) => (el.value = ''));
          setResponse('');
        }, 2500);
      } catch (error: any) {
        console.log(error);
        if (
          error.response !== undefined &&
          error.response.data !== undefined &&
          error.response.data.message !== undefined
        ) {
          setError(error.response.data.message);
        } else {
          setError('Problem updating your password. Please let site admin Know.');
        }
        setTimeout(() => {
          setError('');
        }, 2500);
      } finally {
        setLoading(false);
        setTimeout(() => {
          if (responseDivRef.current !== null) {
            expander(responseDivRef.current!, false);
          }
        }, 2200);
      }
    } else {
      if (newPassword !== confirmPassword) {
        setError("Passwords don't match");
      } else {
        setError('Password must be 8 characters or longer');
      }
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

  const resizeHandler = () => {
    if (window.innerWidth >= 1200) {
      setLarge(true);
    }
    if (window.innerWidth < 1200) {
      setLarge(false);
    }
  };

  window.addEventListener('resize', resizeHandler);

  useEffect(() => {
    if (window.innerWidth >= 1200) {
      setLarge(true);
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      <h4 className={classes.heading}>Update Password</h4>
      <form className={classes.form} onSubmit={(e) => updateInfoHandler(e)}>
        <div className={classes.formGroup}>
          <label htmlFor="current password">Current Password</label>
          <input
            required
            ref={(el: HTMLInputElement) => (inputRefs.current[0] = el!)}
            type="password"
            name="current password"
            onChange={(e) => setCurrentPassword(e.target.value)}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="new password">New Password</label>
          <input
            required
            ref={(el: HTMLInputElement) => (inputRefs.current[1] = el!)}
            type="password"
            name="last name"
            onChange={(e) => setNewPassword(e.target.value)}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="confirm new password">Confirm New Password</label>
          <input
            required
            ref={(el: HTMLInputElement) => (inputRefs.current[2] = el!)}
            type="password"
            name="DOB"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <button className={classes.submitButton} type="submit">
          Update Info
        </button>
        <div className={classes.responseDiv} ref={responseDivRef}>
          {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
          {error ? <p className={classes.alert}>{error}</p> : <></>}
          {response ? <p className={classes.alert}>{response}</p> : <></>}
        </div>
      </form>
      {large ? (
        <div className={classes.sideImg}>
          <p className={classes.quote}>
            “Average band with a great drummer sounds great, great band with an average drummer sounds
            average.” <br /> Buddy Rich
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UpdatePassword;

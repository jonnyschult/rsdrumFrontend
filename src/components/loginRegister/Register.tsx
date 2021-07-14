import React, { FormEvent, useRef, useState } from 'react';
import classes from './Register.module.scss';
import { Spinner } from 'reactstrap';
import { User } from '../../models';
import { poster, expander } from '../../utilities';

interface RegisterProps {
  loginHandler: (userToken: string) => void;
  toggle: () => void;
}

const Register: React.FC<RegisterProps> = (props) => {
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setlastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [DOB, setDOB] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const passwordRef = useRef<HTMLDivElement>(null);
  const confirmPasswordRef = useRef<HTMLDivElement>(null);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const submitRegistrationHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      if (password !== confirmPassword) {
        setLoading(false);
        setError('Passwords must match');
        setTimeout(() => {
          setError('');
        }, 2500);
      } else {
        const info: User = {
          email,
          firstName,
          lastName,
          password,
          DOB: DOB,
          admin: false,
          student: true,
          active: true,
        };
        const data = await poster('notoken', 'users/register', info);
        await props.loginHandler(data.token);
        setLoading(false);
        setResponse('Registration Successful');
        //if the time is changed here, it will cause a race with loginHandler, which unmounts this modal. If you change time here, change time in loginHandler in App.tsx.
        setTimeout(() => {
          setResponse('');
          props.toggle();
        }, 2500);
      }
    } catch (error) {
      console.log(error.response);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Problem creating your account. Please let site admin know');
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
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={(e) => submitRegistrationHandler(e)}>
          <div className={classes.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              required
              type="email"
              name="email"
              placeholder="your@email.here"
              onChange={(e) => setEmail(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="password">Create a password</label>
            <input
              required
              type="password"
              name="password"
              onChange={(e) => {
                expander(passwordRef.current!, e.target.value.length < 8 && e.target.value.length > 0, '4em');
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <div className={classes.reqAlertContainer} ref={passwordRef}>
            <p className={classes.reqAlert}>Password Must be 8 Characters Long</p>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="Confirm Password">Confirm password</label>
            <input
              required
              type="password"
              name="Confirm Password"
              onChange={(e) => {
                expander(
                  confirmPasswordRef.current!,
                  password !== e.target.value && e.target.value.length > 0,
                  '4em'
                );
                setConfirmPassword(e.target.value);
              }}
            ></input>
          </div>
          <div className={classes.reqAlertContainer} ref={confirmPasswordRef}>
            <p className={classes.reqAlert}>Passwords Don't Match</p>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="first name">First Name</label>
            <input
              required
              type="text"
              name="first name"
              onChange={(e) => setFirstName(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="last name">Last Name</label>
            <input
              required
              type="text"
              name="last name"
              onChange={(e) => setlastName(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="DOB">DOB</label>
            <input type="date" name="DOB" onChange={(e) => setDOB(e.target.value)}></input>
          </div>
          <button className={classes.submitButton} type="submit">
            Submit
          </button>
          <div className={classes.responseDiv} ref={responseDivRef}>
            {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
            {response ? <p className={classes.alert}>{response}</p> : <></>}
            {error ? <p className={classes.alert}>{error}</p> : <></>}
          </div>
          <div className={classes.formContianer}></div>
        </form>
      </div>
    </div>
  );
};

export default Register;

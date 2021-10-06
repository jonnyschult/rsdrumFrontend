import React, { FormEvent, useState, useRef } from 'react';
import classes from './Login.module.scss';
import { Spinner } from 'reactstrap';
import { poster, expander } from '../../utilities';

interface LoginProps {
  loginHandler: (userToken: string) => void;
  toggle: () => void;
}

const Login: React.FC<LoginProps> = (props) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const responseDivRef = useRef<HTMLDivElement>(null);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const info = { email, password };
      const data = await poster('notoken', 'users/login', info);
      await props.loginHandler(data.token);
      setResponse('Login Successful');
      //if the time is changed here, it will cause a race with loginHandler, which unmounts this modal. If you change time here, change time in loginHandler in App.tsx.
      setTimeout(() => {
        setResponse('');
        props.toggle();
      }, 1500);
    } catch (error: any) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Problem logging into your account. Please let site admin know');
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
        <form className={classes.form} onSubmit={(e) => submitHandler(e)}>
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
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <button className={classes.submitButton} type="submit">
            Submit
          </button>
          <div className={classes.responseDiv} ref={responseDivRef}>
            {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
            {error ? <p className={classes.alert}>{error}</p> : <></>}
            {response ? <p className={classes.alert}>{response}</p> : <></>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

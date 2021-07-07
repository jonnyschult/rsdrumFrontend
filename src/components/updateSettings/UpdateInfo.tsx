import React, { useState, useEffect, useRef } from 'react';
import classes from './UpdateInfo.module.scss';
import { UserInfo } from '../../models';
import { Spinner } from 'reactstrap';
import { updater, expander, dynamicPropertyRemover } from '../../utilities';


interface UpdateInfoProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

const UpdateInfo: React.FC<UpdateInfoProps> = (props) => {
  const token = props.userInfo.token;
  let user = props.userInfo.user;
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [DOB, setDOB] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [large, setLarge] = useState<boolean>(false);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const updateInfoHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const compiledObj = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        DOB: DOB,
      };
      const info = dynamicPropertyRemover(compiledObj);
      const data = await updater(token, 'users/updateUser', info);
      console.log(data);
      props.userInfo.user = data.updatedUser;
      props.setUserInfo(props.userInfo);
      setResponse(data.message);
      setTimeout(() => {
        setResponse('');
      }, 2400);
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
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
      }, 2200);
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
      <h3 className={classes.heading}>Update Information</h3>
      <form className={classes.form} onSubmit={(e) => updateInfoHandler(e)}>
        <div className={classes.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            defaultValue={user.email}
            type="email"
            name="email"
            placeholder="your@email.here"
            onChange={(e) => setEmail(e.target.value.trim())}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="first Name">First Name</label>
          <input
            defaultValue={user.firstName}
            type="text"
            name="first name"
            onChange={(e) => setFirstName(e.target.value.trim())}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="last name">Last Name</label>
          <input
            defaultValue={user.lastName}
            type="text"
            name="last name"
            onChange={(e) => setLastName(e.target.value.trim())}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="DOB">DOB</label>
          <input
            defaultValue={user.DOB}
            type="date"
            name="DOB"
            onChange={(e) => setDOB(e.target.value)}
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

export default UpdateInfo;

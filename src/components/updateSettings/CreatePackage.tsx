import React, { useState, useRef } from 'react';
import classes from './CreatePackage.module.scss';
import { UserInfo, PackageOption } from '../../models';
import { Spinner } from 'reactstrap';
import { poster, expander } from '../../utilities';

interface CreatePackageProps {
  packages: PackageOption[];
  userInfo: UserInfo;
  setPackages: React.Dispatch<React.SetStateAction<PackageOption[]>>;
}

const CreatePackage: React.FC<CreatePackageProps> = (props) => {
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [numberOfLessons, setNumberOfLessons] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const createPackageHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const info: PackageOption = {
        title,
        price,
        numberOfLessons,
      };
      const data = await poster(props.userInfo.token, 'payments/createPackage', info);
      props.setPackages([...props.packages, data.newPackage]);
      setResponse(data.message);
      setTimeout(() => {
        setResponse('');
        inputRefs.current.forEach((el) => (el.value = ''));
      }, 2500);
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

  const checkIsNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regEx = new RegExp(/^(\d+\.?\d{0,2}|\.\d{1,9})$/);
    if (regEx.test(e.target.value)) {
      return true;
    } else {
      e.target.value = '';
      setError('Must be formated as number with only two decimal places');
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setError('');
      }, 2400);
      return false;
    }
  };

  return (
    <div className={classes.wrapper} ref={formContainerRef}>
      <h5>New Package</h5>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={(e) => createPackageHandler(e)}>
          <div className={classes.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              placeholder="e.g. Individual Lesson"
              type="text"
              name="title"
              ref={(el: HTMLInputElement) => (inputRefs.current[0] = el!)}
              onChange={(e) => setTitle(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="number of lessons">Number of Lessons</label>
            <input
              placeholder="e.g. 2"
              type="text"
              name="number of lessons"
              ref={(el: HTMLInputElement) => (inputRefs.current[1] = el!)}
              onChange={(e) => {
                const isNum = checkIsNumber(e);
                if (isNum) {
                  setNumberOfLessons(+e.target.value);
                }
              }}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="price">price</label>
            <input
              placeholder="e.g. 19.95"
              type="text"
              name="price"
              ref={(el: HTMLInputElement) => (inputRefs.current[2] = el!)}
              onChange={(e) => {
                const isNum = checkIsNumber(e);
                if (isNum) {
                  console.log(+e.target.value * 100);
                  setPrice(+e.target.value * 100);
                }
              }}
            ></input>
          </div>
          <button className={classes.submitButton} disabled={price && title ? false : true} type="submit">
            Create
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

export default CreatePackage;

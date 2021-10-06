import React, { useState, useRef } from 'react';
import classes from './Package.module.scss';
import { UserInfo, PackageOption } from '../../models';
import { Spinner } from 'reactstrap';
import { Spiral as Hamburger } from 'hamburger-react';
import { updater, deleter, expander, dynamicPropertyRemover } from '../../utilities';

interface PackageProps {
  packageOption: PackageOption;
  packages: PackageOption[];
  userInfo: UserInfo;
  setPackages: React.Dispatch<React.SetStateAction<PackageOption[]>>;
}

const Package: React.FC<PackageProps> = (props) => {
  const packageOption = props.packageOption;
  const [title, setTitle] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [numberOfLessons, setNumberOfLessons] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const updateInfoHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const compiledObj = {
        id: props.packageOption.id,
        title,
        price,
        numberOfLessons,
      };
      const info = dynamicPropertyRemover(compiledObj);
      const data = await updater(
        props.userInfo.token,
        'payments/updatePackage',
        info,
        `${props.packageOption.id}`
      );
      props.setPackages(
        props.packages.map((pack) => {
          if (pack.id === data.updatedPackage.id) {
            return data.updatedPackage;
          } else {
            return pack;
          }
        })
      );
      setResponse(data.message);
      setTimeout(() => {
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

  const deleteHandler = async (e: React.FormEvent, packageId: string) => {
    e.preventDefault();
    try {
      const confirmation = window.confirm('Are you sure you wish to delete this package?');
      if (confirmation) {
        setLoading(true);
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, true);
        }
        const result = await deleter(props.userInfo.token, `payments/deletePackage/${packageId}`);
        props.setPackages(
          props.packages.filter((packageOption) => packageOption.id! !== result.deletedPackage.id)
        );
      }
    } catch (error: any) {
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
  };

  const checkIsNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (priceInputRef.current !== null) {
      const regEx = new RegExp(/^(\d+\.?\d{0,2}|\.\d{1,9})$/);
      if (regEx.test(e.target.value) || e.target.value === '') {
        return true;
      } else {
        priceInputRef.current.value = `${packageOption.price / 100}`;
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
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.packageContainer}>
        <h5>{packageOption.title}</h5>
        <div className={`${classes.costContainer} ${classes.info}`}>
          <p>Cost:</p>
          <p>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            }).format(packageOption.price / 100)}
          </p>
        </div>
        <div className={classes.formContainer} ref={formContainerRef}>
          <form onSubmit={(e) => updateInfoHandler(e)}>
            <div className={classes.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                defaultValue={packageOption.title}
                type="text"
                name="title"
                onChange={(e) => setTitle(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="number of lessons">Number of Lessons</label>
              <input
                defaultValue={packageOption.numberOfLessons}
                type="text"
                name="number of lessons"
                ref={priceInputRef}
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
                defaultValue={packageOption.price / 100}
                type="text"
                name="price"
                ref={priceInputRef}
                onChange={(e) => {
                  const isNum = checkIsNumber(e);
                  if (isNum) {
                    setPrice(+e.target.value);
                  }
                }}
              ></input>
            </div>
            <button className={classes.submitButton} type="submit">
              Update Info
            </button>
            <button className={classes.submitButton} onClick={(e) => deleteHandler(e, packageOption.id!)}>
              Delete Package
            </button>
          </form>
        </div>
        <div className={classes.responseDiv} ref={responseDivRef}>
          {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
          {error ? <p className={classes.alert}>{error}</p> : <></>}
          {response ? <p className={classes.alert}>{response}</p> : <></>}
        </div>
        <div className={classes.burgerContainer}>
          <p>{isOpen ? '' : 'Update'}</p>
          <Hamburger
            toggled={isOpen}
            toggle={(e) => {
              expander(formContainerRef.current!, !isOpen, `${formContainerRef.current?.scrollHeight}px`);
              setIsOpen(!isOpen);
            }}
            color="#f8f7e7"
          />
        </div>
      </div>
    </div>
  );
};

export default Package;

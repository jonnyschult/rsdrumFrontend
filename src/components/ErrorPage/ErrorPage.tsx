import React from 'react';
import classes from './ErrorPage.module.scss';

interface ErrorPageProps {
  errMessage: string;
}

const ErrorPage: React.FC<ErrorPageProps> = (props) => {
  return (
    <div className={classes.wrapper}>
      {props.errMessage} <p>Error Page</p>
    </div>
  );
};

export default ErrorPage;

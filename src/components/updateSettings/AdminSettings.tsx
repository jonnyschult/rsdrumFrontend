import React, { useState, useEffect, useCallback, useRef } from 'react';
import classes from './AdminSettings.module.scss';
import ErrorPage from '../ErrorPage/ErrorPage';
import Package from './Package';
import CreatePackage from './CreatePackage';
import PaymentHistoryModal from './payment/PaymentHistoryModal';
import { UserInfo, User, PackageOption } from '../../models';
import { Spinner } from 'reactstrap';
import { getter, deleter, expander } from '../../utilities';

interface AssignmentEditorProps {
  userInfo: UserInfo; 
}

const AssignmentEditor: React.FC<AssignmentEditorProps> = (props) => {
  let token = props.userInfo.token;
  const [students, setStudents] = useState<User[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [loadingMain, setLoadingMain] = useState<boolean>(true);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const responseDivRef = useRef<HTMLDivElement>(null);

  const loadUpHandler = useCallback(async () => {
    try {
      const studentsData = await getter(token, 'users/getAllUsers');
      setStudents(studentsData.users.filter((user: User) => !user.admin));
      const packageData = await getter(token, 'payments/getPackages');
      setPackages(packageData.packages);
      setLoadingMain(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setErrMessage(error.response.data.message);
      } else {
        setErrMessage('Problem fetching your data. Please let site admin Know.');
      }
    }
  }, [token]);

  const deleteStudentHandler: (student: User) => void = async (student) => {
    const enteredEmail: string | null = prompt(
      `To confirm you wish to remove student account, please copy ${student.email} below.`
    )!;
    if (enteredEmail === null) {
      return;
    } else if (enteredEmail !== student.email) {
      setError('Emails did not match. User not removed.');
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setError('');
      }, 2400);
    } else {
      try {
        setLoading(true);
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, true);
        }
        const data = await deleter(token, `users/deleteUser/${student.id}`);
        setResponse(data.message);
        setTimeout(() => {
          setResponse('');
          loadUpHandler();
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
    }
  };

  useEffect(() => {
    loadUpHandler();
  }, [loadUpHandler]);

  if (isError) {
    return <ErrorPage errMessage={errMessage} />;
  } else if (loadingMain) {
    return (
      <div className={`${classes.loadingMain} ${classes.wrapper}`}>
        <Spinner className={classes.spinnerMain}></Spinner>
      </div>
    );
  } else {
    return (
      <div className={classes.wrapper}>
        <h3>Packages</h3>
        <div className={classes.packages}>
          <div className={classes.newPackage}>
            <CreatePackage userInfo={props.userInfo} packages={packages} setPackages={setPackages} />
          </div>
          <div className={classes.packagesContainer}>
            {packages.length > 0 ? (
              packages.map((packgageOption, index) => {
                return (
                  <Package
                    key={index}
                    packageOption={packgageOption}
                    userInfo={props.userInfo}
                    packages={packages}
                    setPackages={setPackages}
                  />
                );
              })
            ) : (
              <p>No prices set yet.</p>
            )}
          </div>
        </div>

        <div className={classes.students}>
          <h3>Students</h3>
          <div className={classes.studentsContainer}>
            {students.length > 0 ? (
              students.map((student, index) => {
                return (
                  <div className={classes.studentInfo} key={index}>
                    <h5>
                      {student.firstName} {student.lastName}
                    </h5>
                    <div className={`${classes.emailContainer} ${classes.info}`}>
                      <p>Email:</p>
                      <p>{student.email}</p>
                    </div>
                    <div className={`${classes.birdayContainer} ${classes.info}`}>
                      <p>Birthday:</p>
                      <p>
                        {`${new Date(student.DOB!).toString().substring(4, 15)} - ${Math.floor(
                          (+new Date() - new Date(student.DOB!).getTime()) / 3.15576e10
                        )}yo`}
                      </p>
                    </div>
                    <div className={`${classes.dateContainer} ${classes.info}`}>
                      <p>Student Since:</p>
                      <p>{new Date(+student.createdAt!).toString().substring(4, 15)}</p>
                    </div>
                    <div className={classes.buttonsContainer}>
                      <div className={classes.paymentHistoryModalContainer}>
                        <PaymentHistoryModal userInfo={props.userInfo} userId={student.id!} />
                      </div>
                      <button className={classes.deleteButton} onClick={(e) => deleteStudentHandler(student)}>
                        Delete User
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <div className={classes.responseDiv} ref={responseDivRef}>
            {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
            {response ? <p className={classes.alert}>{response}</p> : <></>}
            {error ? <p className={classes.alert}>{error}</p> : <></>}
          </div>
        </div>
      </div>
    );
  }
};

export default AssignmentEditor;

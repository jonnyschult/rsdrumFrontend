import React, { useState, useEffect, useRef } from 'react';
import classes from './LessonEditor.module.scss';
import LessonUpdater from './LessonUpdater';
import AssignLesson from './AssignLesson';
import ErrorPage from '../ErrorPage/ErrorPage';
import { Lesson, UserInfo, User } from '../../models';
import { useHistory } from 'react-router-dom';
import { Spinner, Modal } from 'reactstrap';
import { getter, deleter, expander } from '../../utilities';
import AssignmentAdder from './AssignmentAdder';

interface LessonEditorProps {
  userInfo: UserInfo;
  lesson: Lesson;
  lessonsSetter: (updatedLesson: Lesson) => void;
}

const LessonEditor: React.FC<LessonEditorProps> = (props) => {
  let token = props.userInfo.token;
  let history = useHistory();
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [loadingMain, setLoadingMain] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [modal, setModal] = useState(false);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const toggle = () => setModal(!modal);

  const deleteLessonHandler = async () => {
    const confirmation = window.confirm('Are you sure?');
    if (confirmation) {
      setLoading(true);
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      try {
        const results = await deleter(token, `lessons/deleteLesson/${props.lesson.id}`);
        setResponse(results.message);
        setTimeout(() => {
          setResponse('');
          history.push('/lessons');
          toggle();
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
          setError('There was a problem deleting this lesson.');
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
    const studentLessonRelationGetter = async () => {
      try {
        const studentsData = await getter(token, 'users/getAllUsers', 'student=true');
        setAllStudents(studentsData.users);
      } catch (error: any) {
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
      } finally {
        setLoadingMain(false);
      }
    };
    studentLessonRelationGetter();
  }, [props.lesson, token]);

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
        <button className={classes.modalToggler} onClick={toggle}>
          &#x270E;
        </button>
        <Modal
          isOpen={modal}
          toggle={toggle}
          className={classes.modal}
          contentClassName={classes.modalContent}
        >
          {loadingMain ? (
            <div className={classes.loadingMain}>
              <Spinner className={classes.spinnerMain}></Spinner>
            </div>
          ) : (
            <>
              <p className={classes.exit} onClick={toggle}>
                &#10006;
              </p>
              <h3 className={classes.title}>Lesson Editor</h3>
              <hr />
              <LessonUpdater
                userInfo={props.userInfo}
                lesson={props.lesson}
                lessonsSetter={props.lessonsSetter}
              />
              <hr />
              <AssignmentAdder
                userInfo={props.userInfo}
                lesson={props.lesson}
                lessonsSetter={props.lessonsSetter}
              />

              <hr />

              <AssignLesson
                userInfo={props.userInfo}
                lesson={props.lesson}
                allStudents={allStudents}
                lessonsSetter={props.lessonsSetter}
              />

              <hr />
              <button className={classes.deleteBtn} onClick={(e) => deleteLessonHandler()}>
                Delete lesson?{' '}
              </button>
              <div className={classes.responseDiv} ref={responseDivRef}>
                {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
                {error ? <p className={classes.alert}>{error}</p> : <></>}
                {response ? <p className={classes.alert}>{response}</p> : <></>}
              </div>
            </>
          )}
        </Modal>
      </div>
    );
  }
};

export default LessonEditor;

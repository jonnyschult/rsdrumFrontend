import React, { useState, useRef } from 'react';
import classes from './AssignLesson.module.scss';
import { Lesson, UserInfo, User } from '../../models';
import { Spinner } from 'reactstrap';
import { Spiral as Hamburger } from 'hamburger-react';
import { expander, updater } from '../../utilities/';

interface AssignLessonProps {
  userInfo: UserInfo;
  lesson: Lesson;
  allStudents: User[];
  lessonsSetter: (updatedLesson: Lesson) => void;
}

const AssignLesson: React.FC<AssignLessonProps> = (props) => {
  let token = props.userInfo.token;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean[]>(props.allStudents.map(() => false));
  const [error, setError] = useState<string>('');
  const studentsContainerRef = useRef<HTMLDivElement>(null);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const addStudent = async (student: User, index: number) => {
    setLoading(
      loading.map((bool, i) => {
        if (i === index) {
          return true;
        } else {
          return bool;
        }
      })
    );
    try {
      const info: User = student;
      const data = await updater(token, 'lessons/addStudent', info, `${props.lesson.id}`);
      props.lesson.students = data.updatedStudents;
      props.lessonsSetter(props.lesson);
    } catch (error) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Problem assigning lesson. Please let site admin Know.');
      }
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setError('');
      }, 2500);
    } finally {
      setLoading(
        loading.map((bool, i) => {
          if (i === index) {
            return false;
          } else {
            return bool;
          }
        })
      );
    }
  };

  const removeStudent = async (studentId: string, index: number) => {
    setLoading(
      loading.map((bool, i) => {
        if (i === index) {
          return true;
        } else {
          return bool;
        }
      })
    );
    try {
      const data = await updater(token, 'lessons/removeStudent', { id: studentId }, `${props.lesson.id}`);
      props.lesson.students = data.updatedStudents;
      props.lessonsSetter(props.lesson);
    } catch (error) {
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError("Problem removing student's assignment. Please let site admin Know.");
      }
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setError('');
      }, 2500);
    } finally {
      setLoading(
        loading.map((bool, i) => {
          if (i === index) {
            return false;
          } else {
            return bool;
          }
        })
      );
    }
  };

  return (
    <div className={classes.wrapper}>
      <h4>Assign Lesson</h4>
      <div className={classes.studentsContainer} ref={studentsContainerRef}>
        {props.allStudents.length > 0 ? (
          props.allStudents.map((student, index) => {
            return (
              <div className={classes.studentInfo} key={index}>
                <p>{student.firstName}</p>
                {loading[index] ? (
                  <Spinner className={classes.spinner}></Spinner>
                ) : props.lesson.students.map((student) => student.id).includes(student.id!) ? (
                  <p>
                    &#10003;{'  '}
                    <span className={classes.assigner} onClick={(e) => removeStudent(student.id!, index)}>
                      Remove
                    </span>
                  </p>
                ) : (
                  <p className={classes.assigner} onClick={(e) => addStudent(student!, index)}>
                    Add
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p>No students to add. Get some more students!</p>
        )}
      </div>
      <div className={classes.responseDiv} ref={responseDivRef}>
        {error ? <p className={classes.alert}>{error}</p> : <></>}
      </div>
      <div className={classes.burgerContainer}>
        <Hamburger
          toggled={isOpen}
          toggle={(e) => {
            expander(
              studentsContainerRef.current!,
              !isOpen,
              `${studentsContainerRef.current?.scrollHeight}px`
            );
            setIsOpen(!isOpen);
          }}
          color="#f8f7e7"
        />
      </div>
    </div>
  );
};

export default AssignLesson;

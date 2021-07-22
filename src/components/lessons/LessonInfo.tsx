import React, { useEffect, useState } from 'react';
import classes from './LessonInfo.module.scss';
import { useParams } from 'react-router-dom';
import AssignmentInfo from './AssignmentInfo';
import LessonEditor from './LessonEditor';
import AdminComments from './AdminComments';
import Comments from '../lessons/Comments';
import { UserInfo, Lesson } from '../../models';
import { convertCompilerOptionsFromJson } from 'typescript';

interface LessonProps {
  userInfo: UserInfo;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
}

interface ParamTypes {
  id: string;
}

const LessonInfo: React.FC<LessonProps> = (props) => {
  let params = useParams<ParamTypes>();

  const [lesson, setLesson] = useState<Lesson>({
    id: params.id,
    lessonNumber: 0,
    description: '',
    title: '',
    coverImg: '',
    lessonLevel: 0,
    students: [],
    assignments: [],
    comments: [],
  });

  //updates current lesson displayed and the lessons array when assignment is updated.
  const lessonsSetter = (updatedLesson: Lesson) => {
    setLesson(updatedLesson);
    const updatedLessons = props.lessons.map((lessonItem) => {
      if (lessonItem.id === updatedLesson.id) {
        return updatedLesson;
      } else {
        return lessonItem;
      }
    });

    props.setLessons(updatedLessons);
  };

  useEffect(() => {
    if (props.lessons.length > 0) {
      setLesson(props.lessons.filter((lesson) => lesson.id === params.id)[0]);
    }
    console.log(lesson, props.lessons);
  }, [props.lessons, params.id]);

  return (
    <div className={classes.wrapper}>
      <section className={classes.lessonInfo}>
        <h1>{lesson.title}</h1>
        <p className={classes.description}>{lesson.description}</p>
      </section>
      <section className={classes.assignmentsContainer}>
        {lesson.assignments.map((assignment, index) => {
          return (
            <AssignmentInfo
              key={index}
              userInfo={props.userInfo}
              assignment={assignment}
              lesson={lesson}
              lessonsSetter={lessonsSetter}
            />
          );
        })}
      </section>
      {props.userInfo.user.admin ? (
        <section className={classes.adminContainer}>
          <AdminComments userInfo={props.userInfo} lesson={lesson} lessonsSetter={lessonsSetter} />
          <LessonEditor userInfo={props.userInfo} lesson={lesson} lessonsSetter={lessonsSetter} />
        </section>
      ) : (
        <div className={classes.comments}>
          <hr />
          <h3>Comments</h3>
          <Comments userInfo={props.userInfo} lesson={lesson} lessonsSetter={lessonsSetter} />{' '}
        </div>
      )}
    </div>
  );
};

export default LessonInfo;

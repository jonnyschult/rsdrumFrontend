import React, { useRef, useState, useEffect, useCallback } from 'react';
import classes from './AssignmentInfo.module.scss';
import AssignmentEditor from './AssignmentEditor';
import AssignmentImg from './AssignmentImgModal';
import { Spiral as Hamburger } from 'hamburger-react';
import { UserInfo, Lesson, Assignment } from '../../models';
import { expander } from '../../utilities';

interface AssignmentProps {
  userInfo: UserInfo;
  lesson: Lesson;
  assignment: Assignment;
  lessonsSetter: (updatedLesson: Lesson) => void;
}

const LessonInfo: React.FC<AssignmentProps> = (props) => {
  const assignment = props.assignment;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const descriptionContainerRef = useRef<HTMLDivElement>(null);

  const resizeHandler = useCallback(() => {
    if (descriptionContainerRef.current !== null && isOpen) {
      expander(descriptionContainerRef.current, isOpen, `${descriptionContainerRef.current.scrollHeight}px`);
    }
  }, [descriptionContainerRef, isOpen]);

  window.addEventListener('resize', resizeHandler);

  useEffect(() => {
    resizeHandler();
  }, [resizeHandler, assignment]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.assignmentInfo}>
        <h5>{assignment.title}</h5>
        <div className={classes.imgContainer}>
          <AssignmentImg assignment={assignment} />
        </div>
        <div className={classes.descriptionContainer} ref={descriptionContainerRef}>
          <p className={classes.description}>{assignment.description}</p>
          {assignment.url ? (
            <div className={classes.linkContainer}>
              <h5>Link </h5>
              <a href={assignment.url!} target="blank">
                {assignment.linkName ? assignment.linkName : assignment.url}
              </a>
            </div>
          ) : (
            <></>
          )}
          {props.userInfo.user.admin ? (
            <AssignmentEditor
              userInfo={props.userInfo}
              lesson={props.lesson}
              assignment={assignment}
              lessonsSetter={props.lessonsSetter}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={classes.burgerContainer}>
        <p>{isOpen ? '' : 'More Info'}</p>
        <Hamburger
          toggled={isOpen}
          toggle={(e) => {
            expander(
              descriptionContainerRef.current!,
              !isOpen,
              `${descriptionContainerRef.current?.scrollHeight}px`
            );
            setIsOpen(!isOpen);
          }}
          color="#f8f7e7"
        />
      </div>
    </div>
  );
};

export default LessonInfo;

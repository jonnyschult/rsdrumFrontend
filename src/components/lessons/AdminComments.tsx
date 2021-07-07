import React, { useState, useEffect, useRef } from 'react';
import classes from './AdminComments.module.scss';
import Comments from './Comments';
import { UserInfo, Lesson } from '../../models';
import { expander } from '../../utilities';

interface LessonProps {
  userInfo: UserInfo;
  lesson: Lesson;
  lessonsSetter: (updatedLesson: Lesson) => void;
}

const AdminComments: React.FC<LessonProps> = (props) => {
  const students = props.lesson.students;
  const [studentId, setStudentId] = useState<string | null>();
  const [expandable, setExpandable] = useState<boolean>(false);
  const [tagsContainerOpen, setTagsContainerOpen] = useState<boolean>(false);
  const [fader, setFader] = useState<boolean>(false);
  const studentsContainerRef = useRef<HTMLDivElement>(null);

  const resizeHandler = () => {
    if (studentsContainerRef.current !== null) {
      if (studentsContainerRef.current.scrollHeight > 128) {
        setExpandable(true);
      } else {
        setExpandable(false);
      }
    }
  };

  window.addEventListener('resize', resizeHandler);

  useEffect(() => {
    if (studentsContainerRef.current !== null) {
      if (studentsContainerRef.current.scrollHeight > 128) {
        setExpandable(true);
      }
    }
  }, [studentsContainerRef]);

  return (
    <div className={classes.wrapper}>
      <section className={classes.students}>
        <div className={classes.studentsContainer} ref={studentsContainerRef}>
          {students.length > 0 ? (
            students.map((student, index) => {
              return (
                <div key={index} className={classes.studentInfo}>
                  <p
                    className={classes.studentTag}
                    onClick={(e) => {
                      setStudentId(student.id);
                      setFader(true);
                      setTimeout(() => {
                        setFader(false);
                      }, 300);
                    }}
                  >
                    {student.firstName}
                  </p>
                  {props.lesson.comments.filter(
                    (comment) => comment.userId === student.id && comment.read === false
                  ).length > 0 ? (
                    <p className={classes.unreadNotice}>&#8226;</p>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })
          ) : (
            <p>No students have been assigned to this lesson</p>
          )}
        </div>
        {expandable ? (
          <p
            className={classes.studentsExpander}
            onClick={(e) => {
              expander(
                studentsContainerRef.current!,
                !tagsContainerOpen,
                `${studentsContainerRef.current!.scrollHeight}px`,
                '8em'
              );
              setTagsContainerOpen(!tagsContainerOpen);
            }}
          >
            {tagsContainerOpen ? 'Show Less' : 'Show More'}
          </p>
        ) : (
          <></>
        )}
      </section>
      <hr />
      {studentId ? (
        <div className={classes.commentsContainer}>
          <h3>Comments</h3>
          <div className={fader ? classes.fadeIn : classes.comments}>
            <Comments
              userInfo={props.userInfo}
              lesson={props.lesson}
              studentId={studentId}
              lessonsSetter={props.lessonsSetter}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminComments;

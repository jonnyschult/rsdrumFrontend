import React, { useState } from 'react';
import classes from './LessonOption.module.scss';
import { Lesson, UserInfo } from '../../models';
import { Spinner } from 'reactstrap';

interface LessonsLandingProps {
  userInfo: UserInfo;
  lesson: Lesson;
  selectionHandler: (id: string) => void;
}

const LessonsLanding: React.FC<LessonsLandingProps> = (props) => {
  const lesson = props.lesson;
  const [imgLoaded, setImgLoaded] = useState<boolean>();

  return (
    <div className={classes.lesson}>
      <div className={classes.linkDiv} onClick={(e) => props.selectionHandler(lesson.id!)}>
        <h5 className={imgLoaded ? classes.linkItem : classes.hidden}>Lesson {lesson.lessonNumber}</h5>
        <h6 className={imgLoaded ? classes.linkItem : classes.hidden}>{lesson.title}</h6>
        {imgLoaded ? <></> : <Spinner className={classes.spinner}></Spinner>}
        <img
          className={classes.lessonImg}
          src={lesson.coverImg}
          alt=""
          onLoad={(e) =>
            setTimeout(() => {
              setImgLoaded(true);
            }, 700)
          }
        />
      </div>
    </div>
  );
};

export default LessonsLanding;

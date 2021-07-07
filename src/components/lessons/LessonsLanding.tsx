import React, { useState, useEffect } from 'react';
import classes from './LessonsLanding.module.scss';
import LessonAdder from './LessonAdder';
import LessonOption from './LessonOption';
import LessonsAds from './LessonsAds';
import { Lesson, UserInfo } from '../../models';
import { useHistory } from 'react-router-dom';

interface LessonsLandingProps {
  userInfo: UserInfo;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
}

const LessonsLanding: React.FC<LessonsLandingProps> = (props) => {
  const history = useHistory();
  const user = props.userInfo.user;
  const [levels, setLevels] = useState<number[]>([]);

  useEffect(() => {
    const lessonLevels: number[] = props.lessons.map((lesson: Lesson) => lesson.lessonLevel);
    const uniqueLevels = Array.from(new Set(lessonLevels));
    setLevels(uniqueLevels.sort((numA, numB) => numA - numB));
  }, [props.lessons]);

  const selectionHandler = (id: string) => {
    history.push(`/lessons/${id}`);
  };

  if (props.userInfo.loggedIn) {
    return (
      <div className={classes.wrapper}>
        <h1>Lessons</h1>
        <div className={classes.levelsContainer}>
          {levels.length > 0 ? (
            levels.map((level, levelIndex) => {
              return (
                <div className={classes.level} key={levelIndex}>
                  <h3>{`Level ${level}`}</h3>
                  <div className={classes.lessonsContainer}>
                    {props.lessons
                      .filter((lesson) => lesson.lessonLevel === level)
                      .map((lesson, lessonIndex) => {
                        return (
                          <LessonOption
                            key={lessonIndex}
                            userInfo={props.userInfo}
                            lesson={lesson}
                            selectionHandler={selectionHandler}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })
          ) : props.userInfo.user.admin ? (
            <h4>Use the Modal at the bottom right part of the page to add lessons</h4>
          ) : (
            <h4>You haven't been assigned any lessons yet. </h4>
          )}
        </div>
        {user.admin ? (
          <LessonAdder userInfo={props.userInfo} setLessons={props.setLessons} lessons={props.lessons} />
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return <LessonsAds />;
  }
};

export default LessonsLanding;

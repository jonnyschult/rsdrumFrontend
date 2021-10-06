import React, { useState, FormEvent, ChangeEvent, useRef } from 'react';
import classes from './LessonUpdater.module.scss';
import { storage } from '../../firebase';
import { UserInfo, Lesson } from '../../models';
import { Spinner } from 'reactstrap';
import { Spiral as Hamburger } from 'hamburger-react';
import { dynamicPropertyRemover, updater, checkIsNumber, expander } from '../../utilities';

interface LessonProps {
  userInfo: UserInfo;
  lesson: Lesson;
  lessonsSetter: (updatedLesson: Lesson) => void;
}

const LessonUpdater: React.FC<LessonProps> = (props) => {
  let token = props.userInfo.token;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [lessonNum, setLessonNum] = useState<number | null>(null);
  const [lessonLevel, setLessonLevel] = useState<number | null>(null);
  const [lessonImgFile, setLessonImgFile] = useState<File | null>(null);
  const [lessonImgUrl, setLessonImgUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [updateLesson, setUpdateLesson] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const toggle = () => setUpdateLesson(!updateLesson);

  const updateLessonHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    const compiledObj = {
      id: props.lesson.id,
      title: title,
      description: description,
      lessonNumber: lessonNum!,
      coverImg: lessonImgUrl,
      lessonLevel: lessonLevel!,
    };
    //ensures only updated data is being sent throught the network by stripping properties holding null as their value.
    const info = dynamicPropertyRemover(compiledObj);
    console.log(info);
    try {
      const data = await updater(token, `lessons/updateLesson`, info, `${props.lesson.id}`);
      setResponse(data.message);
      setTimeout(() => {
        props.lessonsSetter(data.updatedLesson);
        setResponse('');
        setProgress(0);
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
        setError('Problem updating lesson. Please let site admin Know.');
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

  //Gets file to save to firebase storage
  const setImageFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setLessonImgFile(e.target.files![0]);
    }
  };

  //Saves files to firebase and returns url to save to app databse
  const createImgUrl = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log('process starting');
    try {
      //   const urlString = await imageSaver(lessonImgFile!);
      const uploadTask = storage.ref(`lessonImgs/${lessonImgFile!.name}`).put(lessonImgFile!);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);
        },
        (error) => {
          throw error;
        },
        () => {
          storage
            .ref('lessonImgs')
            .child(lessonImgFile!.name)
            .getDownloadURL()
            .then((url) => {
              setLessonImgUrl(url);
            });
        }
      );
    } catch (error: any) {
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
      setLoading(false);
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setError('');
      }, 2400);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h4>Update Lesson</h4>
      <div className={classes.formContainer} ref={formContainerRef}>
        <form className={classes.form} onSubmit={(e) => updateLessonHandler(e)}>
          <div className={classes.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={props.lesson.title}
              placeholder="Drumming 101"
              onChange={(e) => setTitle(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              defaultValue={props.lesson.description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="lesson level">Lesson Level</label>
            <input
              required
              type="text"
              name="lesson level"
              defaultValue={props.lesson.lessonLevel}
              onChange={(e) => setLessonLevel(+e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="lessonNumber">Lesson Number</label>
            <input
              type="text"
              name="lessonNumber"
              defaultValue={props.lesson.lessonNumber}
              onChange={(e) => {
                checkIsNumber(e, responseDivRef.current!, setLessonNum, setError);
              }}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label className={classes.fileInputLabel} htmlFor="file-upload">
              Select Image for Lesson
            </label>
            <input id="file-upload" type="file" name="img" onChange={(e) => setImageFileHandler(e)}></input>
            <div className={classes.fileContainer}>
              <p className={classes.fileName}>{lessonImgFile ? lessonImgFile.name : ''}</p>
              <p
                className={classes.fileDeleter}
                onClick={(e) => {
                  setLessonImgFile(null);
                  setLessonImgUrl('');
                  setProgress(0);
                }}
              >
                {lessonImgFile ? <>&#10006;</> : ''}
              </p>
            </div>
            <button
              className={classes.uploadBtn}
              onClick={(e) => createImgUrl(e)}
              disabled={lessonImgFile ? false : true}
            >
              Save Image
            </button>
            <p className={classes.progressTracker}>
              {progress === 100 && lessonImgFile ? (
                <>&#10003;</>
              ) : progress > 0 && lessonImgFile ? (
                `${progress}%`
              ) : (
                ''
              )}
            </p>{' '}
          </div>
          <button
            className={classes.submitButton}
            type="submit"
            disabled={
              (progress > 0 && progress < 100) || (lessonImgFile !== null && lessonImgUrl === null)
                ? true
                : false
            }
          >
            Submit
          </button>
        </form>
      </div>
      <div className={classes.responseDiv} ref={responseDivRef}>
        {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
        {error ? <p className={classes.alert}>{error}</p> : <></>}
        {response ? <p className={classes.alert}>{response}</p> : <></>}
      </div>

      <div className={classes.burgerContainer}>
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
  );
};

export default LessonUpdater;

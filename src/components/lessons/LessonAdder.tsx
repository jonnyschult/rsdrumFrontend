import React, { useState, FormEvent, useRef, ChangeEvent } from 'react';
import classes from './LessonAdder.module.scss';
import { storage } from '../../firebase';
import { UserInfo, Lesson } from '../../models';
import { Spinner, Modal } from 'reactstrap';
import { poster, checkIsNumber, expander } from '../../utilities/';

interface LessonProps {
  userInfo: UserInfo;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
}

const LessonAdder: React.FC<LessonProps> = (props) => {
  let token = props.userInfo.token;
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [lessonNum, setLessonNum] = useState<number | null>(null);
  const [lessonLevel, setLessonLevel] = useState<number>();
  const [lessonImgFile, setLessonImgFile] = useState<File | null>(null);
  const [lessonImgUrl, setLessonImgUrl] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [modal, setModal] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement)[]>([]);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setModal(!modal);
    setLessonImgFile(null);
    console.log(lessonImgUrl);
  };

  const addLessonHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const info: Lesson = {
        title,
        description,
        lessonNumber: lessonNum!,
        coverImg: lessonImgUrl,
        lessonLevel: lessonLevel!,
        assignments: [],
        students: [],
        comments: [],
      };
      const data = await poster(token, 'lessons/createLesson', info);
      setResponse(data.message);
      setTitle('');
      setDescription('');
      setLessonNum(null);
      setLessonImgUrl('');
      setProgress(0);
      setTimeout(() => {
        inputRefs.current.forEach((el) => (el.value = ''));
        props.setLessons([...props.lessons, data.newLesson]);
        setResponse('');
        toggle();
      }, 2500);
    } catch (error: any) {
      console.log(error);
      if (error.response !== undefined) {
        setError(error.response.data.message);
      } else {
        setError('Propblem fetching your data. Please let site admin Know.');
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
        setError('');
      }, 2200);
    }
  };

  const setImageFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setLessonImgFile(e.target.files![0]);
    }
  };

  const createImgUrl = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setProgress(1);
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
        setError('Problem with firebase upload. Please let site admin know');
      }
      setLoading(false);
      expander(responseDivRef.current!, true);
      setTimeout(() => {
        expander(responseDivRef.current!, false);
        setError('');
      }, 2400);
    }
  };

  return (
    <div className={classes.wrapper}>
      <button className={classes.modalToggler} onClick={toggle}>
        +
      </button>
      <Modal isOpen={modal} toggle={toggle} className={classes.modal} contentClassName={classes.modalContent}>
        <p className={classes.exit} onClick={toggle}>
          &#10006;
        </p>
        <h3 className={classes.title}>Add Lesson</h3>
        <hr />
        <section className={classes.formContainer}>
          <form className={classes.form} onSubmit={(e) => addLessonHandler(e)}>
            <div className={classes.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                required
                ref={(el: HTMLInputElement) => (inputRefs.current[0] = el!)}
                type="text"
                name="title"
                placeholder="Drumming 101"
                onChange={(e) => setTitle(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                required
                ref={(el: HTMLTextAreaElement) => (inputRefs.current[1] = el!)}
                name="description"
                onChange={(e) => setDescription(e.target.value.trim())}
              ></textarea>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="lesson level">Lesson Level</label>
              <input
                required
                ref={(el: HTMLInputElement) => (inputRefs.current[2] = el!)}
                type="text"
                name="lesson level"
                onChange={(e) => setLessonLevel(+e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="lessonNumber">Lesson Number</label>
              <input
                ref={(el: HTMLInputElement) => (inputRefs.current[3] = el!)}
                type="text"
                name="lessonNumber"
                onChange={(e) => {
                  checkIsNumber(e, responseDivRef.current!, setLessonNum, setError);
                }}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label className={classes.fileInputLabel} htmlFor="file-upload">
                Select Cover Image
              </label>
              <input
                id="file-upload"
                required
                type="file"
                name="file-upload"
                ref={(el: HTMLInputElement) => (inputRefs.current[4] = el!)}
                onChange={(e) => setImageFileHandler(e)}
              ></input>
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
                  {lessonImgUrl ? <>&#10006;</> : ''}
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
              disabled={lessonImgUrl.length < 1 || lessonNum === null ? true : false}
            >
              Submit
            </button>
          </form>
          <div className={classes.responseDiv} ref={responseDivRef}>
            {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
            {error ? <p className={classes.alert}>{error}</p> : <></>}
            {response ? <p className={classes.alert}>{response}</p> : <></>}
          </div>
        </section>
      </Modal>
    </div>
  );
};

export default LessonAdder;

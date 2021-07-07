import React, { useState, FormEvent, ChangeEvent, useRef } from 'react';
import classes from './AssignmentUpdater.module.scss';
import { storage } from '../../firebase';
import { UserInfo, Assignment, Lesson } from '../../models';
import { Spinner } from 'reactstrap';
import { Spiral as Hamburger } from 'hamburger-react';
import { updater, expander, checkIsNumber, dynamicPropertyRemover } from '../../utilities';

interface AssignmentUpdaterProps {
  userInfo: UserInfo;
  assignment: Assignment;
  lesson: Lesson;
  lessonsSetter: (updatedLesson: Lesson) => void;
}

const AssignmentUpdater: React.FC<AssignmentUpdaterProps> = (props) => {
  let token = props.userInfo.token;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [assignmentNum, setAssignmentNum] = useState<number | null>(null);
  const [primaryImgFile, setPrimaryImgFile] = useState<File | null>(null);
  const [primaryImgUrl, setPrimaryImgUrl] = useState<string | null>(null);
  const [auxImgFile, setAuxImgFile] = useState<File | null>(null);
  const [primaryProgress, setPrimaryProgress] = useState<number>(0);
  const [auxProgress, setAuxProgress] = useState<number>(0);
  const [auxImgUrl, setAuxImgUrl] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [linkName, setLinkName] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [updateAssignment, setUpdateAssignment] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const toggle = () => setUpdateAssignment(!updateAssignment);

  const updateAssignmentHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const compiledObj = {
        id: props.assignment.id,
        title: title,
        description: description,
        assignmentNumber: assignmentNum!,
        primaryImg: primaryImgUrl,
        auxImg: auxImgUrl,
        url: url,
        linkName: linkName,
      };
      const info = dynamicPropertyRemover(compiledObj);
      const data = await updater(token, `lessons/updateAssignment`, info, `${props.lesson.id}`);
      props.lesson.assignments = data.updatedAssignments;
      props.lessonsSetter(props.lesson);
      setResponse(data.message);
      setTimeout(() => {
        setResponse('');
        setProgress(0);
        toggle();
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
        setError('Problem updating assignment. Please let site admin Know.');
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

  //sets file in state to be saved on firebase
  //sets a file to be passed to firebase storage
  const setPrimaryImageFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setPrimaryImgFile(e.target.files![0]);
    }
  };

  //sets a file to be passed to firebase storage
  const setAuxImageFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAuxImgFile(e.target.files![0]);
    }
  };

  //saves image to firebase and returns the url to be stored on app database.
  const createImgUrl = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imgFile: File,
    urlSetter:
      | React.Dispatch<React.SetStateAction<string>>
      | React.Dispatch<React.SetStateAction<string | null>>,
    progressSetter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    e.preventDefault();
    console.log('process starting');
    try {
      //   const urlString = await imageSaver(primaryImgFile!);
      const uploadTask = storage.ref(`lessonImgs/${imgFile!.name}`).put(imgFile!);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          progressSetter(progress);
        },
        (error) => {
          throw error;
        },
        () => {
          storage
            .ref('lessonImgs')
            .child(imgFile!.name)
            .getDownloadURL()
            .then((url) => {
              urlSetter(url);
            });
        }
      );
    } catch (error) {
      console.log(error);
      setError('Problem uploading you image. Try again in a few minutes.');
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setError('');
      }, 2500);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h4>Update Assignment</h4>
      <div className={classes.formContainer} ref={formContainerRef}>
        <form className={classes.form} onSubmit={(e) => updateAssignmentHandler(e)}>
          <div className={classes.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={props.assignment.title}
              placeholder="Paradiddle"
              onChange={(e) => setTitle(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              defaultValue={props.assignment.description}
              onChange={(e) => setDescription(e.target.value.trim())}
            ></textarea>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="link name">Link Name*</label>
            <input
              type="text"
              name="link name"
              defaultValue={props.assignment.linkName ? props.assignment.linkName : ''}
              onChange={(e) => setLinkName(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="url">Url</label>
            <input
              type="text"
              name="url"
              defaultValue={props.assignment.url ? props.assignment.url : ''}
              onChange={(e) => setUrl(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="assignmentNum">Assignment Number</label>
            <input
              type="text"
              name="assignmentNum"
              defaultValue={props.assignment.assignmentNumber}
              onChange={(e) => {
                checkIsNumber(e, responseDivRef.current!, setAssignmentNum, setError);
              }}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label className={classes.fileInputLabel} htmlFor="primaryUpload">
              Select Image
            </label>
            <input
              id="primaryUpload"
              type="file"
              name="img"
              onChange={(e) => setPrimaryImageFileHandler(e)}
            ></input>
            <div className={classes.fileContainer}>
              <p className={classes.fileName}>{primaryImgFile ? primaryImgFile.name : ''}</p>
              <p
                className={classes.fileDeleter}
                onClick={(e) => {
                  setPrimaryImgFile(null);
                  setPrimaryImgUrl('');
                  setPrimaryProgress(0);
                }}
              >
                {primaryImgFile ? <>&#10006;</> : ''}
              </p>
            </div>
            <button
              className={classes.uploadBtn}
              onClick={(e) => createImgUrl(e, primaryImgFile!, setPrimaryImgUrl, setPrimaryProgress)}
              disabled={primaryImgFile ? false : true}
            >
              Save Image
            </button>
            <p className={classes.progressTracker}>
              {primaryProgress === 100 && primaryImgFile ? (
                <>&#10003;</>
              ) : primaryProgress > 0 && primaryImgFile ? (
                `${primaryProgress}%`
              ) : (
                ''
              )}
            </p>
          </div>
          <div className={classes.formGroup}>
            <label className={classes.fileInputLabel} htmlFor="auxImgUpload">
              Second Image *
            </label>
            <input
              id="auxImgUpload"
              type="file"
              name="auxImgUpload"
              onChange={(e) => setAuxImageFileHandler(e)}
            ></input>
            <div className={classes.fileContainer}>
              <p className={classes.fileName}>{auxImgFile ? auxImgFile.name : ''}</p>
              <p
                className={classes.fileDeleter}
                onClick={(e) => {
                  setAuxImgFile(null);
                  setAuxImgUrl('');
                  setAuxProgress(0);
                }}
              >
                {auxImgFile ? <>&#10006;</> : ''}
              </p>
            </div>
            <button
              className={classes.uploadBtn}
              onClick={(e) => createImgUrl(e, auxImgFile!, setAuxImgUrl, setAuxProgress)}
              disabled={auxImgFile ? false : true}
            >
              Save Image
            </button>
            <p className={classes.progressTracker}>
              {auxProgress === 100 && auxImgFile ? (
                <>&#10003;</>
              ) : auxProgress > 0 && auxImgFile ? (
                `${auxProgress}%`
              ) : (
                ''
              )}
            </p>{' '}
            <button
              className={classes.submitButton}
              type="submit"
              disabled={
                (progress > 0 && progress < 100) ||
                (primaryImgFile !== null &&
                  primaryImgUrl === null &&
                  auxImgFile !== null &&
                  auxImgUrl === null)
                  ? true
                  : false
              }
            >
              Submit Update
            </button>
          </div>
        </form>
      </div>
      <div className={classes.responseDiv} ref={responseDivRef}>
        {' '}
        {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
        {error ? <p className={classes.alert}>{error}</p> : <></>}
        {response ? <p className={classes.alert}>{response}</p> : <></>}
      </div>

      <div className={classes.burgerContainer}>
        <Hamburger
          toggled={isOpen}
          toggle={(e) => {
            expander(formContainerRef.current!, !isOpen, `${formContainerRef.current!.scrollHeight}px`);
            setIsOpen(!isOpen);
          }}
          color="#f8f7e7"
        />
      </div>
    </div>
  );
};

export default AssignmentUpdater;

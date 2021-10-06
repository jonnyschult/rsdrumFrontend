import React, { useState, FormEvent, useRef, ChangeEvent } from 'react';
import classes from './AssignmentAdder.module.scss';
import { storage } from '../../firebase';
import { UserInfo, Assignment, Lesson } from '../../models';
import { Spinner } from 'reactstrap';
import { Spiral as Hamburger } from 'hamburger-react';
import { expander, checkIsNumber, updater } from '../../utilities';

interface AssignmentAdderProps {
  userInfo: UserInfo;
  lesson: Lesson;
  lessonsSetter: (updatedLesson: Lesson) => void;
}

const AssignmentAdder: React.FC<AssignmentAdderProps> = (props) => {
  let token = props.userInfo.token;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [assignmentNum, setAssignmentNum] = useState<number | null>(null);
  const [primaryImgFile, setPrimaryImgFile] = useState<File | null>(null);
  const [auxImgFile, setAuxImgFile] = useState<File | null>(null);
  const [primaryImgUrl, setPrimaryImgUrl] = useState<string>('');
  const [auxImgUrl, setAuxImgUrl] = useState<string | null>(null);
  const [primaryProgress, setPrimaryProgress] = useState<number>(0);
  const [auxProgress, setAuxProgress] = useState<number>(0);
  const [linkName, setLinkName] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [openAdder, setOpenAdder] = useState<boolean>(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const responseDivRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement)[]>([]);

  const toggle = () => setOpenAdder(!openAdder);

  const addAssignmentHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const info: Assignment = {
        title,
        description,
        assignmentNumber: assignmentNum!,
        primaryImg: primaryImgUrl,
        auxImg: auxImgUrl,
        linkName: linkName,
        url: url,
      };
      const data = await updater(token, 'lessons/addAssignment', info, `${props.lesson.id}`);
      setResponse(data.message);
      props.lesson.assignments = data.updatedAssignments;
      props.lessonsSetter(props.lesson);
      setTimeout(() => {
        inputRefs.current.forEach((el) => (el.value = ''));
        setResponse('');
        setTitle('');
        setDescription('');
        setAssignmentNum(null);
        setPrimaryImgUrl('');
        setPrimaryProgress(0);
        setAuxProgress(0);
        toggle();
      }, 2500);
    } catch (error: any) {
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Problem creating assignment. Please let site admin Know.');
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

  //sets a file to be passed to firebase storage
  const setPrimaryImageFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('Hello');
    if (e.target.files![0]) {
      setPrimaryImgFile(e.target.files![0]);
    }
  };

  //sets a file to be passed to firebase storage
  const setAuxImageFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
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
    progressSetter(1);
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
    } catch (error: any) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Problem fetching your data. Please let site admin Know.');
      }
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
        setError('');
      }, 2200);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h4>Add Assignment</h4>
      <div className={classes.formContainer} ref={formContainerRef}>
        <form className={classes.form} onSubmit={(e) => addAssignmentHandler(e)}>
          <div className={classes.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              required
              ref={(el: HTMLInputElement) => (inputRefs.current[0] = el!)}
              type="text"
              name="title"
              placeholder="Paradiddle"
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
            <label htmlFor="link name">Link Name *</label>
            <input
              type="text"
              ref={(el: HTMLInputElement) => (inputRefs.current[2] = el!)}
              name="link name"
              onChange={(e) => setLinkName(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="url">URL *</label>
            <input
              type="text"
              ref={(el: HTMLInputElement) => (inputRefs.current[3] = el!)}
              name="url"
              onChange={(e) => setUrl(e.target.value.trim())}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="assignmentNum">Assignment Number</label>
            <input
              required
              ref={(el: HTMLInputElement) => (inputRefs.current[4] = el!)}
              type="text"
              name="assignmentNum"
              onChange={(e) => {
                checkIsNumber(e, responseDivRef.current!, setAssignmentNum, setError);
              }}
            ></input>
          </div>
          <div className={classes.formGroup}>
            <label className={classes.fileInputLabel} htmlFor="primaryImgUpload">
              Select Image
            </label>
            <input
              id="primaryImgUpload"
              required
              type="file"
              ref={(el: HTMLInputElement) => (inputRefs.current[5] = el!)}
              name="primaryImgUpload"
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
              ref={(el: HTMLInputElement) => (inputRefs.current[6] = el!)}
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
            </p>
          </div>
          <button
            className={classes.submitButton}
            type="submit"
            disabled={primaryImgUrl.length > 1 ? false : true}
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

export default AssignmentAdder;

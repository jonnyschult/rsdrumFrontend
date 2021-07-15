import React, { useState, useRef } from 'react';
import classes from './AssignmentEditor.module.scss';
import AssignmentUpdater from './AssignmentUpdater';
import { UserInfo, Assignment, Lesson } from '../../models';
import { Spinner, Modal } from 'reactstrap';
import { expander, updater } from '../../utilities';

interface AssignmentEditorProps {
  userInfo: UserInfo;
  lesson: Lesson;
  assignment: Assignment;
  lessonsSetter: (updatedLesson: Lesson) => void;
}

const AssignmentEditor: React.FC<AssignmentEditorProps> = (props) => {
  let token = props.userInfo.token;
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [modal, setModal] = useState(false);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const toggle = () => setModal(!modal);

  const deleteAssignmentHandler = async (assignmentId: string) => {
    try {
      const confirmation = window.confirm('Are you sure?');
      if (confirmation) {
        setLoading(true);
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, true);
        }
        const info = { id: assignmentId };
        const data = await updater(token, 'lessons/removeAssignment', info, `${props.lesson.id}`);
        setResponse(data.message);
        setTimeout(() => {
          setResponse('');
          props.lesson.assignments = data.updatedAssignments;
          props.lessonsSetter(props.lesson);
        }, 2500);
      }
    } catch (error) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Problem deleting this assingment. Please let site admin know');
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

  return (
    <div>
      <button className={classes.modalToggler} onClick={toggle}>
        &#x270E;
      </button>
      <Modal isOpen={modal} toggle={toggle} className={classes.modal} contentClassName={classes.modalContent}>
        <p className={classes.exit} onClick={toggle}>
          &#10006;
        </p>
        <h3 className={classes.title}>Assignment Editor</h3>
        <hr />
        <AssignmentUpdater
          assignment={props.assignment}
          userInfo={props.userInfo}
          lessonsSetter={props.lessonsSetter}
          lesson={props.lesson}
        />
        <hr />
        <button className={classes.deleteBtn} onClick={(e) => deleteAssignmentHandler(props.assignment.id!)}>
          Delete
        </button>

        <div className={classes.responseDiv} ref={responseDivRef}>
          {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
          {error ? <p className={classes.alert}>{error}</p> : <></>}
          {response ? <p className={classes.alert}>{response}</p> : <></>}
        </div>
      </Modal>
    </div>
  );
};

export default AssignmentEditor;

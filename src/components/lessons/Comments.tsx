import React, { useState, useRef } from 'react';
import classes from './Comments.module.scss';
import { UserInfo, Comment, Lesson } from '../../models';
import { Spinner } from 'reactstrap';
import { updater, expander } from '../../utilities';

interface CommentProps {
  userInfo: UserInfo;
  lesson: Lesson;
  lessonsSetter: (updatedLesson: Lesson) => void;
  studentId?: string; //passed from AdminComments
}

const Comments: React.FC<CommentProps> = (props) => {
  const token = props.userInfo.token;
  const user = props.userInfo.user;
  const [commentText, setCommentText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const responseDivRef = useRef<HTMLDivElement>(null);

  //sets info to be passed to server based on whether user or admin is submitting comment.

  const submitCommentHandler = async () => {
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      const info: Comment = props.studentId
        ? {
            userId: props.studentId!,
            comment: commentText,
            read: false,
            firstName: props.userInfo.user.firstName!,
            response: true,
            createdAt: Date.now(),
          }
        : {
            userId: props.userInfo.user.id!,
            comment: commentText,
            read: false,
            firstName: props.userInfo.user.firstName!,
            response: false,
            createdAt: Date.now(),
          };
      const data = await updater(token, 'lessons/addComment', info, `${props.lesson.id}`);
      props.lesson.comments = data.updatedComments;
      props.lessonsSetter(props.lesson);
      inputRef.current!.value = '';
    } catch (error: any) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Unable to post comment. Please let site admin Know.');
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

  const deleteCommentHandler = async (comment: Comment) => {
    const confirm = window.confirm('Are you sure?');
    try {
      const info = {
        id: comment.id,
        userId: comment.userId,
      };
      if (confirm) {
        const data = await updater(token, 'lessons/removeComment', info, `${props.lesson.id}`);
        props.lesson.comments = data.updatedComments;
        props.lessonsSetter(props.lesson);
      }
    } catch (error: any) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Problem deleting comment. Please let site admin Know.');
      }
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

  const markAsRead = async (comment: Comment) => {
    if (!comment.read && ((comment.response && !user.admin) || (!comment.response && user.admin))) {
      try {
        const info = {
          id: comment.id,
          read: true,
        };
        const data = await updater(token, 'lessons/updateComment', info, `${props.lesson.id}`);
        props.lesson.comments = data.updatedComments;
        props.lessonsSetter(props.lesson);
      } catch (error: any) {
        console.log(error);
        if (
          error.response !== undefined &&
          error.response.data !== undefined &&
          error.response.data.message !== undefined
        ) {
          setError(error.response.data.message);
        } else {
          setError('Problem deleting comment. Please let site admin Know.');
        }
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
    }
  };

  const dateMaker = (date: number) => {
    let mmddyyyy = new Date(date).toDateString();
    let twentyFour = new Date(date).toString().substr(15, 6);
    let hhmm =
      +twentyFour.substr(0, 2) > 12
        ? `${(+twentyFour.substr(0, 2) - 12).toString()}${twentyFour.substr(2)} PM`
        : +twentyFour.substr(0, 2) === 12
        ? `${twentyFour} PM`
        : `${twentyFour} AM`;
    return `${mmddyyyy} at ${hhmm} `;
  };

  return (
    <div className={classes.wrapper}>
      <section className={classes.commentsContainer}>
        {props.lesson.comments.length > 0 ? (
          props.lesson.comments
            .sort(
              (a: Comment, b: Comment) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
            )
            .filter(
              (comment) => comment.userId === props.studentId || comment.userId === props.userInfo.user.id
            )
            .map((comment, index) => {
              return (
                <div
                  key={index}
                  className={
                    comment.response
                      ? `${classes.comment} ${classes.teacherComment}`
                      : `${classes.comment} ${classes.studentComment}`
                  }
                  onClick={(e) => markAsRead(comment)}
                >
                  {!comment.read ? <p className={classes.unreadNotice}>&#8226;</p> : <></>}
                  <p className={classes.commentText}>{comment.comment}</p>
                  <p className={classes.commentInfo}>
                    <span className={classes.commentAuthor}> {comment.firstName}</span>{' '}
                    <span className={classes.commentDate}>{dateMaker(comment.createdAt!)}</span>
                    {(comment.userId === user.id && !comment.response) || (user.admin && comment.response) ? (
                      <span className={classes.commentDeleter} onClick={(e) => deleteCommentHandler(comment)}>
                        delete
                      </span>
                    ) : (
                      <></>
                    )}
                  </p>
                </div>
              );
            })
        ) : (
          <h5>No Comments</h5>
        )}
      </section>
      <section className={classes.commentMakerContainer}>
        <label htmlFor="comment"></label>
        <textarea
          className={classes.commentTextArea}
          name="comment"
          placeholder="Write a comment..."
          ref={inputRef}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className={classes.submitButton} onClick={(e) => submitCommentHandler()}>
          Post
        </button>
        <div className={classes.responseDiv} ref={responseDivRef}>
          {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
          {error ? <p className={classes.alert}>{error}</p> : <></>}
        </div>
      </section>
    </div>
  );
};

export default Comments;

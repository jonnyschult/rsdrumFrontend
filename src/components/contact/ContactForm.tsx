import React, { FormEvent, useState, useRef, useEffect } from 'react';
import classes from './Contact.module.scss';
import { Spinner } from 'reactstrap';
import { poster, expander } from '../../utilities';

const Contact: React.FC = (props) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [large, setLarge] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const inputRefs = useRef<Array<HTMLInputElement | HTMLTextAreaElement>>([]);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const resizeHandler = () => {
    if (window.innerWidth >= 1200) {
      setLarge(true);
    }
    if (window.innerWidth < 1200) {
      setLarge(false);
    }
  };

  window.addEventListener('resize', resizeHandler);

  const messageSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
      }
      const info = {
        name,
        email,
        subject,
        message,
      };
      const data = await poster('notoken', 'mailer/sendMail', info);
      setResponse(data.message);
      setTimeout(() => {
        inputRefs.current.forEach((el) => (el.value = ''));
        setResponse('');
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
        setError('Problem sending message. Please contact rcschult@comcast.com');
      }
      setTimeout(() => {
        setError('');
      }, 10000);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
      }, 2200);
    }
  };

  useEffect(() => {
    if (window.innerWidth >= 1200) {
      setLarge(true);
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      <form onSubmit={(e) => messageSubmitHandler(e)}>
        <div className={classes.formGroup}>
          <label htmlFor="Name">Name</label>
          <input
            required
            ref={(el: HTMLInputElement) => (inputRefs.current[0] = el!)}
            type="text"
            name="Name"
            onChange={(e) => setName(e.target.value.trim())}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="Subject">Subject</label>
          <input
            required
            ref={(el: HTMLInputElement) => (inputRefs.current[1] = el!)}
            type="text"
            name="Subject"
            onChange={(e) => setSubject(e.target.value.trim())}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="Email">Your Email</label>
          <input
            required
            ref={(el: HTMLInputElement) => (inputRefs.current[2] = el!)}
            type="email"
            name="Email"
            onChange={(e) => setEmail(e.target.value.trim())}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="Message">Message</label>
          <textarea
            required
            className={classes.message}
            ref={(el: HTMLTextAreaElement) => (inputRefs.current[3] = el!)}
            name="Message"
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button className={classes.submitButton} type="submit">
          Send Message
        </button>
        <div className={classes.responseDiv} ref={responseDivRef}>
          {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
          {error ? <p className={classes.alert}>{error}</p> : <></>}
          {response ? <p className={classes.alert}>{response}</p> : <></>}
        </div>
      </form>
      {large ? (
        <div className={classes.sideImg}>
          <p className={classes.quote}>
            “But I think that any young drummer starting out today should get himself a great teacher and
            learn all there is to know about the instrument that he wants to play.” <br /> Buddy Rich
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Contact;

import React from 'react';
import ContactForm from './ContactForm';
import classes from './ContactLanding.module.scss';

const Contact: React.FC = () => {
  return (
    <div className={classes.wrapper}>
      <h1 className={classes.heading}>Contact</h1>
      <ContactForm />
    </div>
  );
};

export default Contact;

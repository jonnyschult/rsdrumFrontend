import React, { useEffect, useRef, useState } from 'react';
import classes from './Home.module.scss';
import { UserInfo } from '../../models';
import poster from '../../assets/snareDrum.jpg';
import ContactForm from '../contact/ContactForm';

interface HomeProps {
  loginHandler: (userToken: string) => void;
  userInfo: UserInfo;
}

const Home: React.FC<HomeProps> = (props) => {
  // const videoRef = useRef<HTMLVideoElement | null>(null);
  const [large, setLarge] = useState<boolean>(false);

  const resizeHandler = () => {
    if (window.innerWidth > 1200) {
      setLarge(true);
    }
  };

  window.addEventListener('resize', resizeHandler);

  useEffect(() => {
    // if (videoRef) {
    //   videoRef.current!.playbackRate = 0.5;
    // }
    if (window.innerWidth > 1200) {
      setLarge(true);
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      <section className={`${classes.jumbotron} ${classes.grid}`}>
        <h1 className={classes.headline}>Bringing the Percussive Arts to Life</h1>
      </section>
      <section className={`${classes.about} ${classes.grid}`}>
        <div className={`${classes.bio} ${classes.grid}`}>
          <h2>Your Teacher</h2>
          <p>
            Bob Schult is an passionate drummer with over 40 years experience. He has drummed for the LaPorte
            Theater productions of <i>It's a Wonderful Life</i> and{' '}
            <i>The Best Little Whore House in Texas</i> and jammed out with local musicians such as Jim St.
            James. He is an enthusiastic disciple of drumming and percussion and loves to pass the passion for
            excellence in music on to the next generation of drummers.
          </p>
        </div>
        {large ? <div className={classes.bobDrums}></div> : <></>}
        <div className={`${classes.location} ${classes.grid}`}>
          <h3>Location</h3>
          <h4>
            3252 N. Fail Rd. <br /> LaPorte, IN <br />
            46350
          </h4>
        </div>
      </section>
      <section className={classes.parallax}></section>
      <section className={classes.featuresContainer}>
        <h2>Features</h2>
        <div className={`${classes.features} ${classes.grid}`}>
          <div className={classes.featureA}>
            <div className={classes.border}>
              <h3>Face to Face Lessons</h3>
              <p>Learn techniques and receive live feedback in weekly, in person lessons. </p>
            </div>
          </div>
          <div className={classes.featureB}>
            <div className={classes.border}>
              <h3>Digital Access</h3>
              <p>Permanant access to online content such as lessons, assignements and videos.</p>
            </div>
          </div>
          <div className={classes.featureC}>
            <div className={classes.border}>
              <h3>Packages</h3>
              <p>
                Standard 10 week 10 lessons package available. Contact below for alternative plans or trials.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={classes.contact}>
        <h2>Contact</h2>
        <ContactForm />
      </section>
    </div>
  );
};

export default Home;

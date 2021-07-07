import React from 'react';
import classes from './Footer.module.scss';
import nobleTech from '../../assets/nobleTechDrkGrey.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className={`${classes.footer} ${classes.grid}`}>
      <div className={`${classes.nobleTech} ${classes.grid}`}>
        <h5>Powered by</h5>
        <a href="https://jonnyschult.github.io/portfolio/" target="blank">
          <img src={nobleTech} alt="" />
        </a>
        <p>NobleTech</p>
      </div>
      <div className={`${classes.links} ${classes.grid}`}>
        <h5>Follow Us</h5>
        <div className={`${classes.youtube} ${classes.socialMediaLinks}`}>
          <a href="https://www.youtube.com/channel/UCAaNeVfR-tVCp9ZaKCRipAg" target="blank">
            <FontAwesomeIcon icon={faYoutube} className={classes.icon} />
          </a>
        </div>
        <div className={`${classes.facebook} ${classes.socialMediaLinks}`}>
          <a href="https://www.facebook.com/bob.schult" target="blank">
            <FontAwesomeIcon icon={faFacebook} className={classes.icon} />
          </a>
        </div>
      </div>
      <p className={classes.copyright}>Copyright 2021 - R.S. Drumming</p>
    </footer>
  );
};

export default Footer;

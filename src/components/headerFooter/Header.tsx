import React, { useEffect, useState, useRef } from 'react';
import classes from './Header.module.scss';
import drumLogo from '../../assets/rsDrumLogo.jpg';
import LoginRegister from '../loginRegister/LoginRegisterModal';
import { UserInfo } from '../../models';
import { Spin as Hamburger } from 'hamburger-react';
import { Link, useHistory } from 'react-router-dom';

interface HeaderProps {
  loginHandler: (userToken: string) => void;
  logoutHandler: () => void;
  userInfo: UserInfo;
}
let currentPosition: number = 0;

const Header: React.FC<HeaderProps> = (props) => {
  const history = useHistory();
  const [elipsis, setElipsis] = useState<boolean>();
  const [isOpen, setOpen] = useState<boolean>(false);
  const header = useRef<HTMLElement>(null);

  const setHeaderClass = () => {
    if (window.scrollY === 0) {
      header.current!.className = `${classes.inactiveHeader} ${classes.header}`;
    } else if (window.scrollY > currentPosition) {
      header.current!.className = `${classes.scrollDownHeader} ${classes.header}`;
    } else if (window.scrollY < currentPosition) {
      header.current!.className = `${classes.scrollUpHeader} ${classes.header}`;
    }
    currentPosition = window.scrollY;
  };

  const resizeHandler = () => {
    if (window.innerWidth < 500) {
      setElipsis(true);
      setOpen(false);
    } else {
      setElipsis(false);
    }
  };

  window.addEventListener('scroll', () => {
    if (header.current !== null) {
      setHeaderClass();
    }
  });
  window.addEventListener('resize', resizeHandler);

  useEffect(() => {
    if (window.innerWidth < 500) {
      setElipsis(true);
    }
  }, []);

  return (
    <header className={`${classes.inactiveHeader} ${classes.header}`} ref={header}>
      <div className={classes.logoContainer}>
        <Link to="home" className={classes.logoLink}>
          <img src={drumLogo} alt="" />
        </Link>
      </div>

      {elipsis ? (
        <>
          <div className={classes.burgerContainer}>
            <Hamburger
              toggled={isOpen}
              toggle={(e) => {
                setOpen(!isOpen);
                isOpen
                  ? (header.current!.className = `${classes.inactiveHeader} ${classes.header}`)
                  : (header.current!.className = `${classes.scrollUpHeader} ${classes.header}`);
              }}
              color="#f8f7e7"
            />
          </div>
          {isOpen ? (
            <div className={`${classes.burgerLinks} ${classes.linksContainer}`}>
              <Link
                to="/home"
                onClick={(e) => {
                  setOpen(!isOpen);
                  header.current!.className = `${classes.inactiveHeader} ${classes.header}`;
                }}
              >
                Home
              </Link>
              <Link
                to="/videos"
                onClick={(e) => {
                  setOpen(!isOpen);
                  header.current!.className = `${classes.inactiveHeader} ${classes.header}`;
                }}
              >
                Videos
              </Link>
              <Link
                to="/lessons"
                onClick={(e) => {
                  setOpen(!isOpen);
                  header.current!.className = `${classes.inactiveHeader} ${classes.header}`;
                }}
              >
                Lessons
              </Link>
              <Link
                to="/contact"
                onClick={(e) => {
                  setOpen(!isOpen);
                  header.current!.className = `${classes.inactiveHeader} ${classes.header}`;
                }}
              >
                Contact
              </Link>
              {props.userInfo.loggedIn ? (
                <>
                  <Link
                    to="/settings"
                    onClick={(e) => {
                      setOpen(!isOpen);
                      header.current!.className = `${classes.inactiveHeader} ${classes.header}`;
                    }}
                  >
                    Settings
                  </Link>
                  <p
                    onClick={(e) => {
                      setOpen(!isOpen);
                      props.logoutHandler();
                      history.push('/home');
                      header.current!.className = `${classes.inactiveHeader} ${classes.header}`;
                    }}
                  >
                    Logout
                  </p>
                </>
              ) : (
                <LoginRegister loginHandler={props.loginHandler} />
              )}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <div className={`${classes.linksContainerA} ${classes.linksContainer}`}>
            {props.userInfo.loggedIn ? (
              <>
                <Link to="/settings">Settings</Link>
                <p
                  onClick={(e) => {
                    props.logoutHandler();
                    history.push('/home');
                  }}
                >
                  Logout
                </p>
              </>
            ) : (
              <LoginRegister loginHandler={props.loginHandler} />
            )}
            <Link to="/contact">Contact</Link>
          </div>
          <div className={`${classes.linksContainerB} ${classes.linksContainer}`}>
            <Link to="/home">Home</Link>
            <Link to="/videos">Videos</Link>
            <Link to="/lessons">Lessons</Link>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from 'react';
import classes from './App.module.scss';
import Home from './components/home/Home';
import LessonsLanding from './components/lessons/LessonsLanding';
import ContactLanding from './components/contact/ContactLanding';
import Videos from './components/videos/Videos';
import LessonInfo from './components/lessons/LessonInfo';
import Settings from './components/updateSettings/Settings';
import Header from './components/headerFooter/Header';
import Footer from './components/headerFooter/Footer';
import CheckoutSuccess from './components/updateSettings/payment/CheckoutSuccess';
import Checkout from './components/updateSettings/payment/Checkout';
import { UserInfo, Lesson } from './models';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import userDataFetcher from './utilities/userDataFetcher';
import getter from './utilities/getFetcher';

interface decodedToken {
  id: number;
  iat: number;
  exp: number;
}

const stripePromise = loadStripe(
  'pk_test_51IYwBLB1GHrROi8ESRqRVuvJAJqxAyL9XgSFOBq28PFZEorYYAuszgxI0ErGoyvr9CHX3bRmk89jrHOf2v5Ip13700SKcbSyVw'
);

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    loggedIn: false,
    user: {
      email: '',
      firstName: '',
      lastName: '',
      DOB: '',
      admin: false,
      student: true,
      active: true,
      createdAt: Date.now(),
    },
    token: '',
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const logoutHandler: () => void = () => {
    localStorage.clear();
    setUserInfo({
      loggedIn: false,
      user: {
        email: '',
        firstName: '',
        lastName: '',
        DOB: '',
        admin: false,
        student: true,
        active: true,
        createdAt: Date.now(),
      },
      token: '',
    });
  };

  const loginHandler: (userToken: string) => void = async (userToken) => {
    localStorage.setItem('token', userToken);
    let userData = await userDataFetcher(userToken);
    if (userData.user.admin) {
      const lessonsData = await getter(userData.token, 'lessons/getLessons');
      setLessons(
        lessonsData.lessons.sort((lessonA: Lesson, lessonB: Lesson) => {
          return lessonA.lessonNumber - lessonB.lessonNumber;
        })
      );
    } else {
      const lessonsData = await getter(userData.token, 'lessons/getLessons', `studentId=${userData.user.id}`);
      setLessons(
        lessonsData.lessons.sort((lessonA: Lesson, lessonB: Lesson) => {
          return lessonA.lessonNumber - lessonB.lessonNumber;
        })
      );
    }
    //prevents unmounting login modal before login message is set in that modal.
    setTimeout(() => {
      setUserInfo(userData);
    }, 1600);
  };

  useEffect(() => {
    document.title = 'RS Drum Studio';

    let storageToken = localStorage.getItem('token');

    if (storageToken) {
      if (new Date().getTime() > jwt_decode<decodedToken>(storageToken).exp * 1000) {
        logoutHandler();
      } else {
        loginHandler(storageToken);
      }
    }
  }, []);

  return (
    <div className={classes.app}>
      <Router>
        <Header loginHandler={loginHandler} logoutHandler={logoutHandler} userInfo={userInfo} />

        <Switch>
          <Route exact path="/">
            <Home loginHandler={loginHandler} userInfo={userInfo} />
          </Route>
          <Route exact path="/home">
            <Home loginHandler={loginHandler} userInfo={userInfo} />
          </Route>
          <Route exact path="/videos">
            <Videos userInfo={userInfo} />
          </Route>
          <Route exact path="/lessons">
            <LessonsLanding userInfo={userInfo} lessons={lessons} setLessons={setLessons} />
          </Route>
          <Route exact path="/contact">
            <ContactLanding />
          </Route>
          <Route path="/lessons/:id">
            <LessonInfo userInfo={userInfo} lessons={lessons} setLessons={setLessons} />
          </Route>
          <Route exact path="/settings">
            <Settings userInfo={userInfo} setUserInfo={setUserInfo} logoutHandler={logoutHandler} />
          </Route>
          <Route exact path="/checkout/:quantity/:packageId">
            <Elements stripe={stripePromise}>
              <Checkout userInfo={userInfo} />
            </Elements>
          </Route>
          <Route exact path="/success/:receiptId">
            <CheckoutSuccess userInfo={userInfo} />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
};

export default App;

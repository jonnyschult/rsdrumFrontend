import React, { useState, useEffect } from 'react';
import classes from './LessonsAds.module.scss';
import { getter } from '../../utilities';
import { PackageOption } from '../../models';
import { Spinner } from 'reactstrap';

const LessonsAds: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [packages, setPackages] = useState<PackageOption[]>([]);

  useEffect(() => {
    const loadUpHandler = async () => {
      try {
        const packagesData = await getter('token', 'payments/getPackages');
        setPackages(packagesData.packages);
      } catch (error) {
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
      } finally {
        setLoading(false);
      }
    };
    loadUpHandler();
  }, []);

  return (
    <div className={classes.wrapper}>
      <section className={`${classes.jumbotron} ${classes.grid}`}>
        <h1 className={classes.headline}>R.S. Drumming Studio</h1>
        <p className={classes.headlineInfo}>
          Our in person and online lessons and assignments provide a fully immersive experience with
          consistent feed back and encouragement.
        </p>
      </section>

      <section className={classes.featuresContainer}>
        <h2>Lessons</h2>
        <div className={`${classes.features} ${classes.grid}`}>
          <div className={classes.featureA}>
            <div className={`${classes.border} ${classes.grid}`}>
              <h3 className={classes.featureHeading}>Techniques</h3>
              <p className={classes.featureInfo}>
                Learn techniques through in person lessons and online assignments and music sheets
              </p>
            </div>
          </div>
          <div className={classes.featureB}>
            <div className={`${classes.border} ${classes.grid}`}>
              <h3 className={classes.featureHeading}>Theory</h3>
              <p className={classes.featureInfo}>
                Discover the underlying philosophy of drumming, what makes a good drummer and how to get into
                the aesthetics of drumming
              </p>
            </div>
          </div>
          <div className={classes.featureC}>
            <div className={`${classes.border} ${classes.grid}`}>
              <h3 className={classes.featureHeading}>Grooves</h3>
              <p className={classes.featureInfo}>
                Learn how to make grooves by practicing along with online drumming patterns
              </p>
              <a className={classes.featureLink} href="https://gscribe.com/share/5gJStmyHUCNzooEt8">
                Example
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className={classes.philosophyContainer}>
        <div>
          <h3>Philosophy</h3>
          <p>
            At R.S. Drumming Studio, the aim is to provide a full drumming education. This goes beyond merely
            showing how to hit a drum or even play in ryhthm, it's about immersing the student into a music
            culture and the aesthetic of the instrument being played. This starts out with familiarizing the
            student with drumming, how a drum set it is setup and maintained, but goes into developing
            personal taste of playing, seeing the greats play and what made them great, and encouraging the
            student to have a passion for their newfound mode of expression. The online content reinforces
            these goals by providing an all in one stop for music sheets, audio files, videos and contact with
            the instructor. This enables our in person meetings to be maximally beneficial and productive.
          </p>
        </div>
      </section>
      <section className={classes.packages}>
        {error ? (
          <p>{error}</p>
        ) : loading ? (
          <Spinner></Spinner>
        ) : (
          <>
            <h3>Current Packages Available</h3>
            <div className={classes.packagesContainer}>
              {packages.map((packageOption, index) => {
                return (
                  <div key={index} className={classes.package}>
                    <h5>{packageOption.title}</h5>
                    <p>Number of Lessosn: {packageOption.numberOfLessons}</p>
                    <p>
                      Cost:{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                      }).format(packageOption.price / 100)}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default LessonsAds;

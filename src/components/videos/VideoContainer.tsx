import React, { useState, useEffect, useRef, useCallback } from 'react';
import classes from './VideoContainer.module.scss';
import VideoEditor from './VideoEditor';
import { UserInfo, Video } from '../../models';
import { Spiral as Hamburger } from 'hamburger-react';
import { expander } from '../../utilities';
import { Spinner } from 'reactstrap';

interface VideoContainerProps {
  userInfo: UserInfo;
  video: Video;
  currentVideos: Video[];
  allVideos: Video[];
  allTags: string[];
  setAllTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchTags: React.Dispatch<React.SetStateAction<string[]>>;
  setAllVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  setCurrentVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  tagClickHandler: (clickedTag: string) => Promise<void>;
}

const VideoContainer: React.FC<VideoContainerProps> = (props) => {
  const video = props.video;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const moreInfoRef = useRef<HTMLDivElement>(null);

  const loadFn = () => {
    setLoaded(true);
  };

  const resizeHandler = useCallback(() => {
    if (moreInfoRef.current !== null && isOpen) {
      expander(moreInfoRef.current, isOpen, `${moreInfoRef.current.scrollHeight}px`);
    }
  }, [moreInfoRef, isOpen]);

  window.addEventListener('resize', resizeHandler);

  useEffect(() => {
    resizeHandler();
    console.log(props.userInfo);
  }, [resizeHandler, props.video.tags]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.videoContainer}>
        <div className={classes.titleContainer}>
          <h5>{video.title}</h5>
        </div>
        <div className={classes.iframeContainer}>
          {loaded ? <></> : <Spinner className={classes.spinner}></Spinner>}
          <iframe
            className={loaded ? classes.iframe : classes.hideFrame}
            onLoad={loadFn}
            title={video.title}
            src={video.videoUrl}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <div className={classes.moreInfo} ref={moreInfoRef}>
          <p className={classes.description}>Description: {video.description}</p>
          <div className={classes.videoTagsContainer}>
            {props.video.tags.map((tag, index) => {
              return (
                <p className={classes.videoTagP} key={index} onClick={(e) => props.tagClickHandler(tag)}>
                  {tag}
                </p>
              );
            })}
          </div>
          {props.userInfo.user.admin ? (
            <VideoEditor
              userInfo={props.userInfo}
              video={video}
              currentVideos={props.currentVideos}
              setCurrentVideos={props.setCurrentVideos}
              allVideos={props.allVideos}
              setAllVideos={props.setAllVideos}
              setSearchTags={props.setSearchTags}
              allTags={props.allTags}
              setAllTags={props.setAllTags}
            />
          ) : (
            <></>
          )}
        </div>
        <div className={classes.burgerContainer}>
          <p>{isOpen ? '' : 'More Info'}</p>
          <Hamburger
            toggled={isOpen}
            toggle={(e) => {
              expander(moreInfoRef.current!, !isOpen, `${moreInfoRef.current?.scrollHeight}px`);
              setIsOpen(!isOpen);
            }}
            color="#f8f7e7"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;

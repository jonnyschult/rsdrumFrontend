import React, { useState, useEffect, useRef } from 'react';
import VideoContainer from './VideoContainer';
import VideoAdder from './VideoAdder';
import ErrorPage from '../ErrorPage/ErrorPage';
import { UserInfo, Video } from '../../models';
import { Spinner } from 'reactstrap';
import classes from './Videos.module.scss';
import {getter, expander} from '../../utilities'

interface VideosProps {
  userInfo: UserInfo;
}

const Videos: React.FC<VideosProps> = (props) => {
  const [currentVideos, setCurrentVideos] = useState<Video[]>([]);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]); //holds all tags, even when there is a search
  const [currentTag, setCurrentTag] = useState<string>('home');
  const [searchTags, setSearchTags] = useState<string[]>([]); //mutable when typing in search bar
  const [loadingMain, setLoadingMain] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [expandable, setExpandable] = useState<boolean>(false);
  const [tagsContainerOpen, setTagsContainerOpen] = useState<boolean>(false);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const tagClickHandler = async (clickedTag: string) => {
    setCurrentTag(clickedTag);
    setCurrentVideos(allVideos.filter((video: Video) => video.tags!.includes(clickedTag)));
  };

  const searchHandler = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.toLocaleLowerCase() === '') {
      setSearchTags(allTags);
    } else {
      setSearchTags(allTags.filter((tag) => tag.includes(e.currentTarget.value.toLowerCase())));
    }
  };

  const loadUpHandler = async () => {
    try {
      setLoadingMain(true);
      const videosData = await getter('notoken', 'videos/getVideos');
      const uniqueTags = Array.from(new Set([...videosData.videos.map((video: Video) => video.tags).flat()]));
      const sortedTags = uniqueTags.sort();
      setAllTags(sortedTags);
      setSearchTags(sortedTags);
      setAllVideos(videosData.videos);
      setCurrentVideos(videosData.videos.filter((video: Video) => video.tags!.includes('home')));
    } catch (error) {
      console.log(error);
      setIsError(true);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setErrMessage(error.response.data.message);
      } else {
        setErrMessage('Problem fetching your data. Please let site admin Know.');
      }
    } finally {
      setLoadingMain(false);
    }
  };

  const resizeHandler = () => {
    if (tagsContainerRef.current !== null) {
      if (tagsContainerRef.current.scrollHeight > tagsContainerRef.current.clientHeight) {
        setExpandable(true);
      } else {
        setExpandable(false);
      }
    }
  };

  window.addEventListener('resize', resizeHandler);

  useEffect(() => {
    loadUpHandler();
  }, [tagsContainerRef]);

  useEffect(() => {
    if (tagsContainerRef.current !== null) {
      if (tagsContainerRef.current.scrollHeight > tagsContainerRef.current.clientHeight) {
        setExpandable(true);
      } else {
        setExpandable(false);
      }
    }
  }, [currentVideos, allTags]);

  if (isError) {
    return <ErrorPage errMessage={errMessage} />;
  }
  if (loadingMain) {
    return (
      <div className={classes.loadingMain}>
        <Spinner className={classes.spinnerMain}></Spinner>
      </div>
    );
  } else {
    return (
      <div className={classes.wrapper}>
        <>
          <h1 className={classes.heading}>Videos</h1>
          <section className={classes.searchTags}>
            <div className={classes.searchBarContainer}>
              <label htmlFor="search tags" />
              <input
                placeholder="Search Tags"
                className={classes.searchBar}
                onChange={(e) => searchHandler(e)}
              />
            </div>
            <div className={classes.tagsContainer} ref={tagsContainerRef}>
              {searchTags.map((tag, index) => {
                return (
                  <div key={index}>
                    <p className={classes.tagItem} onClick={(e) => tagClickHandler(tag)}>
                      {tag}
                    </p>
                  </div>
                );
              })}
              {searchTags.length === 0 ? <p className={classes.tagItem}>No Videos with that Tag </p> : ''}
            </div>
            {expandable ? (
              <p
                className={classes.tagExpander}
                onClick={(e) => {
                  expander(
                    tagsContainerRef.current!,
                    !tagsContainerOpen,
                    `${tagsContainerRef.current?.scrollHeight}px`,
                    '4em'
                  );
                  setTagsContainerOpen(!tagsContainerOpen);
                }}
              >
                {tagsContainerOpen ? 'Show Less' : 'Show More'}
              </p>
            ) : (
              <></>
            )}
            <hr />
          </section>

          <section className={classes.videos}>
            <h4>Search Results for: {currentTag ? currentTag : 'home'}</h4>
            <div className={classes.videosLayout}>
              {currentVideos.map((video, index) => {
                return (
                  <div key={index} className={classes.videoComponentContainer}>
                    <VideoContainer
                      userInfo={props.userInfo}
                      video={video}
                      currentVideos={currentVideos}
                      allVideos={allVideos}
                      setAllVideos={setAllVideos}
                      setCurrentVideos={setCurrentVideos}
                      tagClickHandler={tagClickHandler}
                      setAllTags={setAllTags}
                      setSearchTags={setSearchTags}
                      allTags={allTags}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {props.userInfo.user.admin ? (
            <VideoAdder
              userInfo={props.userInfo}
              allVideos={allVideos}
              setAllVideos={setAllVideos}
              allTags={allTags}
              setAllTags={setAllTags}
              setSearchTags={setSearchTags}
              setCurrentVideos={setCurrentVideos}
              currentVideos={currentVideos}
              currentTag={currentTag}
            />
          ) : (
            <></>
          )}
        </>
      </div>
    );
  }
};

export default Videos;

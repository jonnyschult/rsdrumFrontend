import React, { useState, useRef } from 'react';
import classes from './VideoEditor.module.scss';
import VideoUpdater from './VideoUpdater';
import { UserInfo, Video } from '../../models';
import { Modal, Spinner } from 'reactstrap';
import { deleter, expander } from '../../utilities';

interface VideoEditorProps {
  userInfo: UserInfo;
  video: Video;
  currentVideos: Video[];
  allTags: string[];
  allVideos: Video[];
  setCurrentVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  setAllVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  setAllTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const VideoEditor: React.FC<VideoEditorProps> = (props) => {
  let token = props.userInfo.token;
  let video = props.video;
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [modal, setModal] = useState(false);
  const responseDivRef = useRef<HTMLDivElement>(null);

  const toggle = () => setModal(!modal);

  const deleteVideoHandler = async (videoId: string) => {
    try {
      const confirmation = window.confirm('Are you sure?');
      if (confirmation) {
        setLoading(true);
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, true);
        }
        const results = await deleter(token, `videos/deleteVideo/${videoId}`);
        setResponse(results.message);
        const updatedAllVideos = props.allVideos.filter((video) => video.id !== videoId);
        const updatedAllTags = Array.from(new Set(updatedAllVideos.map((video) => video.tags).flat())).sort();
        setTimeout(() => {
          setResponse('');
          props.setAllVideos(updatedAllVideos);
          props.setCurrentVideos(props.currentVideos.filter((video) => video.id !== videoId));
          props.setAllTags(updatedAllTags);
          props.setSearchTags(updatedAllTags);
          toggle();
        }, 500);
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
        setError('There was a problem deleting this video.');
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

  return (
    <div className={classes.wrapper}>
      <button className={classes.modalToggler} onClick={toggle}>
        &#x270E;
      </button>
      <Modal isOpen={modal} toggle={toggle} className={classes.modal} contentClassName={classes.modalContent}>
        <p className={classes.exit} onClick={toggle}>
          &#10006;
        </p>
        <h3 className={classes.title}>Video Editor</h3>
        <hr />
        <VideoUpdater
          userInfo={props.userInfo}
          video={video}
          allVideos={props.allVideos}
          setAllVideos={props.setAllVideos}
          currentVideos={props.currentVideos}
          setCurrentVideos={props.setCurrentVideos}
          allTags={props.allTags}
          setAllTags={props.setAllTags}
          setSearchTags={props.setSearchTags}
          toggle={toggle}
        />
        <hr />
        <button className={classes.deleteBtn} onClick={(e) => deleteVideoHandler(video.id!)}>
          Delete Video{' '}
        </button>
        <div className={classes.responseDiv} ref={responseDivRef}>
          {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
          {error ? <p className={classes.alert}>{error}</p> : <></>}
          {response ? <p className={classes.alert}>{response}</p> : <></>}
        </div>
      </Modal>
    </div>
  );
};

export default VideoEditor;

import React, { useState, FormEvent, useRef } from 'react';
import classes from './VideoAdder.module.scss';
import { UserInfo, Video } from '../../models';
import { Spinner, Modal } from 'reactstrap';
import {poster, expander} from '../../utilities'

interface VideoAddProps {
  userInfo: UserInfo;
  allTags: string[];
  currentTag: string;
  setAllTags: React.Dispatch<React.SetStateAction<string[]>>;
  allVideos: Video[];
  currentVideos: Video[];
  setCurrentVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  setAllVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  setSearchTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const VideoAdder: React.FC<VideoAddProps> = (props) => {
  let token = props.userInfo.token;
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [tagsArr, setTagsArr] = useState<string[]>([]);
  const [tagRes, setTagRes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement)[]>([]);
  const [modal, setModal] = useState(false);
  const tagRef = useRef<HTMLInputElement>();
  const responseDivRef = useRef<HTMLDivElement>(null);

  const toggle = () => setModal(!modal);

  const addVideoHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      if (tagsArr.length === 0) {
        throw Error('Atleast one tag required.');
      }
      const videoInfo: Video = {
        title,
        description,
        videoUrl,
        tags: tagsArr,
        instructional: false,
      };
      const videoData = await poster(token, 'videos/addVideo', videoInfo);
      const uniqueTags: string[] = Array.from(new Set([...tagsArr, ...props.allTags]));
      props.setAllTags(uniqueTags);
      props.setSearchTags(uniqueTags);
      props.setAllVideos([...props.allVideos, videoData.newVideo]);
      if (videoData.newVideo.tags.includes(props.currentTag)) {
        props.setCurrentVideos([...props.currentVideos, videoData.newVideo]);
      }
      setResponse(videoData.message);
      setTitle('');
      setDescription('');
      setTagsArr([]);
      setTimeout(() => {
        setResponse('');
        inputRefs.current.forEach((el) => (el.value = ''));
        toggle();
      }, 1200);
    } catch (error) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(`From server: ${error.response.data.message}`);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Problem fetching your data. Please let site admin Know.');
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

  const addTagToArrHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagsArr.includes(tag.toLowerCase())) {
        setTagRes('That tag is already included');
        setTimeout(() => {
          setTagRes('');
        }, 1000);
      } else {
        setTagsArr([...tagsArr, tag.toLowerCase()]);
        setTag('');
        tagRef.current!.value = '';
      }
    }
  };

  return (
    <div className={classes.wrapper}>
      <button className={classes.modalToggler} onClick={toggle}>
        +
      </button>
      <Modal isOpen={modal} toggle={toggle} className={classes.modal} contentClassName={classes.modalContent}>
        <p className={classes.exit} onClick={toggle}>
          &#10006;
        </p>
        <h3 className={classes.title}>Add Video</h3>
        <hr />
        <section className={classes.formContainer}>
          <form className={classes.form} onSubmit={(e) => addVideoHandler(e)}>
            <div className={classes.formGroup}>
              <label htmlFor="videoUrl">Youtube Video URL</label>
              <input
                required
                type="text"
                name="videoUrl"
                ref={(el: HTMLInputElement) => (inputRefs.current[2] = el!)}
                onChange={(e) => setVideoUrl(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                required
                type="text"
                name="title"
                ref={(el: HTMLInputElement) => (inputRefs.current[0] = el!)}
                onChange={(e) => setTitle(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                required
                name="description"
                ref={(el: HTMLTextAreaElement) => (inputRefs.current[1] = el!)}
                onChange={(e) => setDescription(e.target.value.trim())}
              ></textarea>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="tags">Video Tags</label>
              <input
                type="text"
                name="tags"
                ref={(el: HTMLInputElement) => (tagRef.current = el)}
                onChange={(e) => setTag(e.target.value.trim())}
                onKeyDown={(e) => addTagToArrHandler(e)}
              ></input>
            </div>
            <div className={`${classes.formGroup} ${classes.tagsContainer}`}>
              {tagsArr.length > 0 ? (
                tagsArr.map((tagItem, index) => {
                  return (
                    <div key={index} className={classes.tagInfo}>
                      <p className={classes.tagName}>{tagItem}</p>
                      <p
                        className={classes.tagDeleter}
                        onClick={(e) => setTagsArr(tagsArr.filter((tagStr) => tagStr !== tagItem))}
                      >
                        X
                      </p>
                    </div>
                  );
                })
              ) : (
                <p>No Tags Added</p>
              )}
              {tagRes ? (
                <div className={classes.responseDiv}>
                  <p className={classes.alert}>{tagRes}</p>
                </div>
              ) : (
                <></>
              )}
            </div>

            <button className={classes.submitButton} type="submit">
              Submit
            </button>
            <div className={classes.responseDiv} ref={responseDivRef}>
              {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
              {error ? <p className={classes.alert}>{error}</p> : <></>}
              {response ? <p className={classes.alert}>{response}</p> : <></>}
            </div>
          </form>
        </section>
      </Modal>
    </div>
  );
};

export default VideoAdder;

import React, { useState, useRef, FormEvent } from 'react';
import classes from './VideoUpdater.module.scss';
import { UserInfo, Video } from '../../models';
import { Spinner } from 'reactstrap';
import { updater, expander, dynamicPropertyRemover} from '../../utilities'

interface VideoProps {
  userInfo: UserInfo;
  video: Video;
  allVideos: Video[];
  setAllVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  currentVideos: Video[];
  setCurrentVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  allTags: string[];
  setAllTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchTags: React.Dispatch<React.SetStateAction<string[]>>;
  toggle: () => void;
}

const VideoUpdater: React.FC<VideoProps> = (props) => {
  const token = props.userInfo.token;
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [tag, setTag] = useState<string>('');
  const [activeTags, setActiveTags] = useState<string[]>(props.video.tags);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagRes, setTagRes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const tagRef = useRef<HTMLInputElement>();
  const responseDivRef = useRef<HTMLDivElement>(null);

  const updateVideohandler = async (e: FormEvent) => {
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    console.log('HEllo');
    e.preventDefault();
    const compiledObj = {
      id: props.video.id,
      title,
      description,
      videoUrl,
      tags: [...activeTags, ...newTags],
    };
    //ensures only updated data is being sent throught the network by stripping properties holding null as their value.
    const info = dynamicPropertyRemover(compiledObj);
    console.log(info);
    try {
      const videoData = await updater(token, 'videos/updateVideo', info, `${props.video.id}`);
      const updatedVideo = videoData.updatedVideo;
      const updatedAllVideos = props.allVideos.map((video) => {
        if (video.id === updatedVideo.id) {
          return updatedVideo;
        } else {
          return video;
        }
      });
      const updatedAllTags = Array.from(new Set(updatedAllVideos.map((video) => video.tags).flat())).sort();
      setResponse(videoData.message);
      setTimeout(() => {
        setNewTags([]);
        setActiveTags(updatedVideo.tags);
        props.setSearchTags(updatedAllTags);
        props.setAllTags(updatedAllTags);
        props.setAllVideos(updatedAllVideos);
        props.setCurrentVideos(
          props.currentVideos.map((video) => {
            if (video.id === updatedVideo.id) {
              return updatedVideo;
            } else {
              return video;
            }
          })
        );
        setResponse('');
      }, 2400);
    } catch (error) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError('Problem updating your video. Please let site admin Know.');
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
      const activeTagsTagName = activeTags.map((activeTag) => activeTag);
      if (newTags.includes(tag.toLowerCase()) || activeTagsTagName.includes(tag.toLowerCase())) {
        setTagRes('That tag is already included');
        setTimeout(() => {
          setTagRes('');
        }, 1000);
      } else {
        setNewTags([...newTags, tag.toLowerCase()]);
        setTag('');
        tagRef.current!.value = '';
      }
    }
  };

  const deleteTagHandler = async (tagRemovee: string) => {
    if (activeTags.length === 1) {
      setError('Video must have at least one tag');
      if (responseDivRef.current !== null) {
        expander(responseDivRef.current!, true);
        setTimeout(() => {
          setResponse('');
        }, 2400);
      }
    } else {
      setActiveTags(activeTags.filter((tag) => tag !== tagRemovee));
    }
  };

  return (
    <div className={classes.formContainer}>
      <form className={classes.form} onSubmit={(e) => updateVideohandler(e)}>
        <div className={classes.formGroup}>
          <label htmlFor="videoUrl">Youtube Video URL</label>
          <input
            required
            type="text"
            name="videoUrl"
            defaultValue={props.video.videoUrl}
            onChange={(e) => setVideoUrl(e.target.value.trim())}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={props.video.title}
            onChange={(e) => setTitle(e.target.value.trim())}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            defaultValue={props.video.description}
            onChange={(e) => setDescription(e.target.value.trim())}
          ></textarea>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="videoTags">Video Tags</label>
          <input
            type="text"
            name="videoTags"
            ref={(el: HTMLInputElement) => (tagRef.current = el)}
            onChange={(e) => setTag(e.target.value.trim())}
            onKeyDown={(e) => addTagToArrHandler(e)}
          ></input>
        </div>
        <div className={classes.formGroup}>
          <h5>New Tags</h5>
          <div className={classes.tagsContainer}>
            {newTags.length > 0 ? (
              newTags.map((tagItem, index) => {
                return (
                  <div className={classes.tagInfo} key={index}>
                    <p className={classes.tagName}>{tagItem}</p>
                    <p
                      className={classes.tagDeleter}
                      onClick={(e) => setNewTags(newTags.filter((tagStr) => tagStr !== tagItem))}
                    >
                      X
                    </p>
                  </div>
                );
              })
            ) : (
              <p>No New Tags</p>
            )}
          </div>
        </div>
        <hr />
        <div className={classes.formGroup}>
          <h5>Active Tags</h5>
          <div className={classes.tagsContainer}>
            {activeTags.length > 0 ? (
              activeTags.map((activeTag, index) => {
                return (
                  <div className={classes.tagInfo} key={index}>
                    <p className={classes.tagName}>{activeTag}</p>
                    <p className={classes.tagDeleter} onClick={(e) => deleteTagHandler(activeTag)}>
                      X
                    </p>
                  </div>
                );
              })
            ) : (
              <p>No Tags</p>
            )}
          </div>

          <hr />

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
      </form>
      <div className={classes.responseDiv} ref={responseDivRef}>
        {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
        {error ? <p className={classes.alert}>{error}</p> : <></>}
        {response ? <p className={classes.alert}>{response}</p> : <></>}
      </div>
    </div>
  );
};

export default VideoUpdater;

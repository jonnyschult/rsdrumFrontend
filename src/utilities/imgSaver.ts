import { storage } from '../firebase';

const imageSaver: (image: File) => Promise<string> = async (image) => {
  const uploadTask = storage.ref(`lessonImgs/${image.name}`).put(image);

  await uploadTask.on(
    'state_changed',
    (snapshot) => {},
    (error) => {
      throw error;
    }
  );

  const url = await storage
    .ref('lessonImgs')
    .child(image.name)
    .getDownloadURL()
    .then((url) => {
      return url;
    });
  return url;
};

export default imageSaver;

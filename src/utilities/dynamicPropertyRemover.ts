type Info = {
  [name: string]: any;
};

const dynamicPropertyRemover: (obj: Info) => Info = (obj) => {
  for (const property in obj) {
    const key = property as keyof Info;
    if (obj[key] === null) {
      delete obj[key];
    }
  }

  return obj;
};

export default dynamicPropertyRemover;

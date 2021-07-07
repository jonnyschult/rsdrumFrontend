const expander = (el: HTMLDivElement, expand: boolean, openHeight?: string, closedHeight?: string) => {
  if (expand) {
    if (openHeight) {
      el.style.height = openHeight;
    } else {
      el.style.height = '6em';
    }
  } else {
    if (closedHeight) {
      el.style.height = closedHeight;
    } else {
      el.style.height = '0px';
    }
  }
};

export default expander;

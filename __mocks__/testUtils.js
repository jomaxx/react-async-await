import ReactDOM from "react-dom";

const mountNode = document.createElement("div");

export function mount(element) {
  return ReactDOM.render(element, mountNode);
}

afterEach(() => {
  ReactDOM.unmountComponentAtNode(mountNode);
});

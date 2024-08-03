import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const root = createRoot(document.getElementById("root") as Element);
function render() {
  root.render(
    <AppUiProvider>
      <Provider store={store}>
      <App />
      </Provider>
    </AppUiProvider>
  );
}

render();

// if (module.hot) {
//   module.hot.accept("./app", render);
// }

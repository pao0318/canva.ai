import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { App } from "../examples/fetch/app";
import "@canva/app-ui-kit/styles.css";

const root = createRoot(document.getElementById("root") as Element);
function render() {
  root.render(
    <AppUiProvider>
      <App />
    </AppUiProvider>
  );
}

render();

// if (module.hot) {
//   module.hot.accept("./app", render);
// }

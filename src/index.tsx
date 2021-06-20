import "./wdyr";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DevTools, loadServer } from "jira-dev-tool";
import { AppProvider } from "./context";
import "antd/dist/antd.less";
import { Profiler } from "components/profiler";

loadServer(() =>
  ReactDOM.render(
    <React.StrictMode>
      <Profiler id="Root" phase={["mount"]}>
        <AppProvider>
          <DevTools />
          <App />
        </AppProvider>
      </Profiler>
    </React.StrictMode>,
    document.getElementById("root")
  )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

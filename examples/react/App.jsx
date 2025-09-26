import React from "react";
import ReactDOM from "react-dom";
import SliderCaptchaReact from "../../src/react/SliderCaptcha";
import "../../src/slider-captcha.css";

function App() {
  return (
    <div style={{ width: 340, margin: "2rem auto" }}>
      <h2>React Example - Slider Captcha</h2>
      <SliderCaptchaReact
        width={320}
        height={160}
        onSuccess={() => alert("Verified!")}
        onFail={() => alert("Try again")}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

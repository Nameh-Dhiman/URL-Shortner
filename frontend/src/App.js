import React, { useRef, useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styles from "./App.module.scss";
import CircularLoader from "./CircularLoader";



function App() {
  const [loading, setLoading] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  const form = useRef();
  const [generated, setGenerated] = useState("");
  const [gen, setGen] = useState(false);

  const [formData, setFormData] = useState({});

  const changeHandler = (e) => {
    let inputName = e.target.name;
    setFormData({
      ...formData,
      [inputName]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("https://urljoy.herokuapp.com/", formData)
      .then((res) => {
        setLoading(false);
        setGenerated(res.data);
        setGen(true);
      })
      .catch((err) => console.error(err));

    form.current.reset();
  };

  const urlHandler = () => {
    axios
      .get(`${generated}?q=search`)
      .then((res) => (window.location.href = res.data))
      .catch((err) => {
        alert(`${err.response.data}`);
      });
  };

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  
  return (
    <div className={styles.App}>
      <h1>URL Shortner</h1>
      <form onSubmit={submitHandler} ref={form}>
        <input
          type="text"
          onChange={changeHandler}
          name="url"
          required
          placeholder="Enter URL here..."
        />
        <input
          type="text"
          onChange={changeHandler}
          name="custom"
          placeholder="Enter custom URL name if you want..."
        />
        <input type="submit" value="Generate" />
      </form>
      {!loading ? (
        <div className={styles.Generated}>
          {!gen ? (
            <div className={styles.GeneratedNotYet}>
              Your custom URL will be here after generation.
            </div>
          ) : (
            <>
              <div className={styles.GeneratedYes}>
                Your Custom URL: <span onClick={urlHandler}>{generated}</span>{" "}
                will expire after 10 min
              </div>
              <CopyToClipboard text={generated} onCopy={onCopyText}>
                <div className={styles.CopyArea}>
                  {!isCopied ? (
                    <button>Copy to Clipboard</button>
                  ) : (
                    <button disabled>Copied!</button>
                  )}
                </div>
              </CopyToClipboard>
            </>
          )}
        </div>
      ) : (
        <CircularLoader />
      )}
    </div>
  );
}

export default App;

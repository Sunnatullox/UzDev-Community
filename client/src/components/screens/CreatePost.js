import React, { createRef, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import JoditEditor from "jodit-react";
import "../../style/CreatePost.css";
import { Helmet } from "react-helmet-async";

function CreatePost() {
  const editor = useRef(null);
  const tagRef = createRef();

  const [tagValue, setTagValue] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const hestory = useHistory();


  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "uzdev_overflow");
      data.append("cloud_name", "defsmhgn9");
      fetch(`https://api.cloudinary.com/v1_1/defsmhgn9/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url);
          setUrl(data.url);
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  const updatePostImage = (files) => {
    setImage(files);
  };
  const postDetaels = () => {
    if(tagValue.length){
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Sunna " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pict: url,
          tags: tagValue,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            return
          } 
            toast.success("Congratulations, you added an article");
            hestory.push("/posts");
          console.log(data)
        });
    }else if(!tagValue.length){
      toast.error("The question cannot be downloaded without tags")
    }
  };
  /*remove tags */
  const removeTags = (i) => {
    const tags = [...tagValue];
    tags.splice(i, 1);
    setTagValue(tags);
  };

  /* add tags */
  const addTags = (e) => {
    const tagval = [...tagValue];
    const value = e.target.value;
    if (e.key === "Enter" && value) {
      // check if duplicate skill
      if (tagval.find((val) => val.toLowerCase() === value.toLowerCase())) {
        return toast.error("you cannot add multiple tags");
      }
      tagval.push(value);
      setTagValue(tagval);

      tagRef.current.value = null;
    } else if (e.key === "Backpace" && value) {
      // if no value and  hit backspace we will  remove  previous
      removeTags(tagval.length - 1);
    }
  };

  return (
    <>
        <Helmet>
    <title>UzDev-Community</title>
    <meta  name="description"
    content="Ask your colleagues the questions that are bothering you, and they will write back soon !"/>
     <link rel="canonical" href="/createpost"/>
    </Helmet>
    <div
      id="contentwrapper"
      style={{ backgroundColor: "#e0e0dd" }}
      className="my-5"
    >
      <div id="" className="row container-fluid">
        <ToastContainer />
        <div id="" className="col">
          <div className="connect bolder col">
          Ask your colleagues the questions that are bothering you, and they will write back soon !
          </div>
          <div className="leftbar">
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/v2/yx/r/pyNVUg5EM0j.png"
              alt="..."
            />
          </div>
        </div>

        <div id="rightbod" className="col mt-4">
          <div className="">
            <div className="card">
              <div className="card-header">
                <h2 className="text-center">Write a question</h2>
              </div>
              <div className="card-body p-0 mt-3">
                <div className="form">
                  <div className="form-row"></div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="exampleFormControlSelect1"
                        type="text"
                        className="form-control"
                        name="text"
                        style={{ padding: "0.6rem" }}
                        placeholder="Title"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        onChange={(e) => updatePostImage(e.target.files[0])}
                        type="file"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group d-block">
                    <JoditEditor
                      ref={editor}
                      value={body}
                      config={{
                        buttons: [
                          "bold",
                          "|",
                          "italic",
                          "|",
                          "image",
                          "|",
                          "link",
                          "|",
                          "left",
                          "|",
                          "center",
                          "|",
                          "right",
                        ],
                        height:"200",
                        showXPathInStatusbar: false,
                        showCharsCounter: false,
                        showWordsCounter: false,
                        toolbarAdaptive: false,
                      }}
                      tabIndex={1}
                      onBlur={(newContent) => setBody(newContent)}
                    />
                    <div className="tags">
                      <ul id="ul">
                        {tagValue.map((tag, i) => {
                          return (
                            <li key={i} className="btn">
                              {tag}{" "}
                              <button onClick={() => removeTags(i)}>+</button>
                            </li>
                          );
                        })}
                        <li className="input-tags">
                          <input
                            type="text"
                            size="4"
                            placeholder="Tags"
                            onKeyDown={addTags}
                            className="form-control"
                            ref={tagRef}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => postDetaels()}
                    className="btn btn-primary"
                  >
                    Send
                  </button>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default CreatePost;
//4kf&Q?7x8Qkqb-#

import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../App";
import "../../../style/GroupChat.scss";
import Loader from "../../Loader";
import ChatCreateUser from "./ChatCreateUser";
import Convertatsion from "./Convertatsion";
import Messegs from "./Messegs";
import { toast, ToastContainer } from "react-toastify";
import MemberGroup from "./MemberGroup";
import ScrollableFeed from "react-scrollable-feed";
import { Helmet } from "react-helmet-async";

function GroupChat(props) {
  const convertatsionId = props.match.params.id;
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  const [conversation, setconversation] = useState([]);
  const [newMesseg, setNewMesseg] = useState("");
  const [messeges, setMesseges] = useState([]);
  const [messegGroupId, setMessegGroupId] = useState("");
  const [user, setUser] = useState([]);
  const [groupImg, setGroupImg] = useState("");
  const [uploadServerGroupImg, setUploadServerGroupImg] = useState("");
  const scrolRef = useRef(null);

  useEffect(() => {
    if (groupImg) {
      const data = new FormData();
      data.append("file", groupImg);
      data.append("upload_preset", "uzdev_overflow");
      data.append("cloud_name", "defsmhgn9");
      fetch("https://api.cloudinary.com/v1_1/defsmhgn9/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((result) => {
          /*  console.log(result) */
          setUploadServerGroupImg(result.secure_url);
        });
    }
    if (uploadServerGroupImg) {
      fetch("/updateGroupImg", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Sunna " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          groupId: convertatsionId,
          groupImg: uploadServerGroupImg,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          /* console.log(result); */
        });
    }
    getConvertation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messeges]);

  const getConvertation = async () => {
    try {
      await fetch(`/group/myGroup/${convertatsionId}`, {
        headers: {
          Authorization: "Sunna " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          result.group.map((i) => {
            return setMessegGroupId(i);
          });
          setUser(result.groupUs);
          setMesseges(result.messeg);
          result.group.map((item) => {
            return setconversation(item);
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const hendelSubmit = async (e) => {
    e.preventDefault();

    if (newMesseg && messegGroupId?._id) {
      await fetch("/messeg", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Sunna " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          text: newMesseg,
          groupId: messegGroupId._id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setNewMesseg("");
          if (result.error) {
            toast.info(result.error);
          }
        })
        .catch((error) => {
          toast.error("Habaringiz Yuborilmadi Tehnik nosozlik");
        });
    } else if (!newMesseg || !messegGroupId._id) {
      toast.warning("Iltimos Inputlarga text kiriting");
      console.log("inputga text kiritilmagan");
    }
  };

  const deletedGruop = () => {
    fetch("/deletGroup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        GroupId: convertatsionId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          return toast.error(result.error);
        } else if (result) {
          history.push("/posts");
          console.log(result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <>
      <Helmet>
        <title>UzDev-Community</title>
        <meta name="description" content={messegGroupId.groupName} />
        <link rel="canonical" href={`/group/myGroup/${convertatsionId}`} />
      </Helmet>
      {user.length ? (
        <div className="groupChat">
          <ToastContainer />
          <div className="chatMenu">
            <div className="chatMenuWrapper mt-5">
              {user.map((Con) => (
                <>
                  <Convertatsion
                    convertatsionId={convertatsionId}
                    user={Con}
                    users={user}
                    groupCreatorId={messegGroupId}
                  />
                </>
              ))}
            </div>
          </div>
          <div className="chatBox">
            <div className="bg-white py-2 d-flex">
              <div className="d-flex mt-2" style={{ margin: "auto" }}>
                <div
                  className="pic-holder groupHeader"
                  style={{ width: "50px", height: "50px" }}
                >
                  {messegGroupId.groupPhoto ? (
                    <img
                      id="profilePic"
                      className="pic"
                      src={messegGroupId.groupPhoto}
                      alt="..."
                    />
                  ) : (
                    <img id="profilePic" className="pic" src={{}} alt="..." />
                  )}
                  {conversation.creators === state?._id && (
                    <>
                      <label
                        htmlFor="newProfilePhoto"
                        className="upload-file-block"
                      >
                        <div className="text-center">
                          <div>
                            <i className="fa fa-camera fa-sm"></i>
                          </div>
                        </div>
                      </label>
                      <input
                        id="newProfilePhoto"
                        type="file"
                        onChange={(e) => setGroupImg(e.target.files[0])}
                        accept=".jpg,.png,.jpeg"
                        style={{ display: "none" }}
                      />
                    </>
                  )}
                </div>
                <p className="groupHeader mt-2 mt-auto ml-4">
                  {messegGroupId.groupName}
                </p>
              </div>

              {conversation.creators === state?._id && (
                <span onClick={() => deletedGruop()} className="deletGroup">
                  <i className="fa-solid fa-trash delGroup"></i>
                </span>
              )}
            </div>
            <p
              className="d-flex justify-content-center"
              style={{"marginTop":"-1rem", "marginLeft":"4rem" }}
            >
              {conversation.users?.length}{' '}
              members
            </p>
            <div className="chatBoxWrapper" style={{ background: "white" }}>
              <div className="navGroup bg-transparrent">
                <div className="navbar-container">
                  <input type="checkbox" name="" id="" />
                  <div className="hamburger-lines">
                    <span className="line line1"></span>
                    <span className="line line2"></span>
                    <span className="line line3"></span>
                  </div>
                  <ul className="menu-items chatMenuWrappers">
                    {user.map((Con) => (
                      <>
                        <Convertatsion
                          convertatsionId={convertatsionId}
                          user={Con}
                          users={user}
                        />
                      </>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="chatBoxTop py-2"
                style={{
                  background:
                    "url('https://media.istockphoto.com/vectors/set-of-cloud-computing-icons-vector-pattern-design-vector-id1183605162?k=20&m=1183605162&s=612x612&w=0&h=bUqhuybJPZ0a6WLyL29ZOInxnM6fXx-2o0Bx7flYPOE=')",
                }}
              >
                {messeges.length ? (
                  <ScrollableFeed>
                    {messeges.map((m) => (
                      <Messegs
                        user={user}
                        messeg={m}
                        own={m.sender === state?._id}
                      />
                    ))}
                  </ScrollableFeed>
                ) : (
                  <p className="d-none"></p>
                )}
              </div>
              <div className="chatBoxButtom">
                <textarea
                  onChange={(e) => setNewMesseg(e.target.value)}
                  value={newMesseg}
                  className="chatmessegesInput"
                  placeholder="write something... "
                ></textarea>
                <button className="chatSubmitButton" onClick={hendelSubmit}>
                  Send
                </button>
              </div>
            </div>
          </div>
          {/*      <div className="chatOnline">
        <div className="chatOnlineWrapper">
            <MemberGroup convertatsionId={convertatsionId} adminId={messegGroupId} userId={userId} />
        </div>
      </div> */}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default GroupChat;

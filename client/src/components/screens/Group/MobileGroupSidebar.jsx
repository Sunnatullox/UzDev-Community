import React, { useContext, useEffect, useState } from "react";
import "../../../style/Group.css";
import { toast, ToastContainer } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import memberIcon from "../../../image/left to line.svg";
import { UserContext } from "../../../App";

function MobileGroupSidebar() {
  const [image, setImage] = useState("");
  const [imageServer, setImagServer] = useState("");
  const [groupName, setGroupName] = useState("");
  const [modalOut, setModalOut] = useState(false);
  const [allGroups, setAllGroups] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  const history = useHistory();

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
          /*  setPhot(true) */
          setImagServer(data.secure_url);
        })
        .catch((err) => console.log(err));
    }
    /*     AllUsersGroup() */
    AllGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const updatedGroupImge = (files) => {
    setImage(files);
  };

  const hendelNextModelgroup = () => {
    if (Object.keys(groupName)?.length > 3) {
      createGroup();
      return;
    } else {
      toast.error("Gruop nomi 3 ta harfdan ko'p bo'lishi shart");
    }
  };

  const createGroup = () => {
    fetch("/groupCreait", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        groupName,
        groupPhoto: imageServer,
      }),
    }).then(res => res.json())
    .then((result) => {
      if (result.error) {
        toast.error(result.error);
      }
      history.push(`/group/myGroup/${result?._id}`)
    });
  };

  const AllGroups = async () => {
    try {
      await fetch("/AllGroups", {
        headers: { Authorization: "Sunna " + localStorage.getItem("jwt") },
      })
        .then((res) => res.json())
        .then((result) => {
          setAllGroups(result);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const membersGroup = async (id) => {
    try {
      await fetch("/memberUser", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Sunna " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ convertatsionId: id, userId: state?._id }),
      })
        .then((res) => res.json())
        .then((user) => {
          if (user.error) {
            toast.error("User gruppaga qo'shilmadi");
          }
          history.push(`/group/myGroup/${user?._id}`)
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {" "}
      <div className="groups">
        <ul className="newGroup">
          <li
            className="groupItem"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            <i className="fa-solid fa-user-group"></i> New Group
          </li>
        </ul>
        <hr />
        {allGroups.length ? (
          <>
            <h5 className="text-center">All Groups</h5>
            <br />
            <div className="groupsAll">
              {allGroups.map((item, i) => {
                return (
                  <>
                    <div className="grp" key={i}>
                      <div className="d-flex">
                        <div className="image">
                          {item.groupPhoto ? (
                            <img src={item.groupPhoto} alt="Vector" />
                          ) : (
                            <img
                              src="https://st2.depositphotos.com/3113551/11624/v/950/depositphotos_116240408-stock-illustration-people-avatar-icon.jpg"
                              alt="Vector"
                            />
                          )}
                        </div>
                        <div className="info">
                        {!item.users.includes(state?._id) ? (
                            <h6>{item.groupName}</h6>
                        ):(
                          <Link to={`/group/myGroup/${item?._id}`}>
                            <h6>{item.groupName}</h6>
                          </Link>
                        )}
                        </div>
                      </div>
                      <div className="d-flex info">
                        <span className="d-flex memberGroup">
                          {item.users.length} group members
                        </span>
                        {!item.users.includes(state?._id) ? (
                          <span
                            onClick={() => membersGroup(item?._id)}
                            className="d-flex jounUser  "
                          >
                            Join{" "}
                            <img
                              className="memberIcon"
                              src={memberIcon}
                              alt=""
                            />
                          </span>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                    <hr />
                  </>
                );
              })}
            </div>
          </>
        ):(
          <p className="text-center">group not found</p>
        )}
      </div>
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content modal_content">
            <div className="modal-body modal_body d-flex py-3">
              <span className="pic-holder">
                {!imageServer ? (
                  <>
                    <div className="groupImage"></div>
                    <label
                      htmlFor="newGroupPhoto"
                      className="upload-file-blocks"
                    >
                      <div className="text-centers">
                        <div>
                          <i className="fa fa-camera fa-sm fa-2xl"></i>
                        </div>
                      </div>
                    </label>
                  </>
                ) : (
                  <>
                    <img
                      id="profilePic"
                      className="pic"
                      src={imageServer}
                      alt="..."
                    />
                    <label
                      htmlFor="newGroupPhoto"
                      className="upload-file-block"
                    >
                      <div className="text-center">
                        <div>
                          <i className="fa fa-camera fa-sm fa-2xl"></i>
                        </div>
                      </div>
                    </label>
                  </>
                )}
                <input
                  id="newGroupPhoto"
                  type="file"
                  onChange={(e) => updatedGroupImge(e.target.files[0])}
                  accept=".jpg,.png,.jpeg"
                  style={{ display: "none" }}
                />
              </span>
              <label
                className="newInputGroup"
                style={{ marginTop: "-1rem", marginRight: "auto" }}
              >
                <input
                  className="newGroupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  type="text"
                  required="required"
                />
                <span className="inputName">Name</span>
              </label>
            </div>
            <div className="modal-footer">
              <span className=" btn bg-secondary" data-dismiss="modal">
                Close
              </span>
              <span
                className="btn btn-outline-info"
                onClick={() => hendelNextModelgroup()}
                data-dismiss={Object.keys(groupName).length >3 && "modal"}
              >
                Next
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileGroupSidebar;

import React, { createRef, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../App";

import "../../style/ProfileSistems.css";

function ProfileSistems({ userId,setProfileSistems }) {
  const [editName, setEditName] = useState(undefined);
  const [editEmail, setEditEmail] = useState(undefined);
  const [editPassword, setEditPassword] = useState(undefined);
  const [telNumber, setTelNumber] = useState("");
  const [specilization, setSpecilization] = useState([]);
  const hestory = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const tagRef = createRef()


  const uploadUserImage = async (id) => {
    await fetch("/userEditProfile", {
      method: "put",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: "Sunna " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name: editName,
        email: editEmail,
        password: editPassword,
        telNumber,
        specilization,
        editUserId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error("Iltimos barcha inputlarni to'ldiring");
        }
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...state,
              name: data.name,
              email: data.email,
            })
          );
          dispatch(
            { type: "EDITNAME", payload: data.name },
            { type: "EDITEMAIL", payload: data.email },
            );
            setProfileSistems(false)
          /* hestory.push("/profile"); */
          toast.success("User molumotlar o'zgartirildi!");
        
      });
  };
/*remove tags */
const removeTags = (i) => {
  const tags = [...specilization];
  tags.splice(i, 1)
  setSpecilization(tags)
}


  const addTags = (e) => {
    const tagval = [...specilization]
    const value = e.target.value
    if(e.key === 'Enter' && value){
      // check if duplicate skill
      if(tagval.find(val => val.toLowerCase() === value.toLowerCase())){
        return toast.error("birmartadan ko'p tag qo'sholmaysiz")
      }
      tagval.push(value)
      setSpecilization(tagval)
  
      tagRef.current.value = null
    }else if(e.key === "Backpace"&& value){
      // if no value and  hit backspace we will  remove  previous
      removeTags(tagval.length -1)
    }
  }




  return (
    <div>
      {" "}
      <ToastContainer />
      <div className="form" id="form">
        <h2>User Profile</h2>
          <div className="form-group">
            <label htmlFor="email">Full Name:</label>
            <div className="relative">
              <input
                className="form-control"
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                type="text"
                pattern="[a-zA-Z\s]+"
                title="Username should only contain letters. e.g. Piyush Gupta"
                autoComplete=""
                placeholder="Type your name here..."
              />
              <i className="fa fa-user"></i>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address:</label>
            <div className="relative">
              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="form-control"
                type="email"
                placeholder="Type your email address..."
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
              />
              <i className="fa fa-envelope"></i>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Password:</label>
            <div className="relative">
              <input
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="form-control"
                type="password"
                id="designation"
                placeholder="Type your designation..."
              />
              <i className="fa fa-solid fa-lock"></i>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Contact Number:</label>
            <div className="relative">
              <input
                value={telNumber}
                onChange={(e) => setTelNumber(e.target.value)}
                className="form-control"
                type="number"
                maxLength="10"
                placeholder="Type your Mobile Number..."
              />
              <i className="fa fa-phone"></i>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Specialty:</label>
            <div className="relative">
            <ul id="ul">
                        {specilization.map((tag, i )=> {
                          return(
                            <li key={i} className="btn">
                              {tag} <b style={{"borderRadius":"50%"}}  onClick={() => removeTags(i)}>+</b>
                            </li>
                          )
                        })}
                        <li className="input-tags">
                        <input type="text" id="tags" placeholder="Type your specialty..." className="form-control"  onKeyDown={addTags} ref={tagRef}/>
                        </li >
             {/*            <li><b  className="btn"  onClick={() =>addTags()}>send</b></li> */}
                      </ul>
              <i className="fa fa-brands fa-css3"></i>
            </div>
          </div>

        <div className="tright">
          <button
            onClick={() => uploadUserImage(userId._id)}
            className="btn movebtn movebtnsu"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSistems;

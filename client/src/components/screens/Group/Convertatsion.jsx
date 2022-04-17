/* eslint-disable array-callback-return */
import React, { useState, useEffect, useContext } from "react";
import Avatar from "../../../image/user-circle.svg";
import "../../../style/Convertation.css";
import QuritGroup from "../../../image/left from line.svg";
import { UserContext } from "../../../App";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

function Convertatsion({ user, convertatsionId, groupCreatorId }) {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory()

  const QuitGroup = async(id) => {
    try{
      await fetch("/quitUserGroup", {
        method:"put",
        headers:{
          "Content-Type": "application/json",
          Authorization:"Sunna " +localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          convertatsionId,
          userId:id
        })
      }).then(res => res.json())
      .then(result => {
        if(result.error){
          toast.error(result.error)
        }
        history.push("/posts")
      })
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <div className="convertation" key={user?._id}>
        <Link
          to={user?._id !== state?._id ? `/profile/${user?._id}` : "/profile"}
        >
          {user.userPhoto ? (
            <img src={user.userPhoto} className="ConvertationImg" alt="" />
          ) : (
            <img src={Avatar} className="ConvertationImg" alt="" />
          )}
          <span className="convertationName text-dark">{user.name}</span>
        </Link>
        {user?._id === state?._id | groupCreatorId?.creators === state?._id ? (
          <span
             onClick={() => QuitGroup(user?._id)}
            className="d-flex jounUser  quitUser"
          >
            Quit <img className="memberIcon" src={QuritGroup} alt="" />
          </span>
        ):<></>}
       {/*  {groupCreatorId?.creators === state?._id && (
          <span
             onClick={() => QuitGroup(user?._id)}
            className="d-flex jounUser  quitUser"
          >
            Quit <img className="memberIcon" src={QuritGroup} alt="" />
          </span>
        )} */}
      </div>
    </>
  );
}

export default Convertatsion;

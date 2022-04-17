import React, { useContext, useState } from "react";
import "../../../style/Messeges.css";
import Avatar from "../../../image/user_avatar.svg";
import { formatDistanceToNowStrict } from "date-fns";
import { UserContext } from "../../../App";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function Messegs({ own, messeg }) {
  const { state, dispatch } = useContext(UserContext);

  return (
    <div key={messeg?._id} className={own ? "messeges own" : "messeges"}>
      <div className="floatMesseg">
        <div className="messegesTop">
          {messeg.sender !== state?._id && (
            <>
              <Link to={`/profile/${messeg.sender}`}>
                {!messeg.senderPhoto ? (
                  <>
                  {messeg.sender !== state?._id &&(
                  <img src={Avatar} alt="" className="messegesImg" />
                  )}
                  </>
                ) : (
                  <>
                  {messeg.sender !== state?._id &&(
                    <img src={messeg.senderPhoto} alt="" className="messegesImg" />
                  )}
                  </>
                  )}
              </Link>
              <Link to={`/profile/${messeg.sender}`}>
                <h6 className="senderName">{messeg.senderName}</h6>
              </Link>
            </>
          )}
          {!messeg.senderPhoto && messeg.sender === state?._id ? (
             <>
             {messeg.sender !== state?._id &&(
               <img src={Avatar} alt="" className="messegesImg" />
             )}
             </>
          ) : (
            <p className="d-none"></p>
          )}
        </div>
        <p className="messegesText">{messeg.text}</p>
        <div className="messegesBottom">
          {" "}
          {dayjs(messeg.createdAt).format("hh:mm")}
        </div>
      </div>
    </div>
  );
}

export default Messegs;

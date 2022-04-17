import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatart from '../../image/user-circle.svg'


function SignUp() {
  const hestory = useHistory();
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [image, setImage] = useState();
  const [UserImage, setuserImage] = useState("");

  useEffect(() =>{
    if(image){
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
          setuserImage(data.secure_url);
        })
        .catch((err) => console.log(err));
    }
  // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  },[image])

  const ourFields =() =>{
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        regEmail
      )
    ) {
      toast.warning("Email manzilingizni to'giri kiriting");
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: regName,
        password: regPassword,
        email: regEmail,
        image:UserImage
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.msg);
          hestory.push("/signin");
        }
      });
  }

  const uploadUserImage = (files) => {
    setImage(files)
  };

  return (
    <>
           <Helmet>
    <title>UzDev-Community</title>
    <meta  name="description"
    content="UzDev-Community Sign Up"/>
     <link rel="canonical" href="/signup"/>
    </Helmet>
    <div className="containers " style={{"display":"contents"}}>
      <ToastContainer />
      <div className="screen mt-5" style={{"margin":"auto","contentVisibility":"auto"}}>
        <div className="screen__content">
          <div className="siginup">
            <div className="pic-holder">
              {UserImage ?(
                <img
                  id="profilePic"
                  className="pic"
                  src={UserImage} alt="..."
                />
                ):(
                  <img
                    id="profilePic"
                    className="pic"
                    src={Avatart} alt="..."
                  />
              )}

              <label htmlFor="newProfilePhoto" className="upload-file-block">
                <div className="text-center">
                  <div >
                    <i className="fa fa-camera fa-sm"></i>
                  </div>
                  <div >
                    Update <br /> Profile Photo
                  </div>
                </div>
              </label>
              <input
              id='newProfilePhoto'
                type="file"
                onChange={(e) => uploadUserImage(e.target.files[0])} 
                accept=".jpg,.png,.jpeg"
                style={{"display":"none"}}
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="login__input"
                placeholder="Fisrst Name"
              />
            </div>
            <div className="login__field">
              <i className="login__icon fa-solid fa-at"></i>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="login__input"
                placeholder="Email"
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="login__input"
                placeholder="Passwird"
              />
            </div>

            <button className="button login__submit" onClick={() => ourFields()}>
              Sign Up
              <i className="button__icon fas fa-chevron-right"></i>
            </button>

            <p className="mt-4">
              <Link
                to="/signin"
                className="text-white"
                style={{ marginLeft: "3rem" }}
              >
                Do you want to log in?
              </Link>
            </p>
          </div>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
    </>
  );
}

export default SignUp;

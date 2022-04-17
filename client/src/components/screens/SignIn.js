import { useContext } from "react";
import { UserContext } from "../../App";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";

function SignIn() {
  const {state, dispatch} = useContext(UserContext)
  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const hestory = useHistory();

  const logData = () => {
     //eslint-disable-next-line
     if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(logEmail)){
      toast.warning("Email manzilingizni to'giri kiriting")
      return
    }
fetch("/signin", {
method: "post",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
 password: logPassword,
 email: logEmail,
}),
})
.then((res) => res.json())
.then((data) => {
 if (data.error) {
     toast.error(data.error)
   
 }else{
  localStorage.setItem("jwt",data.token)
  localStorage.setItem("user", JSON.stringify(data.user))
  dispatch({type:"User", payload: data.user})
   toast.success("Muvafaqiyatli kirdingiz")
   hestory.push("/")
 }
});
  };

  return (
    <>
        <Helmet>
    <title>UzDev-Community</title>
    <meta  name="description"
    content="UzDev-Community Sign In"/>
     <link rel="canonical" href="/signin"/>
    </Helmet>
    <div className="containers "  style={{"display":"contents"}}>
      <ToastContainer />
      <div className="screen mt-5" style={{"margin":"auto","contentVisibility":"auto"}}>
        <div className="screen__content">
          <div className="form siginin">
            <div className="login__field">
              <i className="login__icon fa-solid fa-at"></i>
              <input
                type="email"
                value={logEmail}
                onChange={(e) => setLogEmail(e.target.value)}
                className="login__input"
                placeholder="Email"
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                value={logPassword}
                onChange={(e) => setLogPassword(e.target.value)}
                className="login__input"
                placeholder="Password"
              />
            </div>

            <button className="button login__submit" onClick={() => logData()}>
             Sign in
              <i className="button__icon fas fa-chevron-right"></i>
            </button>

            <p className="ml-2" style={{"marginTop":"6.4rem"}}>
              <Link to="/signup" style={{ marginLeft: "3rem" }} className="text-white">
              Do you want to register?
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

export default SignIn;


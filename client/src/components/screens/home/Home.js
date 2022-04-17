import HomeLogo from "../../../image/homeLogo.png";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { UserContext } from "../../../App";

function Home() {
  const {state, dispatch} = useContext(UserContext)


  return (
    <>
      <Helmet>
        <title>UzDev-Community</title>
        <meta
          name="description"
          content="Do you have a programming question or do
you want answers to your questions?"
        />
        <link rel="canonical" href="/" />
      </Helmet>
      <div
        className="sect sect--padding-top"
        style={{ backgroundColor: "#e0e0dd" }}
      >
        <div className="container py-4">
          <div className="row">
            <div className="col-md-12">
              <div className="site">
                <h1 className="site__title">
                  Do you have a programming question or do <br /> you want
                  answers to your questions?
                </h1>
                <h2 className="site__subtitle">
                  <div className="circ">
                    <b> {"< / >"}</b>
                  </div>
                </h2>
                <div className="site__box-link">
                  <Link to={state ? "/posts" : "/signup"} className="btn btn--width">
                    Get started
                  </Link>
                  <div className="circle blue"></div>
                  <div className="square red"></div>
                  <div className="circle orange"></div>
                  <div className="squares yellow"></div>
                </div>
                <img className="site__img" src={HomeLogo} alt="..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

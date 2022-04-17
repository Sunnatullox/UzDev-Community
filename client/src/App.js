import "./style/App.css";
import "./style/home.css";
import { createContext, useReducer, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/screens/home/Home";
import Profile from "./components/screens/Profile";
import SignIn from "./components/screens/SignIn";
import SignUp from "./components/screens/SignUp";
import CreatePost from "./components/screens/CreatePost";
import {reducer, initialState} from './reducers/userReducer'
import Posts from "./components/screens/posts/Posts";
import { Footer } from "./components/Footer";
import PostComments from "./components/screens/posts/PostComments";
import UserProfile from './components/screens/UserProfile'
import ProfileSistems from "./components/screens/ProfileSistems";
import GroupChat from './components/screens/Group/GroupChat'


export const UserContext = createContext();

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"User", payload: user})
      /* history.push("/") */
    }else{
      history.push("/signin")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signIn" component={SignIn} />
      <Route path="/signUp" component={SignUp} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/createpost" component={CreatePost} />
      <Route path="/posts" component={Posts} />
      <Route path="/postComments/:id" exact component={PostComments} />
      <Route path="/profile/:id" exact component={UserProfile} />
      <Route path="/profileSistems/:id" exect component={ProfileSistems} />
      <Route path="/group/myGroup/:id" exect component={GroupChat}/>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <Router className="App">
      <Navbar />
      <div className="content ">
      <Routing/>
      </div>
      <Footer />
    </Router>
    </UserContext.Provider>
  );
}

export default App;

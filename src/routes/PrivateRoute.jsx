import React from "react";
import { Navigate } from "react-router-dom";
const PrivateRoute = ({children}) => {
    let userid =localStorage.getItem("userid")

  return (
    <React.Fragment>
        {userid ? <React.Fragment>{children} </React.Fragment>  :<Navigate to={"/"}/>}
    </React.Fragment>
    
  )
}

export default PrivateRoute;
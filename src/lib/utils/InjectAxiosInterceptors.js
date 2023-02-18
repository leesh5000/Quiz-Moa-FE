import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {setUpInterceptors} from "../api/client";

function InjectAxiosInterceptors () {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!loading) {
    setUpInterceptors(navigate);
    setLoading(true);
  }

  return <></>;
}

export default InjectAxiosInterceptors;
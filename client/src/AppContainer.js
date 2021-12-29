import { useState, useEffect } from "react";
import axios from "axios";
import getItems from "./getItems";
import App from "./App";

let baseURL = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "https://apod-remake.herokuapp.com"

const fetch = (url) => axios.post(baseURL + "/apod", { url: url }).then((res) => res.data);

const parser = new DOMParser();
const parseData = (data) => parser.parseFromString(data, "text/html");

function AppContainer() {
  const [state, setState] = useState({ image: "", explanation: "", title: "", date: "", prevImage: "", nextImage: "" });

  const handleClick = (e) => {
    e.preventDefault();

    fetch(e.target.getAttribute("href"))
      .then(parseData)
      .then(getItems)
      .then(setState)
      .catch((err) => console.log(err))
      .finally(window.scrollTo(0, 0));
  };

  //Call fetch only one time when page initially loads
  useEffect(
    () =>
      fetch("https://apod.nasa.gov/apod/")
        .then(parseData)
        .then(getItems)
        .then(setState)
        .catch((err) => console.log(err)),
    []
  );

  return (
    <App state={state} handleClick={handleClick} />
  )
}

export default AppContainer;
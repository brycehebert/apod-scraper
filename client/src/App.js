import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import getItems from "./getItems";
import Navigation from "./components/Navigation";

const fetch = (url) => axios.post("http://localhost:5000/apod", { url: url }).then((res) => res.data);

const parser = new DOMParser();
const parseData = (data) => parser.parseFromString(data, "text/html");

function App() {
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
    <div className="App">
      <h1>Astronomy Picture of the Day</h1>
      <div className="date">{state.date}</div>
      <div className="image">{state.image}</div>
      <div className="title">{state.title}</div>
      <p className="explanation">{state.explanation}</p>
      <Navigation nextImage={state.nextImage} prevImage={state.prevImage} handleClick={handleClick} />
      <div className="footer">
        All data presented is courtesy of <a href="https://apod.nasa.gov/apod/">NASA's APOD</a> and the respective
        copyright owners.
      </div>
    </div>
  );
}

export default App;

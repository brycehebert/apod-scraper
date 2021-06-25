import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import htmlToReact from "html-react-parser";
import getItems from "./getItems";
import Navigation from "./components/Navigation";

function App() {
  const [image, setImage] = useState("");
  const [explanation, setExplanation] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [nextImage, setNextImage] = useState("");

  const setState = (items) => {
    setImage(htmlToReact(items.img));
    setDate(items.date);
    setTitle(htmlToReact(items.title));
    setExplanation(htmlToReact(items.explain));
    setNextImage(items.next);
    setPrevImage(items.prev);
  };

  const fetch = (url) => axios.post("http://localhost:5000/apod", { url: url }).then((res) => res.data);

  const handleClick = (e) => {
    e.preventDefault();
    
    fetch(e.target.getAttribute("href"))
      .then(parseData).then(getItems).then(setState)
      .catch((err) => console.log(err))
      .finally(window.scrollTo(0,0))
  };

  const parser = new DOMParser();
  const parseData = (data) => parser.parseFromString(data, "text/html");
  
  //Call fetch only one time when page initially loads
  useEffect(
    () =>
      fetch("https://apod.nasa.gov/apod/")
        .then(parseData).then(getItems).then(setState)
        .catch((err) => console.log(err)),
    []
  ); 

  return (
    <div className="App">
      <h1>Astronomy Picture of the Day</h1>
      <div className="date">{date}</div>
      <div className="image">{image}</div>
      <div className="title">{title}</div>
      <p className="explanation">{explanation}</p>
      <Navigation nextImage={nextImage} prevImage={prevImage} handleClick={handleClick} />
      <div className="footer">
        All data presented is courtesy of <a href="https://apod.nasa.gov/apod/">NASA's APOD</a> and the respective
        copyright owners.
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import htmlToReact from "html-react-parser";
import getItems from "./getItems"

function App() {
  const parser = new DOMParser();

  const [image, setImage] = useState("");
  const [explanation, setExplanation] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [nextImage, setNextImage] = useState("");

  const fetch = async (url) => {
    axios
      .post("http://localhost:5000/apod", { url: url })
      .then((res) => {
        let doc = parser.parseFromString(res.data, "text/html");
        let items = getItems(doc);
        setState(items);
      })
      .catch((err) => console.log(err));
  };

  const setState = (items) => {
    setImage(htmlToReact(items.img));
    setDate(items.date);
    setTitle(htmlToReact(items.title));
    setExplanation(htmlToReact(items.explain));
    setNextImage(items.next);
    setPrevImage(items.prev);
  };

  const handleClick = (e) => {
    e.preventDefault();
    fetch(e.target.getAttribute("href"));
  };

  useEffect(() => fetch("https://apod.nasa.gov/apod/"), []); //Call fetch only one time when page initially loads

  return (
    <div className="App">
      <h1>Astronomy Picture of the Day</h1>
      <div className="date">{date}</div>
      <div className="image">{image}</div>
      <div className="title">{title}</div>
      <p className="explanation">{explanation}</p>
      <div className="navigation">
        <a href={prevImage} onClick={handleClick}>
          Previous
        </a>
        <a href={nextImage} onClick={handleClick}>
          Next
        </a>
      </div>
      <div className="footer">
        All data presented is courtesy of <a href="https://apod.nasa.gov/apod/">NASA's APOD</a> and the respective
        copyright owners.
      </div>
    </div>
  );
}

export default App;

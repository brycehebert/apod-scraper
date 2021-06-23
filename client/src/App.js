import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import htmlToReact from "html-react-parser";

function App() {
  const parser = new DOMParser();

  const [image, setImage] = useState("");
  const [explanation, setExplanation] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [nextImage, setNextImage] = useState("");

  const fetch = (url) => {
    axios
      .post("http://localhost:5000/apod", { url: url })
      .then((res) => {
        let doc = parser.parseFromString(res.data, "text/html");
        let items = getItems(doc);
        setState(items);
      })
      .catch((err) => console.log(err));
  };

  const getItems = (doc) => {
    let items = {};

    //The Picture of the Day is not necessarily an image. 
    //APOD tends to use an iframe element if it is not an img element.
    //So check if there is an img element on the page. If not, check for an iframe.
    //If still nothing, we just don't get to see that day's image.
    if (doc.getElementsByTagName("img")[0]) {
      let element = doc.getElementsByTagName("img")[0];
      items.img = `<img src=https://apod.nasa.gov/apod/${element.getAttribute("src")} alt="${element.getAttribute("alt")}" />`;
    } else if (doc.getElementsByTagName("iframe")[0]) {
      items.img = doc.getElementsByTagName("iframe")[0].outerHTML;
    } else {
      items.img = "";
    }

    items.date = `${doc.getElementsByTagName("p")[1].innerText}`;

    items.title = `${doc.getElementsByTagName("center")[1].innerHTML}`;

    //Fix any links in explanation that have a relative path to have an absolute path to the APOD website
    //First we grab all the anchor tags in the explanation paragraph
    //We convert the resulting HTMLCollection to an array using [...] so that we can run Array.forEach() on it
    //Then we just search for any anchor tag with an href that doesn't begin with http and prepend the APOD url to it.
    [...doc.getElementsByTagName("p")[2].getElementsByTagName("a")].forEach((ele) => {
      const link = ele.getAttribute("href");
      if (!link.startsWith("http")) {
        ele.setAttribute("href", `https://apod.nasa.gov/apod/${link}`);
      }
    });
    items.explain = `${doc.getElementsByTagName("p")[2].innerHTML}`;

    items.prev =
      "https://apod.nasa.gov/apod/" +
      [...doc.getElementsByTagName("a")].filter((ele) => ele.innerText === "<")[0].getAttribute("href");
    items.next =
      "https://apod.nasa.gov/apod/" +
      [...doc.getElementsByTagName("a")].filter((ele) => ele.innerText === ">")[0].getAttribute("href");

    return items;
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

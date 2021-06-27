import htmlToReact from "html-react-parser";

const getItems = (doc) => {
  let items = {};

  //The Picture of the Day is not necessarily an image. 
  //APOD tends to use an iframe element if it is not an img element.
  //So check if there is an img element on the page. If not, check for an iframe.
  //If still nothing, we just don't get to see that day's image.
  if (doc.getElementsByTagName("img")[0]) {
    let element = doc.getElementsByTagName("img")[0];
    items.image = `<img src=https://apod.nasa.gov/apod/${element.getAttribute("src")} alt="${element.getAttribute("alt")}" />`;
  } else if (doc.getElementsByTagName("iframe")[0]) {
    items.image = doc.getElementsByTagName("iframe")[0].outerHTML;
  } else {
    items.image = "";
  }
  items.image = htmlToReact(items.image);

  items.date = `${doc.getElementsByTagName("p")[1].innerText}`;

  items.title =htmlToReact(`${doc.getElementsByTagName("center")[1].innerHTML}`);

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
  items.explanation = htmlToReact(`${doc.getElementsByTagName("p")[2].innerHTML}`);

  items.prevImage =
    "https://apod.nasa.gov/apod/" +
    [...doc.getElementsByTagName("a")].filter((ele) => ele.innerText === "<")[0].getAttribute("href");
  items.nextImage =
    "https://apod.nasa.gov/apod/" +
    [...doc.getElementsByTagName("a")].filter((ele) => ele.innerText === ">")[0].getAttribute("href");

  return items;
};

export default getItems;
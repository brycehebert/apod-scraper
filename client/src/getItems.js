import htmlToReact from "html-react-parser";

//Fix any links that have a relative path to have an absolute path to the APOD website
//Search for any anchor tag with an href that doesn't begin with http and prepend the APOD url to it.
const fixRelativeLinks = (links) => {
  links.forEach(ele => {
    let link = ele.getAttribute("href");
    if (!link.startsWith("http")){
      ele.setAttribute("href", `https://apod.nasa.gov/apod/${link}`);
    }
  })
}

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

  //Grab all the anchor tags in the explanation paragraph
  //Convert the resulting HTMLCollection to an array using [...] so that we can run Array.forEach() on it
  fixRelativeLinks([...doc.getElementsByTagName("p")[2].getElementsByTagName("a")]);
  items.explanation = htmlToReact(`${doc.getElementsByTagName("p")[2].innerHTML}`);

  //Do the same for the image title/credit
  fixRelativeLinks([...doc.getElementsByTagName("center")[1].getElementsByTagName("a")]);
  items.title = htmlToReact(`${doc.getElementsByTagName("center")[1].innerHTML}`);

  items.prevImage =
    "https://apod.nasa.gov/apod/" +
    [...doc.getElementsByTagName("a")].filter((ele) => ele.innerText === "<")[0].getAttribute("href");
    
  items.nextImage =
    "https://apod.nasa.gov/apod/" +
    [...doc.getElementsByTagName("a")].filter((ele) => ele.innerText === ">")[0].getAttribute("href");

  return items;
};

export default getItems;
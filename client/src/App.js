import "./App.css";
import Navigation from "./components/Navigation";

function App(props) {
  const { state, handleClick } = props;

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

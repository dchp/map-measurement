import "./App.scss";
import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Map from "./components/Map";
import MeasurePanel from "./components/MeasurePanel";

const App = () => {
  return (
    <div className="map-mesasurement">
      <Map />
      <MeasurePanel />
    </div>
  );
};

export default App;

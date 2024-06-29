import "./App.scss";
import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Map from "./components/Map";
import MesurePanel from "./components/MesurePanel";

const App = () => {
  return (
    <div className="map-mesasurement">
      <Map />
      <MesurePanel />
    </div>
  );
};

export default App;

import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Map } from "./components/Map";
import { MeasurePanel } from "./components/MapPanel";

const App = () => {
  return (
    <div style={{ display: "flex" }}>
      <Map />
      <MeasurePanel />
    </div>
  );
};

export default App;

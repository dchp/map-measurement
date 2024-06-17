import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Map } from "./components/Map";
import { MeasurePanel } from "./components/MapPanel";

const App = () => {
  const [hoverSectorId, setHoverSectorId] = useState("");
  const [editSectorId, setEditSectorId] = useState("");

  return (
    <div style={{ display: "flex" }}>
      <Map
        hoverSectorId={hoverSectorId}
        setHoverSectorId={setHoverSectorId}
        editSectorId={editSectorId}
        setEditSectorId={setEditSectorId}
      />

      <MeasurePanel
        editSectorId={editSectorId}
        hoverSectorId={hoverSectorId}
        setHoverSectorId={setHoverSectorId}
        setEditSectorId={setEditSectorId}
      />
    </div>
  );
};

export default App;

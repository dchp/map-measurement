import { Dropdown, Form } from "react-bootstrap";
import { Gear } from "react-bootstrap-icons";
import { unitSettingStore } from "./UnitSettingStore";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import LengthUnit from "../types/LengthUnit";
import AngleUnit from "../types/AngleUnit";

const UnitSettingsButton = observer(() => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="light"
        id="dropdown-basic"
        className="rounded-0"
      >
        <span className="icon">
          <Gear />
        </span>
        <span className="text">Unit settings</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form.Group className="px-3 py-1 form-group">
          <Form.Label>Length unit:</Form.Label>
          <Form.Select
            value={unitSettingStore.lengthUnit}
            onChange={(e) =>
              runInAction(() => {
                unitSettingStore.lengthUnit = e.target.value as LengthUnit;
              })
            }
          >
            <option value={LengthUnit.Kilometers}>kilometers</option>
            <option value={LengthUnit.Miles}>miles</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="px-3 py-1 form-group">
          <Form.Label>Angle unit:</Form.Label>
          <Form.Select
            value={unitSettingStore.angleUnit}
            onChange={(e) =>
              runInAction(() => {
                unitSettingStore.angleUnit = e.target.value as AngleUnit;
              })
            }
          >
            <option value={AngleUnit.Degrees}>degrees</option>
            <option value={AngleUnit.Radians}>radians</option>
          </Form.Select>
        </Form.Group>
      </Dropdown.Menu>
    </Dropdown>
  );
});

export default UnitSettingsButton;

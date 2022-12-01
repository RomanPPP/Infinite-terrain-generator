import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Slider from "./slider";
const style = {
  position: "fixed",
  top: 10,
  left: 10,
  width: 200,
  fontSize: "0.6em",
};
export default ({
  updateMesh,
  defaultMeshParams = {
    amplitude: 10,
    octaveSize: 64,
    discretization: 10,
    chunkSize: 128,
  },
  paramsDescription,
}) => {
  const [meshParams, setMeshParams] = useState(defaultMeshParams);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setMeshParams((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    updateMesh(meshParams);
  }, [meshParams]);
  return (
    <div className="Ui" style={style}>
      {Object.keys(meshParams).map((paramName) => {
        const { name, max, min, step } = paramsDescription[paramName];
        return (
          <>
            <div>
              {name} : {meshParams[paramName]}
            </div>
            <Slider
              aria-label="Temperature"
              name={paramName}
              defaultValue={defaultMeshParams[paramName]}
              onChange={handleChange}
              valueLabelDisplay="auto"
              step={step}
              marks
              min={min}
              max={max}
            />
          </>
        );
      })}
    </div>
  );
};

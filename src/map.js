import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import levelOne from "./GeoJson/Lebanon_Level1.json";
import provincesData from "./GeoJson/Lebanon_Level2.json";
import villagesData from "./GeoJson/Lebanon_Level3.json";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { geoPath, geoBounds } from "d3-geo";

const colors = [
  "#EF4907",
  "#0070AE",
  "#545454",
  "#00DBFF",
  "#B20218",
  "#EFC417",
  "#FF7701",
  "#01723F",
];

const MapComponent = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [ProvincesInLevelOne, setProvincesInLevelOne] = useState([]);
  const [villagesInProvince, setVillagesInProvince] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [projectionConfig, setProjectionConfig] = useState({
    scale: 19000,
    center: [35.8, 33.8],
  });

  const resetProjection = () => {
    setProjectionConfig({
      scale: 19000,
      center: [35.85, 33.85],
    });

    setVillagesInProvince([]);
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the map container
    const handleDocumentClick = (e) => {
      const mapContainer = document.getElementById("map-container");
      if (!mapContainer.contains(e.target)) {
        resetProjection();
      }
    };

    // Attach the event listener
    document.addEventListener("click", handleDocumentClick);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleLevelOneClick = (geo) => {
    setSelectedLevel(geo);
    const levelId = geo.properties.GID_1;
    const ProvinceId = provincesData.features.filter(
      (province) => province.properties.GID_1 === levelId
    );
    setProvincesInLevelOne(ProvinceId);
    setSelectedProvince(null);
  };

  const handleProvinceClick = (geo) => {
    setSelectedProvince(geo);
    const provinceId = geo.properties.GID_2;
    const villagesInSelectedProvince = villagesData.features.filter(
      (village) => village.properties.GID_2 === provinceId
    );
    setVillagesInProvince(villagesInSelectedProvince);
    setSelectedVillage(null);
    const path = geoPath().projection(projectionConfig);
    const bounds = geoBounds(geo.geometry);

    // Calculate the width and height of the bounding box
    const width = Math.abs(bounds[1][0] - bounds[0][0]);
    const height = Math.abs(bounds[1][1] - bounds[0][1]);

    // Calculate the center of the bounding box
    const centerX = (bounds[0][0] + bounds[1][0]) / 2;
    const centerY = (bounds[0][1] + bounds[1][1]) / 2;

    const newProjectionConfig = {
      scale: (1 / Math.max(width, height)) * 40000,
      center: [centerX, centerY],
    };

    setProjectionConfig(newProjectionConfig);
  };

  const handleSelectedVillage = (geo) => {
    setSelectedVillage(geo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        flexDirection: "row",
        backgroundColor: "#dceefd",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          flexDirection: "column",
          marginLeft: "5rem",
          marginTop: "5rem",
          width: "40vw",
        }}
      >
        <h1 style={{ textAlign: "center", margin: "20px 0" }}>Lebanon Map</h1>
        <Breadcrumbs>
          {selectedLevel && (
            <Typography color='inherit'>
              {selectedLevel.properties.NAME_1}
            </Typography>
          )}
          {selectedProvince && (
            <Typography color='inherit'>
              {selectedProvince.properties.NAME_2}
            </Typography>
          )}
          {selectedVillage && (
            <Typography color='inherit'>
              {selectedVillage.properties.NAME_3}
            </Typography>
          )}
        </Breadcrumbs>

        {selectedVillage && (
          <Card
            style={{
              width: "15vw",
              height: "15vh",
              marginTop: "5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            elevation={10}
          >
            <CardContent>
              {selectedVillage.properties.NAME_3 && (
                <Typography variant='h5' component='div'>
                  Name: {selectedVillage.properties.NAME_3}
                </Typography>
              )}
              {selectedVillage.properties.NAME_3 && (
                <Typography variant='h5' component='div'>
                  اسم: {selectedVillage.properties.Arabic_NAME_3}
                </Typography>
              )}
              {selectedVillage.properties.GID_3 && (
                <Typography variant='body2'>
                  ID: {selectedVillage.properties.GID_3}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <div
        style={{
          height: "100vh",
          width: "60vw",
        }}
        id='map-container'
      >
        <ComposableMap
          projection='geoEqualEarth'
          projectionConfig={projectionConfig}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Geographies geography={levelOne}>
            {({ geographies }) =>
              geographies.map((geo, index) => {
                return (
                  <Geography
                    key={geo.properties.Name_1}
                    geography={geo}
                    style={{
                      default: {
                        fill: colors[index % colors.length],
                      },
                      hover: {
                        fill: colors[index % colors.length],
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: colors[index % colors.length],
                      },
                    }}
                    stroke='#dad9d9'
                    onClick={() => handleLevelOneClick(geo)}
                  >
                    <text style={{ color: "black" }}>
                      {geo.properties.NAME_1}
                    </text>
                  </Geography>
                );
              })
            }
          </Geographies>
          {selectedLevel && (
            <Geographies geography={ProvincesInLevelOne}>
              {({ geographies }) =>
                geographies.map((geo, index) => {
                  return (
                    <Geography
                      key={geo.properties.Name_2}
                      geography={geo}
                      style={{
                        default: {
                          fill: "transparent",
                          strokeWidth: "0.3px",
                        },
                        hover: {
                          fill: "#e0eaf3",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#e0eaf3",
                        },
                      }}
                      stroke='white'
                      onClick={() => handleProvinceClick(geo)}
                    ></Geography>
                  );
                })
              }
            </Geographies>
          )}
          <Geographies geography={villagesInProvince}>
            {({ geographies }) =>
              geographies.map((geo, index) => {
                return (
                  <Geography
                    key={geo.properties.Name_3}
                    geography={geo}
                    style={{
                      default: {
                        fill: "transparent",
                        strokeWidth: "0.3px",
                      },
                      hover: {
                        fill: "#e0eaf3",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#e0eaf3",
                      },
                    }}
                    stroke='white'
                    onClick={() => handleSelectedVillage(geo)}
                  ></Geography>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};
export default MapComponent;

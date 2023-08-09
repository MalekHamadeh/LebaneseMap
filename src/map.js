import React, { useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import levelOne from "./GeoJson/Lebanon_Level1.json";
import provincesData from "./GeoJson/Lebanon_Level2.json";
import villagesData from "./GeoJson/Lebanon_Level3.json";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  TransformWrapper,
  TransformComponent,
  useTransformEffect,
} from "react-zoom-pan-pinch";

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
  const [selectedLevel, setSelectedLevel] = React.useState(null);
  const [selectedProvince, setSelectedProvince] = React.useState(null);
  const [ProvincesInLevelOne, setProvincesInLevelOne] = React.useState([]);
  const [villagesInProvince, setVillagesInProvince] = React.useState([]);
  const [selectedVillage, setSelectedVillage] = React.useState(null);
  const [projectionConfig, setProjectionConfig] = React.useState({
    scale: 19000,
    center: [35.85, 33.85],
  });

  const initialX = 0; // Initial X position
  const initialY = 0; // Initial Y position
  const initialScale = 1; // Initial scale
  const minScale = 0.5; // Minimum scale
  const maxScale = 10; // Maximum scale

  const handleLevelOneClick = (geo) => {
    setSelectedLevel(geo);
    const levelId = geo.properties.GID_1;
    const ProvinceId = provincesData.features.filter(
      (province) => province.properties.GID_1 === levelId
    );
    setProvincesInLevelOne(ProvinceId);
    setSelectedProvince(null);
    console.log("hi");
  };

  const handleProvinceClick = (geo) => {
    setSelectedProvince(geo);
    const provinceId = geo.properties.GID_2;
    const villagesInSelectedProvince = villagesData.features.filter(
      (village) => village.properties.GID_2 === provinceId
    );
    setVillagesInProvince(villagesInSelectedProvince);
    setSelectedVillage(null);
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
                          strokeWidth: "0.2px",
                        },
                        hover: {
                          fill: "white",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "white",
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
                        strokeWidth: "0.2px",
                      },
                      hover: {
                        fill: "white",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "white",
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

import React, { useEffect, useState } from "react";
import IconVersus from "../icons/IconVersus";
import IconX from "../icons/IconX";
import IconCalculator from "../icons/IconCalculator";
import { getDistance } from "geolib";
import IconBack from "../icons/IconBack";
import { storage } from "../utils/storage";
import L, { LatLngBounds, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Fix for default markers in react-leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapFitToMarkers = ({ coordinates }: { coordinates: string[] }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates.length >= 2) {
      const firstCoordinate = coordinates[0]
        ?.split(",")
        .map((coor) => parseFloat(coor.trim()));
      const secondCoordinate = coordinates[1]
        ?.split(",")
        .map((coor) => parseFloat(coor.trim()));

      if (firstCoordinate?.length === 2 && secondCoordinate?.length === 2) {
        const bounds = new LatLngBounds([
          [firstCoordinate[0] || 0, firstCoordinate[1] || 0],
          [secondCoordinate[0] || 0, secondCoordinate[1] || 0],
        ]);
        map.fitBounds(bounds.pad(0.1));
      }
    }
  }, [coordinates, map]);

  return null;
};

const SingleCoordinateMap = ({ coordinates }: { coordinates: string[] }) => {
  const firstCoordinate = coordinates[0]
    ?.split(",")
    .map((coor) => parseFloat(coor.trim()));
  const secondCoordinate = coordinates[1]
    ?.split(",")
    .map((coor) => parseFloat(coor.trim()));
  let center: number[] | undefined;
  if (firstCoordinate && secondCoordinate) {
    center = [
      ((firstCoordinate[0] || 0) + (firstCoordinate[1] || 0)) / 2,
      ((secondCoordinate[0] || 0) + (secondCoordinate[1] || 0)) / 2,
    ];
  }

  console.log("Center:", center, firstCoordinate, secondCoordinate);

  return (
    <div className="h-48 w-full">
      <MapContainer
        center={center as LatLngExpression}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFitToMarkers coordinates={coordinates} />

        {firstCoordinate && firstCoordinate.length === 2 && (
          <Marker position={firstCoordinate as L.LatLngExpression}>
            <Popup>
              <div>
                <p>
                  Coordinates: {firstCoordinate?.[0]}, {firstCoordinate?.[1]}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        {secondCoordinate && secondCoordinate.length === 2 && (
          <Marker position={secondCoordinate as L.LatLngExpression}>
            <Popup>
              <div>
                <p>
                  Coordinates: {secondCoordinate?.[0]}, {secondCoordinate?.[1]}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

const App = () => {
  const [isMultiple, setIsMultiple] = useState<boolean | null>(null);
  const [coordinates, setCoordinates] = useState<string[]>([]);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [singleDistance, setSingleDistance] = useState<number | null>(null);

  const handleSingleCoordinatesChange = async () => {
    console.log("Single Coordinates:", coordinates);
    if (coordinates.length > 1) {
      const firstCoordinate = coordinates[0]?.split(",");
      const secondCoordinate = coordinates[1]?.split(",");
      if (!firstCoordinate || !secondCoordinate) return;
      setIsCalculated(true);
      await storage.set("isCalculated", true);
      const distance = getDistance(
        {
          latitude: parseFloat(firstCoordinate?.[0] || "0"),
          longitude: parseFloat(firstCoordinate?.[1] || "0"),
        },
        {
          latitude: parseFloat(secondCoordinate?.[0] || "0"),
          longitude: parseFloat(secondCoordinate?.[1] || "0"),
        }
      );
      await storage.set("singleDistance", distance || 0);
      setSingleDistance(distance || 0);
    }
  };

  useEffect(() => {
    const handleFocus = async () => {
      console.log("Popup focused, refreshing data");
      const iscal = await storage.get<boolean>("isCalculated");
      const ismul = await storage.get<boolean | string | null>("isMultiple");
      const singleDist = await storage.get("singleDistance");
      const coor = await storage.get("coordinates");
      setIsCalculated((iscal || false) as boolean);
      setSingleDistance(parseFloat(singleDist as any));
      setIsMultiple(
        ismul === "null" || isMultiple === null ? null : (ismul as boolean)
      );
      setCoordinates(coor === null ? [] : JSON.parse(coor as string));
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="bg-gradient-to-tr from-green-200 to-green-600 min-w-[360px] max-w-[720px] min-h-72 max-h-[1000px] p-6 flex flex-col text-black overflow-scroll">
      <div className="flex items-center justify-center relative mb-6">
        {isMultiple !== null && (
          <div className="absolute left-0 inset-y-0 flex items-center justify-center">
            <button
              onClick={async () => {
                await storage.set("isMultiple", `${null}`);
                setIsMultiple(null);
              }}
              className="hover:opacity-50 transition"
            >
              <IconBack size={20} className="fill-white" />
            </button>
          </div>
        )}
        <h1 className="text-base font-bold text-center">
          Coordinates Calculator
        </h1>
      </div>
      {isMultiple === null ? (
        <div className="flex items-center justify-center w-full space-x-2">
          <button
            className="bg-white rounded-lg flex-1 flex items-center justify-center font-semibold text-black hover:opacity-80 transition aspect-square "
            onClick={async () => {
              await storage.set("isMultiple", false);
              setIsMultiple(false);
            }}
          >
            Single Coordinate
          </button>
          <button
            className="bg-green-500 rounded-lg flex-1 flex items-center justify-center font-semibold text-white hover:opacity-80 transition aspect-square "
            onClick={async () => {
              await storage.set("isMultiple", true);
              setIsMultiple(true);
            }}
          >
            Multi Coordinate
          </button>
        </div>
      ) : isMultiple === true ? (
        <></>
      ) : (
        <div className="flex flex-col items-start">
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-col space-y-1 w-full">
              <p className="text-sm font-medium">Coordinate 1 (Lat,Long)</p>
              <input
                type="text"
                value={coordinates[0]}
                onChange={(e) => {
                  const temp = [...coordinates];
                  temp[0] = e.target.value;
                  setCoordinates(temp);
                }}
                onBlur={async (e) => {
                  const temp = [...coordinates];
                  temp[0] = e.target.value;
                  await storage.set("coordinates", JSON.stringify(temp));
                }}
                placeholder="e.g. 37.7749,-122.4194"
                className="form-input rounded-md w-full text-black placeholder:text-xs"
              />
            </div>
            <div className="flex items-center justify-center">
              <IconVersus size={28} className="fill-white" />
            </div>
            <div className="flex flex-col space-y-1 w-full -mt-3">
              <p className="text-sm font-medium">Coordinate 2 (Lat,Long)</p>
              <input
                type="text"
                value={coordinates[1]}
                onChange={(e) => {
                  const temp = [...coordinates];
                  temp[1] = e.target.value;
                  setCoordinates(temp);
                }}
                onBlur={async (e) => {
                  const temp = [...coordinates];
                  temp[1] = e.target.value;
                  await storage.set("coordinates", JSON.stringify(temp));
                }}
                placeholder="e.g. 37.7749,-122.4194"
                className="form-input rounded-md w-full text-black placeholder:text-xs"
              />
            </div>
            {!isCalculated && !singleDistance ? (
              <div className="w-full">
                <button
                  onClick={() => handleSingleCoordinatesChange()}
                  className="bg-green-700/70 w-full mt-3 font-bold text px-4 py-2 rounded-xl flex items-center justify-center space-x-2 text-white hover:opacity-80 transition"
                >
                  <IconCalculator size={28} className="stroke-white" />
                  Calculate
                </button>
              </div>
            ) : (
              <div className="w-full">
                {(singleDistance || 0) < 50 ? (
                  <div className="bg-green-400 rounded-md p-4 pt-6 mt-3 w-full flex flex-col items-center justify-center relative">
                    <IconX
                      size={20}
                      className="absolute top-2 right-2 cursor-pointer hover:opacity-70 transition fill-white"
                      onClick={async () => {
                        setIsCalculated(false);
                        setSingleDistance(null);
                        setCoordinates([]);
                        await storage.set("isCalculated", false);
                        await storage.set("singleDistance", `${null}`);
                      }}
                    />
                    <p className="text-white mb-4 text-sm">
                      Distance is between these coordinates is approximately{" "}
                      <span className="font-semibold text-green-800">
                        {singleDistance}
                      </span>
                      {` `}
                      meters from centre coordinate.
                    </p>
                    <SingleCoordinateMap coordinates={coordinates} />
                  </div>
                ) : (
                  <div className="bg-red-400 rounded-md p-4 pt-6 mt-3 w-full flex flex-col items-center justify-center relative">
                    <IconX
                      size={20}
                      className="absolute top-2 right-2 cursor-pointer hover:opacity-70 transition fill-white"
                      onClick={async () => {
                        setIsCalculated(false);
                        setSingleDistance(null);
                        setCoordinates([]);
                        await storage.set("isCalculated", false);
                        await storage.set("singleDistance", `${null}`);
                      }}
                    />
                    <p className="text-white text-sm mb-4">
                      Distance is between these coordinates is approximately{" "}
                      <span className="font-semibold text-red-800">
                        {singleDistance}
                      </span>{" "}
                      meters.
                    </p>
                    <SingleCoordinateMap coordinates={coordinates} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

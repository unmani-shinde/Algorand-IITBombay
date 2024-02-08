import React, { useState } from "react";
import "./Rating.css";
export interface ICustomiseRatingProps {
  keyValue: any;
  handleChangeRating: (key: any, value: any) => void;
  handleDeleteStrength: (key: any) => void;
}
const CustomiseRating = (props: ICustomiseRatingProps) => {
  const [selectedRating, setSelectedRating] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    Nan: false,
  });
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ marginLeft: "20px" }}>{"\u2022 " + props.keyValue}</label>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="ratingContainer">
          <div
            className={
              selectedRating.one ? "ratingNumber active" : "ratingNumber"
            }
            onClick={() => {
              setSelectedRating({
                one: true,
                two: false,
                three: false,
                four: false,
                five: false,
                Nan: false,
              });
              props.handleChangeRating(props.keyValue, "1");
            }}
          >
            1
          </div>
          <div
            className={
              selectedRating.two ? "ratingNumber active" : "ratingNumber"
            }
            onClick={() => {
              setSelectedRating({
                one: false,
                two: true,
                three: false,
                four: false,
                five: false,
                Nan: false,
              });
              props.handleChangeRating(props.keyValue, "2");
            }}
          >
            2
          </div>
          <div
            className={
              selectedRating.three ? "ratingNumber active" : "ratingNumber"
            }
            onClick={() => {
              setSelectedRating({
                one: false,
                two: false,
                three: true,
                four: false,
                five: false,
                Nan: false,
              });
              props.handleChangeRating(props.keyValue, "3");
            }}
          >
            3
          </div>
          <div
            className={
              selectedRating.four ? "ratingNumber active" : "ratingNumber"
            }
            onClick={() => {
              setSelectedRating({
                one: false,
                two: false,
                three: false,
                four: true,
                five: false,
                Nan: false,
              });
              props.handleChangeRating(props.keyValue, "4");
            }}
          >
            4
          </div>
          <div
            className={
              selectedRating.five ? "ratingNumber active" : "ratingNumber"
            }
            onClick={() => {
              setSelectedRating({
                one: false,
                two: false,
                three: false,
                four: false,
                five: true,
                Nan: false,
              });
              props.handleChangeRating(props.keyValue, "5");
            }}
          >
            5
          </div>
          <div
            className={
              selectedRating.Nan ? "ratingNumber active" : "ratingNumber"
            }
            onClick={() => {
              setSelectedRating({
                one: false,
                two: false,
                three: false,
                four: false,
                five: false,
                Nan: true,
              });
              props.handleChangeRating(props.keyValue, "N/a");
            }}
          >
            N/a
          </div>
        </div>
        <div
          className="deleteStrength"
          onClick={() => props.handleDeleteStrength(props.keyValue)}
        >
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2560"
            width="30"
            height="30"
          >
            <path
              d="M896.142698 247.342995 845.913043 247.342995 845.913043 993.557785C845.913043 1009.950157 832.624256 1023.238945 816.231884 1023.238945 816.167955 1023.238945 816.105168 1023.234378 816.04162 1023.233998 815.978072 1023.234378 815.915285 1023.238945 815.851356 1023.238945L206.246005 1023.238945C206.182077 1023.238945 206.119289 1023.234378 206.055741 1023.233998 205.992193 1023.234378 205.929406 1023.238945 205.865478 1023.238945 189.473106 1023.238945 176.184318 1009.950157 176.184318 993.557785L176.184318 247.342995 127.857302 247.342995C111.254879 247.342995 97.795615 233.883731 97.795615 217.281308 97.795615 200.678885 111.254879 187.219621 127.857302 187.219621L340.952806 187.219621 340.952806 33.866964C340.952806 33.356296 340.965744 32.849052 340.991239 32.344853 340.966124 31.840654 340.952806 31.333411 340.952806 30.822742 340.952806 14.22032 354.41207 0.761055 371.014493 0.761055L653.746563 0.761055C670.348986 0.761055 683.80825 14.22032 683.80825 30.822742 683.80825 31.333411 683.794931 31.840654 683.769816 32.344853 683.795312 32.849052 683.80825 33.356296 683.80825 33.866964L683.80825 187.219621 896.142698 187.219621C912.745121 187.219621 926.204385 200.678885 926.204385 217.281308 926.204385 233.883731 912.745121 247.342995 896.142698 247.342995ZM430.376812 963.11557 594.764771 963.11557 594.764771 247.342995 430.376812 247.342995 430.376812 963.11557ZM235.546637 247.342995 235.546637 963.11557 371.014493 963.11557 371.014493 247.342995 235.546637 247.342995ZM624.445931 60.88443 400.315124 60.88443 400.315124 187.219621 624.445931 187.219621 624.445931 60.88443ZM654.12709 247.342995 654.12709 963.11557 786.550725 963.11557 786.550725 247.342995 654.12709 247.342995Z"
              p-id="2561"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};
export default CustomiseRating;

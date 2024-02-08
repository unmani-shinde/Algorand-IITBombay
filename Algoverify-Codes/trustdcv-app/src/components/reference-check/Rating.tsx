import "./Rating.css";
import { useState } from "react";
export interface IRatingProps {
  handleChangeRating: (rating: string) => void;
}
const Rating = (props: IRatingProps) => {
  const [selectedRating, setSelectedRating] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    Nan: false,
  });

  return (
    <div className="ratingContainer">
      <div
        className={selectedRating.one ? "ratingNumber active" : "ratingNumber"}
        onClick={() => {
          setSelectedRating({
            one: true,
            two: false,
            three: false,
            four: false,
            five: false,
            Nan: false,
          });
          props.handleChangeRating("1");
        }}
      >
        1
      </div>
      <div
        className={selectedRating.two ? "ratingNumber active" : "ratingNumber"}
        onClick={() => {
          setSelectedRating({
            one: false,
            two: true,
            three: false,
            four: false,
            five: false,
            Nan: false,
          });
          props.handleChangeRating("2");
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
          props.handleChangeRating("3");
        }}
      >
        3
      </div>
      <div
        className={selectedRating.four ? "ratingNumber active" : "ratingNumber"}
        onClick={() => {
          setSelectedRating({
            one: false,
            two: false,
            three: false,
            four: true,
            five: false,
            Nan: false,
          });
          props.handleChangeRating("4");
        }}
      >
        4
      </div>
      <div
        className={selectedRating.five ? "ratingNumber active" : "ratingNumber"}
        onClick={() => {
          setSelectedRating({
            one: false,
            two: false,
            three: false,
            four: false,
            five: true,
            Nan: false,
          });
          props.handleChangeRating("5");
        }}
      >
        5
      </div>
      <div
        className={selectedRating.Nan ? "ratingNumber active" : "ratingNumber"}
        onClick={() => {
          setSelectedRating({
            one: false,
            two: false,
            three: false,
            four: false,
            five: false,
            Nan: true,
          });
          props.handleChangeRating("N/a");
        }}
      >
        N/a
      </div>
    </div>
  );
};

export default Rating;

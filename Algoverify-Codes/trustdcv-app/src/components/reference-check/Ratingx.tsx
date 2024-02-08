import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/system";

const RatingContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

const RatingItem = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "rgb(212, 212, 212)",
  marginRight: 8,
  color: "#000",
  "&:hover": {
    backgroundColor: "#0077ff",
    transition: "transform 0.4s ease-in-out",
    transform: "scale(1.1)",
  },
});

const RatingItemText = styled("span")({
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
});
const CustomRating = styled(Rating)({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
interface RatingComponentProps {
  maxRating: number;
  handleChangeRating: (rating: string) => void;
}

export function NumberRating({ maxRating }: RatingComponentProps) {
  const [value, setValue] = useState(0);

  const handleRatingChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | null
  ) => {
    setValue(newValue || 0);
  };

  const renderValue = (value: number) => {
    // if (value === 0) {
    //   return "NA";
    // }
    return (
      <RatingItem>
        <RatingItemText>{value}</RatingItemText>
      </RatingItem>
    );
  };

  return (
    <RatingContainer>
      <CustomRating
        name="rating"
        value={value}
        onChange={handleRatingChange}
        precision={1}
        max={maxRating}
        //  icon={renderValue}
        // emptyIcon={renderValue}
        emptyLabelText="NA"
      />
    </RatingContainer>
  );
}

export default NumberRating;

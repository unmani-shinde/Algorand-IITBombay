import React, { useState } from "react";
import Rating from "./Rating";
import "./Questionnaire.css";
import RadioButton from "./RadioButton";
import CustomiseRating from "./CustomiseRating";
import { toast } from "react-toastify";
import { useMutationApi } from "@/hooks/useMutationApi";
export interface IQuestionnaireProps {
  referee: any;
}
const Questionnaire = (props: IQuestionnaireProps) => {
  const [isInThisCompany, setIsInThisCompany] = useState("");
  const [isThisRole, setIsThisRole] = useState("");
  const [isThisDate, setIsThisDate] = useState("");
  const [isDirectToYou, setIsDirectToYou] = useState<any>("");
  const [relationship, setRelationship] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [comScore, setComScore] = useState("");
  const [relScore, setRelScore] = useState("");
  const [teamScore, setTeamScore] = useState("");
  const [isRecommend, setIsRecommend] = useState("");
  const [strengthInput, setStrengthInput] = useState("");
  const [custStrengths, setCustStrengths] = useState<any>({});
  const [strengthOrder, setStrengthOrder] = useState([]);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [softSkill1, setSoftSkill1] = useState("");
  const [softSkill2, setSoftSkill2] = useState("");
  const [softSkill3, setSoftSkill3] = useState("");
  const uploadAnswerApi = useMutationApi("uploadAnswer");
  const errorMsg = "this field is required";

  const validateInputs = () => {
    let isValid = true;
    let errorRecorder: any = {};
    setErrors({});
    if (isInThisCompany === "") {
      errorRecorder.isInThisCompany = errorMsg;
    }
    if (isThisRole === "") {
      errorRecorder.isThisRole = errorMsg;
    }
    if (isThisDate === "") {
      errorRecorder.isThisDate = errorMsg;
    }
    if (isDirectToYou === "") {
      errorRecorder.isDirectToYou = errorMsg;
    }
    if (isDirectToYou === false && relationship === "") {
      errorRecorder.relationship = errorMsg;
    }
    if (linkedInLink === "") {
      errorRecorder.linkedInLink = errorMsg;
    }
    if (comScore === "") {
      errorRecorder.comScore = errorMsg;
    }
    if (relScore === "") {
      errorRecorder.relScore = errorMsg;
    }
    if (teamScore === "") {
      errorRecorder.teamScore = errorMsg;
    }
    if (isRecommend === "") {
      errorRecorder.isRecommend = errorMsg;
    }
    if (softSkill1 === "") {
      errorRecorder.softSkill1 = errorMsg;
    }
    if (softSkill2 === "") {
      errorRecorder.softSkill2 = errorMsg;
    }
    if (softSkill3 === "") {
      errorRecorder.softSkill3 = errorMsg;
    }
    Object.keys(custStrengths).forEach((key) => {
      if (custStrengths[key] === "") {
        errorRecorder[key] = errorMsg;
      }
    });
    // if have error -> return false
    if (Object.keys(errorRecorder).length !== 0) {
      setErrors(errorRecorder);
      isValid = false;
    }
    return isValid;
  };
  const handleSubmitAnswer = async (event: any) => {
    event.preventDefault();
    try {
      // handle form submission here
      if (validateInputs()) {
        var params: any = {
          refereeId: props.referee.refereeId,
          company: isInThisCompany,
          role: isThisRole,
          date: isThisDate,
          isDirectToYou: isDirectToYou,
          relationship: relationship,
          linkedInLink: linkedInLink,
          comScore: comScore,
          relScore: relScore,
          teamScore: teamScore,
          isRecommend: isRecommend,
          comment: comment,
          softSkill1: {
            [Object.keys(props.referee.softSkill1)[0]]: softSkill1,
          },
          softSkill2: {
            [Object.keys(props.referee.softSkill2)[0]]: softSkill2,
          },
          softSkill3: {
            [Object.keys(props.referee.softSkill3)[0]]: softSkill3,
          },
        };
        let counter = 1;
        Object.keys(custStrengths).forEach((key) => {
          params[`custStrength${counter}`] = { [key]: custStrengths[key] };
          counter++;
        });

        const result = await uploadAnswerApi.mutateAsync(params);
        if (result.message === "success") {
          toast.success("submit success");
        } else {
          toast.error("submit failed, please contact admin");
        }
      }
    } catch (error) {
      toast.error("submit failed, please contact admin");
    }
  };

  const handleChangeRating = (key: string, score: any) => {
    setCustStrengths((prevState: any) => ({
      ...prevState,
      [key]: score,
    }));
  };
  const handleAddStrengths = () => {
    if (strengthInput === "") {
      return;
    } else if (Object.keys(custStrengths).length >= 5) {
      // user only can add up to 5
      console.log("you can only add up to 5 strengths");
    } else if (strengthInput in custStrengths) {
      // user already add this strength
      console.log("you already add this strength");
    } else {
      // record order
      setStrengthOrder([...strengthOrder, strengthInput] as any);
      // record user input and score for rating
      setCustStrengths({ ...custStrengths, [strengthInput]: "" });
      // clear user input
      setStrengthInput("");
    }
  };
  const handleDeleteStrength = (key: string) => {
    const { [key]: omit, ...rest } = custStrengths;
    setCustStrengths(rest);
    setStrengthOrder(strengthOrder.filter((item) => item !== key));
    console.log(strengthOrder);
  };

  return (
    <div className="survey-container">
      <form onSubmit={handleSubmitAnswer}>
        <label>Hello {props.referee.refereeName},</label>
        <p className="introduction">
          {props.referee.employeeName} has uploaded their onto TrustD CVs, we
          are the world’s first verified CV recruitment platform. They have
          recommended you as a referee. We are writing to verify their work
          experience and skills, this should take 3-5 minutes in total.
        </p>
        <label className="questionLabel">
          Can you confirm following questions:{" "}
        </label>

        <label className="questionLabel">
          {props.referee.employeeName} worked at {props.referee.company}?
        </label>
        <RadioButton answer={isInThisCompany} setAnswer={setIsInThisCompany} />
        {errors.isInThisCompany && (
          <p className="inputError">{errors.isInThisCompany}</p>
        )}

        <label className="questionLabel">In {props.referee.role}?</label>
        <RadioButton answer={isThisRole} setAnswer={setIsThisRole} />
        {errors.isThisRole && <p className="inputError">{errors.isThisRole}</p>}

        <label className="questionLabel">
          For {props.referee.startDate + " to " + props.referee.endDate}?
        </label>
        <RadioButton answer={isThisDate} setAnswer={setIsThisDate} />
        {errors.isThisDate && <p className="inputError">{errors.isThisDate}</p>}

        <label className="questionLabel">
          Did they report directly to you?
        </label>
        <RadioButton answer={isDirectToYou} setAnswer={setIsDirectToYou} />
        {errors.isDirectToYou && (
          <p className="inputError">{errors.isDirectToYou}</p>
        )}

        {isDirectToYou === false && (
          <div style={{ marginTop: "10px" }}>
            <label className="questionLabel">
              What is your relationship to them?
            </label>
            <input
              style={{ marginTop: "14px" }}
              type="text"
              value={relationship}
              onChange={(e: any) => setRelationship(e.target.value)}
            />
            {errors.relationship && (
              <p className="inputError">{errors.relationship}</p>
            )}
          </div>
        )}
        <label>Please add your linked in profile</label>
        <input
          type="text"
          value={linkedInLink}
          onChange={(e: any) => setLinkedInLink(e.target.value)}
        />
        {errors.linkedInLink && (
          <p className="inputError">{errors.linkedInLink}</p>
        )}

        <label>
          Please rate {props.referee.employeeName} following skills (1-5
          stars)?​
        </label>
        <label className="skillLabel">1. Communication skills</label>
        <Rating handleChangeRating={setComScore}></Rating>
        {errors.comScore && (
          <p className="ratingInputError">{errors.comScore}</p>
        )}

        <label className="skillLabel">2. Reliability</label>
        <Rating handleChangeRating={setRelScore}></Rating>
        {errors.relScore && (
          <p className="ratingInputError">{errors.relScore}</p>
        )}

        <label className="skillLabel">3. Team Player</label>
        <Rating handleChangeRating={setTeamScore}></Rating>
        {errors.teamScore && (
          <p className="ratingInputError">{errors.teamScore}</p>
        )}

        <label>
          Please rate {props.referee.employeeName} following self-added soft
          skills (1-5 stars)?​
        </label>
        <label className="skillLabel">
          1. {Object.keys(props.referee.softSkill1)[0]}
        </label>
        <Rating handleChangeRating={setSoftSkill1}></Rating>
        {errors.comScore && (
          <p className="ratingInputError">{errors.comScore}</p>
        )}

        <label className="skillLabel">
          2. {Object.keys(props.referee.softSkill2)[0]}
        </label>
        <Rating handleChangeRating={setSoftSkill2}></Rating>
        {errors.relScore && (
          <p className="ratingInputError">{errors.relScore}</p>
        )}

        <label className="skillLabel">
          3. {Object.keys(props.referee.softSkill3)[0]}
        </label>
        <Rating handleChangeRating={setSoftSkill3}></Rating>
        {errors.teamScore && (
          <p className="ratingInputError">{errors.teamScore}</p>
        )}

        <label>Any other strengths you would like to add?</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={strengthInput}
            onChange={(e: any) => setStrengthInput(e.target.value)}
          />
          <button
            type="button"
            className="otherStrengthBtn"
            onClick={() => handleAddStrengths()}
          >
            Add
          </button>
        </div>
        {custStrengths && (
          <div>
            {strengthOrder.map((key) => (
              <React.Fragment key={key}>
                <CustomiseRating
                  keyValue={key}
                  handleChangeRating={handleChangeRating}
                  handleDeleteStrength={handleDeleteStrength}
                ></CustomiseRating>
                {errors[key] && (
                  <p className="ratingInputError">{errors[key]}</p>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <label>
          Would you recommend hiring {props.referee.employeeName} in the future?
        </label>
        <RadioButton answer={isRecommend} setAnswer={setIsRecommend} />
        {errors.isRecommend && (
          <p className="inputError">{errors.isRecommend}</p>
        )}

        <label>
          Do you have any other comments about hiring{" "}
          {props.referee.employeeName}?
        </label>
        <textarea
          className="commentArea"
          value={comment}
          onChange={(e: any) => setComment(e.target.value)}
        ></textarea>
        <button type="submit" onClick={(e: any) => handleSubmitAnswer(e)}>
          Submit
        </button>
        <p>
          Blue Tick HR will never share your contact details with prospective
          employers without express written consent.
          <br />
          If you would like to have your CV references verified, join Blue Tick
          HR
          <a href="https://www.google.com/">{"<here>"}</a>
        </p>
      </form>
    </div>
  );
};

export default Questionnaire;

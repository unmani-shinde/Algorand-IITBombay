import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./VerifyIdentity.css";
import { useMutationApi } from "@/hooks/useMutationApi";

const COOLINGDOWN_TIME = 60;
export interface IVerifyIdentityProps {
  referee: any;
  setVerified: (v: boolean) => void;
}
const VerifyIdentity = (props: IVerifyIdentityProps) => {
  const initialCountdown = parseInt(localStorage.getItem("countdown") || "0");
  const [countdown, setCountdown] = useState(initialCountdown);
  const [isDisabled, setIsDisabled] = useState(initialCountdown > 0);
  const [codeInputed, setCodeInputed] = useState("");
  const [reminder, setReminder] = useState("");
  const verifyOneTimeCodeApi = useMutationApi("verifyOneTimeCode");
  const resendOneTimeCodeApi = useMutationApi("resendOneTimeCode");

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      localStorage.setItem("countdown", countdown.toString());
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && isDisabled) {
      setIsDisabled(false);
      localStorage.removeItem("countdown");
    }
    return () => clearTimeout(timer);
  }, [countdown, isDisabled]);

  const handleResendCode = async () => {
    try {
      if (!isDisabled) {
        setIsDisabled(true);
        setCountdown(COOLINGDOWN_TIME);
        const result = await resendOneTimeCodeApi.mutateAsync({
          refereeId: props.referee.refereeId,
        });
        if (result.message === "success") {
          setReminder("");
          toast.success("One time code sent successfully");
        }
      }
    } catch (error) {
      setReminder("resend code failed");
    }
  };
  const handleVerifyCode = async () => {
    if (verifyOneTimeCodeApi.isLoading) {
      return;
    }
    try {
      if (!codeInputed) {
        setReminder("one time code can not be empty");
        props.setVerified(false);
      } else {
        const result = await verifyOneTimeCodeApi.mutateAsync({
          refereeId: props.referee.refereeId,
          oneTimeCode: codeInputed,
        });
        if (result.message && result.message === "success") {
          props.setVerified(true);
          //  toast.info("OTP code is valid");
        } else {
          toast("OTP is not valid", { type: "error" });
        }
      }
    } catch (error) {
      console.log(error);
      props.setVerified(false);
      toast("verify failed", { type: "error" });
    }
  };

  return (
    <Container className="p-5">
      <Row>
        <Col>
          <p>Hello {props.referee.refereeName},</p>
          <p>
            {props.referee.employeeName} has uploaded their onto TrustD CVs, we
            are the world’s first verified CV recruitment platform. They have
            recommended you as a referee. We are writing to verify their work
            experience and skills, this should take 3-5 minutes in total.
          </p>
          <p>
            Please note your responses will be forwarded to other employers.
            However, If you do not recommend this employee we will not add your
            recommendation to the website.
          </p>
          <p>You can ignore this message or decline to comment.</p>
          <p className="alert alert-warning fs-2" role="alert">
            This page contains sensitive personal information, so please verify
            the one-time code sent to your email address:{" "}
            <strong>{props.referee.refereeEmail}</strong>.
          </p>
          <div className="d-flex align-items-center">
            <label className="me-2">one time code:</label>
            <div className="d-flex flex-grow-1">
              <input
                type="text"
                id="inputField"
                className="form-control me-2"
                value={codeInputed}
                onChange={(e: any) => setCodeInputed(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary btn-height"
                onClick={handleVerifyCode}
              >
                Verify
              </button>
            </div>
          </div>

          <div className="resendCodeContainer">
            <label>
              Didn&apos;t receive your code?{" "}
              <span
                className={isDisabled ? "disabledSpan" : "enabledSpan"}
                onClick={handleResendCode}
              >
                {isDisabled ? `${countdown}s` : "Resend code"}
              </span>
              <span className="reminder">{reminder}</span>
            </label>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default VerifyIdentity;

"use client";
import React, { useState } from "react";

import { useParams, usePathname } from "next/navigation";
import Questionnaire from "./Questionnaire";
import VerifyIdentity from "./VerifyIdentity";
import { Loading } from "@/components/common/Loading";
import { useRefereeInformation } from "@/hooks/useRefereeInformation";
import { ToastContainer } from "react-toastify";
import "./ReferenceCheckPage.css";
import "react-toastify/dist/ReactToastify.css";

const ReferenceCheckPage = () => {
  const { refereeId } = useParams();
  const pathname = usePathname();
  const [verified, setVerified] = useState(false);
  const { data, isLoading } = useRefereeInformation(refereeId, pathname);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ToastContainer autoClose={5000} theme="colored" />
      {data ? (
        <div>
          {verified === false ? (
            <VerifyIdentity setVerified={setVerified} referee={data.referee} />
          ) : (
            <Questionnaire referee={data.referee} />
          )}
        </div>
      ) : (
        <span className="msg-span">
          load failed, please check your referee id or contact our admins
        </span>
      )}
    </div>
  );
};
export default ReferenceCheckPage;

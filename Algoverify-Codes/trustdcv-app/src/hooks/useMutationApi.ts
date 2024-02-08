import { useMutation } from "react-query";
import {
  resendOneTimeCode,
  verifyOneTimeCode,
  uploadAnswer,
  fileUpload,
} from "./repository";

export function useMutationApi(
  endpoint:
    | "resendOneTimeCode"
    | "verifyOneTimeCode"
    | "uploadAnswer"
    | "fileUpload"
) {
  const postData = async (data: any) => {
    switch (endpoint) {
      case "resendOneTimeCode":
        return await resendOneTimeCode(data);

      case "verifyOneTimeCode":
        return await verifyOneTimeCode(data);

      case "uploadAnswer":
        return await uploadAnswer(data);

      case "fileUpload":
        return await fileUpload(data);
    }
  };

  return useMutation(postData);
}

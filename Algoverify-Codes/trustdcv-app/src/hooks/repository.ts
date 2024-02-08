import axios from "axios";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "";

async function resendOneTimeCode(params: any) {
  const res = await axios.post(
    `${API_HOST}/api/referee/${params.refereeId}/resend-code`,
    params
  );
  return res.data;
}
async function verifyOneTimeCode(params: any) {
  const res = await axios.post(
    `${API_HOST}/api/referee/${params.refereeId}/verify-code`,
    params
  );
  return res.data;
}
async function getRefereeInformation(refereeId: any) {
  const res = await axios.get(API_HOST + `/api/referee/${refereeId}`);
  return res.data;
}
async function uploadAnswer(params: any) {
  const res = await axios.post(API_HOST + "/api/application/submit", params);
  return res.data;
}

async function fileUpload(data: any) {
  const res = await axios.request({
    url: "/api/file/upload",
    method: "POST",
    baseURL: API_HOST,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export {
  resendOneTimeCode,
  verifyOneTimeCode,
  getRefereeInformation,
  uploadAnswer,
  fileUpload,
};

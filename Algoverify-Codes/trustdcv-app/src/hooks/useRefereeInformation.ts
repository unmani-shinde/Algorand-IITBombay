import { useQuery } from "react-query";
import { getRefereeInformation } from "./repository";

export function useRefereeInformation(refereeId: string, pathname: string) {
  return useQuery(["refereeInformation", refereeId, pathname], async () => {
    const id = refereeId === "index" ? pathname.split("/").pop() : refereeId;
    return await getRefereeInformation(id);
  });
}

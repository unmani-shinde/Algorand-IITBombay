import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const useRedirectOnPatternMatch = (pattern: string) => {
  const router = useRouter();
  const pathname = usePathname();
  console.log("useRedirectOnPatternMatch", pattern, pathname);
  useEffect(() => {
    if (pathname.match(pattern)) {
      console.log("redirecto to", pathname);
      // router.push(pathname);
    }
  }, [router, pathname, pattern]);
};

export default useRedirectOnPatternMatch;

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useTopLoader } from "nextjs-toploader";

type UseLoaderReturn = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function useLoader(initialIsLoading: boolean): UseLoaderReturn {
  const [isLoading, setIsLoading] = useState<boolean>(initialIsLoading);
  const loader = useTopLoader();

  useEffect(() => {
    if (isLoading) {
      loader.start();
    } else {
      loader.done();
    }
  }, [isLoading, loader]);

  useEffect(() => {
    setIsLoading(initialIsLoading);
  }, [initialIsLoading]);

  // return [isLoading, setIsLoading];
  return { isLoading, setIsLoading };
}

import { useState, useEffect } from "react";

const BREAKPOINTS = {
  MOBILE: 767,
  TABLET: 1024,
};

export default function useDeviceSize() {
  const [device, setDevice] = useState({ isMobile: false, isTablet: false, isDesktop: false });

  useEffect(() => {
    const mobileMql = window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE}px)`);
    const tabletMql = window.matchMedia(
      `(min-width: ${BREAKPOINTS.MOBILE + 1}px ) and (max-width: ${BREAKPOINTS.TABLET}px)`
    );

    const updateDevice = () => {
      console.log(mobileMql, tabletMql);

      setDevice({
        isMobile: mobileMql.matches,
        isTablet: tabletMql.matches,
        isDesktop: !mobileMql.matches && !tabletMql.matches,
      });
    };

    mobileMql.addEventListener("change", updateDevice);
    tabletMql.addEventListener("change", updateDevice);

    updateDevice();
    return () => {
      mobileMql.removeEventListener("change", updateDevice);
      tabletMql.removeEventListener("change", updateDevice);
    };
  }, []);

  return device;
}

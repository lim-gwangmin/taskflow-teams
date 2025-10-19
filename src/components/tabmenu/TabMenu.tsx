import { useRef, useState, useEffect } from "react";

export default function TabMenu({ menus = [], onClick }) {
  const tabRefs = useRef([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  // 각 탭의 DOM 요소를 저장하기 위한 ref 배열

  useEffect(() => {
    const activeTabNode = tabRefs.current[activeTabIndex];
    if (activeTabNode) {
      setIndicatorStyle({
        left: activeTabNode.offsetLeft,
        width: activeTabNode.clientWidth,
      });
    }
  }, [activeTabIndex, menus]);

  const handleTabClick = (index, params) => {
    setActiveTabIndex(index);
    onClick({ groupName: params });
  };

  return (
    <div className="relative">
      <ul className="flex items-center gap-[18px]">
        {menus.map((menu, index) => (
          <li
            key={index}
            // 3. 각 li 요소를 ref 배열에 저장
            ref={(el) => (tabRefs.current[index] = el)}
          >
            <button
              type="button"
              // 4. 활성화 상태에 따라 텍스트 색상과 굵기를 동적으로 변경
              className={`px-4 py-3 text-base font-medium transition-colors duration-300 ${
                activeTabIndex === index ? "text-blue-500 font-semibold" : "text-gray-500"
              }`}
              onClick={() => handleTabClick(index, menu.params)}
            >
              {menu.title}
            </button>
          </li>
        ))}
      </ul>
      <div
        className="absolute bottom-[-1px] h-[2px] bg-blue-500 transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />
    </div>
  );
}

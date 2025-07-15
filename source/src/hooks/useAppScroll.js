"use client";

const useAppScroll = () => {
  const handleScrollTo = (elementId = "top-anchor", addTop = 0) => {
    const anchor = document.getElementById(`${elementId}`);
    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });

      setTimeout(() => {
        window.scrollBy({
          top: 0 + addTop,
          behavior: "smooth",
        });
      }, 400);
    }
  };

  return { handleScrollTo };
};

export default useAppScroll;

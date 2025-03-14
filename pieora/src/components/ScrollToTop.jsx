import { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return show ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "gray",
        color: "white",
        border: "none",
        borderRadius: "80%",
        width: "40px",
        height: "40px",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      ⬆
    </button>
  ) : null;
};

export default ScrollToTop;

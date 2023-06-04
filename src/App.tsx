import { useQuery } from "@tanstack/react-query";
import diceSvg from "./assets/images/icon-dice.svg";
import mbDividerSvg from "./assets/images/pattern-divider-mobile.svg";
import { useEffect, useState } from "react";
import dtDividerSvg from "./assets/images/pattern-divider-desktop.svg";

type AdviceResponse = {
  slip: {
    id: number;
    advice: string;
  };
};

const App = () => {
  const [randomId, setRandomId] = useState(7);
  
  const [imageSrc, setImageSrc] = useState("");
  const { status, data, error } = useQuery<AdviceResponse>({
    queryKey: ["advice", randomId],
    queryFn: async () => {
      const advice = await fetchAdvice(randomId);
      return advice;
    },
  });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 1240) {
        setImageSrc(mbDividerSvg);
      } else {
        setImageSrc(dtDividerSvg);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getRandomId = () => {
    const r = Math.floor(Math.random() * 224 + 1);
    setRandomId(r);
  };

  const fetchAdvice = async (id: number): Promise<AdviceResponse> => {
    const res = await fetch(`https://api.adviceslip.com/advice/${id}`);
    if (!res.ok) {
      throw new Error("Unstable Network, can't get advice!");
    }
    return res.json();
  };

  let content: string;
  if (status === "loading") {
    content = "Loading...";
  } else if (status === "error") {
    content = (error as Error)?.message;
  } else {
    content = data.slip.advice;
  }

  return (
    <main>
      <article className="container">
        <h1 className="advice-header">ADVICE #{data?.slip?.id}</h1>
        <p className="advice-text">&ldquo;{content}&rdquo;</p>
        <img src={imageSrc} alt="pattern-divider" className="divider" />
        <button className="dice-btn" onClick={getRandomId}>
          <img src={diceSvg} alt="dice-button" />
        </button>
      </article>
      <div className="attribution">
        Challenge by{" "}
        <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
          Frontend Mentor
        </a>
        . Coded by{" "}
        <a href="https://www.frontendmentor.io/profile/erke31-2">KaungSet</a>.
      </div>
    </main>
  );
};
export default App;

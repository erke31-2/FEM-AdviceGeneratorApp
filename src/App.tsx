import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import diceSvg from "./assets/images/icon-dice.svg";
import mbDividerSvg from "./assets/images/pattern-divider-mobile.svg";
import dtDividerSvg from "./assets/images/pattern-divider-desktop.svg";

type AdviceResponse = {
  slip: {
    id: number;
    advice: string;
  };
};

const App = () => {
  const generateRandomId = () => {
    return Math.floor(Math.random() * 224 + 1);
  };
  const [randomId, setRandomId] = useState(generateRandomId());
  console.log(randomId);

  // const [imageSrc, setImageSrc] = useState("");
  const { status, data, error } = useQuery<AdviceResponse>({
    queryKey: ["advice", randomId],
    queryFn: async () => {
      const advice = await fetchAdvice(randomId);
      return advice;
    },
  });

  // useEffect(() => {
  //   const handleResize = () => {
  //     const screenWidth = window.innerWidth;
  //     if (screenWidth <= 1240) {
  //       setImageSrc(mbDividerSvg);
  //     } else {
  //       setImageSrc(dtDividerSvg);
  //     }
  //   };
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const getRandomId = () => {
    const r = generateRandomId();
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
    <section>
      <article className="container">
        <h1 className="advice-header">ADVICE #{data?.slip?.id}</h1>
        <p className="advice-text">&ldquo;{content}&rdquo;</p>
        <picture className="divider">
          <source srcSet={dtDividerSvg} media="(min-width: 760px)" />
          <img src={mbDividerSvg} alt="divider" />
        </picture>

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
    </section>
  );
};
export default App;

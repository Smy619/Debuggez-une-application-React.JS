import { useEffect, useMemo, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const AUTOPLAY_MS = 5000;

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const byDateDesc = useMemo(() => {
    const list = Array.isArray(data?.focus) ? [...data.focus] : [];
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data]);

  useEffect(() => {
    let timer;
    if (byDateDesc.length) {
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % byDateDesc.length);
      }, AUTOPLAY_MS);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [byDateDesc.length, index]);

  if (!byDateDesc.length) return null;

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.id ?? event.title ?? idx}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt={event.title || "slide"} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((slide, radioIdx) => (
            <input
              key={`dot-${
                slide.id ?? `${slide.title}-${slide.date}` ?? radioIdx
              }`}
              type="radio"
              name="slider-pagination"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)}
              aria-label={`Aller à la diapositive ${radioIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;

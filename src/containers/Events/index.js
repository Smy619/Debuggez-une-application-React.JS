import { useMemo, useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const typeList = useMemo(() => {
    const events = data?.events || [];
    const types = [];
    events.forEach((e) => {
      if (!e?.type) return;
      const normalized = e.type.trim().toLowerCase();
      if (!types.find((t) => t.value === normalized)) {
        types.push({ value: normalized, label: e.type.trim() });
      }
    });
    return types;
  }, [data]);

  const filteredByType = useMemo(() => {
    const events = data?.events || [];

    if (!type) return events;

    return events.filter((e) => (e.type || "").trim().toLowerCase() === type);
  }, [data, type]);

  const pageNumber = useMemo(() => {
    const pages = Math.ceil((filteredByType.length || 0) / PER_PAGE);
    return Math.max(1, pages);
  }, [filteredByType]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredByType.slice(start, start + PER_PAGE);
  }, [filteredByType, currentPage]);

  const changeType = (newType) => {
    setType(newType ? newType.value : null);
    setCurrentPage(1);
  };

  if (error) return "error";
  if (data === null) return "loading";
  return (
    <>
      <h3 className="SelectTitle">Catégories</h3>
      <Select selection={typeList} onChange={changeType} />
      <div id="events" className="ListContainer">
        {paginatedEvents.map((event) => (
          <Modal key={event.id} Content={<ModalEvent event={event} />}>
            {({ setIsOpened }) => (
              <EventCard
                onClick={() => setIsOpened(true)}
                imageSrc={event.cover}
                title={event.title}
                date={new Date(event.date)}
                label={event.type}
              />
            )}
          </Modal>
        ))}
      </div>
      {filteredByType.length > 0 && (
        <div className="Pagination" aria-label="Pagination des événements">
          {Array.from({ length: pageNumber }).map((_, index) => {
            const pageId = `page-${index + 1}`;
            return (
              <button
                key={pageId}
                type="button"
                className={currentPage === index + 1 ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(index + 1);
                }}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export default EventList;

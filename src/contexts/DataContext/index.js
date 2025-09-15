import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import eventsData from "../../data/events.json";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    try {
      const response = await fetch("/events.json");
      if (!response.ok) throw new Error("fetch failed");
      return await response.json();
    } catch (err) {
      // fallback to local events.json
      // eslint-disable-next-line no-console
      console.warn("Using fallback data from src/data/events.json:", err.message);
      return eventsData;
    }
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;

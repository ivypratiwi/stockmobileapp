import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // function to load from disk
  async function loadFromDisk() {
    try {
      const dataFromDisk = await AsyncStorage.getItem("stockWatchList");
      if (dataFromDisk != null) {
        setState(JSON.parse(dataFromDisk));
      }
    } catch {
      alert("Unable to load from disk");
    }
  }


  async function addToWatchlist(newSymbol) {
    //add the new symbol to the watchlist, save it in state and persist to AsyncStorage
    try {
      await setState(prev => prev.concat(newSymbol))
      AsyncStorage.setItem('stockWatchList', JSON.stringify([...state, newSymbol]))
    }
    catch{
      alert("There was an error saving.");
    }
  }

  useEffect(() => {
    //Retrieve watchlist from persistent storage
    loadFromDisk()
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state, addToWatchlist };
};

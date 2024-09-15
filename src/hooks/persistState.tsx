import { createContext, ReactNode, useEffect } from 'react';
import { useModel } from '@modern-js/runtime/model';

import { AppModel } from '@/state/appModel';

const AppStateContext = createContext({});

const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [{ community, worlds, maps }, actions] = useModel(AppModel);

  useEffect(() => {
    const community = localStorage.getItem('community');
    const worlds = localStorage.getItem('worlds');
    const maps = localStorage.getItem('maps');

    if (community) {
      console.log('Setting state from local storage', community);
      actions.setCommunity(JSON.parse(community));
    }

    if (worlds) {
      console.log('Setting worlds from local storage', worlds);
      actions.setWorlds(JSON.parse(worlds));
    }

    if (maps) {
      console.log('Setting maps from local storage', maps);
      actions.setMaps(JSON.parse(maps));
    }
  }, []);

  useEffect(() => {
    if (community) {
      console.log('Persisting Community changes', community);
      localStorage.setItem('community', JSON.stringify(community));
    } else {
      console.log('Clearing Community from local storage');
      localStorage.removeItem('community');
    }
  }, [community]);

  useEffect(() => {
    if (worlds.length > 0) {
      console.log('Persisting World changes', worlds);
      localStorage.setItem('worlds', JSON.stringify(worlds));
    } else {
      console.log('Clearing Worlds from local storage');
      localStorage.removeItem('worlds');
    }
  }, [worlds]);

  useEffect(() => {
    if (maps.length > 0) {
      console.log('Persisting Map changes', maps);
      localStorage.setItem('maps', JSON.stringify(maps));
    } else {
      console.log('Clearing Maps from local storage');
      localStorage.removeItem('maps');
    }
  }, [maps]);

  return (
    <AppStateContext.Provider value={{}}>{children}</AppStateContext.Provider>
  );
};

export default AppStateProvider;

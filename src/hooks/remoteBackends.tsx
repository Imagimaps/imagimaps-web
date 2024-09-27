import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type RemoteBackends = {
  mapApiHost: string;
  mapApiBaseUrl: string;
  cdnBaseUrl: string;
};

const RemoteBackendsContext = createContext<RemoteBackends>({
  mapApiHost: 'localhost:8082',
  mapApiBaseUrl: 'http://localhost:8082/api/map',
  cdnBaseUrl: 'https://cdn.dev.imagimaps.com',
});

const RemoteBackendsProvider = ({ children }: { children: ReactNode }) => {
  const { hostname } = window.location;
  const [mapApiHost, setMapApiHost] = useState<string>('localhost:8082');
  const [mapApiBaseUrl, setMapApiBaseUrl] = useState<string>(
    'http://localhost:8082',
  );
  const [cdnBaseUrl, setCdnBaseUrl] = useState<string>(
    'https://cdn.dev.imagimaps.com',
  );

  useEffect(() => {
    switch (hostname) {
      case 'localhost':
        setMapApiBaseUrl('http://localhost:8082');
        break;
      case 'dev.imagimaps.com':
      case 'imagimaps.com':
        setMapApiHost(`api-alb.${hostname}`);
        setMapApiBaseUrl(`https://api-alb.${hostname}/api/map`);
        setCdnBaseUrl(`https://cdn.${hostname}`);
        break;
      default:
        console.error('[RemoteBackend] Unknown hostname:', hostname);
        break;
    }
  }, []);

  return (
    <RemoteBackendsContext.Provider
      value={{
        mapApiHost,
        mapApiBaseUrl,
        cdnBaseUrl,
      }}
    >
      {children}
    </RemoteBackendsContext.Provider>
  );
};

export default RemoteBackendsProvider;

export const useRemoteBackends = () => {
  return useContext(RemoteBackendsContext);
};

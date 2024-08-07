import { useEffect } from 'react';
import { useParams } from '@modern-js/runtime/router';
import { MdOutlinePerson } from 'react-icons/md';

// import Map from '@/components/map/map';
// import Viewpane from '@/components/map2/viewpane';

import './page.scss';

const MapPage = () => {
  const { roomId, mapId } = useParams();

  useEffect(() => {
    console.log('TODO: Get Map Data', roomId, mapId);
  }, []);

  return (
    <div id="map-page">
      <header>
        <div id="header-title">
          <h1>Map</h1>
          <h2>Room: {roomId}</h2>
          <p>{' > '}</p>
          <h2>Map: {mapId}</h2>
        </div>
        <div id="header-profile">
          <MdOutlinePerson />
        </div>
      </header>
      {/* <Map /> */}
      {/* <Viewpane roomId={roomId ?? 'test'} mapId={mapId ?? 'test'} /> */}
    </div>
  );
};

export default MapPage;

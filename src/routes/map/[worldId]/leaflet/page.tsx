import { useEffect } from 'react';
import { useParams } from '@modern-js/runtime/router';
import { MdOutlinePerson } from 'react-icons/md';

// import MapView from '@/components/leaflet/mapView';

import './page.scss';

const MapPage = () => {
  const { worldId } = useParams();
  const mapId = 'leaflet';

  useEffect(() => {
    console.log('Leaflet - Get Map Data', worldId, mapId);
  }, []);

  return (
    <div id="map-page">
      <header>
        <div id="header-title">
          <h1>Map</h1>
          <h2>World: {worldId}</h2>
          <p>{' > '}</p>
          <h2>Map: {mapId}</h2>
        </div>
        <div id="header-profile">
          <MdOutlinePerson />
        </div>
      </header>
      {/* {worldId && mapId && <MapView worldId={worldId} mapId={mapId} />} */}
    </div>
  );
};

export default MapPage;

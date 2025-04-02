import { FC, useEffect, useMemo, useRef } from 'react';
import { useModel } from '@modern-js/runtime/model';
import L from 'leaflet';
import { MenuItem } from 'primereact/menuitem';
import LayersSVG from '@shared/svg/layers.svg';
import { Menu } from 'primereact/menu';
import { EngineDataModel } from '../../state/engineData';
import SvgIcon from '@/components/icon/svg';

import './index.scss';

const OverlayFilter: FC = () => {
  const [{ overlays, hiddenOverlays }, actions] = useModel(EngineDataModel);

  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<Menu>(null);

  const filterPanelHeader = {
    template: () => {
      return (
        <div className="marker-filter-panel-header">
          <p>Visible Overlays</p>
        </div>
      );
    },
  };

  const filterItemTemplate = (item: MenuItem) => {
    return (
      <label className="marker-filter-panel-item">
        <input
          type="checkbox"
          className="marker-filter-panel-checkbox"
          checked={!item.data.isHidden}
          onChange={e => {
            const isHidden = !e.target.checked;
            console.log('Filter overlay', item.id, isHidden);
            if (isHidden) {
              actions.hideOverlay(item.id!);
            } else {
              actions.showOverlay(item.id!);
            }
          }}
        />
        {item.label}
      </label>
    );
  };

  const filterableOverlays = useMemo(() => {
    const overlayItems: MenuItem[] = [filterPanelHeader];
    const ol = overlays.map(overlay => ({
      id: overlay.id,
      icon: overlay.icon,
      label: overlay.name,
      data: {
        isHidden: hiddenOverlays.find(h => h === overlay.id),
      },
      command: () => {
        console.log('Filter overlay', overlay);
      },
      template: filterItemTemplate,
    }));
    overlayItems.push(...ol);
    return overlayItems;
  }, [overlays, hiddenOverlays]);

  useEffect(() => {
    if (filterPanelRef.current) {
      L.DomEvent.disableClickPropagation(filterPanelRef.current);
    }
  }, []);

  return (
    <div className="marker-filter-panel-wrapper">
      <div className="marker-filter-panel" ref={filterPanelRef}>
        <SvgIcon
          className="meta-icon"
          src={LayersSVG}
          alt="Visible Overlays"
          onClick={event => {
            filterMenuRef.current?.toggle(event);
          }}
          style={{ width: '16px', height: '16px' }}
        />
        <Menu
          model={filterableOverlays}
          popup
          ref={filterMenuRef}
          id="popup_menu_left"
        />
      </div>
    </div>
  );
};

export default OverlayFilter;

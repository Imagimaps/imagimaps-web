import { FC, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import SettingsSVG from '@shared/svg/settings.svg';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import SvgIcon from '@/components/icon/svg';

import './index.scss';

const EngineSettings: FC = () => {
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<Menu>(null);

  const filterPanelHeader = {
    template: () => {
      return (
        <div className="marker-filter-panel-header">
          <p>Map Settings</p>
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
          checked={item.data.enabled}
          onChange={e => {
            const { checked } = e.target;
            console.log('[Engine Settings] Item Checked', item.id, checked);
          }}
        />
        {item.label}
      </label>
    );
  };

  const settingsItems = useMemo(() => {
    const overlayItems: MenuItem[] = [filterPanelHeader];
    overlayItems.push({
      id: 'map-settings',
      icon: 'pi pi-cog',
      label: 'Stub Setting',
      data: {
        enabled: true,
      },
      template: filterItemTemplate,
    });
    return overlayItems;
  }, []);

  useEffect(() => {
    if (settingsPanelRef.current) {
      L.DomEvent.disableClickPropagation(settingsPanelRef.current);
    }
  }, []);

  return (
    <div className="engine-settings-panel-wrapper">
      <div className="engine-settings-panel" ref={settingsPanelRef}>
        <SvgIcon
          className="meta-icon"
          src={SettingsSVG}
          alt="Add"
          onClick={event => {
            settingsMenuRef.current?.toggle(event);
          }}
          style={{ width: '16px', height: '16px' }}
        />
        <Menu
          model={settingsItems}
          popup
          ref={settingsMenuRef}
          id="popup_menu_left"
        />
      </div>
    </div>
  );
};

export default EngineSettings;

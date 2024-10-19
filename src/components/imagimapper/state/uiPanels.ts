import { model } from '@modern-js/runtime/model';

export type UIPanelData = {
  clickPosition: { lng: number; lat: number } | undefined;
  showCtxMenu: boolean;
  showDetailsPanel: boolean;
};

const UIPanelDataDefaults: UIPanelData = {
  clickPosition: undefined,
  showCtxMenu: false,
  showDetailsPanel: false,
};

export const UIPanelDataModel = model<UIPanelData>('UIPanelData').define(
  (_, { onMount }) => {
    onMount(() => {
      console.log('UIPanelDataModel mounted');
    });

    return {
      state: UIPanelDataDefaults,
      actions: {
        toggleCtxMenu: (state: UIPanelData) => {
          state.showCtxMenu = !state.showCtxMenu;
        },
        toggleDetailsPanel: (state: UIPanelData) => {
          state.showDetailsPanel = !state.showDetailsPanel;
        },
        setClickPosition: (
          state: UIPanelData,
          position: { lng: number; lat: number },
        ) => {
          state.clickPosition = position;
        },
      },
    };
  },
);

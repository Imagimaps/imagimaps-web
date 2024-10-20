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
        closeCtxMenu: (state: UIPanelData) => {
          state.showCtxMenu = false;
        },
        openCtxMenu: (state: UIPanelData) => {
          state.showCtxMenu = true;
        },
        closeDetailsPanel: (state: UIPanelData) => {
          state.showDetailsPanel = false;
        },
        openDetailsPanel: (state: UIPanelData) => {
          state.showDetailsPanel = true;
        },
        setClickPosition: (
          state: UIPanelData,
          position: { lng: number; lat: number },
        ) => {
          state.clickPosition = position;
        },
        clearClickPosition: (state: UIPanelData) => {
          state.clickPosition = undefined;
        },
      },
    };
  },
);

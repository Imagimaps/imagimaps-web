import { model } from '@modern-js/runtime/model';
import { DisplayTemplate, MapMarker, Overlay } from '@shared/_types';

export type UserInteractions = {
  selectedTemplate?: DisplayTemplate;
  stagedMarker?: Partial<MapMarker>;
  lastUsedOverlay?: Overlay;
  lastUsedTemplate?: DisplayTemplate;
};

export const UserInteractionsModel = model('UserInteractions').define(
  (_, { onMount }) => {
    onMount(() => {
      console.log('UserInteractions Model Mounted');
    });
    return {
      state: {} as UserInteractions,
      computed: {},
      actions: {
        overlayUsed: (state: UserInteractions, overlay: Overlay) => {
          state.lastUsedOverlay = overlay;
        },
        templateUsed: (state: UserInteractions, template: DisplayTemplate) => {
          state.lastUsedTemplate = template;
        },
      },
    };
  },
);

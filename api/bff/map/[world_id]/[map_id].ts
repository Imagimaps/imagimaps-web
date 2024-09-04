import {
  MapOverlay,
  MapMarker,
  MapTopology,
  TemplateGroup,
  Map,
  MapMetadata,
} from '@shared/_types';

export type FetchMapResponse = {
  map: Map;
  defaults: MapMetadata;
  user?: Partial<MapMetadata>;
};

export default async (worldId: string, mapId: string) => {
  console.log('In Leaftlet world');
  console.log(`Get data for map ${mapId} in room ${worldId}`);

  const resourcesOverlay: MapOverlay = {
    id: '9e6ef0e5',
    type: 'Overlay',
    name: 'Resources',
    description: 'Raw Resources Overlay',
    markers: [
      {
        id: '8x7Uhv',
        type: 'Marker',
        name: 'Planty Plant',
        description: 'Its a plant!',
        position: {
          x: 50,
          y: 50,
        },
        refTemplateid: 'HKNDqZ',
      } as MapMarker,
      {
        id: 'zO9CtL',
        type: 'Marker',
        name: 'Test Point 2',
        description: 'Test Point Description',
        refTemplateid: 'HKNDqZ',
        position: {
          x: 350,
          y: 80,
        },
      } as MapMarker,
      {
        id: 'f1Kfw-',
        type: 'Marker',
        name: 'Deathly Ore',
        description:
          // eslint-disable-next-line max-len
          'Warning! The pansy sniffer wibbly wobbly gank group loves ganking this spot. One might say this mining spot is cursed! :(',
        refTemplateid: 'bZ9io6',
        position: {
          x: 200,
          y: 269,
        },
      } as MapMarker,
    ],
    regions: [],
  };

  const enemiesOverlay: MapOverlay = {
    id: 'fcabe6a0',
    type: 'Overlay',
    name: 'Baddies',
    description: 'Mark the position of baddies here!',
    markers: [
      {
        id: 'xQ4bx9',
        type: 'Marker',
        name: 'Toe Fungus Ganker Leaders house',
        description: 'A real fun guy!',
        position: {
          x: 1000,
          y: 1000,
        },
        refTemplateid: 'pz6ynx',
      },
    ],
    regions: [
      {
        id: '7v#-8q',
        type: 'Region',
        name: 'Toe Fungus Ganker Camp',
        description: 'A camp of gankers who love to gank!',
        points: [
          {
            x: 100,
            y: 100,
          },
          {
            x: 200,
            y: 100,
          },
          {
            x: 200,
            y: 200,
          },
          {
            x: 100,
            y: 200,
          },
        ],
        refTemplateid: 'pz6ynx',
      },
    ],
  };

  const testTopography: MapTopology = {
    id: '9b027e00',
    name: 'Base Topography',
    description: 'Test Topography',
    position: {
      x: 0,
      y: 0,
    },
    bounds: {
      top: 0,
      left: 0,
      bottom: 1000,
      right: 1000,
    },
    baseImageSrc: 'https://imagimaps.com/imagimaps_test_map-min.png',
    overlays: [resourcesOverlay, enemiesOverlay],
  };

  const templateGroupResources: TemplateGroup = {
    id: 'waCOPr',
    name: 'Resources',
    description: 'Test Resources Template Group',
    templates: [
      {
        id: 'HKNDqZ',
        name: 'Herbs',
        description: 'Test Herbs Template',
        imgSrc:
          // eslint-disable-next-line max-len
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgNzYgNzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDc2LjAwIDc2LjAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KCTxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTSAzOCwxOUMgMzgsMTkgNDEsMjEgNDAsMjJDIDQwLDIyIDQyLDE5IDQwLjc1LDI0LjI1QyA0MC43NSwyNC4yNSA0MywyMSA0MS41LDI1Ljc1QyA0MS41LDI1Ljc1IDQ0LDIyIDQyLjI1LDI3LjI1QyA0Mi4yNSwyNy4yNSA0NCwyNSA0MywyOUMgNDMsMjkgNDUsMjggNDMsMzJDIDQzLDMyIDQ1LDMxIDQzLDM1QyA0MywzNSA0NSwzNSA0MiwzOUMgNDIsMzkgNDQsMzcgNDQsMzlDIDQ0LDM5IDQ2LDM0IDQ2LDM3QyA0NiwzNyA0OCwzMSA0OCwzNUMgNDgsMzUgNTEsMzAgNTAsMzRDIDUwLDM0IDUyLDI5IDUyLDMyQyA1MiwzMiA1NiwyOCA1NCwzMkMgNTQsMzIgNTUuNzUsMzAuMjUgNTYuNzUsMzAuMjUwMUMgNTcuNzUsMzAuMjUwMSA1NywzMiA1NSwzM0MgNTUsMzMgNTksMzIgNTUsMzVDIDU1LDM1IDU3LDM1IDU0LDM3QyA1NCwzNyA1NiwzOCA1MiwzOUMgNTIsMzkgNTYsNDAgNTEsNDFDIDUxLDQxIDUzLDQyIDUwLDQzQyA1MCw0MyA1Miw0NCA0OCw0NUMgNDgsNDUgNTEsNDUgNDcsNDZDIDQ3LDQ2IDUyLDQ2IDQ5LDQ3QyA0OSw0NyA1NSw0NyA1MSw0OEMgNTEsNDggNTcsNDggNTMsNDlDIDUzLjY2NjcsNDkgNTgsNDkgNTMsNTBDIDUzLDUwIDU1LDUxIDUwLDUxQyA1MCw1MSA1NCw1MyA0OCw1MUMgNDgsNTEgNTIsNTQgNDYsNTFDIDQ2LDUxIDUwLDUzLjc1IDQ0LDUxLjc1QyA0NCw1MS43NSA0Niw1MyA0Miw1MkMgNDIsNTIgNDUsNTMgNDYuMjUsNTUuNUMgNDMuMjUsNTYuNSA0MCw1MyAzOSw1MkwgMzksNTdMIDM3LDU3TCAzNyw1MkMgMzYsNTMgMzIuNzUsNTYuNSAyOS43NSw1NS41QyAzMSw1MyAzNCw1MiAzNCw1MkMgMzAsNTMgMzIsNTEuNzUgMzIsNTEuNzVDIDI2LDUzLjc1IDMwLDUxIDMwLDUxQyAyNCw1NCAyOCw1MSAyOCw1MUMgMjIsNTMgMjYsNTEgMjYsNTFDIDIxLDUxIDIzLDUwIDIzLDUwQyAyMiw1MCAyMiw1MCAyMC43NSw0OS41QyAyMiw0OSAyMi4zMzMzLDQ5IDIzLDQ5QyAxOSw0OCAyNSw0OCAyNSw0OEMgMjAsNDcgMjcsNDcgMjcsNDdDIDI0LDQ2IDMxLDQ2IDMxLDQ2QyAyNCw0NiAyOCw0NSAyOCw0NUMgMjQsNDQgMjYsNDMgMjYsNDNDIDIzLDQyIDI0LjUsNDEgMjQuNSw0MUMgMTkuNSw0MCAyMy41LDM5IDIzLjUsMzlDIDE5LjUsMzggMjEuNSwzNyAyMS41LDM3QyAxOC41LDM1IDIxLDM1IDIxLDM1QyAxOCwzMyAyMC43NSwzMy41IDIwLjc1LDMzLjVDIDE4Ljc1LDMyLjUgMTgsMzEgMTksMzFDIDIwLDMxIDIyLDMyLjUgMjIsMzIuNUMgMjAsMjkgMjQsMzMgMjQsMzNDIDIzLDI5IDI2LDM0IDI2LDM0QyAyNSwzMCAyOCwzNSAyOCwzNUMgMjgsMzEgMzAsMzcgMzAsMzdDIDMwLDM0IDMyLDM5IDMyLDM5QyAzMiwzNyAzNCwzOSAzNCwzOUMgMzEsMzUgMzMsMzUgMzMsMzVDIDMxLDMxIDMzLDMyIDMzLDMyQyAzMSwyOCAzMywyOSAzMywyOUMgMzIsMjUgMzQsMjcgMzQsMjdDIDMzLDI0IDM0LDI1IDM0LDI1QyAzNCwyMSAzNSwyNCAzNSwyNEMgMzQsMjAgMzYsMjIgMzYsMjJDIDM1LDIxIDM4LDE5IDM4LDE5IFogIi8+Cjwvc3ZnPgo=',
        targetSize: { width: 25, height: 25 },
        minSize: { width: 20, height: 20 },
        maxSize: { width: 70, height: 70 },
        data: {
          fillColor: 'green',
          lineColor: 'orange',
          lineWidth: 2,
        },
      },
      {
        id: 'bZ9io6',
        name: 'Ore',
        description:
          // eslint-disable-next-line max-len
          'Ore - The foundations of all society and a nessesary material needed to make just about everything. Hard to extract, you need specialised tools to be able to mine this lustrous material.',
        imgSrc:
          // eslint-disable-next-line max-len
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0zNDQuNTc4IDQ5My41NGwtMTE3LjIxNC0yLjAyNEwxMTguOSAzMzguNTM2bDE0LjM1NS01MS4zNTMgMzUuMjY0IDkuMzggNDAuMTQ1IDQyLjAzMy0xNy40NjctNTkuODc0IDIzLjgzNi0zNS4zNTgtNDIuNzQ4LTEwNC4wMzQgNDMuMTY1LTc5LjQ1IDcyLjQzNCAyMi40NjggNDYuMjYgODAuNDYtMjkuNDc0IDUtMzguNDc4LTM1LjAxNyAyMi41NjggNDguMDY0LS42NzIgMzcuMzY0LTI2LjA5IDE4LjIyNCAzNC45NSAxLjI4NCA0Ny4xNDUgMjMuODM1IDI4Ljc1LTI3Ljg3NCAzOC40ODggMTkuMDU3IDEwLjY0NyAzNy41NzgtMTguOTctMTMuNzg0LTc4LjE2NiAzOS45NjctNDQuOTgzLTE1LjM5IDUuODYtMjcuMTUzLTQyLjc2NiAzLjI3NCAyMy41NzMgMTEuOTEzLTkuNDkgMjIuOTQzIDU4LjAzNyAzMS4yODUgMjAuMzQgNzkuNDIzLTE1LjQ1IDM0LjczIDI5LjM5Ny0yMC4zNiA2Ni44My05LjQzOC03MS42MSA2NS44MXptLTE1OC41MjQtMy41MzhsLTUzLjQ4LTIuMjk2IDI3LjY2My02NC4wMDYgMzQuMzggNDkuNjk1LTguNTYzIDE2LjYwN3ptLTg2Ljc4LTM3LjA0bC0xMS4wOC0zNC44NzUtMzUuNTAzLTEwLjIwNCAzNC44NTgtMTEuMDkgMTAuMjEyLTM1LjUgMTEuMDkgMzQuODU1IDM1LjUwMiAxMC4yMi0zNC44NTcgMTEuMDgyLTEwLjIyIDM1LjUxem0yNTIuOTgzLTMzLjIwOGwtMjEuNTY1LTg0LjIyOCA3Mi4wNDItMzguOTkgNTMuNjgzIDU5LjMyMi0xOC42NjUgNTIuMjMtODUuNDk1IDExLjY2NnpNMTY5LjQ3IDI4MC42NzdsLTU5LjEzMy0xNS42MTItMjAuMjk4LTY5LjE2IDY2LjA2NC0zNy40NSAzNi45NCA4NC4xMjYtMjMuNTczIDM4LjA5N3ptMTcyLjEwNi0zOC45NzJsLTM4LjM4NS0xOS42NiAxLjU3NC0zOC44NiA0My42MDctOS45MTcgMjYuNzUzIDM5LjI5Ni0zMy41NDcgMjkuMTR6bTU4Ljg0NS00Ny4yM2wtMTQuMjM0LTQ1LjQyNS00Ni4xNC0xMy40NiA0NS40MS0xNC4yNjIgMTMuNDYtNDYuMTMyIDE0LjI1MiA0NS40MSA0Ni4xNCAxMy40NzgtNDUuNDEgMTQuMjM1LTEzLjQ3NyA0Ni4xNTZ6TTMyNy4wMSAxMjQuOWwtMjguNjY2LTU2Ljc2Mi0yOC45NzItNy45NiAyMi42NDUtNDEuNzE4IDI5LjMxMiAxNC4yNzggMTcuODQgNTkuNTQyLTEyLjE2IDMyLjYyeiIvPjwvc3ZnPgo=',
        targetSize: { width: 25, height: 25 },
        minSize: { width: 20, height: 20 },
        maxSize: { width: 70, height: 70 },
        data: {
          fillColor: 'brown',
          lineColor: 'black',
          lineWidth: 4,
        },
      },
      {
        id: 'HOJcbS',
        name: 'Shrooms',
        description: 'Suspicious Mushrooms...',
        imgSrc:
          // eslint-disable-next-line max-len
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0yNDMuMTU2IDMzLjQzOGMtMjAuOTQyLS4wNjMtNDIuNzM0IDIuMjU3LTY1LjE4NyA3LjQzN0MxMjYuOTYzIDUyLjY0MyA2OC4zMjIgMTA3LjQ3IDQyLjUzIDE2Mi43MiAyOS42MzYgMTkwLjM0MiAyNSAyMTcuNTggMzEuMjUgMjM4LjkzN2M1LjIyMiAxNy44NDggMTcuNDkyIDMyLjY0MyA0MS42MjUgNDIuMjgtNi40MzUtMTEuMzQ2LTExLjEyNy0yMy41MTUtMTMuNTk0LTM1LjQzN0w3Ny41OTUgMjQyYzMuMjk4IDE1LjkzNSAxMi4xMDQgMzMuODg4IDIzLjc1IDQ3LjM3NSAxNi40MSAzLjY4IDM0LjEzNiA2LjU5OCA1Mi42MjUgOC44NzUtNi4zNDItMTQuOTI3LTYuNS0yOC4xMjUtNi4yODItMzkuMzQ0bDE4LjY4Ny4zNzVjLS4yNzMgMTMuOTk0LS41NzcgMjQuOTk2IDkuOTcgNDEuNDA4IDE4LjE1NyAxLjY3MiAzNi44MTQgMi43NCA1NS41MyAzLjI4LS4zOTgtMTQuMjE3LjYtMjcuOTgzIDEuODc1LTQxLjVsMTguNTk0IDEuNzVjLTEuMjc1IDEzLjUyNS0yLjE4IDI2Ljc5OC0xLjc1IDQwLjEyNiAyMC4zOTQuMjAzIDQwLjY1My0uMjQyIDYwLjE4Ny0xLjIyIDIuNTM4LTE0LjY1IDQuMTk1LTI3Ljk4NSA1Ljg3Ni00MS41M2wxOC41NjMgMi4zMTJjLTEuNTIgMTIuMjMtMy4wNiAyNC42Mi01LjI4MyAzOC4wOTQgMTkuMDMzLTEuMzQyIDM3LjEwMy0zLjIxMiA1My42NTctNS41NjMgNS41OC0xNC4zODYgOS44Mi0yOC42MyAxMi4xODctNDIuNjg3bDE4LjQwOCAzLjA5NEM0MTIuMTQgMjY5IDQwOC44NiAyODEuMDQ2IDQwNC43MTcgMjkzYzkuNDUtMS43MyAxOC4yMjUtMy42MjYgMjYuMDk0LTUuNjg4IDkuMjg2LTE1LjA4NCAxNi4yNjYtMjkuOTE1IDIwLjAzMi00NC4zNDNsMTguMDk0IDQuNzE4Yy0yLjU1NiA5Ljc5LTYuMjggMTkuNDI4LTEwLjkwNyAyOC45NjggMTkuNzQ0LTExLjU5NCAyOC42LTI4LjgwNiAzMC4wNjQtNDkuNjg3IDEuOTUzLTI3Ljg0My0xMS4yNTItNjIuOTQyLTM3LjI1LTk1LjM3Ni00Mi4yNDgtNTIuNzA1LTExNi45MzgtOTcuODg2LTIwNy42ODgtOTguMTU2em0tNTcgMjg3LjE1NmMtMS42NTYgNy43Ni0zLjE0MiAxNS42NjQtNC40MDYgMjMuNTk0LTQuNTIgMjguMzYyLTYuMjY2IDU3LjA5Ny0zLjkzOCA4MC40MDYgMi4zMyAyMy4zMDggOS4xNzUgNDAuNDE0IDE4LjE1NyA0Ny4yNSAxNS45NzcgMTIuMTYgMzcuMDg1IDE3LjMxOCA1Ny4zNzQgMTYuNjg3IDIwLjI4OC0uNjMgMzkuNTAyLTcuMjU1IDUwLjg0NC0xNi41IDkuMDczLTcuMzk0IDE2LjQ2Ny0zMC42IDE3LjE4Ny02MC42NTUuNjQ3LTI3LjAwMy0zLjE4Ny01OS4wMDYtMTAuNS04OS4wOTQtNDAuMjkgMi4wNS04My4zNzQgMS42NjgtMTI0LjcyLTEuNjg2eiIvPjwvc3ZnPgo=',
        imgAnchor: { x: 0.5, y: 0 },
        targetSize: { width: 25, height: 25 },
        minSize: { width: 20, height: 20 },
        maxSize: { width: 70, height: 70 },
        data: {
          fillColor: 'brown',
          lineColor: 'black',
          lineWidth: 1,
        },
      },
    ],
  };

  const templateGroupPOI: TemplateGroup = {
    id: '8qc^g8',
    name: 'POI',
    description: 'Test POI Template Group',
    templates: [
      {
        id: 'Bi92t5',
        name: 'Temple',
        description: 'An interesting Temple',
        imgSrc:
          // eslint-disable-next-line max-len
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIyLDEwYTEsMSwwLDAsMCwuNzA3LTEuNzA3bC0yLjgtMi44LS45MzMtMy43M0ExLDEsMCwwLDAsMTgsMUg2YTEsMSwwLDAsMC0uOTcuNzU4TDQuMSw1LjQ4OGwtMi44LDIuOEExLDEsMCwwLDAsMiwxMEg0djhIM2ExLDEsMCwwLDAsMCwySDIxYTEsMSwwLDAsMCwwLTJIMjBWMTBaTTUuNzA3LDYuNzA3YTEsMSwwLDAsMCwuMjYzLS40NjVMNi43ODEsM0gxNy4yMTlsLjgxMSwzLjI0MmExLDEsMCwwLDAsLjI2My40NjVMMTkuNTg2LDhINC40MTRaTTE1LDEwdjhIOVYxMFpNNiwxMEg3djhINlptMTIsOEgxN1YxMGgxWm01LDRhMSwxLDAsMCwxLTEsMUgyYTEsMSwwLDAsMSwwLTJIMjJBMSwxLDAsMCwxLDIzLDIyWiIvPjwvc3ZnPg0K',
        targetSize: { width: 25, height: 25 },
        minSize: { width: 20, height: 20 },
        maxSize: { width: 70, height: 70 },
        data: {
          fillColor: 'yellow',
          lineColor: 'red',
          lineWidth: 1,
        },
      },
    ],
  };

  const testMapData: Map = {
    id: mapId,
    name: 'Test Map',
    description: 'Test Map Description',
    topology: testTopography,
    templateGroups: [templateGroupResources, templateGroupPOI],
    originOffset: { x: 0, y: 0 },
  };

  const defaultMetadata: MapMetadata = {
    activeTopologyId: testTopography.id,
    viewPosition: { x: 0, y: 0 },
    viewZoom: 1,
  };

  const mapDataResponse: FetchMapResponse = {
    map: testMapData,
    defaults: defaultMetadata,
    user: {},
  };

  return mapDataResponse;
};

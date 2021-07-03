import { writable, derived } from 'svelte/store';

const MOCK_INITIAL_POLYGONS = {
  L8EIvC: {
    id: 'L8EIvC',
    points: {
      LsJQaN: {
        x: 615,
        y: 45,
        id: 'LsJQaN'
      },
      QyO1oa: {
        x: 865,
        y: 65,
        id: 'QyO1oa'
      },
      jRfjxP: {
        x: 865,
        y: 245,
        id: 'jRfjxP'
      },
      i0spdb: {
        x: 560,
        y: 107,
        id: 'i0spdb'
      }
    },
    attributes: {}
  },
  DaNhAj: {
    id: 'DaNhAj',
    points: {
      YKdSHB: {
        x: 678,
        y: 247,
        id: 'YKdSHB'
      },
      IHLh3o: {
        x: 870,
        y: 295,
        id: 'IHLh3o'
      },
      ABqVA8: {
        x: 858,
        y: 497,
        id: 'ABqVA8'
      },
      WH2UKA: {
        x: 681,
        y: 475,
        id: 'WH2UKA'
      }
    },
    attributes: {}
  }
};

export const mode = writable(null);
export const isSnapEnabled = writable(true);
export const snapRadius = writable(20);

export const isToolbarDragging = writable(false);
export const toolbarX = writable(30);
export const toolbarY = writable(30);

export const renderSvg = writable(null);

export const hoveredPolygonId = writable(null);
export const dragablePolygonId = writable(null);
export const selectedPolygonId = writable(null);

export const dragablePointId = writable(null);
export const closestSnapablePointId = writable(null);

export const globalAttributesStore = writable({});

export const addLocalAttribute = ({ name, value }) =>
  globalAttributesStore.update(($globalAttributesStore) => ({ ...$globalAttributesStore, [name]: value }))

// global attributes
export const globalAttributes = {
  subscribe: globalAttributesStore.subscribe,
  add: ({ name, value }) => globalAttributesStore.update($globalAttributes => {
    $globalAttributes[name] = value;
    return $globalAttributes;
  }),
};

export const globalAttributesMap = derived([globalAttributes],
  ([$globalAttributes]) => Object.entries($globalAttributes)
    .reduce((acc, [name, value]) => [...acc, { [name]: value }], []))

export const polygonsStore = writable(MOCK_INITIAL_POLYGONS);

export const selectedPolygon = derived(
  [polygonsStore, selectedPolygonId],
  ([$polygonsStore, $selectedPolygonId]) => $polygonsStore[$selectedPolygonId]
);

export const dragablePoint = derived(
  [selectedPolygon, dragablePointId],
  ([$selectedPolygon, $dragablePointId]) => $selectedPolygon && $selectedPolygon.points[$dragablePointId]
);

export const hoveredPolygon = derived(
  [polygonsStore, hoveredPolygonId],
  ([$polygonsStore, $hoveredPolygonId]) => $polygonsStore[$hoveredPolygonId]
);

export const dragablePolygon = derived(
  [polygonsStore, dragablePolygonId],
  ([$polygonsStore, $dragablePolygonId]) => $polygonsStore[$dragablePolygonId]
);

export const polygons = {
  subscribe: polygonsStore.subscribe,
  addPolygon: (polygon) => polygonsStore.update($polygons => {
    $polygons[polygon.id] = polygon;
    return $polygons;
  }),
  deletePolygon: (polygonId) => polygonsStore.update($polygons => {
    $polygons = Object.values($polygons)
      .reduce((acc, polygon) => {
        return {
          ...acc,
          ...(polygon.id !== polygonId ? { [polygonId]: polygon } : {}),
        }
      }, {});
    return $polygons;
  }),
  addPoint: (polygon, point) => polygonsStore.update($polygons => {
    $polygons[polygon.id].points[point.id] = point;
    return $polygons;
  }),
  addLocalAttribute: (polygonId, attribute) => polygonsStore.update($polygons => {
    $polygons[polygonId].attributes[attribute.name] = attribute.value;
    return $polygons;
  }),
  deleteLocalAttribute: (polygonId, attribute) => polygonsStore.update($polygons => {
    $polygons[polygonId].attributes = Object.entries($polygons[polygonId].attributes)
      .reduce((acc, [name, value]) => {
        return {
          ...acc,
          ...(attribute.name !== name ? { [name]: value } : {}),
        }
      }, {});
    return $polygons;
  }),
  addGlobalAttribute: (attribute) => polygonsStore.update($polygons => {
    return Object.values($polygons).reduce((acc, polygon) => {
      return {
        ...acc,
        [polygon.id]: {
          ...polygon,
          attributes: {
            ...polygon.attributes,
            ...(!polygon.attributes[attribute.name] && {
              [attribute.name]: attribute.value
            })
          }
        }
      }
    }, {});
  }),
  movePoint: (polygon, pointId, x, y) => polygonsStore.update($polygons => {
    $polygons[polygon.id].points[pointId].x = x;
    $polygons[polygon.id].points[pointId].y = y;
    return $polygons;
  }),
  moveAllPoints: (polygon, x, y) => polygonsStore.update($polygons => {
    $polygons[polygon.id].points = Object.values(polygon.points).reduce((acc, point) => ({
      ...acc,
      [point.id]: {
        ...point,
        x: point.x + x,
        y: point.y + y,
      }
    }), {});
    return $polygons;
  }),
  set: (val) => polygonsStore.set(val)
};

// convert polygons and their points to arrays (maps)
export const polygonsMap = derived([polygonsStore],
  ([$polygonsStore]) => Object.values($polygonsStore).reduce((acc, polygon) => {
    return [...acc, {
      ...polygon,
      pointsMap: Object.values(polygon.points),
    }]
  }, []));

// flaten points object to renderable sring
export const renderPolygons = derived([polygonsMap],
  ([$polygonsMap]) => $polygonsMap.map((polygon) => {
    return {
      ...polygon,
      points: polygon.pointsMap.reduce((acc, { x, y }) => `${acc} ${x},${y}`, '').replace(' ', ''),
    }
  }));

export const drawablePolygon = (() => {
  const { subscribe, set, update } = writable(null);

  return {
    subscribe,
    addPoint: (newPoint) => update(($drawablePolygon) => {
      return {
        ...$drawablePolygon,
        points: {
          ...$drawablePolygon.points,
          [newPoint.id]: newPoint
        }
      }
    }),
    set: (val) => set(val)
  };
})();
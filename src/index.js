export const ActionTypes = [
  'INSERT_ENTITY',
  'UPDATE_ENTITY',
  'UPSERT_ENTITY',
  'DELETE_ENTITY'
].reduce((acc, val) => {
  acc[val] = val;
  return acc;
}, {});

export function buildEntityReducer(entityName) {
  return function (state = { byId: {}, allIds: [] }, { type, payload }) {
    if (!payload) {
      return state;
    }
    let items = payload[entityName];
    if (!items) {
      return state;
    }
    if (!Array.isArray(items)) {
      items = [items];
    }
    switch (type) {
      case ActionTypes.INSERT_ENTITY:
      case ActionTypes.UPSERT_ENTITY: {
        return items.reduce((ac, item) => ({
          byId: { ...ac.byId, [item.id]: item },
          allIds: ac.allIds.includes(item.id)
            ? ac.allIds
            : [...ac.allIds, item.id]
        }), state);
      }
      case ActionTypes.DELETE_ENTITY: {
        return items.reduce((ac, item) => {
          delete ac.byId[item.id];
          return {
            byId: ac.byId,
            allIds: ac.allIds.filter(id => id !== item.id)
          };
        }, state);
      }
      default:
        return state;
    }
  };
}

export default {
  buildEntityReducer
};

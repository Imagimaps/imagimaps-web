import { model } from '@modern-js/runtime/model';

const StringFilterModel = model('stringFilter').define(() => {
  return {
    state: {
      filterPattern: '',
    },
    actions: {
      setFilterPattern: (state, pattern: string) => {
        state.filterPattern = pattern;
      },
      clearFilterPattern: state => {
        state.filterPattern = '';
      },
    },
  };
});

export default StringFilterModel;

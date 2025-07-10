import { ActionType } from '../../src/@types/observableArray/actionType';
import { ObservableArray } from '../../src/class/Observables/ObservableArray';

test('ArrayObservable Remove', () => {
  const fun = jest.fn();
  const observable = new ObservableArray();
  observable.push('banana', 'apple', 'orange');
  observable.listen(fun);
  observable.remove(1);

  expect(fun).toHaveBeenCalledWith({
    indexs: [1],
    action: ActionType.DELETE,
  });
  expect(observable.value.map((m) => m.value)).toEqual(['banana', 'orange']);
});

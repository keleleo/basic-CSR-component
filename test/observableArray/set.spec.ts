import { ActionType } from '../../src/@types/observableArray/actionType';
import { ObservableArray } from '../../src/class/Observables/ObservableArray';

test('ArrayObservable Set', () => {
  const fun = jest.fn();
  const observable = new ObservableArray();
  observable.push('banana', 'apple', 'orange');
  observable.listen(fun);
  observable.set(1, 'Lemon');

  expect(fun).toHaveBeenCalledWith({
    indexs: [1],
    action: ActionType.UPDATE,
  });

  expect(observable.value.map((m) => m.value)).toEqual([
    'banana',
    'Lemon',
    'orange',
  ]);
});

import { ActionType } from '../../src/@types/observableArray/actionType';
import { ObservableArray } from '../../src/class/Observables/ObservableArray';

test('ArrayObservable push', () => {
  const fun = jest.fn();
  const observable = new ObservableArray();
  observable.listen(fun);
  observable.push('banana', 'apple', 'orange');

  expect(fun).toHaveBeenCalledWith({
    indexs: [0, 1, 2],
    action: ActionType.INSERT,
  });
  expect(observable.value.map((m) => m.value)).toEqual([
    'banana',
    'apple',
    'orange',
  ]);
});

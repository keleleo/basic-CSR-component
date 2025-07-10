import { ActionType } from '../../src/@types/observableArray/actionType';
import { ObservableArray } from '../../src/class/Observables/ObservableArray';

test('ArrayObservable Swap', () => {
  const fun = jest.fn();
  const observable = new ObservableArray();
  observable.push('banana', 'apple', 'orange');
  observable.listen(fun);
  observable.swap(1, 2);

  expect(fun).toHaveBeenCalledWith({
    indexs: [1, 2],
    action: ActionType.MOVE,
  });

  expect(observable.value.map((m) => m.value)).toEqual([
    'banana',
    'orange',
    'apple',
  ]);
});

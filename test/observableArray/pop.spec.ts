import { ActionType } from '../../src/@types/observableArray/actionType';
import { ObservableArray } from '../../src/class/Observables/ObservableArray';

test('ArrayObservable Pop', () => {
  const fun = jest.fn();
  const observable = new ObservableArray();
  observable.push('banana', 'apple', 'orange');
  observable.listen(fun);
  const res = observable.pop();

  expect(fun).toHaveBeenCalledWith({
    indexs: [2],
    action: ActionType.DELETE,
  });
  expect(res).toEqual('orange');
  expect(observable.value.map((m) => m.value)).toEqual(['banana', 'apple']);
});

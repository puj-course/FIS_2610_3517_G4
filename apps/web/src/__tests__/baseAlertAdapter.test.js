import { describe, expect, it } from 'vitest';
import BaseAlertAdapter from '../patterns/adapters/BaseAlertAdapter.js';

class FakeAlertAdapter extends BaseAlertAdapter {
  adapt(item) {
    if (item === 'empty') return null;
    if (item === 'missing') return undefined;
    if (item === 'multiple') return [{ id: 'alert-2' }, { id: 'alert-3' }];
    return { id: `alert-${item}` };
  }
}

describe('BaseAlertAdapter', () => {
  it('lanza error cuando adapt no fue implementado por una subclase', () => {
    const adapter = new BaseAlertAdapter();

    expect(() => adapter.adapt({ id: 1 })).toThrow('El adapter debe implementar adapt().');
  });

  it('normalize retorna el mismo arreglo cuando recibe arreglo', () => {
    const adapter = new BaseAlertAdapter();
    const alerts = [{ id: 'alert-1' }, { id: 'alert-2' }];

    expect(adapter.normalize(alerts)).toBe(alerts);
  });

  it('normalize envuelve un objeto en arreglo', () => {
    const adapter = new BaseAlertAdapter();
    const alert = { id: 'alert-1' };

    expect(adapter.normalize(alert)).toEqual([alert]);
  });

  it('normalize retorna arreglo vacio con null', () => {
    const adapter = new BaseAlertAdapter();

    expect(adapter.normalize(null)).toEqual([]);
  });

  it('normalize retorna arreglo vacio con undefined', () => {
    const adapter = new BaseAlertAdapter();

    expect(adapter.normalize(undefined)).toEqual([]);
  });

  it('adaptMany procesa varios items con una clase fake', () => {
    const adapter = new FakeAlertAdapter();

    expect(adapter.adaptMany([1, 4])).toEqual([
      { id: 'alert-1' },
      { id: 'alert-4' },
    ]);
  });

  it('adaptMany aplana resultados cuando adapt devuelve arreglos', () => {
    const adapter = new FakeAlertAdapter();

    expect(adapter.adaptMany([1, 'multiple', 4])).toEqual([
      { id: 'alert-1' },
      { id: 'alert-2' },
      { id: 'alert-3' },
      { id: 'alert-4' },
    ]);
  });

  it('adaptMany ignora resultados null o undefined usando normalize', () => {
    const adapter = new FakeAlertAdapter();

    expect(adapter.adaptMany(['empty', 7, 'missing'])).toEqual([
      { id: 'alert-7' },
    ]);
  });
});

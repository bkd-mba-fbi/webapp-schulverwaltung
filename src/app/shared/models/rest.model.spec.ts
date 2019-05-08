import { RestModel, RestDateTime } from './rest.model';

describe('RestModel', () => {
  describe('.from', () => {
    class RestTestModel extends RestModel {
      @RestDateTime()
      foo: Date;

      bar: string;
      baz: {
        x: number;
      };
    }

    it('creates new instance of given model, sets attributes and decodes date times', () => {
      const model = RestTestModel.from({
        foo: '2019-04-25T08:35:00',
        bar: 'foobar',
        baz: { x: 42 }
      });
      expect(model instanceof RestTestModel).toBe(true);
      expect(model.foo).toEqual(new Date('2019-04-25T08:35:00'));
      expect(model.bar).toBe('foobar');
      expect(model.baz).toEqual({ x: 42 });
    });
  });
});

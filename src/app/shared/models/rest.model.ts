interface AttrSet {
  [className: string]: string[];
}

type AttributesDecoder = (
  constructorFunction: Constructor<RestModel>,
  data: any
) => any;

const dateTimeAttrs: AttrSet = {};
const decodeDateTimeStrings = buildAttributesDecoder<string, Date>(
  dateTimeAttrs,
  value => new Date(value)
);

export const RestDateTime = buildAttributesDecorator(dateTimeAttrs);

export class RestModel {
  /**
   * Create a model from a given object
   *
   * let student = Student.from({ FirstName: 'Hänsel' });
   */
  static from<T extends RestModel>(this: { new (): T }, data: any): T {
    return Object.assign(new this(), decodeDateTimeStrings(this, data));
  }
}

function buildAttributesDecoder<T, R>(
  attrSet: AttrSet,
  decode: (value: T) => R
): AttributesDecoder {
  return (constructorFunction: Constructor<RestModel>, data: any): any => {
    const modelName = constructorFunction.name;
    Object.keys(data).forEach(property => {
      if (attrSet[modelName] && attrSet[modelName].indexOf(property) !== -1) {
        data[property] = decode(data[property]);
      }
    });
    return data;
  };
}

function buildAttributesDecorator(attrSet: AttrSet): () => any {
  return () => {
    return (target: object, propertyKey: string) => {
      const modelName = target.constructor.name;
      if (!attrSet[modelName]) {
        attrSet[modelName] = [];
      }
      attrSet[modelName].push(propertyKey);
    };
  };
}

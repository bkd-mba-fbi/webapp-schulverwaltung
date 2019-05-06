export class RestModel {
  /**
   * Create a model from a given object
   *
   * let student = Student.from({ FirstName: 'Hänsel' });
   */
  static from<T extends RestModel>(
    this: { new (): T },
    data: { [P in keyof T]?: T[P] }
  ): T {
    return Object.assign(new this(), data);
  }
}

// export function RestAttr(type?: string): any {
//   return (
//     target: object,
//     propertyKey: string,
//     descriptor: PropertyDescriptor
//   ) => {
//     let keys = restAttrMap.get(target) || {};
//     keys[propertyKey] = type;
//     restAttrMap.set(target, keys);
//   };
// }

import { Pipe, PipeTransform } from "@angular/core";
import xss, { IFilterXSSOptions } from "xss";

@Pipe({
  name: "xss",
})
export class XssPipe implements PipeTransform {
  transform(value: string, options?: IFilterXSSOptions): string {
    return xss(value, options);
  }
}

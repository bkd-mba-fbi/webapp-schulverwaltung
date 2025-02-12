import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, switchMap } from "rxjs";
import { read, utils } from "xlsx";
import { notNull } from "../../shared/utils/filter";

interface SubscriptionDetailData {
  "ID Anlass": number;
  "ID Person": number;
  "ID AD": number;
  Wert: string;
  "E-Mail": string;
}

@Injectable()
export class ImportSubscriptionDetailsStateService {
  private fileSubject$ = new BehaviorSubject<Option<File>>(null);

  file$ = this.fileSubject$.asObservable();

  rows$ = this.file$.pipe(
    filter(notNull),
    switchMap((f) => this.toSheet(f)),
  );
  headers$ = this.rows$.pipe(map((r) => Object.keys(r[0])));

  constructor() {}

  setFile(file: File | null) {
    this.fileSubject$.next(file);
  }

  async toSheet(file: File) {
    const ab = await file?.arrayBuffer();
    const wb = read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data: SubscriptionDetailData[] =
      utils.sheet_to_json<SubscriptionDetailData>(ws);
    console.log(data);
    return data;
  }
}

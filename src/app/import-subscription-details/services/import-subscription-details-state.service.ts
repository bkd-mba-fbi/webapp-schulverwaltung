import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, switchMap } from "rxjs";
import { read, utils } from "xlsx";
import { notNull } from "../../shared/utils/filter";

interface SubscriptionDetailRow {
  "ID Anlass": number;
  "ID Person": number;
  "ID AD": number;
  Wert: string;
  "E-Mail": string;
}

export type SubscriptionDetailData = {
  eventId: number;
  personId: number;
  subscriptionDetailId: number;
  value: string;
  personEmail?: string;
};

@Injectable()
export class ImportSubscriptionDetailsStateService {
  private fileSubject$ = new BehaviorSubject<Option<File>>(null);

  file$ = this.fileSubject$.asObservable();

  entries$ = this.file$.pipe(
    filter(notNull),
    switchMap((f) => this.parseSheet(f)),
    map((s) => this.toData(s)),
  );
  headers$ = this.entries$.pipe(map((r) => Object.keys(r[0])));

  constructor() {}

  setFile(file: File | null) {
    this.fileSubject$.next(file);
  }

  async parseSheet(file: File) {
    const ab = await file?.arrayBuffer();
    const wb = read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data: SubscriptionDetailRow[] =
      utils.sheet_to_json<SubscriptionDetailRow>(ws);
    console.log(data);
    return data;
  }

  toData(rows: SubscriptionDetailRow[]): ReadonlyArray<SubscriptionDetailData> {
    return rows.map((row) => ({
      eventId: row["ID Anlass"],
      personId: row["ID Person"],
      subscriptionDetailId: row["ID AD"],
      value: row.Wert,
      personEmail: row["E-Mail"],
    }));
  }
}

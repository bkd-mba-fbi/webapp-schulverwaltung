import { Injectable } from "@angular/core";

export type UploadProgress = {
  uploading: number;
  success: number;
  error: number;
  total: number;
};

@Injectable({
  providedIn: "root",
})
export class ImportUploadSubscriptionDetailsService {
  constructor() {}
}

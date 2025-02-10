import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { SETTINGS, Settings } from "../../settings";
import { JobTrainer } from "../models/job-trainer.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class JobTrainersRestService extends RestService<typeof JobTrainer> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, JobTrainer, "JobTrainers");
  }
}

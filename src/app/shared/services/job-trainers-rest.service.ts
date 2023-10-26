import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { SETTINGS, Settings } from "../../settings";
import { JobTrainer } from "../models/job-trainer.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class JobTrainersRestService extends RestService<typeof JobTrainer> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, JobTrainer, "JobTrainers");
  }
}

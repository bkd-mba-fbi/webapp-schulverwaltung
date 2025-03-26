import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { SETTINGS, Settings } from "src/app/settings";
import { RestErrorInterceptorOptions } from "src/app/shared/interceptors/rest-error.interceptor";

const API_REQUEST_KEY = "bkdApiRequest";

@Component({
  selector: "bkd-api",
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: "./api.component.html",
  styleUrl: "./api.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private settings = inject<Settings>(SETTINGS);

  formGroup = signal(this.createFormGroup());
  params = computed(() => this.formGroup().controls.params);

  ngOnInit(): void {
    const value = this.restoreValue();
    if (value) {
      const group = this.formGroup();
      group.reset(value);

      group.controls.params.clear();
      value.params.forEach((param: { key: string; value: string }) =>
        this.addParam(param),
      );

      group.controls.headers.clear();
      value.headers.forEach((header: { key: string; value: string }) =>
        this.addHeader(header),
      );
    }
  }

  addParam({ key = "", value = "" } = {}): void {
    const { params } = this.formGroup().controls;
    params.push(this.createKeyValueGroup(key, value));
  }

  removeParam(index: number): void {
    const { params } = this.formGroup().controls;
    params.removeAt(index);
  }

  addHeader({ key = "", value = "" } = {}): void {
    const { headers } = this.formGroup().controls;
    headers.push(this.createKeyValueGroup(key, value));
  }

  removeHeader(index: number): void {
    const { headers } = this.formGroup().controls;
    headers.removeAt(index);
  }

  onSubmit(): void {
    const group = this.formGroup();
    if (group.valid) {
      const {
        method,
        path,
        body,
        params: paramsData,
        headers: headersData,
      } = group.value;

      this.storeValue();

      const url = `${this.settings.apiUrl}${path}`;
      const params = paramsData?.reduce((acc, { key, value }) => {
        if (key?.trim() && value?.trim()) {
          return acc.set(key.trim(), value.trim());
        }
        return acc;
      }, new HttpParams());
      const headers = headersData?.reduce((acc, { key, value }) => {
        if (key?.trim() && value?.trim()) {
          return acc.set(key.trim(), value.trim());
        }
        return acc;
      }, new HttpHeaders());
      const context = new HttpContext().set(RestErrorInterceptorOptions, {
        disableErrorHandling: true,
      });

      let result$ = null;
      switch (method) {
        case "GET":
        case "DELETE":
          result$ = this.http.request(method, url, {
            context,
            headers,
            params,
          });
          break;
        case "POST":
        case "PUT":
        case "PATCH":
          result$ = this.http.request(method, url, {
            context,
            headers,
            params,
            body,
          });
          break;
      }

      if (result$) {
        result$.subscribe({
          next: (result) => {
            console.log("Success:", result);
          },
          error: (error) => {
            console.log("Error:", error);
          },
        });
      }
    }
  }

  private createFormGroup() {
    return this.fb.nonNullable.group({
      method: ["GET", Validators.required],
      path: ["", Validators.required],
      body: [""],
      params: this.fb.nonNullable.array<
        FormGroup<{ key: FormControl<string>; value: FormControl<string> }>
      >([]),
      headers: this.fb.nonNullable.array<
        FormGroup<{ key: FormControl<string>; value: FormControl<string> }>
      >([]),
    });
  }

  private createKeyValueGroup(key = "", value = "") {
    return this.fb.nonNullable.group({
      key: [key, Validators.required],
      value: [value, Validators.required],
    });
  }

  private restoreValue() {
    const data = localStorage.getItem(API_REQUEST_KEY);
    return data ? JSON.parse(data) : null;
  }

  private storeValue(): void {
    console.log(this.formGroup().value);
    localStorage.setItem(
      API_REQUEST_KEY,
      JSON.stringify(this.formGroup().value),
    );
  }
}

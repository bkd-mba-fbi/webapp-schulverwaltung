import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { MyGradesHeaderComponent } from "./components/my-grades-header/my-grades-header.component";
import { MyGradesShowComponent } from "./components/my-grades-show/my-grades-show.component";
import { MyGradesComponent } from "./components/my-grades/my-grades.component";
import { MyGradesRoutingModule } from "./my-grades-routing.module";

@NgModule({
  declarations: [
    MyGradesComponent,
    MyGradesShowComponent,
    MyGradesHeaderComponent,
  ],
  imports: [CommonModule, MyGradesRoutingModule, SharedModule],
})
export class MyGradesModule {}

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { JsPlumbComponent } from "./js-plumb/js-plumb.component";
import { WidgetComponent } from "./js-plumb/canvas/widget/widget.component";
import { ControlsComponent } from "./js-plumb/controls/controls.component";
import { CanvasComponent } from "./js-plumb/canvas/canvas.component";
import { WidgetsService } from "./services/widgets/widgets.service";
import { OptionsComponent } from "./js-plumb/canvas/widget/options/options.component";

@NgModule({
  declarations: [
    AppComponent,
    JsPlumbComponent,
    WidgetComponent,
    ControlsComponent,
    CanvasComponent,
    OptionsComponent
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [WidgetsService],
  bootstrap: [AppComponent]
})
export class AppModule {}

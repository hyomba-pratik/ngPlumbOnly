import { Component, OnInit,Injectable } from "@angular/core";
import { WidgetsService } from "./../../services/widgets/widgets.service";
import { WidgetComponent } from "./../canvas/widget/widget.component";
@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.scss"]
})
export class CanvasComponent implements OnInit {
  widgets: Array<WidgetComponent> = [];

  constructor(private widgetsService: WidgetsService) {}

  ngOnInit() {
    this.widgets = this.widgetsService.getAllWidgets();
  }
}

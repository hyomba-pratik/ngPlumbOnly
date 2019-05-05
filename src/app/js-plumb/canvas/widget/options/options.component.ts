import { Component, OnInit, Input } from "@angular/core";
import { WidgetsService } from "./../../../../services/widgets/widgets.service";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"]
})


export class OptionsComponent implements OnInit {
  @Input() optionId: number;
  @Input() widgetId: number;

  constructor(private widgetsService: WidgetsService) {}

  ngOnInit() {

  }

  remove() {
    this.widgetsService.removeOptionFromWidget(this.widgetId, this.optionId);
  }
}

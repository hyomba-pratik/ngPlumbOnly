import { Component, OnInit } from "@angular/core";
import { WidgetsService } from "./../../../services/widgets/widgets.service";
import { OptionsComponent } from "./options/options.component";
import { WidgetTypes } from "./../../../enums/widget-type.enum";
import { FormsModule, FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-widget",
  templateUrl: "./widget.component.html",
  styleUrls: ["./widget.component.scss"]
})
export class WidgetComponent implements OnInit {
  id = 0;
  form: FormGroup;
  options: Array<OptionsComponent> = [];
  availableTypes: Array<String> = [];

  constructor(
    private widgetsService: WidgetsService,
    private formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      type: null,
      description: null
    });

    this.form.valueChanges.subscribe(formData => {
      console.log(formData);
    });
  }

  ngOnInit() {
    this.id = this.widgetsService.widgetCount() - 1;
    this.options = this.widgetsService.getAllOptionsByWidgetId(this.id);
    this.availableTypes = Object.keys(WidgetTypes).filter(
      key => !isNaN(Number(WidgetTypes[key]))
    );
  }

  onPropsChanged(val) {
    console.log(val);
  }

  remove(id: number) {
    this.widgetsService.removeWidget(id);
  }

  addOption() {
    this.widgetsService.addOptionToWidget(
      this.id,
      new OptionsComponent(this.widgetsService)
    );
  }
}

import { Component, OnInit } from "@angular/core";
import { WidgetComponent } from "./../canvas/widget/widget.component";
import { WidgetsService } from "./../../services/widgets/widgets.service";
import { FormsModule, FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-controls",
  templateUrl: "./controls.component.html",
  styleUrls: ["./controls.component.scss"]
})
export class ControlsComponent implements OnInit {
  constructor(
    private widgetsService: WidgetsService,
    private formBuilder: FormBuilder
  ) {
    formBuilder = new FormBuilder();
  }

  ngOnInit() {}

  addWidget() {
    this.widgetsService.addWidget(
      new WidgetComponent(this.widgetsService, this.formBuilder)
    );
  }

  logMe() {
    console.log(this.widgetsService.getAllWidgets());
  }

  saveState() {
    let state = this.widgetsService.getCurrentState();
    console.log(state);
  }

  loadState() {
    let state = {
      points: [
        {
          id: "node0",
          positionX: 0,
          positionY: 0,
          type: "Trigger",
          description: "Incoming Call",
          options: [
            {
              id: "option-0-0",
              text: "Call"
            }
          ]
        },
        {
          id: "node1",
          positionX: 60,
          positionY: 290,
          type: "Menu",
          description: "Do you want coffee?",
          options: [
            {
              id: "option-1-0",
              text: "Yes"
            },
            {
              id: "option-1-0",
              text: "Yes"
            }
          ]
        },
        {
          id: "node2",
          positionX: 550,
          positionY: 30,
          type: "EndPoint",
          description: "Call End",
          options: []
        },
        {
          id: "node3",
          positionX: 450,
          positionY: 450,
          type: "Message",
          description: "Sending coffee.",
          options: [
            {
              id: "option-3-0",
              text: "Dispatched"
            }
          ]
        }
      ],
      connections: [
        {
          source: "option-0-0",
          target: "node1"
        },
        {
          source: "option-1-1",
          target: "node2"
        },
        {
          source: "option-1-0",
          target: "node3"
        },
        {
          source: "option-3-0",
          target: "node2"
        }
      ],
      workflow: {
        name: "Ask For Coffee",
        status: "true"
      }
    };
    this.widgetsService.loadState(state);
  }
}

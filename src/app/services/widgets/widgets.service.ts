import { Injectable } from "@angular/core";
import { WidgetComponent } from "./../../js-plumb/canvas/widget/widget.component";
import { OptionsComponent } from "../../js-plumb/canvas/widget/options/options.component";
import * as $ from "jquery";

declare let jsPlumb: any;

@Injectable()
export class WidgetsService {
  private widgets: Array<WidgetComponent> = [];
  private widget: WidgetComponent;
  private options: Array<OptionsComponent> = [];
  private option: OptionsComponent;
  private workFlowName: string;
  private workFlowStatus: boolean;

  constructor() {}

  // workflow options
  setWorkFlowName(name: string) {
    this.workFlowName = name;
    return;
  }

  getWorkFlowName(): string {
    return this.workFlowName;
  }

  setWorkFlowStatus(status: boolean) {
    this.workFlowStatus = status;
    return;
  }

  getWorkFlowStatus(): boolean {
    return this.workFlowStatus;
  }

  // widgets functions
  widgetCount(): number {
    return this.widgets.length;
  }

  getWidgetById(widgetId: number) {
    for (let j = 0; j < this.widgets.length; j++) {
      if (this.widgets[j].id === widgetId) {
        return this.widgets[j];
      }
    }
  }

  getAllWidgets() {
    return this.widgets;
  }

  addWidget(widget: WidgetComponent) {
    widget.id = this.widgetCount();
    this.widgets.push(widget);
    this.setDraggable(widget.id);
    this.makeTarget(widget.id);
    return;
  }

  removeWidget(id: number) {
    this.options = this.getAllOptionsByWidgetId(id);
    for (let j = 0; j < this.options.length; j++) {
      this.removeConnectionFromSource(id, this.options[j].optionId);
    }
    this.removeConnectionFromTarget(id);
    for (let i = 0; i < this.widgets.length; i++) {
      if (this.widgets[i].id === id) {
        this.widgets.splice(i, 1);
      }
    }
  }

  // options function
  countWidgetOptions(widgetId: number) {
    this.widget = this.getWidgetById(widgetId);
    return this.widget.options.length;
  }

  getAllOptionsByWidgetId(widgetId: number) {
    this.widget = this.getWidgetById(widgetId);
    return this.widget.options;
  }

  getOptionByWidgetId(widgetId: number, optionId: number) {
    this.option = this.getOptionByWidgetId(widgetId, optionId);
    return this.option;
  }

  addOptionToWidget(widgetId: number, option: OptionsComponent) {
    this.widget = this.getWidgetById(widgetId);
    option.optionId = this.widget.options.length;
    this.widget.options.push(option);
    this.addEndPointToOption(widgetId, option.optionId);
    return option.optionId;
  }

  removeOptionFromWidget(widgetId: number, optionId: number) {
    this.widget = this.getWidgetById(widgetId);
    for (let i = 0; i < this.widget.options.length; i++) {
      if (this.widget.options[i].optionId === optionId) {
        this.removeConnectionFromSource(widgetId, optionId);
        this.widget.options.splice(i, 1);
      }
    }
  }

  // jsPlumb function
  getCurrentState() {
    let nodes = [],
      data = [],
      connections = [];

    $(".widget").each(function(idx, elem) {
      const $elem = $(elem);
      const options: any = [];

      $elem.find(".option").each(function(index, element) {
        const $opt = $(element);
        options.push({
          id: $elem.find("span.option-ep").attr("id"),
          text: $elem.find("input").val()
        });
      });

      nodes.push({
        id: $elem.attr("id"),
        positionX: parseInt($elem.css("left"), 10),
        positionY: parseInt($elem.css("top"), 10),
        type: $elem.find("select[name=type] option:selected").val(),
        description: $elem.find("textarea[name=description]").val(),
        options: options
      });
    });

    $.each(jsPlumb.getConnections(), function(idx, connection) {
      const connectionData = {
        source: connection.sourceId,
        target: connection.targetId
      };
      if (connections.indexOf(connectionData) === -1) {
        connections.push(connectionData);
      }
    });
    const nodes_graph: any = {};
    nodes_graph.points = nodes;
    nodes_graph.connections = connections;
    nodes_graph.workflow = {
      name: this.getWorkFlowName(),
      status: this.getWorkFlowStatus()
    };
    console.log(JSON.stringify(nodes_graph));
    return nodes_graph;
  }

  loadState(stateJSON: any) {
    let connections = stateJSON.connections;
    let points = stateJSON.points;
    let workflow = stateJSON.workflow;
    let that = this;

    if (workflow.length) {
      this.setWorkFlowName(workflow.name);
      this.setWorkFlowStatus(workflow.status);
    }

    if (points.length) {
      points.forEach((element, index) => {
        element.id = index;
        this.widgets.push(element);
        this.setDraggable(element.id);
      });
    }

    if (connections.length) {
    }
  }

  setDraggable(id) {
    const that = this;
    setTimeout(() => {
      const node = "node" + id;
      jsPlumb.draggable([node], {
        grid: [10, 10],
        containment: true,
        drag: function() {
          that.repaintEverything();
        }
      });

      that.repaintEverything();
    }, 200);
  }

  makeTarget(id) {
    const that = this;
    setTimeout(() => {
      const node = "node" + id;
      jsPlumb.makeTarget(node, {
        anchor: [
          "Top",
          {
            shape: "Circle"
          }
        ],
        connector: "Bezier"
      });
      that.repaintEverything();
    }, 200);
  }

  addEndPointToOption(widgetId: number, optionId: number) {
    const that = this;
    setTimeout(() => {
      const newInner = "option-" + widgetId + "-" + optionId;
      // The div can be a source for a connection
      jsPlumb.makeSource(newInner, {
        anchor: [
          "Bottom",
          {
            shape: "Circle"
          }
        ],
        connector: "Bezier",
        maxConnections: 1
      });
      that.repaintEverything();
    }, 200);
  }

  removeConnectionFromSource(widgetId: number, optionId: number) {
    const option = "option-" + widgetId + "-" + optionId;
    jsPlumb.remove(option);
    this.repaintEverything();
  }

  removeConnectionFromTarget(widgetId: number) {
    const node = "node" + widgetId;
    jsPlumb.remove(node);
    this.repaintEverything();
  }

  repaintEverything() {
    setTimeout(() => {
      jsPlumb.repaintEverything();
    }, 200);
    jsPlumb.repaintEverything();
  }
}

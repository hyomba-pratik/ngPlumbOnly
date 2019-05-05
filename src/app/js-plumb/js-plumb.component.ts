import { Component, OnInit, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WidgetsService } from "./../services/widgets/widgets.service";
import { Output } from "@angular/core/src/metadata/directives";
import { EventEmitter } from "selenium-webdriver";
declare let $: any;
declare let jsPlumb: any;
@Component({
  selector: "app-js-plumb",
  templateUrl: "./js-plumb.component.html",
  styleUrls: ["./js-plumb.component.scss"]
})
export class JsPlumbComponent implements OnInit {
  minScale = 0.4;
  maxScale = 2;
  incScale = 0.1;
  plumb = null;
  $container = null;
  $diagram = null;
  $panzoom = null;
  panZoomReady = false;
  workFlowName: string;
  workFlowStatus: boolean;

  constructor(private widgetsService: WidgetsService) {}

  ngOnInit() {
    this.jsPlumbInit();
    this.$container = $(".canvas");
    this.$diagram = this.$container.find(".widget-wrapper");
  }

  workFlowNameChange(name: string) {
    this.widgetsService.setWorkFlowName(name);
  }

  workFlowStatusChange(status: boolean) {
    this.widgetsService.setWorkFlowStatus(status);
  }

  jsPlumbInit() {
    const that = this;
    jsPlumb.ready(function() {
      console.log("JS PLUMB READY");

      this.plumb = jsPlumb.getInstance({
        Container: $(".widget-wrapper")
      });

      jsPlumb.importDefaults({
        Connector: [
          "Flowchart",
          {
            cornerRadius: 5
          }
        ],
        Anchors: ["Bottom", "Top"],
        PaintStyle: {
          strokeWidth: 5,
          stroke: "#445566"
        }
      });

      // connection validations
      jsPlumb.bind("connection", function(info) {
        const targetId = info.targetId.replace("node", "");
        const sourceId = info.sourceId.split("-")[1];
        // check if option is from widget and delete connection
        if (targetId === sourceId) {
          jsPlumb.deleteConnection(info.connection);
        }
      });

      jsPlumb.bind("zoom", function(scale) {
        jsPlumb.repaintEverything();
      });
      //that.panZoomInit();
    });
  }

  panZoomInit() {
    const that = this;

    that.$panzoom = that.$container
      .find(".panzoom")
      .panzoom({
        minScale: that.minScale,
        maxScale: that.maxScale,
        increment: that.incScale,
        cursor: "",
        disablePan: true
      })
      .on("panzoomstart", function(e, pz, ev) {
        that.$panzoom.css("cursor", "move");
      })
      .on("panzoomend", function(e, pz) {
        that.$panzoom.css("cursor", "");
      })
      .on("panzoomzoom", function(event, panzoom, scale, opts) {
        jsPlumb.setZoom(scale, true);
      });

    that.$panzoom
      .parent()
      .on("mousewheel.focal", function(e) {
        // if (e.ctrlKey || e.originalEvent.ctrlKey) {
        // e.preventDefault();
        // var delta = e.delta || e.originalEvent.wheelDelta;
        // var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        // that.$panzoom.panzoom("zoom", zoomOut, {
        //   animate: false,
        //   exponential: false
        // });
        // } else {
        //   e.preventDefault();
        //   var deltaY =
        //     e.deltaY || e.originalEvent.wheelDeltaY || -e.originalEvent.deltaY;
        //   var deltaX =
        //     e.deltaX || e.originalEvent.wheelDeltaX || -e.originalEvent.deltaX;
        //   that.$panzoom.panzoom("pan", deltaX / 2, deltaY / 2, {
        //     animate: true,
        //     relative: true
        //   });
        // }
      })
      .on("mousedown touchstart", function(ev) {
        var matrix = that.$container.find(".panzoom").panzoom("getMatrix");
        var offsetX = matrix[4];
        var offsetY = matrix[5];
        var dragstart = { x: ev.pageX, y: ev.pageY, dx: offsetX, dy: offsetY };
        $(ev.target).css("cursor", "move");
        $(this).data("dragstart", dragstart);
      })
      .on("mousemove touchmove", function(ev) {
        var dragstart = $(this).data("dragstart");
        if (dragstart) {
          var deltaX = dragstart.x - ev.pageX;
          var deltaY = dragstart.y - ev.pageY;
          var matrix = that.$container.find(".panzoom").panzoom("getMatrix");
          matrix[4] = parseInt(dragstart.dx) - deltaX;
          matrix[5] = parseInt(dragstart.dy) - deltaY;
          that.$container.find(".panzoom").panzoom("setMatrix", matrix);
        }
      })
      .on("mouseup touchend touchcancel", function(ev) {
        $(this).data("dragstart", null);
        $(ev.target).css("cursor", "");
      });
  }
}

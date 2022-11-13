const GRAPH_PADDING = 30;
const GRAPH_AXIS_PADDING = 40;

class Graph {
    constructor(id, width, height) {
        this.graphElem = document.querySelector("#"+id);

        let canvas    = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;
        this.graphElem.appendChild(canvas);
        this.graphCtx = canvas.getContext("2d");

        this.rangeX = { min: 0, max: 5 };
        this.rangeY = { min: 0, max: 10 };

        this.courbes = [];

        Graph.active = this;
    }

    reset() {
        this.courbes = [];
        
        this.rangeX = { min: 0, max: 5 };
        this.rangeY = { min: 0, max: 10 };
    }

    addCourbe(name, color) {
        this.courbes.push({
            "name": name,
            "color": color,
            "points": []
        });
    }

    addPoint(courbeName, x, y) {
        let courbe = null;
        for(var c of this.courbes) {
            if(c.name == courbeName) {
                courbe = c;
                break;
            }
        }
        if(!courbe) return;

        courbe.points.push({x: x, y: y});
        // update scale
        this.rangeX.min = Math.min(x, this.rangeX.min);
        this.rangeX.max = Math.max(x, this.rangeX.max);
        this.rangeY.min = Math.min(y, this.rangeY.min);
        this.rangeY.max = Math.max(y, this.rangeY.max);

        this.#redraw();
    }

    #getScaledPoint(point) {
        var sizeX = this.rangeX.max - this.rangeX.min;
        var sizeY = this.rangeY.max - this.rangeY.min;

        var ctxW = this.graphCtx.canvas.width  - GRAPH_AXIS_PADDING - GRAPH_PADDING;
        var ctxH = this.graphCtx.canvas.height - GRAPH_AXIS_PADDING - GRAPH_PADDING;

        return {
            x:                               (point.x / sizeX + this.rangeX.min) * ctxW + GRAPH_AXIS_PADDING,
            y: this.graphCtx.canvas.height - (point.y / sizeY + this.rangeY.min) * ctxH - GRAPH_AXIS_PADDING
        };
    }

    #redraw() {
        var w = this.graphCtx.canvas.width;
        var h = this.graphCtx.canvas.height;
        this.graphCtx.clearRect(0, 0, w, h);

        this.#drawAxis();

        for(let courbe of this.courbes) {
            this.#drawCourbe(courbe);
        }
    }

    #drawCourbe(courbe) {
        // draw courbe
        this.graphCtx.strokeStyle = courbe.color;
        this.graphCtx.lineWidth   = 2;
        this.graphCtx.beginPath();
        for(var i = 0; i < courbe.points.length; ++i) {
            var scaledPoint = this.#getScaledPoint(courbe.points[i]);
            if(i == 0) {
                this.graphCtx.moveTo(scaledPoint.x, scaledPoint.y);
            } else {
                this.graphCtx.lineTo(scaledPoint.x, scaledPoint.y);
            }
        }
        this.graphCtx.stroke();

        this.#drawPoints(courbe.points, courbe.color);
    }

    #drawAxis() {
        let popMax = SimulationManager.current.gridSize * SimulationManager.current.gridSize;
        this.graphCtx.strokeStyle = "#fff";
        this.graphCtx.lineWidth   = 1;
        // Y axis
        this.graphCtx.strokeText((this.rangeY.max/popMax).toFixed(2)*100+"%", 0, 20);
        // Origin
        this.graphCtx.strokeText(0, 10, this.graphCtx.canvas.height-10);
        // X axis
        this.graphCtx.strokeText(this.rangeX.max, this.graphCtx.canvas.height, this.graphCtx.canvas.height-10);
    }

    #drawPoints(points, color) {
        var sizeX = this.rangeX.max - this.rangeX.min;
        var step = Math.floor(Math.log10(sizeX)+1);
        for(var i = 0; i < points.length; i+=step) {
            var scaledPoint = this.#getScaledPoint(points[i]);
            drawCircle(this.graphCtx, scaledPoint.x, scaledPoint.y, 2, color);
        }
    }
}
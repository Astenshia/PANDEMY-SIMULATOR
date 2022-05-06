const PROBABILITY = .6;

class ConwaySimulation extends Simulation {
    constructor(randomSpawn = true) {
        super({value: 0}, 60);

        this.random = randomSpawn;
    }

    init()
    {
        if(this.random) {
            // place random cells based on Math.random() which return a number bewteen 0 and 1
            // and a probability between 0 and 1
            for(let x = 0; x < this.gridSize; ++x)
            for(let y = 0; y < this.gridSize; ++y)
                this.grid[x][y].value = (Math.random() > PROBABILITY);
        } else {
            let middle = Math.floor(this.gridSize * .5);
            // plane
            // X 0 0
            this.grid[middle-1][middle-1].value = 1;
            // 0 X X
            this.grid[middle  ][middle].value = 1;
            this.grid[middle+1][middle].value = 1;
            // X X 0
            this.grid[middle-1][middle+1].value = 1;
            this.grid[middle  ][middle+1].value = 1;
        }
        
    }

    _updateCell(x, y, cell) {
        let n = this._getNeighboursList(x, y, NEIGHBOURING_RULES.CORNERS);
        let count = 0;
        // count outside cell as dead cells
        for(let nn of n) count += nn.value;

        // apply rules

        // living cell
        if(cell.value == 1) {
            // underpopulation (solitude)
            if(count < 2) cell.value = 0;
            // overpopulation
            if(count > 3) cell.value = 0;   
        } 
        // dead cell
        else { 
            // reproduction
            if(count == 3) cell.value = 1;
        }

        return cell;
    }

    _drawCell(ctx, x, y, cell) {

        // show only the 40 middle cells
        var xx = x - 10;
        var yy = y - 10;

        if(xx < 0 || yy < 0) return;

        let cellSize = ctx.canvas.width / (this.gridSize - 20);
        drawSquare(ctx, xx * cellSize, yy * cellSize, cellSize, "#000", cell.value);
    }

}
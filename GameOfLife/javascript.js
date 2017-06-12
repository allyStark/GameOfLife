let { Grid, Row, Col, Button } = ReactBootstrap;

let gameGrid = createGridArr([44, 87], true);

//create the gaming grid
function createGridArr(arr, random){
    
    let toReturn = [];

    for (let i = 0; i < arr[0]; i++){

        let toPush = [];

        for (let j = 0; j < arr[1]; j++){

            toPush.push(!random ? 0 : Math.random() < 0.5 ? 1 : 0);

        }

        toReturn.push(toPush);

    }

    return toReturn;

}

function returnSingleCell(rowIndex, cellIndex, isOn){

    let hasClass = "single-cell";

    //give the impression of an infinite grid
    rowIndex <= 1 || rowIndex >= gameGrid.length - 2 || cellIndex <= 1 || cellIndex >= gameGrid[0].length - 2 ? hasClass = "single-cell no-view" : hasClass;

    return (

        <div className={hasClass} id={rowIndex + "cell" + cellIndex} style={{backgroundColor: isOn !== 0 ? "#E95D12" : "#FFFBE8"}}>

        </div>    

    );

} 

function gameRowCreate(index, rowIndex) {

let cells = [];

    for (var i = 0; i < index.length; i++){

        cells.push(returnSingleCell(rowIndex, i, index[i]));

    }

    return (

        <Row className="cell-row" id={"row" + rowIndex}>

            {cells}

        </Row>

    );

}

//check and return array to create the next state
function checkAndUpdate(grid){

    let newGrid = [];

    for (let i = 0; i < grid.length; i++){

        let toPush = [];

        for (let j = 0; j < grid[i].length; j++){

            let neighbourCount = 0;

            neighbourCount += onOuterGrid(grid, [i - 1], [j - 1]); //top left
            neighbourCount += onOuterGrid(grid, [i - 1], [j]); //top center
            neighbourCount += onOuterGrid(grid, [i - 1], [j + 1]); //top right
            neighbourCount += onOuterGrid(grid, [i], [j - 1]); // middle left
            neighbourCount += grid[i][j]; //middle center
            neighbourCount += onOuterGrid(grid, [i], [j + 1]); //middle right
            neighbourCount += onOuterGrid(grid, [i + 1], [j - 1]); //bottom left
            neighbourCount += onOuterGrid(grid, [i + 1], [j]); //bottom centre
            neighbourCount += onOuterGrid(grid, [i + 1], [j + 1]); //bottom right

            //apply Game Of Life rules to the cell    
            if (neighbourCount === 3){

                toPush.push(1);

            } else if (neighbourCount === 4){

                toPush.push(grid[i][j]);

            } else {

                toPush.push(0);

            }  

            //check if the cell state is different from the last state. If it is, update the cell 
            if (grid[i][j] !== toPush[j] && i > 1 && i < grid.length - 2 && j > 1 && j < grid[i].length){

                if (toPush[j] === 1){

                    cellColour(i + "cell" + j , "#E95D12");

                } else {

                    cellColour(i + "cell" + j, "#FFFBE8");

                }

            }

        }
        
        newGrid.push(toPush);

        }        

    return newGrid;

    }
//is the cell on the edge?
function onOuterGrid(grid, i, j){

    if (grid[i] == undefined || grid[i][j] == undefined){

        return 0;

    } else {

        return grid[i][j];

    }

}

//change cell colour
function cellColour(cellId, colour){

    document.getElementById(cellId).style.backgroundColor = colour;

}

function gridOnOff(gridIsOn) {

    let borderStyle = "";

    !gridIsOn ? borderStyle = "1px solid black" : borderStyle = "0px";

    for (var i = 0; i < gameGrid.length; i++){

            for (var j = 0; j < gameGrid[i].length; j++){

                document.getElementById(i + "cell" + j).style.border = borderStyle; 

            }

        }

}

class MainContainer extends React.Component {

    constructor(props) {

        super(props);
        this.state={gameArr: gameGrid};
        
    }

    handleClick() {

        gameGrid = createGridArr([44, 87], true);

        this.setState({gameArr: gameGrid});

    }

    

    createGameRows() {

        let gridHolder = gameGrid;

        let gridReturn = [];

        for (let i = 0; i < gridHolder.length; i++){

            gridReturn.push(gameRowCreate(gridHolder[i], i));

        }

        return (
            
            <Grid id="gameboard">
            
                <UpdateGameBoard buttonClick={this.handleClick.bind(this)}/>

                {gridReturn}

            </Grid>

        );
    
    }

    
    render() {

        return (

            <div>

                <Grid>

                    <Row>

                        <Col className="text-center title">Conway's Game Of Life!</Col> 

                    </Row>  

                </Grid>    

                {this.createGameRows()}               

             </div>

        );

    } 

}

class UpdateGameBoard extends React.Component {

    constructor() {

        super()

        this.state = {
            
            count: 0,
            timerOn: false,
            buttonText: "Play",
            gridIsOn: true,
            firstPlay: true
    
        };

        this.updateState = this.updateState.bind(this);
        this.clearGameGrid = this.clearGameGrid.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.toggleGrid = this.toggleGrid.bind(this);

    }

    updateState(){

        gameGrid = checkAndUpdate(gameGrid);
   
        this.setState({count: this.state.count + 1});

    }

    startTimer() {

        let timer;

        if (this.state.timerOn === false){

            this.setState({timerOn: true, buttonText: "Pause", firstPlay: false});

            timer = setInterval(() => {  

                gameGrid = checkAndUpdate(gameGrid);
        
                this.setState({count: this.state.count + 1});

                !this.state.timerOn ? clearInterval(timer) : "";

            }, 50)

        } else {

            this.setState({timerOn: false, buttonText: "Play"});

        }     

    }

    clearGameGrid() {

        for (var i = 0; i < gameGrid.length; i++){

            for (var j = 0; j < gameGrid[i].length; j++){

                    cellColour(i + "cell" + j, "#FFFBE8");
                   
            }

        }

        gameGrid = createGridArr([44, 87], false);

        this.setState({count: 0});

    }

    toggleGrid() {

        gridOnOff(this.state.gridIsOn);

        this.state.gridIsOn ? this.setState({gridIsOn: false}) : this.setState({gridIsOn: true});

}

    render() {

        return (

            <div>

            <Grid>

                <Row>
                  
                    {this.state.firstPlay === true ? this.startTimer() : ""}

                    <Col md={2}><Button className="submit-button" bsSize="large" onClick={this.props.buttonClick}>Random</Button></Col>

                    <Col md={2}><AddToGrid /></Col>

                    <Col md={2}><Button className="submit-button" bsSize="large" onClick={this.updateState}>Update State</Button></Col>

                    <Col md={2}><Button className="submit-button" id="timer-start" bsSize="large" onClick={this.startTimer}>{this.state.buttonText}</Button></Col>

                    <Col md={2}><Button className="submit-button" bsSize="large" onClick={this.clearGameGrid}>Clear Board</Button></Col>

                    <Col md={2}><Button className="submit-button" bsSize="large" onClick={this.toggleGrid}>Toggle Grid</Button></Col>

                </Row>

            </Grid>

               

                <h3>Generation: {this.state.count}</h3>

            </div>

        );

    }

}

class AddToGrid extends React.Component {

    constructor() {

        super();

        this.state = {

            toggle: false,
            buttonColour: "Default"

        };

        this.addSquare = this.addSquare.bind(this);

    }

    addSquare() {

        if (!this.state.toggle) {

            window.onclick=(event) => {

                let cellId = event.target.id;

                let stringPos = cellId.indexOf("c");

                let col = cellId.substring(stringPos + "cell".length), rest = cellId.substring(0, stringPos);

                let row = cellId.substring(0, stringPos);

                //change array entry and colour of cell depending on its current state
                gameGrid[row][col] !== undefined && gameGrid[row][col] === 0 ? (gameGrid[row][col] = 1, cellColour(cellId, "#E95D12")) : (gameGrid[row][col] = 0, cellColour(cellId, "white"));

            };

            document.getElementById("gameboard").style.cursor = "crosshair";

            this.setState({

                toggle: true,
                buttonColour: "danger"

            });

        } else {

            window.onclick=(event) => {};

            document.getElementById("gameboard").style.cursor = "auto";

            this.setState({

                toggle: false,
                buttonColour: "Default"

            });

        }


    }

    render() {
        
        return (

            <Button className="submit-button" bsStyle={this.state.buttonColour} bsSize="large" onClick={this.addSquare}>Add Square</Button>

        );

    }

}

ReactDOM.render(<MainContainer />, document.getElementById('main'));
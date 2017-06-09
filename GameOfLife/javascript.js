let { Grid, Row, Col, Button } = ReactBootstrap;

var gameGrid = [];

var gridHeightWidth = [];

//get input for the game grid
function checkInputFields() {

        gridHeightWidth = [];

        gridHeightWidth.push(document.getElementById('grid-height').value);
        gridHeightWidth.push(document.getElementById('grid-width').value);

        return createGridArr(gridHeightWidth);

}

//create the gaming grid
function createGridArr(arr){
    
    var toReturn = [];

    for (var i = 0; i < arr[0]; i++){

        var toPush = [];

        for (var j = 0; j < arr[1]; j++){
            
            toPush.push(Math.random() < 0.5 ? 1 : 0);

        }

        toReturn.push(toPush);

    }

    return toReturn;

}

function returnSingleCell(rowIndex, cellIndex, isOn){

    if (isOn !== 0){

        var color = "red";

    }

    return (

        <div className="single-cell" id={rowIndex + "cell" + cellIndex} style={{backgroundColor: isOn !== 0 ? "red" : "white"}}>

        </div>    

    );

} 

function gameRowCreate(index, rowIndex) {

var cells = [];

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

    var newGrid = [];

    for (var i = 0; i < grid.length; i++){

        var toPush = [];

        for (var j = 0; j < grid[i].length; j++){

            var neighbourCount = 0;

            neighbourCount += onOuterGrid(grid, [i - 1], [j - 1]); //top left
            neighbourCount += onOuterGrid(grid, [i - 1], [j]); //top center
            neighbourCount += onOuterGrid(grid, [i - 1], [j + 1]); //top right
            neighbourCount += onOuterGrid(grid, [i], [j - 1]); // middle left
            neighbourCount += grid[i][j]; //middle center
            neighbourCount += onOuterGrid(grid, [i], [j + 1]); //middle right
            neighbourCount += onOuterGrid(grid, [i + 1], [j - 1]); //bottom left
            neighbourCount += onOuterGrid(grid, [i + 1], [j]); //bottom centre
            neighbourCount += onOuterGrid(grid, [i + 1], [j + 1]); //bottom right

            toPush.push(aliveOrDead(grid[i][j],neighbourCount));

        }
        
        newGrid.push(toPush);

        }        

    return newGrid;

    }

function aliveOrDead(cell, count){

    if (count === 3){

        return 1;

    } else if (count === 4){

        return cell;

    } else {

        return 0;

    }

}

function onOuterGrid(grid, i, j){

    if (grid[i] == undefined || grid[i][j] == undefined){

        return 0;

    } else {

        return grid[i][j];

    }

}

//change cell colour
function cellColour(cellId){

    console.log(cellId);
}

class MainContainer extends React.Component {

    constructor(props) {

        super(props);
        this.state={gameArr: gameGrid};

        this.handleClick = this.handleClick.bind(this); 
        

    }

    handleClick() {

        gameGrid = checkInputFields();

        this.setState({gameArr: gameGrid});

    }

    
    render() {

        return (

            <div>

                <Row>
                
                    <Col className="grid-info" md={3}>Enter grid height: <Textform areaName="grid-height" /></Col>

                    <Col className="grid-info" md={3}>Enter grid width: <Textform areaName="grid-width" /></Col>

                    <Button className="submit-button" bsStyle="primary" bsSize="large" onClick={this.handleClick}>Submit</Button>
             
                </Row>

                    

                    <CreateGameGrid gridArr={gameGrid} />                

             </div>

        );

    } 

}

class CreateGameGrid extends React.Component {

    constructor(props){

        super(props)
        this.state = {generation: 0};

        this.updateState = this.updateState.bind(this);

    }

    updateState(){
  
        gameGrid = (checkAndUpdate(gameGrid));

        for (var i = 0; i < gameGrid.length; i++){

            for (var j = 0; j < gameGrid[i].length; j++){

                cellColour(i + "cell" + j);

            }

        }

        this.setState({generation: 1});

    }


    createGameRows() {

        var gridHolder = gameGrid;

        var gridReturn = [];

        for (var i = 0; i < gridHolder.length; i++){

            gridReturn.push(gameRowCreate(gridHolder[i], i));

        }

        return (
            
            <Grid >
            
                {gridReturn}
        
            </Grid>

        );
    
    }

    render() {

        return (

            <div>

                <h1>{gameGrid.length}</h1>

                <Button className="submit-button" bsStyle="primary" bsSize="large" onClick={this.updateState}>Update State</Button>

                {this.createGameRows()}

            </div>    

        )

    }

}


class Textform extends React.Component {

  constructor(props) {

    super(props);

    this.state = { value: "" };

  }

    render() {

        return (

            <div>

                <textarea className="text-input" id={this.props.areaName}></textarea>

            </div>

        );

    }

}

ReactDOM.render(<MainContainer />, document.getElementById('main'));
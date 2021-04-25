import React from 'react';
import './Minesweeper.css';

class Minesweeper extends React.Component {
    /*
    * Crete a new minesweeper component
    */
    constructor(props) {
        super(props);

        // Read in props
        this.state = {
            size: props.size,
            mines: props.mines,
            numLeft: props.size*props.size - props.mines,
            status: "playing",
            map: []
        };

        // Create a new mine field
        this.createNewMap();
    }

    /*
    * Inititalize a minesweeper map with this.state.size (square) ad this.state.mines
    */
    createNewMap() {
        var _map = this.state.map;

        // Create the blank map
        for (var x = 0; x < this.state.size; x++) {
            _map[x] = [];

            for (var y = 0; y < this.state.size; y++) {
                _map[x][y] = {
                    "flag": false,
                    "open": false,
                    "mine": false
                }
            }
        }

        // Randomize mine locations
        for (var i = 0; i < this.state.mines; i++) {
            _map[Math.floor(Math.random() * this.state.size)][Math.floor(Math.random() * this.state.size)].mine = true;
        }

        // Store it
        this.setState({ map: _map });
    }

    /*
    * Handles when a space gets left clicked
    */ 
    async leftClickHandler(x, y) {
        if (this.state.status !== "playing")
            return;

        // Don't want to be able to open flagged cells or already open cells
        if(this.state.map[x][y].flag || this.state.map[x][y].open)
            return;

        var _map = this.state.map;
        _map[x][y].open = true;
		
		// Check if we won after updating the map.
		// Note that we need to do this syncronously in order to properly count down.
		await new Promise (end => {
			this.setState({ map: _map, numLeft:this.state.numLeft-1 }, () => {
				if (this.state.map[x][y].mine) {
					this.setState({ status: "lose" });				
				} else if (this.state.numLeft === 0) {
					this.setState({ status: "win" });		
				}
				
				end();
			});
		});
		
		// If we get a zero square, left click all around it for auto complete.
		if(this.countNeighborBombs(x, y) === 0){
			for (var i = x - 1; i <= x + 1; i++) {
				for (var j = y - 1; j <= y + 1; j++) {
					if (i >= 0 && j >= 0 && i < this.state.size && j < this.state.size) {						
						this.leftClickHandler(i, j);
					}
				}
			}
		}					
    }

    /*
    * Handles when a space gets right clicked
    */ 
    rightClickHandler(e, x, y) {
        if (this.state.status !== "playing")
            return;

        e.preventDefault();

        // Toggle the flag
        var _map = this.state.map;
        _map[x][y].flag = !_map[x][y].flag;

        this.setState({ map: _map });
    }

    /*
    * Determines the bombs that surround this space
    */
    countNeighborBombs(x, y) {
        var count = 0;

        for (var i = x - 1; i <= x + 1; i++) {
            for (var j = y - 1; j <= y + 1; j++) {
                if (i >= 0 && j >= 0 && i < this.state.size && j < this.state.size) {
                    if (this.state.map[i][j].mine) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    /*
    * Determines the text to put in this space
    */
    determineSpaceContent(x, y) {
        if (this.state.map[x][y].open) {
            if (this.state.map[x][y].mine) {
                return "X";
            } else {
				var num = this.countNeighborBombs(x, y);				
                return (num > 0) ? num.toString() : "";
            }
        } else if (this.state.map[x][y].flag) {
            return "✔";
        } else {
            return "";
        }
    }

    /*
    * Win/lose message if needed
    */
    determineMessage() {
        if (this.state.status === "win") {
            return "You won!"
        } else if (this.state.status === "lose") {
            return "You hit a bomb!";
        } else {
            return "";
        }
    }

    /*
    * Render the component
    */
    render() {
        return (
            <div>
                <table className="gameboard"> 
                    <thead>
                    </thead>
                    <tbody>
                        {Array.from(Array(this.state.size).keys()).map(y => {
                            return (
                                <tr key={y}>
                                    {Array.from(Array(this.state.size).keys()).map(x => {
                                        return (
                                            <td className={this.state.map[x][y].open ? "openCell" : "closedCell"} onClick={(e) => this.leftClickHandler(x, y)}
                                                onContextMenu={(e) => this.rightClickHandler(e, x, y)}
                                                key={x}>
                                                {this.determineSpaceContent(x, y)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <center><h1>{this.determineMessage()}</h1></center>
            </div>
        );
    }
}

export default Minesweeper;
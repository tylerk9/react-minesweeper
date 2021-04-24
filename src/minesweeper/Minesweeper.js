import React from 'react';
import styles from './Minesweeper.module.css';

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
            numCorrect: 0,
            numFlags: 0,
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
    leftClickHandler(e, x, y) {
        if (this.state.status !== "playing")
            return;

        e.preventDefault();

        // Don't want to be able to open flagged cells.
        if(this.state.map[x][y].flag)
            return;

        var _map = this.state.map;
        _map[x][y].open = true;
        this.setState({ map: _map }, () => {
            if (this.state.map[x][y].mine) {
                this.setState({ status: "lose" });
            }
        });
    }

    /*
    * Handles when a space gets right clicked
    */ 
    rightClickHandler(e, x, y) {
        if (this.state.status !== "playing")
            return;

        e.preventDefault();

        var _map = this.state.map;

        if (_map[x][y].flag) {
            // About to be unflagged
            this.setState({ numFlags: this.state.numFlags - 1 })

            if (_map[x][y].mine) {
                // About to be incorrect
                this.setState({ numCorrect: this.state.numCorrect - 1 })
            }
        } else {
            // About to be flagged
            this.setState({ numFlags: this.state.numFlags + 1 })

            if (_map[x][y].mine) {
                // About to be correct
                this.setState({ numCorrect: this.state.numCorrect + 1 })
            }
        }

        // Flip-flop the flag
        _map[x][y].flag = !_map[x][y].flag;

        this.setState({ map: _map }, () => {
            if (this.state.numCorrect === this.state.mines && this.state.mines === this.state.numFlags) {
                this.setState({ status: "win" });
            }
        });
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
                return this.countNeighborBombs(x, y).toString();
            }
        } else if (this.state.map[x][y].flag) {
            return "☑";
        } else {
            return "☐"
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
                <table className={styles.gameboard}> 
                    <thead>
                    </thead>
                    <tbody>
                        {Array.from(Array(this.state.size).keys()).map(x => {
                            return (
                                <td key={x}>
                                    {Array.from(Array(this.state.size).keys()).map(y => {
                                        return (
                                            <tr onClick={(e) => this.leftClickHandler(e, x, y)}
                                                onContextMenu={(e) => this.rightClickHandler(e, x, y)}
                                                key={y}>
                                                {this.determineSpaceContent(x, y)}
                                            </tr>
                                        );
                                    })}
                                </td>
                            )
                        })}
                    </tbody>
                </table>
                <center><h1>{this.determineMessage()}</h1></center>
            </div>
        );
    }
}

export default Minesweeper;
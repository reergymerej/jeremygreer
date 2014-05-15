(function () {
    'use strict';

    var app = {

        init: function () {
        
            this.setUpFramework();
            this.grid.display();

            // start game
            this.start();
        },

        setUpFramework: function () {
            this.definePrototypes();
            this.grid = new this.Grid(4, 4, $('#grid'));
        },

        // Start a new game.
        start: function () {
            var that = this;
            this.topValue = 0;
            this.grid.display();
            this.grid.add();

            // TODO: Clear this at the end of the game or set up 
            // one at the beginning.
            $('body').keydown(function (event) {
                var direction = that.KEYS[event.which];
                
                if (direction) {

                    // Attempt to move and then check to see if the
                    // game is over.
                    // TODO: Need to run a test for any valid moves
                    // instead of waiting for the user to move so we
                    // can tell if the game is over.
                    if (that.move(direction) &&
                        !that.grid.add() || this.topValue === 2048) {
                            console.log('game over');
                        }
                }
            });
        },

        /**
        * @param {String} direction n,e,w, or s
        * @return {Boolean} move completed
        */
        move: function (direction) {
            var that = this,
                success = false;

            if (direction === 'w' || direction === 'e') {

                this.grid.eachRow(function (row) {
                    var stack = new that.Stack(row);
                    success = stack.move(direction === 'w' ? -1 : 1) || success;
                });

            } else {

                this.grid.eachColumn(function (column) {
                    var stack = new that.Stack(column);
                    success = stack.move(direction === 'n' ? -1 : 1) || success;
                });
            }

            return success;
        },

        definePrototypes: function () {

            var Grid = this.Grid.prototype,
                Square = this.Square.prototype,
                Stack = this.Stack.prototype;

            Grid.toString = function () {
                var r, rows = [];

                for (r = 0; r < this.rows; r++) {
                    rows.push(this.row(r).join(' '));
                }

                return rows.join('\n');
            };

            Grid.column = function (x) {
                var i, column;

                if (x < this.columns && x >= 0) {
                    column = [];
                    for (i = 0; i < this.rows; i++) {
                        column.push(this.grid[i][x]);
                    }
                    
                }

                return column;
            };

            Grid.row = function (x) {
                return this.grid[x];
            };

            /**
            * Add a value to one of the random "empty" squares.
            * @return {Boolean} a value was added to the board
            */
            Grid.add = function () {
                var square = this.getEmptySquare();
                if (square) {
                    square.value(Math.random() < 0.5 ? 2 : 4);
                }

                return !!square;
            };

            Grid.getEmptySquare = function () {
                var empties = [];
                this.each(function (square) {
                    if (!square.value()) {
                        empties.push(square);
                    }
                });

                if (empties.length) {
                    return empties[app.rand(0, empties.length - 1)];
                }
            };

            Grid.each = function (fn) {
                var c;

                this.eachRow(function (row) {
                    for (c = 0; c < row.length; c++) {
                        fn(row[c]);
                    }
                });
            };

            Grid.eachRow = function (fn) {
                var r;

                for (r = 0; r < this.rows; r++) {
                    fn(this.row(r));
                }
            };

            Grid.eachColumn = function (fn) {
                var i;
                for (i = 0; i < this.columns; i++) {
                    fn(this.column(i));
                }
            };

            Grid.display = function () {
                console.log('-------------------');
                console.log(this.toString());
            };

            Grid.buildDomGrid = function () {
                var el = this.el,
                    rowEl,
                    row = 0,
                    rowArr = [],
                    column,
                    squareEl;

                for (; row < this.rows; row++) {
                    rowEl = $('<div>', {
                        class: 'row'
                    }).appendTo(el);

                    rowArr = this.row(row);

                    for (column = 0; column < rowArr.length; column++) {
                        squareEl = $('<div>', {
                            class: 'square'
                        });
                        rowEl.append(squareEl);
                        rowArr[column].el = squareEl;
                    }
                }
            };

            Square.toString = function () {
                return '[' + this.column + ', ' + this.row +
                    ' (' + this.value() + ')]';
            };

            Square.value = function (x) {
                if (x === undefined) {
                    return this.val;
                } else {
                    this.val = x;
                    app.topValue = Math.max(app.topValue, this.val);
                    this.updateView();
                }
            };

            Square.updateView = function () {
                var value = this.value() || '';

                // TODO: This is expensive and dumb.
                // Added just to figure out the CSS for now.
                this.el.html(value)
                    .removeClass()
                    .addClass('square ' + (value ? 'val-' + value : ''));
            };

            /**
            * Merges this square's value with another's.
            * Clears other's value.
            * @return {Boolean} success
            */
            Square.merge = function (square) {
                var squareValue = square.value(),
                    value = this.value(),
                    success = false;

                if (!value || squareValue === value) {
                    this.value(squareValue + value);
                    square.value(0);
                    success = true;
                }

                return success;
            };

            /**
            * Moves/merges squares left/up or right/down.
            * @param {Number} direction left/up when < 0
            * right/down when > 0.
            * @return {Boolean} success
            */
            Stack.move = function (direction) {
                var success = false,
                    stack = this.squares,
                    square,
                    squareValue,
                    emptySquare,
                    i,
                    targetSquareValue,
                    potentialMergable,
                    lastMergeIndex,
                    squareMoved,
                    inc = direction < 0 ? -1 : 1,
                    index = inc < 0 ? 0 : stack.length - 1;

                // Move each square.
                for (; index < stack.length && index >= 0; index -= inc) {
                    square = stack[index];
                    squareValue = square.value();
                    squareMoved = false;

                    if (squareValue) {

                        // Find the furthest empty square in the direction
                        // of movement and the first potential mergable.
                        i = index + inc;
                        targetSquareValue = 0;
                        potentialMergable = null;
                        while (i >= 0 && i < stack.length) {
                            targetSquareValue = stack[i].value();
                            if (!targetSquareValue) {
                                emptySquare = stack[i];
                            } else if (!potentialMergable) {
                                potentialMergable = stack[i];
                            }

                            i += inc;
                        }

                        // Try to merge.
                        if (potentialMergable) {

                            // Make sure we didn't just merge this one.
                            if (lastMergeIndex !== potentialMergable.column) {

                                    if (potentialMergable.merge(square)) {
                                        lastMergeIndex = potentialMergable.column;
                                        squareMoved = true;
                                        
                                    }
                            }
                        }

                        // Move to an empty space.
                        if (emptySquare && !squareMoved) {
                            emptySquare.merge(square);
                            squareMoved = true;
                        }
                    }

                    success = success || squareMoved;
                }


                return success;
            };
        },

        Grid: function Grid (columns, rows, el) {
            var c, r, row;

            this.columns = columns;
            this.rows = rows;
            this.el = el;

            // build an array to represent the grid
            this.grid = [];
            for (r = 0; r < rows; r++) {
                row = [];
                for (c = 0; c < columns; c++) {
                    row.push(new app.Square(c, r));
                }
                this.grid.push(row);
            }

            this.buildDomGrid();
        },

        Square: function Square (column, row) {
            this.column = column;
            this.row = row;
            this.val = 0;
        },

        // A column/row of squares.
        Stack: function Stack (squares) {
            this.squares = squares;
        },

        rand: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        grid: undefined,
        
        topValue: undefined,

        KEYS: {
            38: 'n',
            39: 'e',
            37: 'w',
            40: 's'
        }
    };

    $(function () {
        app.init();
    });
}());
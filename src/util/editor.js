/**
 * Copyright 2013 Sweet Carolina Games
 */

/**
 * @file editor.js
 * @author Ian Coleman <ian@sweetcarolinagames.com>
 * 
 * Tile-based visual level editor tool
 */


$(document).ready(function() {
	Editor.init(18, 18);
}); 

/**
 * Using JSON-like class definition since
 * Editor is a singleton
 * @author Ian Coleman
 */
var Editor = {
		
	width: 0, // counted in number of tiles
	tileWidthPx: 40,
	height: 0, // counted in number of tiles
	tileHeightPx: 40,
	grid: [],
	mouseDown: false,
	editorContainer: null,
	printoutContainer: null,
	keyModifier: null,
	
	// tile type enum
	tileTypes:  {
		UNDEFINED: 0,
		FLAT: 1,
		START: 3,
		GOAL: 4,
		RAISED: 8
	},

	/**
	 * Sets up the Editor
	 * @author Ian Coleman
	 * @param int widthTileCount -- number of tiles across
	 * @param int heightTileCount -- number of tiles down
	 */
	init: function(widthTileCount, heightTileCount) {
		this.width = widthTileCount;
		this.height = heightTileCount;
		this.editorContainer = $("#editor-container");
		this.printoutContainer = $("<div id='printout-container'></div>");
		this.clearGrid();
		this.draw();
		this.attachBehaviors();
		var editor = this;
		
		$(document).keydown(function(event) {
			if(event.which == 70) {
				console.log('f');
				editor.keyModifier = 'f';
			}
			else if(event.which == 82) {
				console.log('r');
				editor.keyModifier = 'r';
			} 
			else if(event.which == 83) {
				console.log('s');
				editor.keyModifier = 's';
			}
			else if(event.which == 71) {
				console.log('g');
				editor.keyModifier = 'g';
			}
			console.log(editor.keyModifier);
		});
		
		$(document).keyup(function(event) {
			editor.keyModified = undefined; 
		});
	},
	
	/**
	 * Sets all tiles to value -1 (empty tile)
	 * @author Ian Coleman
	 */
	clearGrid: function() {
		for(var i=0; i < this.height; i++) {
			this.grid[i] = new Array(this.width);
			for(var j=0; j < this.width; j++) {
				this.grid[i][j] = -1;
			}
		}
	},
	
	/**
	 * Draws flat representation of grid
	 * @author Ian Coleman
	 */
	draw: function() {
		var width = this.tileWidthPx;
		var height = this.tileHeightPx;
		var gridContainer = $("<div id='editor-grid-container'></div>");
		$.each(this.grid, function(rowIndex, row) {						
			$.each(row, function(index, value) {
				var editorTile = $("<div class='editor-tile'></div>");
				editorTile.attr('x', index);
				editorTile.attr('y', rowIndex);				
				var leftOffset = index * width;
				var topOffset = rowIndex * height;
				editorTile.css({left: leftOffset+"px", top: topOffset+"px"});
				gridContainer.append(editorTile);
			});			
		});	
		this.editorContainer.append(gridContainer);
	},
	
	/**
	 * Attaches mouse events to elements
	 * @author Ian Coleman
	 */
	attachBehaviors: function() {
		var gridContainer = $("#editor-grid-container");
		var editor = this;
		
		// set mouseDown
		$("body").on("mousedown", null, null, function(event) {
			if(event.which == 1)
				editor.mouseDown = true;			
		});
		
		// clear mouseDown
		$("body").on("mouseup", null, null, function(event) {
			if(event.which == 1)
				editor.mouseDown = false;			
		});
		
		// attach mousedown behavior to tiles in grid
		gridContainer.on('mousedown', '.editor-tile', function(event) {
			if(event.which == 1) {
				editor.setTileType($(this), editor.tileTypes.FLAT);
				var rowIndex = parseInt($(this).attr('y'));
				var columnIndex = parseInt($(this).attr('x'));
				editor.updateGrid(columnIndex, rowIndex, 1);
			}				
		});
		
		// attach mouseover behavior to tiles in grid
		gridContainer.find('.editor-tile').on('mouseover', function(event) {
			if(editor.mouseDown && event.which == 1) {
				editor.setTileType($(this), editor.tileTypes.FLAT);
				var rowIndex = parseInt($(this).attr('y'));
				var columnIndex = parseInt($(this).attr('x'));
				editor.updateGrid(columnIndex, rowIndex, "01");
			}
		});
	},
	
	/**
	 * Sets styles,attributes for @tile of corresponding to @type
	 * @author Ian Coleman
	 * @param object tile
	 * @param int type
	 */
	setTileType: function(tile, type) {
		switch(type) {
		case this.tileTypes.FLAT:
			tile.addClass("editor-tile-flat");
			break;
		case this.tileTypes.START:
			tile.addClass("editor-tile-start");
			break;
		case this.tileTypes.GOAL:
			tile.addClass("editor-tile-goal");
			break;
		case this.tileTypes.RAISED:
			tile.addClass("editor-tile-raied");
			break;
		default:
			break;
		}
	},
	
	/**
	 * Sets value of grid at index <x,y>
	 */
	updateGrid: function(x, y, value) {
		this.grid[y][x] = value;
	},
	
	/**
	 * Handler for button that outputs grid definition
	 * @author Ian Coleman
	 */
	submitOutputGrid: function(button) {
		console.log("grid output");
		this.outputGrid();
	},
	
	/**
	 * @author Ian Coleman
	 */
	outputGrid: function() {
		var editor = this;
				
		$.each(this.grid, function(index, row ) {
			editor.printoutContainer.append("<p>" + row.toString() + "<p>");			
		});
	}
};


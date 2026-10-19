//set up grid
const grid_x = 10;
const grid_y = 10;
const grid_line_width = 1;
const cell_width = 50;
const grid_width = (grid_x * cell_width) + (grid_x * grid_line_width);
const grid_height = (grid_y * cell_width) + (grid_y * grid_line_width);
const edge_offset = 0.5 * grid_line_width;
const cell_size = cell_width + grid_line_width;

//set up pattern
const image_data = new Array(grid_x);
for (let i = 0; i < grid_x; i++) {
    image_data[i] = new Array(grid_y).fill(0);
}

//button
const save_button = document.getElementById("save_button");

//set up canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas_width = (grid_x * cell_width) + ((grid_x + 1) * grid_line_width);
const canvas_height = (grid_y * cell_width) + ((grid_y + 1) * grid_line_width);
canvas.height = canvas_height;
canvas.width = canvas_width;

//set up palette
const palette_canvas = document.getElementById("palette");
const ptx = palette_canvas.getContext("2d");

const palette = new Map();
palette.set(0, "clear");
palette.set(1, "black");
palette.set(2, "red");
palette.set(3, "blue");
palette.set(4, "green");

const palette_width = cell_width + 2 * grid_line_width;
const palette_height = (palette.size * cell_width) + ((palette.size + 1) * grid_line_width);
palette_canvas.height = palette_height;
palette_canvas.width = palette_width;

let current_colour = 0;

//events
function mouse_pos(canvas, event) {
    const rect = canvas.getBoundingClientRect();

    x = Math.floor((event.clientX - rect.left - edge_offset) / cell_size);
    y = Math.floor((event.clientY - rect.top - edge_offset) / cell_size);

    image_data[x][y] = current_colour;
}

function select_colour(palette_canvas, event) {
    const rect = palette_canvas.getBoundingClientRect();

    current_colour = Math.floor((event.clientY - rect.top - edge_offset) / cell_size);
}

function print_json() {
    const pattern = {
        size: {
            width: grid_x,
            height: grid_y
        },
        palette: {},
        data: []
    };

    for (let i = 1; i < palette.size; i++) {
        pattern.palette[i] = palette.get(i);
    }

    for (let y = 0; y < grid_y; y++) {
        let newRow = [];
        for (let x = 0; x < grid_x; x++){
            newRow.push(image_data[x][y]); 
        }
        pattern.data.push(newRow);
    }

    console.log(JSON.stringify(pattern));
}

canvas.addEventListener("click", (event) => {
    mouse_pos(canvas, event);
    draw();
})

palette_canvas.addEventListener("click", (event) => {
    select_colour(palette_canvas, event);
})

save_button.addEventListener("click", print_json);

//drawing
function fill_cell(x, y) {
    ctx.fillStyle = palette.get(image_data[x][y]);
    ctx.fillRect(edge_offset + (x * cell_size), edge_offset + (y * cell_size), cell_size, cell_size);
}

function draw_cells() {
    for (let x = 0; x < grid_x; x++) {
        for (let y = 0; y < grid_y; y++) {
            if (image_data[x][y] != 0) {
                fill_cell(x, y);
            }
        }
    }
}

function draw_grid() {
    ctx.strokeStyle = "lightgray";

    //columns
    for (let i = 0; i < grid_x; i++) {
        ctx.strokeRect(edge_offset + (i * (cell_width + grid_line_width)), edge_offset, cell_width + 1, grid_height + 1);
    }

    //rows
    for (let i = 0; i < grid_y; i++) {
        ctx.strokeRect(edge_offset, edge_offset + (i * (cell_width + grid_line_width)), grid_width + 1, cell_width + 1);
    }
}

function draw_border() {
    ctx.strokeStyle = "black";
    ctx.strokeRect(edge_offset, edge_offset, grid_width, grid_height);
}

function draw_palette_cells() {
    for (let i = 0; i < palette.size; i++) {
        if (i == 0) {
            ptx.clearRect(edge_offset, edge_offset, cell_size, cell_size);
        } else {
            ptx.fillStyle = palette.get(i);
            ptx.fillRect(edge_offset, edge_offset + (i * cell_size), cell_size, cell_size);
        }
    }
}

function draw_palette_grid() {
    ptx.strokeStyle = "lightgray";
    for (let i = 0; i < palette.size; i++) {
        ptx.strokeRect(edge_offset, edge_offset + (i * (cell_width + grid_line_width)), grid_width + 1, cell_width + 1);
    }
}

function draw_palette_border() {
    ptx.strokeStyle = "black";
    ptx.strokeRect(edge_offset, edge_offset, palette_width - edge_offset, palette_height - edge_offset);
}

function draw() {
    //draw pattern
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    draw_cells();
    draw_grid();
    draw_border();

    //draw palette
    ptx.clearRect(0, 0, palette_width, palette_height);
    draw_palette_cells();
    draw_palette_grid();
    draw_palette_border();
}

draw();
import {makeNoise2D} from 'open-simplex-noise' ;

export class Monster {
    birth_limit = 5
    death_limit = 4
    n_steps = 4
    n_colors = 255
    noise ;
    noise2 ;
    outline=true;
    constructor(size) {
        console.log(">>>Monster init check");
        this.generate(size ? { x: size, y: size } : { x: 32, y: 32 });
    }

    generate(size){
        // this.noise2.setOctaves(3);
        // this.noise2.setPeriod(40.0);
        // this.noise2.setPersistence(0.4);
        // this.noise2.setLacunarity(3.0);

        // this.noise.setOctaves(5);
        // this.noise.setPeriod(30.0);
        // this.noise.setPersistence(0.4);
        // this.noise.setLacunarity(3.0);
        this.noise = makeNoise2D(Math.floor(Math.random() * 100000));
        this.noise2 = makeNoise2D(Math.floor(Math.random() * 100000));
        this.size = size;
        this.tileMap = this.generateNew(this.size);
        this.tileMap = this.cellcularAutomate(this.tileMap,this.n_steps) ;
        this.scheme = this.generateColorScheme(this.n_colors)
        this.eyeScheme = this.generateColorScheme(this.n_colors)
        this.allGroup = this.fillColor(this.tileMap,this.scheme,this.eyeScheme,this.n_colors,this.outline);
        this.g_draw = null ;
    }

    //map generate
    generateNew(size) {
        var map = this.getRandomMap(size);
        for (let i = 0; i < 2; i++) this.randomWalk(size, map);
        return map;
    }

    randomWalk(size, map) {
        var pos = [Math.floor(Math.random() * size.x), Math.floor(Math.random() * size.y)];
        for (var i = 0; i < 100; i++) {
            this.setAtPos(map, pos, true);

            this.setAtPos(map, [size.x - pos[0] - 1, pos[1]], true);
            pos = [
                pos[0] + Math.floor(Math.random() * 3) - 1,
                pos[1] + Math.floor(Math.random() * 3) - 1
            ];
        }
    }

    setAtPos(map, pos, value) {
        if (pos[0] >= 0 && pos[0] < map.length && pos[1] >= 0 && pos[1] < map[0].length) {
            map[pos[0]][pos[1]] = value;
        }
    }
    getAtPos(map,pos){
        if (pos[0] >= 0 && pos[0] < map.length && pos[1] >= 0 && pos[1] < map[0].length) {
            return map[pos[0]][pos[1]] ;
        }
        return null ;
    }


    getRandomMap(size) {
        var map = [];
        for (let x = 0; x < this.size.x; x++) {
            map.push([]);
        }

        for (var x = 0; x < Math.ceil(size.x * 0.5); x++) {
            var arr = [];
            for (var y = 0; y < size.y; y++) {
                arr.push(this.randomBool(0.48));

                // When close to center increase the chances to fill the map, so it's more likely to end up with a sprite that's connected in the middle
                var toCenter = (Math.abs(y - size.y * 0.5) * 2.0) / size.y;
                if (x === Math.floor(size.x * 0.5) - 1 || x === Math.floor(size.x * 0.5) - 2) {
                    if (this.randomRange(0,0.4) > toCenter) {
                        arr[y] = true;
                    }
                }
            }

            map[x] = arr.slice();
            map[size.x - x - 1] = arr.slice();
        }
        return map;
    }

    randomBool(chance) {
        return Math.random() > chance;
    }

    //cellular automate
    cellcularAutomate(map,n_steps){
        for(let i=0;i<n_steps;i++){
            map = this.cellcularAutomateStep(map) ;
        }
        return map ;
    }
    cellcularAutomateStep(map) {
        var dup = [...map];
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[x].length; y++) {
                var cell = dup[x][y];
                var n = this.getNeighbours(map, [x, y]);
                if (cell && n < this.death_limit) {
                    dup[x][y] = false;
                } else if (!cell && n > this.birth_limit) {
                    dup[x][y] = true;
                }
            }
        }
        return dup;
    }
    
    getNeighbours(map, pos) {
        var count = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    if (this.getAtPos(map, [pos[0] + i, pos[1] + j])) {
                        count += 1;
                    }
                }
            }
        }
        return count;
    }
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    //Using ideas from https://www.iquilezles.org/www/articles/palettes/palettes.htm
    generateColorScheme(n_colors){
        var a = [this.randomRange(0.0, 0.5), this.randomRange(0.0, 0.5), this.randomRange(0.0, 0.5)];
        var b = [this.randomRange(0.1, 0.6), this.randomRange(0.1, 0.6), this.randomRange(0.1, 0.6)];
        var c = [this.randomRange(0.15, 0.8), this.randomRange(0.15, 0.8), this.randomRange(0.15, 0.8)];
        var d = [this.randomRange(0.0, 1.0), this.randomRange(0.0, 1.0), this.randomRange(0.0, 1.0)];
    
        var cols = [];
        var n = parseFloat(n_colors - 1);
        for (var i = 0; i < n_colors; i++) {
            var vec3 = [0, 0, 0];
            vec3[0] = (a[0] + b[0] * Math.cos(6.28318 * (c[0] * (i / n) + d[0]))) + (i / n) * 0.8;
            vec3[1] = (a[1] + b[1] * Math.cos(6.28318 * (c[1] * (i / n) + d[1]))) + (i / n) * 0.8;
            vec3[2] = (a[2] + b[2] * Math.cos(6.28318 * (c[2] * (i / n) + d[2]))) + (i / n) * 0.8;
    
            cols.push([vec3[0], vec3[1], vec3[2]]);
        }
        return cols;
    }

    //
    fillColor(map,colorscheme,eye_colorscheme,n_colors,outline=true){
        let groups = [];
        let negative_groups = [];
    
        groups = this.floodFill(map, groups, colorscheme, eye_colorscheme, n_colors, false, outline);
        negative_groups = this.floodFillNegative(map, negative_groups, colorscheme, eye_colorscheme, n_colors, outline);
    
        return {
            "groups": groups,
            "negative_groups": negative_groups
        };
    }

    floodFillNegative(map, groups, colorscheme, eye_colorscheme, n_colors, outline) {
        let negative_map = [];
        for (let x = 0; x < map.length; x++) {
            let arr = [];
            for (let y = 0; y < map[x].length; y++) {
                arr.push(!this.getAtPos(map, [x,y]));
            }
            negative_map.push(arr);
        }
        
        return this.floodFill(negative_map, groups, colorscheme, eye_colorscheme, n_colors, true, outline);
    }

    floodFill(map, groups, colorscheme, eye_colorscheme, n_colors, is_negative = false, outline = true) {
        let checked_map = [];
        for (let x = 0; x < map.length; x++) {
            let arr = [];
            for (let y = 0; y < map[x].length; y++) {
                arr.push(false);
            }
            checked_map.push(arr);
        }
    
        let bucket = [];
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[x].length; y++) {
                if (!checked_map[x][y]) {
                    checked_map[x][y] = true;
    
                    if (map[x][y]) {
                        bucket.push({x: x, y: y});
    
                        let group = {
                            arr: [],
                            valid: true
                        };
    
                        while (bucket.length > 0) {
                            let pos = bucket.pop();
    
                            let right = this.getAtPos(map, [pos.x + 1, pos.y]);
                            let left = this.getAtPos(map, [pos.x - 1, pos.y]);
                            let down = this.getAtPos(map, [pos.x, pos.y + 1]);
                            let up = this.getAtPos(map, [pos.x, pos.y - 1]);
    
                            if (is_negative && (left === null || up === null || down === null || right === null)) {
                                group.valid = false;
                            }
    
                            let col = this.getColor(map, pos, is_negative, right, left, down, up, colorscheme, eye_colorscheme, n_colors, outline, group);
    
                            group.arr.push({
                                position: pos,
                                color: col
                            });
    
                            if (right && !checked_map[pos.x + 1][pos.y]) {
                                bucket.push({x: pos.x + 1, y: pos.y});
                                checked_map[pos.x + 1][pos.y] = true;
                            }
                            if (left && !checked_map[pos.x - 1][pos.y]) {
                                bucket.push({x: pos.x - 1, y: pos.y});
                                checked_map[pos.x - 1][pos.y] = true;
                            }
                            if (down && !checked_map[pos.x][pos.y + 1]) {
                                bucket.push({x: pos.x, y: pos.y + 1});
                                checked_map[pos.x][pos.y + 1] = true;
                            }
                            if (up && !checked_map[pos.x][pos.y - 1]) {
                                bucket.push({x: pos.x, y: pos.y - 1});
                                checked_map[pos.x][pos.y - 1] = true;
                            }
                        }
                        groups.push(group);
                    }
                }
            }
        }
        return groups;
    }

    getColor(map, pos, is_negative, right, left, down, up, colorscheme, eye_colorscheme, n_colors, outline, group) {
        var col_x = Math.ceil(Math.abs(pos.x - (map.length - 1) * 0.5));
        var n = Math.pow(Math.abs(this.noise(col_x, pos.y)), 1.5) * 3.0;
        var n2 = Math.pow(Math.abs(this.noise2(col_x, pos.y)), 1.5) * 3.0;
    
        if (!down) {
            if (is_negative) {
                n2 -= 0.1;
            } else {
                n -= 0.45;
            }
            n *= 0.8;
            if (outline) {
                group.arr.push({
                    "position": {x:pos.x,y:pos.y+1},
                    "color": [0,0,0,1]
                });
            }
        }
        if (!right) {
            if (is_negative) {
                n2 += 0.1;
            } else {
                n += 0.2;
            }
            n *= 1.1;
            if (outline) {
                group.arr.push({
                    "position": {x:pos.x+1,y:pos.y},
                    "color": [0,0,0,1]
                });
            }
        }
        if (!up) {
            if (is_negative) {
                n2 += 0.15;
            } else {
                n += 0.45;
            }
            n *= 1.2;
            if (outline) {
                group.arr.push({
                    "position": {x:pos.x,y:pos.y-1},
                    "color": [0,0,0,1]
                });
            }
        }
        if (!left) {
            if (is_negative) {
                n2 += 0.1;
            } else {
                n += 0.2;
            }
            n *= 1.1;
            if (outline) {
                group.arr.push({
                    "position": {x:pos.x-1,y:pos.y},
                    "color": [0,0,0,1]
                });
            }
        }
        var c_0 = colorscheme[Math.floor(Math.abs(this.noise(col_x, pos.y)) * (n_colors - 1))];
        var c_1 = colorscheme[Math.floor(Math.abs(this.noise(col_x, pos.y - 1)) * (n_colors - 1))];
        var c_2 = colorscheme[Math.floor(Math.abs(this.noise(col_x, pos.y + 1)) * (n_colors - 1))];
        var c_3 = colorscheme[Math.floor(Math.abs(this.noise(col_x - 1, pos.y)) * (n_colors - 1))];
        var c_4 = colorscheme[Math.floor(Math.abs(this.noise(col_x + 1, pos.y)) * (n_colors - 1))];
        var diff = ((Math.abs(c_0[0] - c_1[0]) + Math.abs(c_0[1] - c_1[1]) + Math.abs(c_0[2] - c_1[2])) +
            (Math.abs(c_0[0] - c_2[0]) + Math.abs(c_0[1] - c_2[1]) + Math.abs(c_0[2] - c_2[2])) +
            (Math.abs(c_0[0] - c_3[0]) + Math.abs(c_0[1] - c_3[1]) + Math.abs(c_0[2] - c_3[2])) +
            (Math.abs(c_0[0] - c_4[0]) + Math.abs(c_0[1] - c_4[1]) + Math.abs(c_0[2] - c_4[2])));
        if (diff > 2.0) {
            n += 0.3;
            n *= 1.5;
            n2 += 0.3;
            n2 *= 1.5;
        }
    
        n = this.clamp(n, 0.0, 1.0);
        n = Math.floor(n * (n_colors - 1));
        n2 = this.clamp(n2, 0.0, 1.0);
        n2 = Math.floor(n2 * (n_colors - 1));
        var col = colorscheme[n];
    
        if (is_negative) {
            col = eye_colorscheme[n2];
        }
        return col;
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }
}
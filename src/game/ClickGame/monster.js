import { makeNoise2D } from 'open-simplex-noise';


class Noise2D {
    octaves = 3;
    period = 40;
    persistense = 0.4;
    lacunarity = 3;
    noise;
    constructor(seed) {
        this.noise = makeNoise2D(seed);
    }
    noise2D(x, y) {
        let value = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        for (let octave = 0; octave < this.octaves; octave++) {
            const noiseValue = (this.noise(x * frequency / this.period, y * frequency / this.period) + 1) * 0.5; // make noise [0,1]
            value = value + noiseValue * amplitude;
            maxValue = maxValue + amplitude;
            frequency *= this.lacunarity;
            amplitude *= this.persistence;
        }

        return value / maxValue;
    }
}

export class Monster {
    name ;
    birth_limit = 5; //5
    death_limit = 4; //4
    n_steps = 4; //4
    n_colors = 12; //12
    symmetry = 100;//100  
    noise;
    noise2;
    outline = true;
    constructor(size) {
        console.log(">>>Monster init check");
        this.generate(size ? { x: size, y: size } : { x: 32, y: 32 });
    }

    generate(size) {
        this.randomSeed = [Math.floor(Math.random() * 100000) , Math.floor(Math.random() * 100000)] ;
        //this.randomSeed = [1,2];
        this.noise = new Noise2D(this.randomSeed[0]);
        this.noise2 = new Noise2D(this.randomSeed[1]);

        this.noise2.octaves = 3;
        this.noise2.period = 40.0;
        this.noise2.persistence = 0.4;
        this.noise2.lacunarity = 3.0;

        this.noise.octaves = 5;
        this.noise.period = 30.0;
        this.noise.persistence = 0.4;
        this.noise.lacunarity = 3.0;
        this.name = this.generateName();
        this.size = size;
        this.tileMap = this.generateNew(this.size);
        this.tileMap = this.cellcularAutomate(this.tileMap, this.n_steps);
        this.scheme = this.generateColorScheme(this.n_colors)
        this.eyeScheme = this.generateColorScheme(this.n_colors)
        this.allGroup = this.fillColor(this.tileMap, this.scheme, this.eyeScheme, this.n_colors, this.outline);
        this.filterGroup(this.allGroup);
        this.g_draw = null;
    }

    //map generate
    generateNew(size) {
        var map = this.getRandomMap(size);
        for (let i = 0; i < 2; i++) this.randomWalk(size, map);

        for (let x = Math.ceil(size.x * 0.5); x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                if (Math.random() * 100 > this.symmetry) {
                    map[x][y] = Math.random() > 0.48;

                    const to_center = (Math.abs(y - size.y * 0.5) * 2.0) / size.y;
                    if (x === Math.floor(size.x * 0.5) - 1 || x === Math.floor(size.x * 0.5) - 2) {
                        if (Math.random() > 0.4 * to_center) {
                            map[x][y] = true;
                        }
                    }
                }
            }
        }
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
    getAtPos(map, pos) {
        if (pos[0] >= 0 && pos[0] < map.length && pos[1] >= 0 && pos[1] < map[0].length) {
            return map[pos[0]][pos[1]];
        }
        return null;
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
                    if (this.randomRange(0, 0.4) > toCenter) {
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
    cellcularAutomate(map, n_steps) {
        for (let i = 0; i < n_steps; i++) {
            map = this.cellcularAutomateStep(map);
        }
        return map;
    }
    cellcularAutomateStep(map) {
        var dup = JSON.parse(JSON.stringify(map));//[...map];浅拷贝有问题！！
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
    generateColorScheme(n_colors) {
        var a = [this.randomRange(0.0, 0.5), this.randomRange(0.0, 0.5), this.randomRange(0.0, 0.5)];
        var b = [this.randomRange(0.1, 0.6), this.randomRange(0.1, 0.6), this.randomRange(0.1, 0.6)];
        var c = [this.randomRange(0.15, 0.8), this.randomRange(0.15, 0.8), this.randomRange(0.15, 0.8)];
        var d = [this.randomRange(0.4, 0.6), this.randomRange(0.4, 0.6), this.randomRange(0.4, 0.6)];

        var cols = [];
        var n = parseFloat(n_colors - 1);
        for (var i = 0; i < n_colors; i++) {
            var vec3 = [0, 0, 0];
            vec3[0] = (a[0] + b[0] * Math.cos(6.28318 * (c[0] * (i / n) + d[0]))) + (i / n);
            vec3[1] = (a[1] + b[1] * Math.cos(6.28318 * (c[1] * (i / n) + d[1]))) + (i / n);
            vec3[2] = (a[2] + b[2] * Math.cos(6.28318 * (c[2] * (i / n) + d[2]))) + (i / n);

            cols.push([vec3[0] * 0.8, vec3[1] * 0.8, vec3[2] * 0.8]);
        }
        return cols;
    }

    //
    fillColor(map, colorscheme, eye_colorscheme, n_colors, outline = true) {
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
                arr.push(!this.getAtPos(map, [x, y]));
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
                        bucket.push({ x: x, y: y });

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
                                bucket.push({ x: pos.x + 1, y: pos.y });
                                checked_map[pos.x + 1][pos.y] = true;
                            }
                            if (left && !checked_map[pos.x - 1][pos.y]) {
                                bucket.push({ x: pos.x - 1, y: pos.y });
                                checked_map[pos.x - 1][pos.y] = true;
                            }
                            if (down && !checked_map[pos.x][pos.y + 1]) {
                                bucket.push({ x: pos.x, y: pos.y + 1 });
                                checked_map[pos.x][pos.y + 1] = true;
                            }
                            if (up && !checked_map[pos.x][pos.y - 1]) {
                                bucket.push({ x: pos.x, y: pos.y - 1 });
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
        var n = Math.pow(Math.abs(this.noise.noise2D(col_x, pos.y)), 1.5) * 3.0;
        var n2 = Math.pow(Math.abs(this.noise2.noise2D(col_x, pos.y)), 1.5) * 3.0;

        if (!down) {
            if (is_negative) {
                n2 -= 0.1;
            } else {
                n -= 0.45;
            }
            n *= 0.8;
            if (outline) {
                group.arr.push({
                    "position": { x: pos.x, y: pos.y + 1 },
                    "color": [0, 0, 0, 1]
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
                    "position": { x: pos.x + 1, y: pos.y },
                    "color": [0, 0, 0, 1]
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
                    "position": { x: pos.x, y: pos.y - 1 },
                    "color": [0, 0, 0, 1]
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
                    "position": { x: pos.x - 1, y: pos.y },
                    "color": [0, 0, 0, 1]
                });
            }
        }

        var c_0 = colorscheme[Math.floor(Math.abs(this.noise.noise2D(col_x, pos.y)) * (n_colors - 1))];
        var c_1 = colorscheme[Math.floor(Math.abs(this.noise.noise2D(col_x, pos.y - 1)) * (n_colors - 1))];
        var c_2 = colorscheme[Math.floor(Math.abs(this.noise.noise2D(col_x, pos.y + 1)) * (n_colors - 1))];
        var c_3 = colorscheme[Math.floor(Math.abs(this.noise.noise2D(col_x - 1, pos.y)) * (n_colors - 1))];
        var c_4 = colorscheme[Math.floor(Math.abs(this.noise.noise2D(col_x + 1, pos.y)) * (n_colors - 1))];
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

    filterGroup(allGroups) {
        let largest = 0;
        let groups = allGroups.groups;
        for (let i = 0; i < groups.length; i++) {
            largest = Math.max(largest, groups[i].arr.length);
        }

        for (let i = groups.length - 1; i >= 0; i--) {
            groups[i].start_time = groups[i].arr.length + groups.length; // 开始事件和arr的大小相关，那么在对称的时候可以让他们开始时间相同
            if (groups[i].arr.length < this.size.x * this.size.y * 0.03) { //<largest * 0.25 in origin 
                groups.splice(i, 1);
            }
        }
        let negative_groups = allGroups.negative_groups;
        for (let i = 0; i < negative_groups.length; i++) {
            if (negative_groups[i].valid === false) continue;
            let touching = false;
            for (let j = 0; j < groups.length; j++) {
                if (this.groupIsTouchingGroup(groups[j].arr, negative_groups[i].arr)) {
                    touching = true;
                    if (negative_groups[i].hasOwnProperty('start_time')) {
                        groups[j].start_time = negative_groups[i].start_time;
                    } else {
                        negative_groups[i].start_time = groups[j].start_time;
                    }
                }
            }
            if (touching && (negative_groups[i].arr.length + negative_groups.length) % 5 >= 3) { // eye
                let eye_cutoff = Math.sqrt(this.size.x) * 0.3;
                let average = negative_groups[i].arr.reduce((s, a) => [s[0] + a.position.x, s[1] + a.position.y], [0, 0]);
                average = [average[0] / this.size.x, average[1] / this.size.y];
                for (let j = 0; j < negative_groups[i].arr.length; j++) {
                    let p = negative_groups[i].arr[j].position;
                    let c = negative_groups[i].arr[j].color;
                    if (this.distance([p.x, p.y], average) < eye_cutoff)
                        negative_groups[i].arr[j].color = [c[0] * 0.15, c[1] * 0.15, c[2] * 0.15];
                }
            }
        }
    }
    distance(p1, p2) {
        return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]));
    }
    groupIsTouchingGroup(g1, g2) {
        for (let i = 0; i < g1.length; i++)
            for (let j = 0; j < g2.length; j++) {
                // if (g1[i].position.x === g2[j].position.x) {
                //     if (g1[i].position.y === g2[j].position.y + 1 || g1[i].position.y === g2[j].position.y - 1)
                //         return true;
                // }
                // else if (g1[i].position.y === g2[j].position.y) {
                //     if (g1[i].position.x === g2[j].position.x + 1 || g1[i].position.y === g2[j].position.x - 1)
                //         return true;
                // }
                if (Math.abs(g1[i].position.x - g2[j].position.x) + Math.abs(g1[i].position.y - g2[j].position.y) <= 2) //<=1,原作者逻辑复杂了，这就是汉明距离
                    return true ;
            }
        return false;
    }

    generateName() {
        const materials = ["Bone", "Snow", "Boxwood", "Graphite", "Stone", "Wooden", "Water", "Ice", "Birch", "Air", "Crystal", "Magma", "Steel", "Metal", "Plastic", "Concrete", "Glass", "Paper", "Aluminium", "Titanium", "Leather", "Quartz", "Mineral"];
        const foods = ["Beet", "Broccoli", "Celery", "Fish", "Cabbage", "Corn", "Dandelion", "Vanilla", "Chocolate", "Lemon", "Coconut", "Strawberry", "Fiddlehead", "Grape", "Cheese", "Cake", "Zucchini", "Lettuce", "Spinach", "Salt", "Turnip", "Banana", "Cucumber", "Pumpkin", "Squash", "Tomato", "Pepper", "Artichoke", "Sunflower", "Asparagus", "Onion", "Shallot", "Meat", "Herb", "Tofu", "Bread", "Rice", "Carrot", "Mushroom", "Bun", "Milk", "Cereal", "Dumpling", "Sushi", "Spaghetti", "Meatball", "Apple Pie", "Dave"];
        const flavors = ["Sweet", "Sour", "Spicy", "Hot", "Salty", "Bitter", "Disgusting", "Cheesy"];
        const sizes = ["Big", "Small", "Tiny", "Huge", "Massive", "Short", "Grand"];
        const properties = ["Colorful", "Destructive", "Mysterious", "Healing", "Chaotic", "Floating", "Heavy", "Deep", "Hateful", "Unique", "Heavenly", "Radioactive", "Toxic", "Burning", "Freezing", "Beautiful", "Ugly", "Cold", "Great", "Terrible", "Light", "Dark"];
        const colors = ["Red", "Green", "Blue", "Yellow", "Orange", "Pink", "Purple", "Cyan", "Magenta", "Black", "White", "Gray"];
        const ages = ["Old", "Fresh", "Crusty", "New", "Ancient", "Broken", "Fossilized", "Crisp", "Aged", "Fermented"];
        const things = ["Feather", "Sandals", "Gem", "Orb", "Dust", "Book", "Amulet", "Heart", "Finger", "Pencil", "Weapon", "Vitamins", "Calculator", "Cloud", "Overlord", "Bottle", "Branch", "Bag", "Alien", "Fire", "Fork", "Sculpture", "Soul", "Toothbrush"];
        const other = ["Destruction", "Chaos", "Equality", "Electricity", "Speed", "Mutations", "Agression", "Worship", "Silence", "Illusion", "Purifying", "Growing", "Breaking", "Secrets"];
        const text_add = {materials, foods, flavors, sizes, properties, colors, ages}
        const can_add = [text_add.materials,text_add.foods,text_add.flavors,text_add.sizes,text_add.properties,text_add.ages]
        let name_string = "";
        let has_added = [];


        function rand_chance(chance) {
            return Math.random() < chance;
        }

        function rand_from_array(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        for (let i = 0; i <= 2; i++) {
            const add = rand_from_array(can_add);

            if (has_added.length === 0 && rand_chance(0.9)) {
                has_added.push(add);
            } else if (!has_added.includes(add) && rand_chance(0.4)) {
                has_added.push(add);
            }
        }

        if (has_added.includes(text_add.sizes)) {
            name_string += rand_from_array(sizes) + " ";
        }
        if (has_added.includes(text_add.ages)) {
            name_string += rand_from_array(ages) + " ";
        }
        if (has_added.includes(text_add.colors)) {
            name_string += rand_from_array(colors) + " ";
        }
        if (has_added.includes(text_add.properties)) {
            name_string += rand_from_array(properties) + " ";
        }
        if (has_added.includes(text_add.flavors)) {
            name_string += rand_from_array(flavors) + " ";
        }
        if (has_added.includes(text_add.materials)) {
            name_string += rand_from_array(materials) + " ";
        }

        if (rand_chance(0.2)) {
            name_string += rand_from_array(things) + " ";
            name_string += "of ";
            name_string += rand_from_array(other);
        } else {
            if (rand_chance(0.5)) {
                name_string += rand_from_array(foods);
            } else {
                name_string += rand_from_array(things);
            }
        }
        return name_string;
    }
    /**
     * 生成时序相关的彩色colerTileMap
     * @param {*} currentFrameTime 当前帧
     * @param {*} A 上下运动的幅度,0是静止图片
     * @returns [x,y]->[x,y+2*A]
     */
    generateColorTilemap(currentFrameTime,A = 0){
        let colorTileMap = []
        for (let x = 0; x < this.size.x ; x += 1) {
            let lines = []
            for (let y = 0; y < this.size.y + 2*A; y += 1) {
                lines.push('white');
            }
            colorTileMap.push(lines);
        }

        for (let i = 0; i < this.allGroup.groups.length; i++) {
            const arr = this.allGroup.groups[i].arr;
            let offset = Math.floor(Math.sin(currentFrameTime/250 + this.allGroup.groups[i].start_time*4.0)*A + A) ;
            for (let j = 0; j < arr.length; j++) {
                const p = arr[j].position;
                const c = arr[j].color;
                if (this.getAtPos(this.tileMap, [p.x, p.y]) !== null) {
                    colorTileMap[p.x][p.y+offset] = `rgb(${c[0] * 255},${c[1] * 255},${c[2] * 255})` ;
                }
            }
        }
        for (let i = 0; i < this.allGroup.negative_groups.length; i++) {
            if (this.allGroup.negative_groups[i].valid === false) continue;
            const arr = this.allGroup.negative_groups[i].arr;
            let offset = Math.floor(Math.sin(currentFrameTime/250 + this.allGroup.negative_groups[i].start_time*4.0)*A + A);
            for (let j = 0; j < arr.length; j++) {
                const p = arr[j].position;
                const c = arr[j].color;
                if (this.getAtPos(this.tileMap, [p.x, p.y]) !== null) {
                    colorTileMap[p.x][p.y+offset] = `rgb(${c[0] * 255},${c[1] * 255},${c[2] * 255})`;
                }
            }
        }
        return colorTileMap ;
    }
}
export class Item {
    constructor() {
        this.items = [];
        
        this.slotName = ["炮塔","枪械"];
        this.slotRandomName=[
            ["光棱塔","闪电塔","堡垒塔","深渊塔"],
            ["手枪","冲锋","火箭","来福","大喷","微冲","火箭筒"]
        ]
        this.slots = [];
    }
    generate(level = 0) {

        if (this.items.length > 5) {
            this.items.splice(0, 1);
        }

        let item = {}

        item.level = level;
        item.name = "";
        let pre = 1.0;
        if (this.randomBool(0.8)) {
            item.name = "威猛" + item.name;
            pre *= 2;
        }
        if (this.randomBool(0.5)) {
            item.slot = 0;
            item.name = item.name + this.slotRandomName[0][Math.floor(this.randomRange(0,this.slotRandomName[0].length))];
            item.dps = this.randomRange(1, 10) * (level + 1.05**level + 1) * pre;
            item.click = 0;
        } else {
            item.slot = 1;
            item.name = item.name +this.slotRandomName[1][Math.floor(this.randomRange(0,this.slotRandomName[1].length))];
            item.dps = 0;
            item.click = this.randomRange(5, 50) * (level +1.05**level + 1) * pre;
        }
        item.name += `LV${level}`;
        this.items.push(item);
        this.needUpdate = true ;
        return item.name;
    }
    getString() {
        let str = `SLOTS\n`;
        for (let i = 0; i < this.slots.length; i++) {
            str += `${this.slotName[i]}>` + this.getStringItem(this.slots[i]);
        }
        str += "BAG\n";
        // for (let i = 0; i < this.items.length; i++) {
        //     str += this.getStringItem(this.items[i]);
        // }
        return str;
    }
    getStringItem(item) {
        if(!item) return "";
        let str = `${item.name}`;
        switch (item.slot) {
            case 0: str = `${str}\tidleDPS +${item.dps.toFixed(0)}`;
                break;
            case 1: str = `${str}\tclickDMG +${item.click.toFixed(0)}`;
                break;
            default: break;
        }
        return str + '\n';
    }
    equip(i){
        this.slots[this.items[i].slot] = this.items[i] ;
        this.items.splice(i,1);
    }
    get dps() {
        return this.slots.reduce((s, a) => s + a.dps, 0);
    }
    get click() {
        return this.slots.reduce((s, a) => s + a.click, 0);
    }
    randomFnRange(min, max, callback) {
        return (max - min) * callback() + min
    }
    randomRange(min, max) {
        return (max - min) * Math.random() + min;
    }
    randomBool(chance) {
        return Math.random() > chance;
    }
    expRandomBool(chance) {
        return Math.exp(-Math.random()) > chance
    }
    normRandomBool(chance) {
        return this.normRandom(0.5, 1) > chance;
    }
    normRandom(mean = 0.5, std = 1) {
        return mean + Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()) * std;
    }
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}
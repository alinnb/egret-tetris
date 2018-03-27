
class Block {
    public _isFixed: boolean;
    get isFixed() {
        return this._isFixed;
    }
    set isFixed(value: boolean) {
        this._isFixed = value;
    }

    public _disppearAnimCout: number;
    get disappearAnimCount() {
        return this._disppearAnimCout;
    }
    set disappearAnimCount(value: number) {
        this._disppearAnimCout = value;
    }

    public _type: number;
    get type() {
        return this._type;
    }
    set type(value: number) {
        this._type = value;
    }

    public constructor() {
        this.init();
    }

    public init() {
        this.isFixed = false;
        this.disappearAnimCount = 0;
        this.type = 0;
    }
}

class Wall {
    private body: Block[][]; //墙体上10x20的小方块
    // private UIPos: Vector2; //用于画在Canvas上的坐标
    private tetromino: Tetromino; //当前形状
    private nextTetrominoType: number; //下一形状
    private speed: number; //当前速度
    private drapTimer: number; //计时器，用于下落计时
    private animTimer: number; //计时器，用于动画计时
    private GameLost: () => {}; //游戏失败的callback

    public constructor() {
        this.init();
    }

    public init() {
        for (let i = 0; i < 20; i++) {
            this.body[i] = [];
            for (let j = 0; j < 10; j++) {
                this.body[i][j] = new Block();
            }
        }

        //初始化下一个形状
        this.nextTetromino();

        //初始化当前速度
        this.speed = ConstDefine.levelSpeed[Static.game_level]

    }

    //初始化
    public reset() {
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                this.body[i][j].init()
            }
        }

        this.tetromino.blockType = BlockType.BlockType_S;
        this.tetromino.positon = new Vector2(this.body[0].length / 2, 0);

        this.setSpeed(Static.game_level);
    }

    //随机生成下一个形状
    public randomNextTetromino() {
        this.nextTetrominoType = Math.floor(Math.random() * BlockType.BlockType_MAX)
        console.log('Error genrate wrong type', this.nextTetrominoType)
    }

    //充值计时器，开始下一次下落的计时
    public resetTetrominoTimer() {
        if (this.drapTimer) {
            clearInterval(this.drapTimer)
        }
        this.drapTimer = setInterval(() => {
            this.autoMove();
        }, this.speed);
    }

    //设置速度
    public setSpeed(game_level: number) {
        this.speed = game_level < ConstDefine.levelSpeed.length ? ConstDefine.levelSpeed[game_level] : ConstDefine.levelSpeed[ConstDefine.levelSpeed.length - 1];
        if (Static.game_state != ConstDefine.gameStateStop) {
            this.resetTetrominoTimer();
        }
    }

    //暂定计时
    public stopTetrominoTimer() {
        let b = clearInterval(this.drapTimer);
    }

    //检查当前的固定的形状所占的行是否可以被消除
    public getClearLines() {
        let allLines = [];
        let fullLines = [];
        let shape = this.tetromino.getShape();
        for (let i in shape) {
            allLines.push(this.tetromino.positon.y + shape[i][1]);
        }
        allLines = allLines.filter(function (element, index, self) {
            console.log(self.indexOf(element), index);
            return self.indexOf(element) === index;
        })
        for (let i in allLines) {
            let canClear = true;
            for (let j = 0; j < this.body[0].length; j++) {
                if (!this.body[allLines[i]][j].isFixed) {
                    canClear = false;
                    break;
                }
            }
            if (canClear) {
                fullLines.push(allLines[i]);
            }
        }
        return fullLines;
    }

    public playLineAnim(line) {
        for (let i in this.body[line]) {
            this.body[line][i].disappearAnimCount++;
        }
    }

    public stopLineAnim(line) {
        for (let i in this.body[line]) {
            this.body[line][i].disappearAnimCount = 0;
        }
    }

    //开始进行消除动画，异步处理
    public startLineClear(lines) {
        let that = this;
        let clearAnim = new Promise(function (resolve, reject) {

            //每100ms 变换一次动画
            that.animTimer = setInterval(() => {
                for (let i in lines) {
                    that.playLineAnim(lines[i]);
                }
            }, ConstDefine.FlashInterval);

            //1 sec 后结束
            setTimeout(() => {
                for (let i in lines) {
                    that.stopLineAnim(lines[i]);
                }
                clearInterval(that.animTimer);
                resolve();
            }, ConstDefine.DisappearTime);
        })

        return clearAnim;
    }

    //移动fromline数据到toline
    //如果fromline无效，则清空toline
    //如果toline无效，则清空fromline
    public moveLineData(fromLine, toLine) {
        for (let i in this.body[fromLine]) {
            if (toLine >= 0 && toLine < this.body.length) {
                this.body[toLine][i].init();

                if (fromLine >= 0 && fromLine < this.body.length) {
                    this.body[toLine][i].isFixed = this.body[fromLine][i].isFixed;
                    this.body[toLine][i].type = this.body[fromLine][i].type;
                    this.body[toLine][i].disappearAnimCount = this.body[fromLine][i].disappearAnimCount;
                }
            }
            else if (fromLine >= 0 && fromLine < this.body.length) {
                this.body[fromLine][i].init();
                console.log("Error toline in w.moveLineData()");
            }
        }
    }

    public lineClear(lines) {
        //排序，数字大的在第一位
        lines = lines.sort((x, y) => {
            if (x > y) {
                return -1;
            }
            else if (x < y) {
                return 1;
            }
            return 0;
        })
        let fromLine = lines[0];
        for (let i = fromLine; i >= 0; i--) {
            this.moveLineData(i - lines.length, i);
        }
    }

    public checkDisappearAndContinue() {
        let that = this;
        //if can 
        let lines = this.getClearLines();
        if (lines.length > 0) {
            Static.game_score += ConstDefine.score[lines.length - 1];
            Static.game_topScore = Static.game_topScore < Static.game_score ? Static.game_score : Static.game_topScore;
            Static.game_lines += lines.length;

            //todo
            // topScoreText.innerHTML = Static.game_topScore;
            // scoreText.innerHTML = Static.game_score;
            // linesText.innerHTML = Static.game_lines;

            for (let i:number = 0; i < ConstDefine.levelupScore.length; i++) {
                if (Static.game_score >= ConstDefine.levelupScore[i]) {
                    let newlevel:number = ConstDefine.levelupScore.length - 1 - i;
                    if (newlevel > Static.game_level) {
                        Static.game_level = newlevel;
                        console.log("Level up!");
                    }
                }
            }

            //stop timer
            this.stopTetrominoTimer();
            //clear lines
            this.startLineClear(lines).then(() => {
                //resume drop timer
                that.stopLineAnim(lines);
                that.resetTetrominoTimer();
                that.lineClear(lines);
            })
        }
    }

    //尝试移动到某个方向，需要在里面判断是否可移动
    public moveTo(direction) {
        let newPos = new Vector2(0, 0);
        switch (direction) {
            case ConstDefine.dir_left:
                newPos.x = -1;
                break
            case ConstDefine.dir_right:
                newPos.x = 1;
                break
            case ConstDefine.dir_down:
                newPos.y = 1;
                break
        }

        if (this.canMoveTo(newPos)) {
            this.tetromino.moveTo(newPos);
        }
    }

    //尝试旋转，判断是否可旋转
    public rotateNext() {
        console.log('w.rotateNext');
        if (this.canRotate()) {
            this.tetromino.rotate();
        }
    }

    //碰撞检测，用于判断是否可移动和旋转
    public checkCollision(pos, shape): boolean {
        for (let i = 0; i < shape.length; i++) {
            let x = pos.x + shape[i][0];
            let y = pos.y + shape[i][1];
            if (x < 0 || x >= this.body[0].length || y >= this.body.length || (y > 0 && this.body[y][x].isFixed)) //不考虑y<0情况，因为是从顶部掉下来，顶部可能超过墙体上限
            {
                return false;
            }
        }
        return true;
    }

    //判断是否可旋转
    public canRotate(): boolean {
        return this.checkCollision(this.tetromino.positon, this.tetromino.getNextShape());
    }

    //判断是否可移动
    public canMoveTo(pos): boolean {
        let newPos = new Vector2(0, 0);
        newPos.x = pos.x + this.tetromino.positon.x;
        newPos.y = pos.y + this.tetromino.positon.y;
        return this.checkCollision(newPos, this.tetromino.getShape());
    }

    //落到底部后固定形状到墙体中
    public fixTetromino() {
        let shape = this.tetromino.getShape();
        for (let i = 0; i < shape.length; i++) {
            let x = this.tetromino.positon.x + shape[i][0];
            let y = this.tetromino.positon.y + shape[i][1];
            this.body[y][x].isFixed = true;
            this.body[y][x].type = this.tetromino.blockType;
        }
    }

    //检测是否失败
    public checkLost(): boolean {
        let shape = this.tetromino.getShape();
        for (let i = 0; i < shape.length; i++) {
            if (this.tetromino.positon.y + shape[i][1] < 0)
                return true;
        }
        return false;
    }

    //随机生成下一个形状
    public nextTetromino() {
        this.tetromino.init();
        this.tetromino.blockType = this.nextTetrominoType
        this.tetromino.positon = new Vector2(this.body[0].length / 2, 0);
        this.randomNextTetromino();
    }

    //自动下落一层
    public autoMove() {
        let downPos = new Vector2(0, 0);
        downPos.y = 1;
        if (this.canMoveTo(downPos)) {
            this.tetromino.moveTo(downPos);
        }
        else if (this.checkLost()) {
            // this.lost()
        }
        else {
            this.fixTetromino();
            this.checkDisappearAndContinue();
            this.nextTetromino();
        }
    }
    
	// //墙体绘制，包括当前下落的形状
	// w.draw = function () {
	// 	Draw.fillRect(this.canvas, this.UIPos.x, this.UIPos.y,
	// 		this.body[0].length * ConstDefine.block_width,
	// 		this.body.length * ConstDefine.block_height, ConstColor.WallColor)

	// 	for (let i = 0; i < this.body[0].length; i++) {
	// 		for (let j = 0; j < this.body.length; j++) {
	// 			if (this.body[j][i].isFixed) {
	// 				let x = i * ConstDefine.block_width + this.UIPos.x
	// 				let y = j * ConstDefine.block_height + this.UIPos.y

	// 				if (this.body[j][i].disappearAnimCount % 2 == 0) {
	// 					Draw.fillRect(this.canvas, x + 1, y + 1, ConstDefine.block_width - 2, ConstDefine.block_height - 2, ConstColor.BlockColor)
	// 					Draw.drawRect(this.canvas, x + 1, y + 1, ConstDefine.block_width - 2, ConstDefine.block_height - 2, ConstColor.BlockBorderColor)
	// 				}
	// 			}
	// 		}
	// 	}

	// 	if(Static.game_state == ConstDefine.gameStateRunning) {
	// 		this.tetromino.draw(this.UIPos)
	// 	}
		
	// 	Draw.drawRect(this.canvas, this.UIPos.x, this.UIPos.y,
	// 		this.body[0].length * ConstDefine.block_width,
	// 		this.body.length * ConstDefine.block_height, ConstColor.WallBorderColor)
	// }
}
class Game extends eui.UILayer {

	private loadingView: LoadingUI;
	private wall: Wall;
	private nextTetromino: Tetromino;
	private actions: () => {}[];
	private keydown: boolean[];
	private scoreLabel:eui.Label;
	private linesLabel:eui.Label;
	private pauseBtn:eui.Button;
	private pauseLabel:eui.Label;

	protected createChildren(): void {
		super.createChildren();

		egret.lifecycle.addLifecycleListener((context) => {

		});

		egret.lifecycle.onPause = () => {
			egret.ticker.pause();
		};

		egret.lifecycle.onResume = () => {
			egret.ticker.resume();
		};

		this.loadingView = new LoadingUI();
		this.stage.addChild(this.loadingView);

		this.wall = new Wall();
		this.nextTetromino = new Tetromino();

		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		RES.loadConfig("resource/default.res.json", "resource/");
	}

	private onConfigComplete(event: RES.ResourceEvent): void {
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

		let theme = new eui.Theme("resource/default.thm.json", this.stage);
		theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeComplete, this);
	}

	private onThemeComplete(event: eui.UIEvent): void {
		this.stage.removeChild(this.loadingView);

		this.createScene();
	}

	private createScene(): void {

		let bg:eui.Rect = new eui.Rect(this.width, this.height);
		bg.fillColor = 0xFFFFFF;
		bg.strokeWeight = 1;
		bg.strokeColor = 0x000000;
		this.addChild(bg);

		//Top
		let topGroup: eui.Group = new eui.Group();
		topGroup.width = this.width;
		topGroup.x = 0;
		topGroup.y = 0;
		topGroup.height = 150;
		topGroup.layout = new eui.BasicLayout();
		this.addChild(topGroup);

		let topGroupBg: eui.Rect = new eui.Rect(topGroup.width, topGroup.height);
		topGroupBg.fillColor = 0x999999;
		topGroupBg.strokeWeight = 1;
		topGroupBg.strokeColor = 0x000000;
		topGroup.addChild(topGroupBg);

		this.scoreLabel = new eui.Label("Score:");
		this.scoreLabel.x = 10;
		this.scoreLabel.y = 10;
		this.scoreLabel.textColor = 0x000000;
		topGroup.addChild(this.scoreLabel);

		this.linesLabel = new eui.Label("Lines:");
		this.linesLabel.x = 10;
		this.linesLabel.y = 50;
		this.linesLabel.textColor = 0x000000;
		topGroup.addChild(this.linesLabel);

		let startBtn = new eui.Button();
		startBtn.label = "新游戏";
		startBtn.x = 10;
		startBtn.y = 100;
		startBtn.width = 80;
		startBtn.height = 40;
		this.addChild(startBtn);
		startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.newGame, this);

		this.pauseBtn = new eui.Button();
		this.pauseBtn.label = "暂停";
		this.pauseBtn.x = 100;
		this.pauseBtn.y = 100;
		this.pauseBtn.width = 80;
		this.pauseBtn.height = 40;
		this.addChild(this.pauseBtn);
		this.pauseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pauseGame, this);

		let nextTetrominoShapeBg: eui.Rect = new eui.Rect(topGroup.width / 2, topGroup.height);
		nextTetrominoShapeBg.x = topGroup.width / 2;
		nextTetrominoShapeBg.y = 0;
		nextTetrominoShapeBg.fillColor = 0x999999;
		nextTetrominoShapeBg.strokeWeight = 1;
		nextTetrominoShapeBg.strokeColor = 0x000000;
		topGroup.addChild(nextTetrominoShapeBg);

		let nextTetrominoShape: egret.Shape = new egret.Shape();
		nextTetrominoShape.x = nextTetrominoShapeBg.width / 2;
		nextTetrominoShape.y = nextTetrominoShapeBg.height / 2;
		nextTetrominoShapeBg.addChild(nextTetrominoShape);
		this.nextTetromino.canvas = nextTetrominoShape;
		this.nextTetromino.randomNextTetromino();

		let col: eui.Group = new eui.Group();
		col.width = this.width;
		col.height = this.height - topGroup.height;
		col.x = 0;
		col.y = topGroup.height;
		this.addChild(col);

		let wallGroup: eui.Group = new eui.Group();
		wallGroup.width = 300;
		wallGroup.height = 600;
		wallGroup.x = (col.width - 300) / 2;
		wallGroup.y = (col.height - 600) / 2;
		wallGroup.scrollEnabled = true;

		let wallBg: eui.Rect = new eui.Rect(wallGroup.width + 4, wallGroup.height + 4);
		wallBg.fillColor = 0x999999;
		wallBg.strokeColor = 0x000000;
		wallBg.strokeWeight = 2;
		wallBg.x = wallGroup.x - 2;
		wallBg.y = wallGroup.y - 2;

		col.addChild(wallBg);
		col.addChild(wallGroup);

		let wallCanvas:egret.Shape = new egret.Shape();
		wallGroup.addChild(wallCanvas);
		this.wall.canvas = wallCanvas;

		let tetrominoCanvas:egret.Shape = new egret.Shape();
		wallGroup.addChild(tetrominoCanvas);
		this.wall.tetromino.canvas = tetrominoCanvas;
		tetrominoCanvas.visible = false;

		this.pauseLabel = new eui.Label("暂停中");
		this.pauseLabel.horizontalCenter = 0;
		this.pauseLabel.verticalCenter = 0;
		this.pauseLabel.visible = false;
		wallGroup.addChild(this.pauseLabel);

		let leftButton:eui.Button = new eui.Button();
		leftButton.label = "<<";
		leftButton.x = 20;
		leftButton.y = 322;
		leftButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.moveLeft, this);
		col.addChild(leftButton);

		let rightButton:eui.Button = new eui.Button();
		rightButton.label = ">>";
		rightButton.x = 406;
		rightButton.y = 322;
		rightButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.moveRight, this);
		col.addChild(rightButton);

		let downBtn:eui.Button = new eui.Button();
		downBtn.label = "V";
		downBtn.x = 20;
		downBtn.y = 406;
		downBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.moveDown, this);
		col.addChild(downBtn);

		let rotateBtn:eui.Button = new eui.Button();
		rotateBtn.label = "O";
		rotateBtn.x = 406;
		rotateBtn.y = 406;
		rotateBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rotate, this);
		col.addChild(rotateBtn);
	}

	private newGame(event: egret.TouchEvent): void {
		//clear score
		Static.game_score = 0;
		Static.game_level = 0;
		Static.game_lines = 0;
		Static.game_pause = false;
		Static.game_state = ConstDefine.gameStateRunning;
		//clear wall
		this.wall.nextTetrominoCB = ():number => {
			return this.randomNextTetromino();
		};
		this.wall.lineClearedCB = (lines:number) => {
			this.lineCleared(lines);
		}
		this.wall.reset();

		this.scoreLabel.text = `Score:${Static.game_score}`;
		this.linesLabel.text = `Score:${Static.game_lines}`;
		
		this.pauseLabel.visible = Static.game_pause;
		this.pauseBtn.label = "暂停";
	}

	//返回当前类型，同时初始化下一个类型
	private randomNextTetromino(): number {
		let curType = this.nextTetromino.blockType;
		this.nextTetromino.randomNextTetromino();
		return curType;
	}

	private lineCleared(lines:number) {
		Static.game_score += ConstDefine.score[lines - 1];
		Static.game_topScore = Static.game_topScore < Static.game_score ? Static.game_score : Static.game_topScore;
		Static.game_lines += lines;

		//todo
		this.scoreLabel.text = `Score:${Static.game_score}`;
		this.linesLabel.text = `Score:${Static.game_lines}`;

		for (let i: number = 0; i < ConstDefine.levelupScore.length; i++) {
			if (Static.game_score >= ConstDefine.levelupScore[i]) {
				let newlevel: number = ConstDefine.levelupScore.length - 1 - i;
				if (newlevel > Static.game_level) {
					Static.game_level = newlevel;
					console.log("Level up!");
				}
			}
		}
	}

	private moveLeft() {
		this.wall.moveTo(ConstDefine.dir_left);
	}

	private moveRight() {
		this.wall.moveTo(ConstDefine.dir_right);
	}

	private moveDown() {
		this.wall.moveTo(ConstDefine.dir_down);
	}

	private rotate() {
		this.wall.rotateNext();
	}

	private pauseGame() {
		Static.game_pause = !Static.game_pause;
		this.pauseLabel.visible = Static.game_pause;
		if (Static.game_pause) {
			this.wall.stopTetrominoTimer();
			this.pauseBtn.label = "继续";
		}
		else {
			this.wall.resetTetrominoTimer();
			this.pauseBtn.label = "暂停";
		}
	}
}
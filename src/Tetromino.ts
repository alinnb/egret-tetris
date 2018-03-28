class Tetromino {
	private readonly TetrominoColor: number[] = [
		0x60ceff, //BlockType_S
		0x00fc00, //BlockType_Z
		0xff6500, //BlockType_L
		0xcc30ff, //BlockType_J
		0xfdea10, //BlockType_I
		0xe3aca7, //BlockType_O
		0xd85eff, //BlockType_T
	];
	private readonly BlockBorderColor: number = 0x000000;

	private readonly blockData: number[][][][] = [
		[//S
			[[0, -1], [1, -1], [-1, 0], [0, 0]], [[0, -1], [0, 0], [1, 0], [1, 1]],
		],
		[//Z
			[[-1, -1], [0, -1], [0, 0], [1, 0]], [[1, -1], [0, 0], [1, 0], [0, 1]],
		],
		[//L
			[[0, -1], [0, 0], [0, 1], [1, 1]],
			[[-1, 0], [0, 0], [1, 0], [-1, 1]],
			[[-1, -1], [0, -1], [0, 0], [0, 1]],
			[[1, -1], [-1, 0], [0, 0], [1, 0]],
		],
		[//J
			[[0, -1], [0, 0], [0, 1], [-1, 1]],
			[[-1, -1], [-1, 0], [0, 0], [1, 0]],
			[[0, -1], [1, -1], [0, 0], [0, 1]],
			[[-1, 0], [0, 0], [1, 0], [1, 1]],
		],
		[//I
			[[-1, 0], [0, 0], [1, 0], [2, 0]],
			[[0, -1], [0, 0], [0, 1], [0, 2]],
		],
		[//O
			[[-1, -1], [0, -1], [-1, 0], [0, 0]],
		],
		[//T
			[[-1, 0], [0, 0], [1, 0], [0, 1]],
			[[0, -1], [-1, 0], [0, 0], [0, 1]],
			[[0, -1], [-1, 0], [0, 0], [1, 0]],
			[[0, -1], [0, 0], [1, 0], [0, 1]],
		],
	];

	private _blockType: number;
	set blockType(type: number) {
		this._blockType = type;
	}
	get blockType() {
		return this._blockType;
	}

	private _positon: Vector2;
	set positon(pos: Vector2) {
		this._positon = pos;
		if (this.canvas) {
			this.canvas.x = this.positon.x * ConstDefine.block_width;
			this.canvas.y = this.positon.y * ConstDefine.block_height;
		}
	}
	get positon() {
		return this._positon;
	}

	private _isHidden: boolean;
	set isHidden(b: boolean) {
		this._isHidden = b;
		if (this.canvas) {
			this.canvas.visible = !this.isHidden;
		}
	}
	get isHidden() {
		return this._isHidden;
	}

	private _index: number;
	set index(i: number) {
		if (i < 0) {
			i = 0;
		}
		else if (i >= this.blockData[this.blockType].length) {
			i = this.blockData[this.blockType].length - 1;
		}
		if (this._index != i) {
			this._index = i;
		}
	}
	get index() {
		return this._index;
	}

	//canvas for draw
	private _canvas: egret.Shape;
	set canvas(c: egret.Shape) {
		this._canvas = c;
	}
	get canvas() {
		return this._canvas;
	}

	// 初始化
	public constructor() {
	}

	//随机生成下一个形状
	public randomNextTetromino(): number {
		let type = Math.floor(Math.random() * BlockType.BlockType_MAX);
		type = BlockType.BlockType_I;//debug
		this.setNewType(type);
		return this.blockType;
	}

	public setNewType(type: number) {
		let isUpdateShape: boolean = false;

		if (this.blockType != type) {
			this.blockType = type;
			isUpdateShape = true;
		}
		if (this.index != 0) {
			this.index = 0;
			isUpdateShape = true;
		}

		if (isUpdateShape) {
			this.updateShape();
		}
	}

	// 旋转
	public rotate() {
		this.index = this.index + 1;
		if (this.canvas) {
			this.updateShape();
		}
	}

	// 移动到某个位置
	public moveTo(pos: Vector2) {
		let newPos = new Vector2(this.positon.x + pos.x, this.positon.y + pos.y);
		this.positon = newPos;
	}

	//获取形状当前状态的数据
	public getShape(): number[][] {
		return this.blockData[this.blockType][this.index];
	}

	//获取形状下一个状态的数据
	public getNextShape(): number[][] {
		let nextIndex = this.index + 1;
		if (nextIndex >= this.blockData[this.blockType].length) {
			nextIndex = 0;
		}
		return this.blockData[this.blockType][nextIndex];
	}

	private updateShape() {
		this.canvas.graphics.clear();
		let data: number[][] = this.getShape();
		for (let i = 0; i < data.length; i++) {
			let x = (data[i][0]) * ConstDefine.block_width;
			let y = (data[i][1]) * ConstDefine.block_height;
			//fill rect
			this.canvas.graphics.beginFill(this.TetrominoColor[this.blockType]);
			this.canvas.graphics.lineStyle(1, this.BlockBorderColor);
			this.canvas.graphics.drawRect(x, y, ConstDefine.block_width, ConstDefine.block_height);
			this.canvas.graphics.endFill();
		}
	}
}
class Tetromino {
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
			[[0, -1], [0, 0], [0, 1], [0, 2]],
			[[-1, 0], [0, 0], [1, 0], [2, 0]],
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

	private _positon: Vector2;

	set positon(pos:Vector2) {
		this._positon = pos;
	}

	get positon() {
		return this._positon;
	}

	private index: number;

	set blockType(type:number) {
		this._blockType = type;
	}

	get blockType() {
		return this._blockType;
	}

	// 初始化
	public constructor(type: number) {
		this.blockType = type;
		this.index = 0;
	}

	public init() {
		this.blockType = 0;
		this.index = 0;
	}

	// 旋转
	public rotate() {
		this.index = (this.index + 1 >= this.blockData[this.blockType].length) ? 0 : this.index + 1
	}

	// 移动到某个位置
	public moveTo(pos: Vector2) {
		this.positon = pos;
	}

	//获取形状当前状态的数据
	public getShape():number[][] {
		return this.blockData[this.blockType][this.index];
	}

	//获取形状下一个状态的数据
	public getNextShape():number[][] {
		var nextIndex = this.index + 1;
		if (nextIndex >= this.blockData[this.blockType].length) {
			nextIndex = 0;
		}
		return this.blockData[this.blockType][nextIndex];
	}
}
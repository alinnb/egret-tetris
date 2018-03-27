
class Vector2 {
    public x:number;
    public y:number;

    public constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
}

class ConstDefine {
	//四个方向键
	public static dir_left:string = 'dir_left';
	public static dir_right:string = 'dir_right';
	public static dir_up:string = 'dir_up';
	public static dir_down:string = 'dir_down';

	//方块尺寸 单位：px
	public static block_width: 30;
	public static block_height: 30;

	//游戏等级，跟速度挂钩,7个等级
	public static levelSpeed:number[] = [1000, 800, 500, 300, 200, 100, 50]; //不同等级对应的速度，单位(ms)
	public static levelupScore:number[] = [5000, 2000, 1000, 500, 250, 120, 60];

	//同时消除层数对应的分数
	public static score:number[] = [10, 20, 40, 100];

	//游戏状态
	public static gameStateStop:number = 0;
	public static gameStateRunning:number = 1;
	public static gameStateGameOver:number = 2;

	//消除动画闪烁间隔
	public static FlashInterval:number = 80;
	public static DisappearTime:number = 300;
}

class Static {
    public static game_level:number = 0; //游戏等级，与难度挂钩 最高4
	public static game_pause:boolean = false;//游戏是否暂停
	public static game_score:number = 0; //分数
	public static game_topScore:number = 0; //历史最高分数
	public static game_lines:number = 0; //消除的行数
	public static game_state:number = ConstDefine.gameStateStop; 
}

// 方块类型
class BlockType {
	public static readonly BlockType_S:number = 0;
	public static readonly BlockType_Z:number = 1;
	public static readonly BlockType_L:number = 2;
	public static readonly BlockType_J:number = 3;
	public static readonly BlockType_I:number = 4;
	public static readonly BlockType_O:number = 5;
	public static readonly BlockType_T:number = 6;
	public static readonly BlockType_MAX:number = 7;
}
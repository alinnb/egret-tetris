class Game extends eui.UILayer {

	private loadingView: LoadingUI;
	private wall:Wall;
	private nextTetrominoType:number;
	private actions:()=>{}[];
	private keydown:boolean[];

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
		this.nextTetrominoType = 0;

		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		RES.loadConfig("resource/default.res.json", "resource/");
	}

	private onConfigComplete(event: RES.ResourceEvent): void {
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

		let theme = new eui.Theme("resource/default.thm.json", this.stage);
		theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeComplete, this);
	}

	private onThemeComplete(event: eui.UIEvent): void {
		this.createScene();
	}

	private myGroup: eui.Group;
	private createScene(): void {
		// let button = new eui.Button();
		// button.label = "StartGame";
		// button.horizontalCenter = 0;
		// button.verticalCenter = 0;
		// this.addChild(button);
		// button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonTouchTap, this);

		this.myGroup = new eui.Group();
		this.addChild(this.myGroup);

		// this.myGroup.layout = new eui.BasicLayout();
		this.myGroup.width = this.stage.width;
		this.myGroup.height = 300;

		var outline: egret.Shape = new egret.Shape;
		outline.graphics.lineStyle(3, 0x00ff00);
		outline.graphics.beginFill(0x000000, 0);
		outline.graphics.drawRect(0, 0, this.myGroup.width, this.myGroup.height);
		outline.graphics.endFill();
		this.myGroup.addChild(outline);

		var btn1: eui.Button = new eui.Button();
		btn1.label = "egret 按钮 A";
		var btn2: eui.Button = new eui.Button();
		btn2.label = "egret 按钮 B";
		var btn3: eui.Button = new eui.Button();
		btn3.label = "egret 按钮 C";
		this.myGroup.addChild(btn1);
		this.myGroup.addChild(btn2);
		this.myGroup.addChild(btn3);

		var hLayout: eui.HorizontalLayout = new eui.HorizontalLayout();
		hLayout.gap = 10;
		hLayout.paddingTop = 30;
		hLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
		this.myGroup.layout = hLayout;   /// 水平布局

	}

	private onButtonTouchTap(event: egret.TouchEvent): void {

	}
}
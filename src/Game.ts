class Game extends eui.UILayer {

	private loadingView: LoadingUI;

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

	private createScene(): void {
		let button = new eui.Button();
		button.label = "StartGame";
		button.horizontalCenter = 0;
		button.verticalCenter = 0;
		this.addChild(button);
		button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonTouchTap, this);
	}

	private onButtonTouchTap(event: egret.TouchEvent): void {

	}
}

var CkeckOut = require('CheckOut')

cc.Class({
	extends: cc.Component,

	properties: {
		NhacNen:  CkeckOut,
		NhacGame: CkeckOut,
		webview: cc.Node,
	},
	onLoad(){
		if (!cc.RedT.isSoundBackground()) {
			this.NhacNen.OnChangerClick();
		}
		if (!cc.RedT.isSoundGame()) {
			this.NhacGame.OnChangerClick();
		}
	},
	onEnable: function () {
        this.node.runAction(cc.RedT.inGame.dialog.actionShow);
    },
    onDisable: function () {
        cc.RedT.inGame.dialog.resetSizeDialog(this.node);
    },
	setMusic: function(){
		var check = localStorage.getItem('SOUND_GAME');
		if(check == null){
			cc.RedT.setSoundGame(true);
		}else{
			if (cc.RedT.isSoundGame()) {
				cc.RedT.IS_SOUND = true;
			}else{
				cc.RedT.IS_SOUND = false;
			}
		}
	},
	OnChangerNhacNen: function() {
		cc.RedT.setSoundBackground(this.NhacNen.isChecked);
		if (this.NhacNen.isChecked) {
			cc.RedT.audio.bg.play();
		}else{
			cc.RedT.audio.bg.stop();
		}
	},
	OnChangerNhacGame: function() {
		cc.RedT.setSoundGame(this.NhacGame.isChecked);
		if (this.NhacGame.isChecked) {
			cc.RedT.IS_SOUND = true;
		}else{
			cc.RedT.IS_SOUND = false;
		}
	},
	OnSignOutClick: function() {
		if(this.webview.opacity==255){
			this.webview.opacity = 0;
			this.webview.removeComponent(cc.WebView);
		} else {
			cc.RedT.inGame.notice.show({title: "ĐĂNG XUẤT", text: "Xác nhận hành động.\nHành động thực hiện đăng xuất khỏi tài khoản này?", button:{type: "sign_out", text: "ĐĂNG XUẤT"}})
		}
	},
});

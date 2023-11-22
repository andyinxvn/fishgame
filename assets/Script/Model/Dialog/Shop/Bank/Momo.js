
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		nickname:  cc.EditBox,
		red:       cc.EditBox,
		messenger: cc.EditBox,
	 
		loadList:       false,
	},
	init(obj){
		this.RedT = obj;
		var self = this;

		this.editboxs = [this.nickname, this.red, this.messenger];
		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.tab ? (self.isTop() && self.changeNextFocusEditBox(),
				t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onChuyenClick(),
				t.preventDefault && t.preventDefault(),
				!1) : void 0
		}
	},
	getList: function(){
		 console.log(11111);
		cc.RedT.send({'shop':{'bank':{'atm':{'list':true}}}});
	},
	onEnable: function () {
		this.loadList === false && this.getList();
		cc.sys.isBrowser && this.addEvent();
		 
	},
	onDisable: function () {
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
	},
	addEvent: function() {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		for (var t in this.editboxs) {
			BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
		}
	},
	removeEvent: function() {
		for (var t in this.editboxs) {
			BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
		}
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
	},
	onKeyDown: function (event) {
		switch(event.keyCode) {
			case cc.macro.KEY.tab:
				this.isTop() && this.changeNextFocusEditBox();
				break;
			case cc.macro.KEY.enter:
				this.isTop() && this.onChuyenClick();
		}
	},
	changeNextFocusEditBox: function() {
		for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++){
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                BrowserUtil.focusEditBox(this.editboxs[e]);
                t = !0;
                break
            }
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
	},
	isTop: function() {
		return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
	},
	clean: function(){
		this.nickname.string = this.red.string = this.messenger.string = "";
	},
	onChuyenClick: function(){
		var error = null;
		if(helper.isEmpty(this.nickname.string) ||
			helper.isEmpty(this.red.string))
		{
			error = "Kiểm tra lại các thông tin..."
		} else if(helper.isEmpty(this.nickname.string)){
			error = "Tên nhân vật không được bỏ trống"
		} else if(helper.getOnlyNumberInString(this.red.string) < 10000){
			error = "Số tiền chuyển tối thiểu là 10.000 Gold."
		}
		if (error)
			cc.RedT.inGame.notice.show({title: "CHUYỂN Gold", text: error});
		else{
			 
			let data = {
				'hinhthuc': "2",
				'bank':    '12345678',
				'money':    helper.getOnlyNumberInString(this.red.string),
				'name':    this.nickname.string+"|"+this.messenger.string,
			};
			data.stk = 123456789;
			data = {'shop':{'bank':{'nap':data}}};
			console.log(data)
			cc.RedT.send(data);
		}
	},
	reCheckMeDL: function(){
		this.meDaily = false;
		if (this.RedT.DaiLy.daily_list.length) {
			let regex = new RegExp("^" + cc.RedT.user.name + "$", 'i');
			this.RedT.DaiLy.daily_list.forEach(function(daily){
				!this.meDaily && (this.meDaily = regex.test(daily.NICKNAME.string));
			}.bind(this));
		}
	},
	selectDaiLy: function(daily){
		this.isdaily  = true;
		this.nickname.string = daily.NICKNAME.string;
		this.onChangerRed(0, true);
		this.RedT.onSelectHead(null, 'ChuyenRed');
		this.dailyStatus();
	},
	onChangerNick: function(value){
		this.isdaily = false;
		if (this.RedT.DaiLy.daily_list.length > 0) {
			this.RedT.DaiLy.daily_list.forEach(function(obj){
				let regex = new RegExp("^" + value + "$", 'i');
				if (regex.test(obj.NICKNAME.string)) {
					this.isdaily  = true;
				}
			}.bind(this));
		}
		this.onChangerRed(0, true);
		this.dailyStatus();
	},
	onChangerRed: function(value = 0, superT = false){
		value = !!superT ? this.red.string : value;
		value = helper.numberWithCommas(helper.getOnlyNumberInString(value));
		this.red.string = value == 0 ? "" : value;
		if(this.isdaily || this.meDaily){
			this.rednhan.string = value;
			this.redPhi.string = 0;
		}else{
			var valueT = helper.getOnlyNumberInString(value);
			var nhan = Math.floor(valueT);
			var phi  = Math.ceil(valueT*0/100);
			this.redPhi.string = helper.numberWithCommas(phi);
			this.rednhan.string = helper.numberWithCommas(nhan+phi);
		}
	},
	dailyStatus: function(){
		if (this.isdaily) {
			this.shop.active = true;
		}else{
			this.shop.active = false;
		}
	},
	onClickOTP: function(){
		cc.RedT.send({otp:true});
	},
	onListATM:function(data){
		this.loadList = true;
		console.log(data);
		// this['i_arg'] = data.map(function(obj, index){
		// 	let item = cc.instantiate(this.prefab);
		// 	let comp = item.getComponent('NapRed_itemOne');
		// 	comp.init(this, 'i_arg', 'labelATMBank', 'onListClick')
		// 	comp.id          = obj.id;
		// 	comp.text.string = obj.name;
		// 	this.contentATMBank.addChild(item);
		// 	comp.data = obj;
		// 	return comp;
		// }.bind(this));
	},
	onData: function(data){
		console.log(data);
		if (void 0 !== data.list) {
			this.onListATM(data.list);
		}
	},
});

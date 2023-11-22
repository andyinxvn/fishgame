
cc.Class({
	extends: cc.Component,

	properties: {
		header: cc.Node,
		nap:    cc.Node,
		atm:    cc.Node,
		rut:    cc.Node,
	},
	init(){
		this.nap = this.nap.getComponent('bankNap');
		this.atm = this.atm.getComponent('bankATM');
		this.rut = this.rut.getComponent('bankRut');

		this.rut.init();

		this.body   = [this.nap, this.atm, this.rut];
		this.header = this.header.children.map(function(obj) {
			return obj.getComponent('itemContentMenu');
		});
	},
	onSelectHead: function(event, name){
		this.header.map(function(header) {
			if (header.node.name == name) {
				header.select();
			}else{
				header.unselect();
			}
		});
		this.body.map(function(body) {
			if (body.node.name == name) {
				body.node.active = true;
			}else{
				body.node.active = false;
			}
		});
	},
	onData: function(data){
		if (!!data.list) {
			this.nap.onData(data.list);
		}
		if (void 0 !== data.atm) {
			this.atm.onData(data.atm);
		}
	},
});

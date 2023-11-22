
cc.Class({
    extends: cc.Component,

    properties: {
        header:    cc.Node,
        body:      cc.Node,
        notif: cc.Node,
        nodeDaily: cc.Node,
        isLoaded: false,
        content: cc.Node,
        prefabDaiLy: cc.Prefab
    },
    init(obj){
        this.RedT = obj;
        this.daily_list = [];
    },
    onLoad: function(){
        this.header = this.header.children.map(function(obj) {
            return obj.getComponent('itemContentMenu');
        });
    },
    onEnable: function () {
        this.RedT.DaiLy.loadDaiLy();
        if(cc.RedT.user.phone !== '') {
            this.nodeDaily.active = true;
            this.notif.active = false;
        } else {
            this.nodeDaily.active = false;
            this.notif.active = true;
        }
    },
    loadDaiLy: function() {
        if(!this.isLoaded) {
            cc.RedT.send({shop:{get_daily:true}});
        }
    },
    onSelectHead: function(event){
        let name = event.target.name;
        Promise.all(this.header.map(function(header) {
            if (header.node.name == name) {
                header.select();
            }else{
                header.unselect();
            }
        }));
        Promise.all(this.body.children.map(function(body) {
            if (body.name == name) {
                body.active = true;
            }else{
                body.active = false;
            }
        }));
    },
    onData: function(data) {
        this.onDaiLy(data);
    },
    onDaiLy: function(data){
        let self  = this;
        data.sort((a,b ) => 0.5 - Math.random());
        this.content.destroyAllChildren();
        let regex = new RegExp("^" + cc.RedT.user.name + "$", 'i');
        this.daily_list = data.map(function(daily, index){
            !self.RedT.ChuyenRed.meDaily && (self.RedT.ChuyenRed.meDaily = regex.test(daily.nickname));
            let item = cc.instantiate(self.prefabDaiLy);
            item = item.getComponent('ChuyenRed_daily');
            item.init(self.RedT.ChuyenRed, daily, index);
            item.bg.active = index%2;
            self.content.addChild(item.node);
            return item;
        });
    },

    loadSecurityPhone: function() {
        cc.RedT.inGame.dialog.onClickBack();
        cc.RedT.inGame.dialog.showProfile(null, 'BaoMat');
        cc.RedT.inGame.dialog.profile.BaoMat.onSelectHead(null, 'DangKyOTP');
    }
});

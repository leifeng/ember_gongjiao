/**************************
 * Application
 **************************/
App = Ember.Application.create();
App.Router.map(function () {
    this.resource("index", {path: "/"});
    this.resource("index", {path: "/index"});
    this.resource('xl', { path: '/xl' });
    this.resource("zd", {path: "/zd"});
    this.resource("hc", {path: "/hc"});
    this.resource('about', { path: '/about' });
    this.resource('setting', { path: '/setting' });
});

/**************************
 * Models
 **************************/
App.xlData = Ember.Object.create({
    line_no: '',
    line_station: '',
    line_fx: '',
    station_num: '',
    line_fx_name: '',
    line_stations: '',
    clearValue: function () {
        this.set('line_no', '');
        this.set('line_station', '');
        this.set('line_fx', '');
        this.set('station_num', '');
        this.set('line_fx_name', '');
        this.set('line_stations', '');
    },
    getJson: function () {
        var me = this;
        Get_waitbusforone(this.get('line_no'), this.get('line_station'), this.get('line_fx'), function (result) {
            me.set('station_num', result);
        });
    },
    getStation: function (line) {
        var me = this;
        Get_line_station(line, function (result) {
            me.set('line_stations', result);
        });
    }
});
App.zdData = Ember.Object.create({
    station_name: '',
    station_info: '',
    getJson: function (station) {
        var me = this;
        Get_Station(station, function (zdinfo) {
            me.set('station_info', zdinfo);
        });
    }
});

App.hcData = Ember.Object.create({
    start_station_name: '',
    end_station_name: '',
    hc_info: '',
    getJson: function () {
        var me = this;
        Get_hc(this.get('start_station_name'), this.get('end_station_name'), function (hcinfo) {
            me.set('hc_info', hcinfo);
        })
    }
});
/**************************
 * Views
 **************************/
App.SearchTextField = Ember.TextField.extend({
    attributeBindings: ['disabled'],
    disabled: true
});

/**************************
 * Controllers
 **************************/
App.ApplicationController = Ember.Controller.extend({
    title: "公交查询",
    about: "关于我们",
    setting: "系统设置"
})

App.IndexController = Ember.Controller.extend({
    tabName1: "线路查询",
    tabName2: "站点查询",
    tabName3: "换乘查询",
    tabIndex: 0,
    item: "",
    actions: {
        toTab: function (i) {
            this.set('tabIndex', i);
            switch (i) {
                case 0:
                    this.set('item', lineList);
                    App.xlData.clearValue();
                    break;
                case 1:
                    this.set('item', App.xlData.get('line_stations'));
                    break;
                case 2:
                    var f = localStorage.getItem('line_fx_' + App.xlData.get('line_no')).split('|');
                    var ab = {fx: [
                        {key: f[0], value: f[0].substring(1)},
                        {key: f[1], value: f[1].substring(1)}
                    ]}
                    this.set('item', ab);
                    break;
                default:
                    this.set('item', zdList);
                    break;

            }
        },
        toTxt: function (li_txt) {
            switch (this.get('tabIndex')) {
                case 0:
                    App.xlData.set('line_no', li_txt);
                    App.xlData.getStation(li_txt);
                    break;
                case 1:
                    App.xlData.set('line_station', li_txt);
                    break;
                case 2:
                    App.xlData.set('line_fx_name', li_txt.substring(1));
                    App.xlData.set('line_fx', li_txt.substring(0, 1));
                    break;
                case 3:
                    App.zdData.set('station_name', li_txt);
                    App.zdData.getJson(li_txt);
                    break;
                case 4:
                    App.hcData.set('start_station_name', li_txt);
                    break;
                case 5:
                    App.hcData.set('end_station_name', li_txt);
                    break;
                default :
                    break;
            }
            $('#modal_panel').modal('hide');

        },
        toXl: function () {
            App.xlData.getJson();
            this.transitionTo('xl');
        },
        toZd: function () {
            this.transitionTo('zd');
        },
        toHc: function () {
            App.hcData.getJson();
            this.transitionTo('hc');
        }

    }
});
App.XlController = Ember.Controller.extend({
    back: function () {
        this.transitionTo('index');
    }
});

App.ZdController = Ember.Controller.extend({
    toIndex: function (line) {
        line = line.replace('路', '');
        App.xlData.clearValue();
        App.xlData.set('line_no', line);
        App.xlData.getStation(line);
        this.transitionTo('index');
    },
    back: function () {
        this.transitionTo('index');
    }
})

App.HcController = Ember.Controller.extend({
    back: function () {
        this.transitionTo('index');
    }
});




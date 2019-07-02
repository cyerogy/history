(function (window){
    var History = window.History;
    // ctvistarouter
    function ctvistarouter() {
        
    }
    /**
     * router parse
     */
    ctvistarouter.prototype.parsing = function (current_url) {
        var position = current_url.indexOf("&_suid=");
        if (position > -1){
            current_url = current_url.substring(0,position);
        }
        var hashsplit = current_url.split("/");
        var pathrule = new RegExp("/([^:]*)[^:]", "g");
        var params = {};
        var key = 0;
        for (var i = 0; i < historyconfig.length; i++) {
            var historypath = historyconfig[i]['path'].match(pathrule);
            if (historypath && historypath.length > 0){
                //有参数
                var configsplit = historyconfig[i]['path'].split("/");
                if (configsplit.length === hashsplit.length){
                    var is_corrent = true;
                    for (var j = 0; j < historypath.length; j++) {
                        if (current_url.indexOf(historypath[j]) === -1) {
                            is_corrent = false;
                            break;
                        }
                    }
                    if (is_corrent){
                        key = i;
                        break;
                    }
                }
            }else{
                //没有参数
                if (current_url === historyconfig[i]['path']) {
                    break;
                }
            }
        }
        var corrent_path_split = historyconfig[key]['path'].split("/");
        for (var i = 0; i < corrent_path_split.length;i++){
            if (corrent_path_split[i].indexOf(":") > -1){
                params[corrent_path_split[i].substring(1)] = hashsplit[i];
            }
        }
        return { params: params, key: key};
    }
    /**
     * router push
     */
    ctvistarouter.prototype.push = function (url,obj) {
        History.pushState(obj, "", "?"+url);
    }
    /**
     * router replace
     */
    ctvistarouter.prototype.replace = function (url, obj) {
        History.replaceState(obj, "", "?" + url);
    }
    /**
     * router back
     */
    ctvistarouter.prototype.back = function (number) {
        window.history.go(number)
    }
    
    ctvistarouter.prototype.excute = function () {
        var hash = "/";
        var State = History.getState();
        var split_arr = State.hash.split("?");
        if (split_arr.length > 1){
            hash = split_arr[1];
        }
        var info = window.ctvistarouter.parsing(hash);
        var url_info = historyconfig[info["key"]];
        if (typeof url_info['callbackfunc'] === "string") {
            window[url_info['callbackfunc']]({ url_params: info['params'], data: State['data'] });
        } else {
            url_info['callbackfunc']({ url_params: info['params'], data: State['data'] });
        }
    }

    ctvistarouter.prototype.init = function(){
        this.excute();
    }

    window.ctvistarouter = new ctvistarouter();
    
    History.Adapter.bind(window, 'statechange', function () {
        window.ctvistarouter.excute();
    });
})(window)
(function(window){
    // ctvistarouter
    function ctvistarouter() {
        
    }
    /**
     * router parse
     */
    ctvistarouter.prototype.parsing = function (current_url) {
        var hashsplit = [];
        var hashother = [];
        var pathrule = new RegExp("/([^:]*)[^:]", "g");
        var params = {};
        var key = 0;
        if (current_url.indexOf("?") > -1){
            var url_arr = current_url.split("?");
            hashsplit = url_arr[0].split("/");
            hashother = url_arr[1].split("&");
        }else{
            hashsplit = current_url.split("/");
        }
        
        for (var i = 0; i < historyconfig.length; i++) {
            if (current_url === historyconfig[i]['path']){
                break;
            }
            var configsplit = historyconfig[i]['path'].split("/");
            if (configsplit.length === hashsplit.length){
                var historypath = historyconfig[i]['path'].match(pathrule);
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
        }
        var corrent_path_split = historyconfig[key]['path'].split("/");
        for (var i = 0; i < corrent_path_split.length;i++){
            if (corrent_path_split[i].indexOf(":") > -1){
                params[corrent_path_split[i].substring(1)] = hashsplit[i];
            }
        }
        if (hashother.length > 0){
            for(var i = 0; i < hashother.length; i++){
                var arr = hashother[i].split("=");
                params[arr[0]] = arr[1];
            }
        }
        return { params: params, key: key};
    }
    /**
     * router push
     */
    ctvistarouter.prototype.push = function (url) {
        window.location.hash = url;
        
    }
    /**
     * router replace
     */
    ctvistarouter.prototype.replace = function (url) {
        const i = window.location.href.indexOf('#')
        window.location.replace(
            window.location.href.slice(0, i >= 0 ? i : 0) + '#' + url
        )
    }
    /**
     * router back
     */
    ctvistarouter.prototype.back = function (number) {
        window.history.go(number)
    }
    
    ctvistarouter.prototype.init = function(){
        if (!window.location.hash){
            window.location.hash = "/";
        }else{
            var info = window.ctvistarouter.parsing(window.location.hash.substring(1));
            var url_info = historyconfig[info["key"]];
            if (typeof url_info['callbackfunc'] === "string") {
                window[url_info['callbackfunc']](info['params']);
            }else{
                url_info['callbackfunc'](info['params']);
            }
        }
    }
    window.ctvistarouter = new ctvistarouter();

    window.addEventListener("hashchange",function(e){
        window.ctvistarouter.init();
    })
})(window)
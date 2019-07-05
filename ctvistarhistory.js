(function (window){
    var History = window.History;
    // ctvistarouter
    function ctvistarouter() {
        
    }
    //find different array item
    function getArrDifference(arr1, arr2) {
        var sum = 0;
        for (var index = 0; index < arr1.length; index++) {
            if (arr1[index] !== arr2[index]){
                sum++;
            }
            
        }
        return sum;
    }

    function parsingUrl(current_url){
        //先找出相似度最大的path并返回
        var position = current_url.indexOf("&_suid=");
        if (position > -1) {
            current_url = current_url.substring(0, position);
        }
        var hashsplit = current_url.split("/");
        var highest_similarity_index = -1;
        var highest_similarity_length = 0;
        for (var i = 0; i < historyconfig.length; i++) {
            var configsplit = historyconfig[i]['path'].split("/");
            var params = historyconfig[i]['path'].split(":");
            var params_length = params.length - 1;
            if (hashsplit.length === configsplit.length) {
                if (params_length === 0) {
                    //没有参数时直接匹配url 匹配成功后直接终止循环
                    if (current_url === historyconfig[i]['path']) {
                        highest_similarity_index = i;
                        highest_similarity_length = 0;
                        break;
                    }
                } else {
                    var half_diffrent_items_length = getArrDifference(hashsplit, configsplit);
                    //url参数个数需要相同
                    if (params_length === half_diffrent_items_length) {
                        if (highest_similarity_index === -1) {
                            highest_similarity_index = i;
                            highest_similarity_length = half_diffrent_items_length;
                        } else if (half_diffrent_items_length < highest_similarity_length) {
                            highest_similarity_index = i;
                            highest_similarity_length = half_diffrent_items_length;
                        }
                    }
                }
            }
        }
        var params = {};
        var corrent_path_split = historyconfig[highest_similarity_index]['path'].split("/");
        for (var i = 0; i < corrent_path_split.length; i++) {
            if (corrent_path_split[i].indexOf(":") > -1) {
                params[corrent_path_split[i].substring(1)] = hashsplit[i];
            }
        }
        return { params: params, key: highest_similarity_index };
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
    
    function excute() {
        var hash = "/";
        var State = History.getState();
        var split_arr = State.hash.split("?");
        if (split_arr.length > 1){
            hash = split_arr[1];
        }
        var info = parsingUrl(hash);
        var url_info = historyconfig[info["key"]];
        if (typeof url_info['callbackfunc'] === "string") {
            window[url_info['callbackfunc']]({ url_params: info['params'], data: State['data'] });
        } else {
            url_info['callbackfunc']({ url_params: info['params'], data: State['data'] });
        }
    }

    ctvistarouter.prototype.init = function(){
        excute();
    }

    window.ctvistarouter = new ctvistarouter();
    
    History.Adapter.bind(window, 'statechange', function () {
        excute();
    });
})(window)
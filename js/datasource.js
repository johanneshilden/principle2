window.Datasource = {

    fetch: function(config) {
        Datasource.request($.extend(config, {
            type: 'GET',
            data: ''
        }));
    },

    request: function(config) {
        $.support.cors = true;
        var hash = CryptoJS.HmacSHA1(config.data, $(document.body).data('key')),
            host = $(document.body).data('host').replace(/\/$/, ''),
            res = config.resource.replace(/^\/|\/$/g, '');

        if (!config.type) {
            config.type = 'GET';
        }
        $.ajax($.extend(config, {
            type: config.type,
            url: host + '/' + res,
            cache: false,
            data: config.data,
            crossDomain: true,
            dataType: 'json',
            headers: {
                "Accept":       "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8",
                "API-Access":   "generic:" + hash.toString(),
                "API-User":     "demouser:demo"
            }
        }));
    }

};

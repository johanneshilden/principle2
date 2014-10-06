(function($) {
    $.fn.addTab = function(id, label, tab, permanent) {
        var template = '<li><a href="#' + id + '">' + label + '</a>';
        if (true !== permanent) 
            template += ' <span class="ui-icon ui-icon-close" role="presentation">Close tab</span>';
        template += '</li>'; 

        $(this).append('<div id="' + id + '"></div>');
        $(this).find('.ui-tabs-nav').first().append($(template)); 
        $('#' + id).append(tab);
        $(this).tabs('refresh');
        return this;
    };
    $.fn.loadTab = function(resource, ref, yield, warn) {
        var tab = $('.ui-tabs-nav a[href="#' + ref + '"]');
        if (tab.length) {
            // This resource is available in an existing tab
            $(this).tabs('option', 'active', tab.parent().index());
        } else {
            Proxy.load(resource, {
                success: _.bind(function(resp) { 
                    if (yield) { yield(resp); }
                    if (!warn) {
                        // Activate the newly created tab
                        $(this).loadTab(resource, ref, null, true);
                    }
                }, this)
            });
        }
        return this;
    };
}(jQuery));

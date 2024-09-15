(function($) {
    function verticalTabs(element, options) {
        var tabHeader = '> h3';
        var $container = $(element);
        var $tabPanels = $container.children();
        var $tabNavigationWrapper = $('<div />');
        var $tabList = $('<ul></ul>');
        var $tabLabel = $('<a />', {
            'href' : "javascript:void(0);",
            'class': 'tab-label study-options-dropdown'
        });
        

        var tabs = [];
        var activeHeader;

        var removeActiveState = function() {
            $container.removeClass('active'); 
        };

        var labelToggleActive = function(event) {
            event.stopPropagation();
            $container.toggleClass('active');
            return false;
        };

        var destroy = function() {
            $tabNavigationWrapper.remove();
        };

        var parsePanels = function(index) {
            var $panel = $(this);
            var $header = $panel.find(tabHeader);
            var id = $panel.attr("id");
            var $tabLink = $('<a />', {
                'href': "#" + id
            });
            var $tabLi = $('<li />', {
                'class': $panel.attr('class') || ''
            });

            var isCurrentHeader = function() {
                return (activeHeader != undefined) && activeHeader == index;
            };

            var tabClick = function(event) {
                var $this = $(this);
                var height = $(this).height();
                var activeClass = 'active';

                $tabPanels.removeClass(activeClass);
                
                if (!isCurrentHeader())
                    $panel.removeClass(tabHeader);

                if ($(window).width() < 768)
                    $tabList.css('top', height);

                $tabList
                    .children()
                    .removeClass(activeClass);

                $('.triangle-right')
                    .remove();

                $panel
                    .addClass(activeClass);

                $tabLi
                    .addClass(activeClass);

                $this
                    .find('.award')
                    .after('<div class="triangle-right"></div>');

                $tabLabel
                    .text($this.text());
                 
                var infoHeight = $panel.find('.option-info').height();    
                                            
                $container.css('min-height', infoHeight+'px');

                activeHeader = index;

                event.preventDefault();
            };

            $header.on('click', function() {

                if (isCurrentHeader())
                    $panel.toggleClass(tabHeader);

                $tabLink.click();
                
            });

            $tabLink.html(
                $header.html()
                
            ).on('click', tabClick);  //$header.text()
            
            $('[data-toggle-content="' + id + '"]').on('click', function(event) {
                $panel.removeClass(tabHeader);
                $tabLink.click();
                event.preventDefault();
            });

            $tabLi.append($tabLink);
            $tabList.append($tabLi);

            tabs.push($tabLi);
        };

        $tabNavigationWrapper
            .addClass('study-options-navigation');
        
        $tabNavigationWrapper
            .append($tabLabel);

        $tabNavigationWrapper
            .append($tabList);

        $container
            .addClass('vertical-tabs')
            .prepend($tabNavigationWrapper);

        $('html').on('click', removeActiveState);


        $tabLabel.on('click', labelToggleActive);

        $tabPanels
            .each(parsePanels)
            .addClass('tabbed-content');

        // default show the first tab
        $(tabs[0])
            .find('a')
            .click();
                                                                                
        var infoHeight = $(".option-info").height();
                                            
        $container.css('min-height', infoHeight+'px');
                                            
        return {
            'destroy': destroy
        };
    }

    $.fn.verticalTabs = function() {
        return this.each(function(){
            if (undefined == $(this).data('verticalTabs')) {
                var plugin = new verticalTabs(this);
                $(this).data('verticalTabs', plugin);
            }
        });
    };

})(jQuery);

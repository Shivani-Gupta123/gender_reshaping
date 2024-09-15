jQuery(document).ready(function ($) {


    /************************************
        MitItUp filter settings
        More details:
        https://mixitup.kunkalabs.com/
        or:
        http://codepen.io/patrickkunka/
    *************************************/

    buttonFilter.init();

    var initialFilter = 'all';
    var hash = window.location.hash.replace(/^#/g, '');

    if (hash) {
        initialFilter = '.' + hash;
    }

    var container = document.querySelector('.cd-gallery ul');

    var mixer = mixitup(container, {
        load: {
            sort: 'name:asc',
            filter: '.Undergraduate'
        },
        multifilter: {
            enable: true // enable the multifilter extension for the mixer
        },
        controls: {
            toggleLogic: 'and'
        }
    });

    // pre-activate toggles 
    mixer.setFilterGroupSelectors('level', ['.Undergraduate']);

    // parse all groups and trigger an initial filter operation
    mixer.parseFilterGroups();

    // re-enable animations for all subsequent operations
    mixer.configure({animation: {enable: true}});



    // New filtering on dropdown

    $('#selectThis1, #selectThis2').on('change', function () {
        mixer.filter(this.value)
            .then(function (state) {
                console.log(state.activeFilter.selector); // '.category-a'
            });
    });



    // eo new filtering dropdown

    //search filtering
    //credits http://codepen.io/edprats/pen/pzAdg
    var inputText;
    var $matching = $();

    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $(".cd-filter-content input[type='search']").keyup(function () {
        // Delay function invoked to make sure user stopped typing
        delay(function () {
            inputText = $(".cd-filter-content input[type='search']").val().toLowerCase();
            // Check to see if input field is empty
            if ((inputText.length) > 0) {
                $('.mix').each(function () {
                    var $this = $(this);

                    // add item to be filtered out if input text matches items inside the title
                    if ($this.text().toLowerCase().match(inputText)) {

                        $matching = $matching.add(this);
                    } else {

                        // removes any previously matched item
                        $matching = $matching.not(this);
                        $(".cd-select select").prop('selectedIndex', 0);
                    }
                });
                //$('.cd-gallery ul').mixItUp('filter', $matching);
                mixer.filter($matching)
                    .then(function (state) {
                        console.log(state.activeFilter.selector); // '.category-a'
                    });
            } else {
                // resets the filter to show all item if input is empty
                $('.cd-gallery ul').mixItUp('filter', 'all');
                // reset the drop downs
                $(".cd-select select").prop('selectedIndex', 0);
            }
        }, 200);
    });


    $(".cd-select select").focus(function () {
        // update the input placeholder text
        $(".cd-filter-content input[type='search']").val('').attr("placeholder", "Search");
    });

});

/*****************************************************
    MixItUp - Define a single object literal
    to contain all filter custom functionality
*****************************************************/
var buttonFilter = {
    // Declare any variables we will need as properties of the object
    $filters: null,
    groups: [],
    outputArray: [],
    outputString: '',

    // The "init" method will run on document ready and cache any jQuery objects we will need.
    init: function () {
        var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.

        self.$filters = $('.cd-main-content');
        self.$container = $('.cd-gallery ul');

        self.$filters.find('.cd-filters').each(function () {
            var $this = $(this);

            self.groups.push({
                $inputs: $this.find('.filter'),
                active: '',
                tracker: false
            });
        });

        self.bindHandlers();
    },

    // The "bindHandlers" method will listen for whenever a button is clicked.
    bindHandlers: function () {
        var self = this;

        self.$filters.on('click', 'a', function (e) {
            self.parseFilters();
        });
        self.$filters.on('change', function () {
            self.parseFilters();
        });
    },

    parseFilters: function () {
        var self = this;

        // loop through each filter group and grap the active filter from each one.
        for (var i = 0, group; group = self.groups[i]; i++) {
            group.active = [];
            group.$inputs.each(function () {
                var $this = $(this);
                if ($this.is('input[type="radio"]') || $this.is('input[type="checkbox"]')) {
                    if ($this.is(':checked')) {
                        group.active.push($this.attr('data-filter'));
                    }
                } else if ($this.is('select')) {
                    group.active.push($this.val());
                } else if ($this.find('.selected').length > 0) {
                    group.active.push($this.attr('data-filter'));
                }
            });
        }
        self.concatenate();
    },

    concatenate: function () {
        var self = this;

        self.outputString = ''; // Reset output string

        for (var i = 0, group; group = self.groups[i]; i++) {
            self.outputString += group.active;
        }

        // If the output string is empty, show all rather than none:
        !self.outputString.length && (self.outputString = 'all');

        // Send the output string to MixItUp via the 'filter' method:
        if (self.$container.mixItUp('isLoaded')) {
            self.$container.mixItUp('filter', self.outputString);
        }
    }
};


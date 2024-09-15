/* 
  HTML
  Ensure that each facet list (.facet-list.mb-4) has has :class="encodeURIComponent(facet.facet_name)"
*/

window.addEventListener('load', () => {

  /**
   * Variables
   */

  /**
   * Change the section type filter parameter if different then 'sectionType_s', e.g. 'sectiontype_ss'
   */
  // const sectionType = 'sectionType_s';
  const sectionTypeArray = [
    'foundation-y',
    'jointhonours-y',
    'industrialexperience-y',
    'yearabroad-y',
    'degreeapprenticeship_s-y'
  ]

  /**
   * Change the custom form filter parameter if different then 'facetId'
   */
  const sectionTypeCustomFormFacet = 'facetId';

  /**
   * Search Tabs
   */
  const searchTabs = document.querySelectorAll('button[facet-id]');

  /**
   * Search Display Wrapper. Search is hidden on page load
   */
  const searchWrapper = document.querySelector('.t4-search-container');

  /**
   * Search Loader
   */
  const searchPlaceholder = document.querySelector('.t4-search-placeholder');


  /**
     * Loader
     */

  const searchResultsDisplayHandler = state => {
    // state ? console.log('t4-show-results class to be added') : console.log('t4-show-results class NOT to be added')
    // state ? searchWrapper.classList.add('t4-show-results') : searchWrapper.classList.remove('t4-show-results')
  }

  // Laoder/Spinner to hide data load
  const triggerLoader = value => {
    // console.log('loader set to ', value);
    value === "none" ? setTimeout(() => {searchPlaceholder.style.display = `${value}`}, 300) : (searchPlaceholder.style.display = `${value}`)
  };

  /**
   * Local storage handler ensuring that setionType filter that have values are accessible to Tabs
   */

  /**
   * clearLocalStorage function removes all stored values in localStorage that start with a specific prefix.
   */ 

  const clearLocalStorage = () => {
    // console.log('clearing local storage')
    for (const key in localStorage) {
      if (key.startsWith('ug-search-for-')) {
        localStorage.removeItem(key);
      }
    }
    // console.log('... and data-count attr');
    // searchTabs.forEach(tab => tab.removeAttribute('data-count'));
  };

  // console.log('Page Loaded: clearLocalStorage triggered...')
  clearLocalStorage();
  // triggerLoader('block');

  /**
   * checkLocalStorage function retrieves values from localStorage
   */

  const checkLocalStorage = () => {
    const values = [];
    for (const key in localStorage) {
      if (key.startsWith('ug-search-for-')) {
        const value = localStorage.getItem(key);
        values.push(value);
      }
    }
    return values;
  };

  /**
   * handleSectionTypeStorage function manages storing input values using localStorage
   */

  const handleSectionTypeStorage = () => {
    if (!document.querySelectorAll('#ss-search-results input').length > 0) {
      // console.log('NO FILTERS PRESENT ON PAGE')
      clearLocalStorage();
      // searchTabs.forEach(b => b.disabled = true);
      triggerLoader('none');
    }
    // console.log('handleSectionTypeStorage triggered to clear local storage and add new itms based on the existing facets: ', document.querySelectorAll('#ss-search-results input'))
    const inputElements = document.querySelectorAll('#ss-search-results input');
    clearLocalStorage();
    inputElements.forEach(el => {
      const facetId = el.id;
      if (facetId && sectionTypeArray.includes(facetId)) {
        // console.log(`handleSectionTypeStorage adds ${facetId}`)
        localStorage.setItem(`ug-search-for-${el.id}`, facetId);
        // console.log('Update tabs with number of results');
        document.querySelector(`button[facet-id="${facetId}"]`).setAttribute('data-count', `(${el.getAttribute('data-count')})`);
        document.querySelector('button[facet-id="all"]').setAttribute('data-count', `(${document.querySelector('#ss-search-results .filters').getAttribute('data-count')})`);
      }
    });
    // console.log('handleSectionTypeStorage triggering updateTabs()')
    updateTabs();
  };


  /**
   * Tabs
   */

  /**
   * Diselect all checked filters when Tabs are triggered
   */ 
  // const diselectFilters = () => {
    // console.log('diselectFilters run')
  //   const filters = document.querySelectorAll('.filters input:checked');
    // console.log('diselectFilters pre chicl: filters ', document.querySelectorAll('.filters input:checked'))
  //   filters.forEach(filter => filter.click());
    // console.log('diselectFilters post click: filters ', document.querySelectorAll('.filters input:checked'))
  // };

  const diselectFilters = (callback) => {
    // console.log('diselectFilters run');
    const totalResults = Number(document.querySelector('.sf-filter-info span.resultsNum').innerText);
    const filters = document.querySelectorAll('.filters input:checked');
  
    // If no filters are checked, directly call the callback
    if (filters.length === 0) {
      // console.log('No filters to deselect');
      callback(); // Call the callback immediately
      return; // Exit the function early
    }
  
    let count = filters.length; // Track the number of filters to deselect
  
    // Helper function to handle deselection of filters
    const deselectFilter = (filter) => {
      filter.click(); // Simulate a click event on the filter to deselect it
      count--; // Decrease the count
      // console.log('Filter deselected:', filter);
      if (count === 0) {
        // console.log('All filters deselected');
        let attempts = 0;
  
        // Recursive function to check totalResults until it differs or maxAttempts reached
        const checkTotalResults = () => {
          attempts++;
          const totalResultsUpdate = Number(document.querySelector('.sf-filter-info span.resultsNum').innerText);
          // console.log('Attempt:', attempts);
          // console.log('totalResults:', totalResults);
          // console.log('totalResultsUpdate:', totalResultsUpdate);
  
          if (totalResults !== totalResultsUpdate || attempts >= 10) { // Adjust maxAttempts as needed
            // console.log('Results differ or max attempts reached, triggering callback');
            callback(); // Trigger the callback
          } else {
            // console.log('Results still match, retrying in 500ms');
            setTimeout(checkTotalResults, 500); // Retry after a delay
          }
        };
  
        // Start checking totalResults after a delay
        setTimeout(checkTotalResults, 500);
      }
    };
  
    // Deselect each checked filter by simulating a click event
    filters.forEach(filter => deselectFilter(filter));
  };
  
  
  

  /**
   * Observes changes in the DOM to check the presence of section type inputs.
   * If only one input with class based on the sectionType is found, it triggers the updateTabs function.
   */
  const checkSectionTypeInputs = id => {
    // console.log('checkSectionTypeInputs triggered');
    const sectionTypeInputs = document.querySelector(`#${id}`).parentElement.parentElement;
    // console.log('checkSectionTypeInputs triggered and sectionTypeInputs is ', sectionTypeInputs)
    const sectionTypeInputsObserver = new MutationObserver(() => {
      if (sectionTypeInputs.children.length === 1) {
        sectionTypeInputsObserver.disconnect();
        searchTabs.forEach(b => b.disabled = false);
        // console.log('checkSectionTypeInputs triggers updateTabs()')
        updateTabs();
      } else {
        // console.log('checkSectionTypeInputs does not triggers updateTabs()')
      }
    });

    sectionTypeInputsObserver.observe(document.documentElement, { childList: true, subtree: true });
  };

  /**
   * click event handler for pre-selected filters
   */

  let loaderToBeTriggered = false;

  const sequentialSimulationOfClickEvent = async (filters, filtersReversed) => {
    // console.log('sequentialSimulationOfClickEvent triggered')
    // console.log(filtersReversed);
    // console.log(filters);
    const tabId = filters[sectionType];
    try {
      await simulateClickEvent(filtersReversed, 'uncheck');
      loaderToBeTriggered = true;
      await simulateClickEvent(filters, 'check');
      // console.log('Both functions completed.');
      if (tabId) {
        searchTabs.forEach(b => b.classList.remove('active'))
        document.querySelector(`button[facet-id="${sectionType},${tabId}`).classList.add('active');
      }
      // console.log('sequentialSimulationOfClickEvent triggers updateTabs()')
      updateTabs();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const sequentialSimulationOfClickEventCheckOnly = async () => {
    triggerLoader('block');
    // console.log('sequentialSimulationOfClickEventCheckOnly triggered')
    try {
      await simulateClickEvent(searchFilters, 'check');
      loaderToBeTriggered = true;
      // console.log('sequentialSimulationOfClickEventCheckOnly completed. Tiggrted updateTabs()');
      updateTabs();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const simulateClickEvent = async (targetElement, condition) => {
    triggerLoader('block');
    // console.log('simulateClickEvent triggered to ', condition)
    const keys = Object.keys(targetElement)
    for (const key of keys) {
      // console.log('simulateClickEvent key: ', key)
      const inputId = targetElement[key].toLowerCase().replace(/ /g, '-');
      const inputElement = document.getElementById(inputId);
      
      if (!inputElement) {
        // console.error(`Input element with ID ${inputId} not found.`);
        continue; // Skip to the next iteration if the element is not found
      }

      inputElement.click(); // Simulate the click event
      // console.log(`Clicked on input element with ID ${inputId}`);
      await waitForDOMChanges(key, inputId, condition); // Wait for DOM changes to occur
      // Perform actions dependent on DOM changes
      const sectionElement = document.querySelector('div.' + key);
      const listItems = Array.from(sectionElement.querySelectorAll('li'));
      if (condition === 'uncheck') {
        if (listItems.length > 1 && !sectionElement.querySelector(`input[id="${inputId}"]`).checked) {
          // console.log('Desired condition met as input element has been unchecked.');
        } else {
          // console.log('Desired condition not met as input element has not been unchecked.');
        }
      } else {
        if (listItems.length === 1 && sectionElement.querySelector(`input[id="${inputId}"]`).checked) {
          // If the number of li elements has changed and none are checked, resolve the promise
          // console.log('Desired condition met as input element has been checked.');
        } else {
          // console.log('Desired condition not met as input element has not been checked.');
        }
      }
    }
    if (condition === 'uncheck') {
      // console.log(`simulateClickEvent done. The number of checked input elements ${document.querySelectorAll('.filters input:checked').length} should NOT match the number of filters on page load ${Object.keys(targetElement).length}`);
      handleSectionTypeStorage();
    } else {
      // console.log(`simulateClickEvent done. The number of checked input elements ${document.querySelectorAll('.filters input:checked').length} should match the number of filters on page load ${Object.keys(targetElement).length}`);
    }
  }

  const waitForDOMChanges = (key, inputId, condition) => {
    // console.log('waitForDOMChanges triggered to ', condition)
    return new Promise(resolve => {
      // console.log('waitForDOMChanges trigger Promise')
      const observer = new MutationObserver(mutations => {
        // console.log('waitForDOMChanges trigger Promise and then observer')
        // Check for specific elements or conditions in the DOM
        // Resolve the promise when the desired condition is met
        // console.log('waitForDOMChanges key: ', key)
        const sectionElement = document.querySelector('div.' + key);
        // console.log('waitForDOMChanges sectionElement ', sectionElement)
        const listItems = Array.from(sectionElement.querySelectorAll('li'));
        // console.log('waitForDOMChanges listItems length ', listItems.length);
        let conditionMet = false;
        if (condition === 'uncheck') {
          if (listItems.length > 1) {
            // console.log('UNCHECK - greater then 1')
            // Resolve the promise when the desired condition is met
            if (sectionElement.querySelector(`input[id="${inputId}"]`) && !sectionElement.querySelector(`input[id="${inputId}"]`).checked) {
              // console.log('UNCHECK - greater then 1 and element not checked')
              conditionMet = true;
            } else {
              let allUnchecked = true;
              listItems.forEach(item => {
                // console.log('item ', item, item.firstElementChild.checked)
                if (item.firstElementChild.checked) {
                  // If any checkbox is checked, update the variable and exit the loop
                  allUnchecked = false;
                  return;
                }
              })
              if (allUnchecked) {
                // console.log('UNCHECK - greater then 1 and none of the elements is checked');
                conditionMet = true;
              }
            }
          } 
        } else {
          if (listItems.length === 1 && sectionElement.querySelector(`input[id="${inputId}"]`).checked) {
            // console.log('CHECK - greater then 1')
            // Resolve the promise when the desired condition is met
            conditionMet = true;
          } else {
            // console.log('Promise for check element not yet resolved as the listItems.length does not equal 1')
          }
        }

        if (conditionMet) {
          // console.log('Desired condition met. Resolving the promise.');
          observer.disconnect(); // Stop observing DOM changes
          resolve();
        } else {
          // console.log('Promise not yet resolved as the condition is not met.');
          // console.log(`The listItems length is ${listItems.length} for the ${inputId}. Is the input with that id checked? ${sectionElement.querySelector(`input[id="${inputId}"]`).checked}`);
        }

      });
      const config = { childList: true, subtree: true };
      observer.observe(document.querySelector('.facet-container-wrapper'), config);
    });
  }


  /**
   * updateTabs function updates the state of search tabs based on stored facets and search value. It also handles the sectionType value and triggers loader accordingly.
   */

  const updateTabs = () => {
    // console.log('updateTabs triggered...');
    const storedFacets = checkLocalStorage();
    const searchValue = searchStudioQuery;
    searchTabs.forEach(b => b.getAttribute('facet-id') !== 'all' ? b.disabled = true : null);

    // Lincoln
    // const searchFacetsWrapper = document.querySelector('#search-facets-div');
    // const searchTabAll = document.querySelector('#searchTabs button[facet-id="all"]');
    // searchTabAll && searchFacetsWrapper ? searchTabAll.classList.contains('active') ? searchFacetsWrapper.classList.add('hide-facets') : searchFacetsWrapper.classList.remove('hide-facets') : null
    // searchTabAll.classList.contains('active') ? document.querySelector('.facet-container-wrapper').classList.add('all-results') : document.querySelector('.facet-container-wrapper').classList.remove('all-results');

    if (storedFacets.length > 0) {
      // console.log('updateTabs triggered as facets are stored locally and keyword search present. Stored facets are ', storedFacets)
      storedFacets.forEach(facet => {
        document.querySelector(`button[facet-id="${facet}"]`).disabled = false;
      })
      document.querySelector(`button[facet-id="all"]`).disabled = false;
      // console.log(loaderToBeTriggered);
      if (loaderToBeTriggered) {
        searchResultsDisplayHandler(true);
        triggerLoader('none');
      }
      setTimeout(() => {triggerLoader('none')}, 300);
    } else {
      // console.log('updateTabs triggered but neither facets are stored locally nor keyword search present.')
    }
  }


  // Checks and clicks on a filter based on the provided facetId.
    // If 'All Results' Tab is not selected, the filters with '.type_s' are hidden
    // then checks if the filter with the given facetId exists.
    // If the filter doesn't exist, observes DOM changes to wait for its appearance,
    // then clicks on it and triggers 'checkSectionTypeInputs' function.
    // Otherwise, directly clicks on the filter and triggers 'checkSectionTypeInputs'.
    // If 'All Results' Tab is selected, it shows the '.type_s' element, enables search tabs, and updates them.
    // * Remove '.type_s' ref if not relevant as it points to the 'Format' filter.
  
    const checkAndClickFilter = facetId => {
      if (facetId !== 'all') {
        // console.log('checkAndClickFilter run for facetId that is not "all" but ', facetId);
        if (facetId.includes(',')) {
          facetId = facetId.split(',')[1];
        }
        let filter = document.querySelector(`.filters input[id="${facetId}"]`);
        // console.log(filter);
        if (!filter) {
          // console.log('checkAndClickFilter run for facetId that is not "all" but not have filter so filterObserver triggerd', filter)
          const filterObserver = new MutationObserver(() => {
            let filter = document.querySelector(`.filters input[id="${facetId}"]`);
            if (filter) {
              // console.log('checkAndClickFilter run for facetId that is not "all" but not have filter so filterObserver triggerd to find the filter', filter)
              filterObserver.disconnect();
              filter.click();
              checkSectionTypeInputs(filter.id);
            }
          });

          filterObserver.observe(document.documentElement, { childList: true, subtree: true });
        } else {
          // console.log('checkAndClickFilter run for facetId that is not "all" and has filter ', filter)
          filter.click();
          checkSectionTypeInputs(filter.id);
        }
      } else {
        // console.log('checkAndClickFilter run for facetId "all" and triggers updateTabs()');
        updateTabs();
      }
    }


  /** 
   * Attaching click event listeners to each Tab
   * Clears sectionTypeValue (predefined filter, e.g. courses) and triggers loader to hide search results change.
   * Assign 'active' class to selected Tab
   */

    searchTabs.forEach(btn => {
      btn.addEventListener('click', e => {
        const targetvalue = e.target.getAttribute('facet-id');
        // console.log('Tab clicked for: ', targetvalue);
        triggerLoader('block');

        searchTabs.forEach(b => {
          b.classList.remove('active');
          b.disabled = true;
        });
        btn.classList.add('active');

        let facetId = '';
        facetId = btn.getAttribute('facet-id') || btn.firstElementChild.parentNode.getAttribute('facet-id');

        // Call diselectFilters with a callback to checkAndClickFilter
        diselectFilters(() => {
          checkAndClickFilter(facetId);
        });

        // diselectFilters();
        // checkAndClickFilter(facetId);
      })
    });

  /* 
    Page loads scenarios:
    Case #1A: form with custom facetId
    Case #1B: form with custom facetId and other facets
    Case #2A: url with sectionType param
    Case #2B: url with sectionType param and other facets
    Case #3: Page loads with keyword search but no facets predefined
    Case #4: Page loads with no keyword but facets present
    
  */

  /**
   * Extract the search parameters
   */

  const url = window.location.href;
  const urlObj = new URL(url);
  const searchParams = new URLSearchParams(urlObj.search);
  let searchStudioQuery = searchParams.get('searchStudioQuery');
  const facets = searchParams.get('facets');
  const customFacet = searchParams.get(sectionTypeCustomFormFacet);

  // console.log('searchStudioQuery: ', searchStudioQuery);
  // console.log('facets: ', facets);
  // console.log('customFacet: ', customFacet);

  let searchFilters = {};
  let searchFiltersReversed = {};
  if (facets) {
    let searchFiltersEntriesObj = {};
    const searchURLFacets = facets.replace(/fq=/g, '').split('&');
    // console.log('searchURLFacets ', searchURLFacets)
    if (searchURLFacets.length > 0) {
      searchURLFacets.forEach(facet => {
        // console.log('decodeURIComponent', decodeURIComponent(facet).toLowerCase().replace(/"/g, '').replace(/:/g, '-'))
        // const [key, value] = decodeURIComponent(facet).toLowerCase().replace(/"/g, '').replace(/:/g, '-');

        const [key, value] = decodeURIComponent(facet).split(':');
        const processedValue = `${key}-${value.toLowerCase().replace(/"/g, '')}`;

        searchFiltersEntriesObj[key] = processedValue;
        let searchFiltersEntries = Object.entries(searchFiltersEntriesObj);
        searchFiltersEntries.reverse();
        searchFiltersReversed = Object.fromEntries(searchFiltersEntries);
        searchFilters[key] = processedValue;
      })
    }
  }

  if (customFacet) {
    searchFilters[sectionTypeCustomFormFacet] = customFacet;
  }

  if (!searchStudioQuery && !facets && !customFacet) {
    triggerLoader('none');
  }

  // console.log(`Pre-select filters: ${JSON.stringify(searchFilters)} of length of ${Object.keys(searchFilters).length}`);


  /**
   * When the search page loads with predefined searchType, e.g. "courses", then in order to fetch all search results for other filters (searchTypes) the current filter needs to be deselected
   */

  let facetValue = '';
  if (Object.keys(searchFilters).length > 0) {
    const searchFiltersValue = Object.values(searchFilters);
    // console.log('searchFilters value: ', searchFiltersValue)
    let sectionTypeValue = searchFiltersValue; // course
    // console.log(sectionTypeValue)
    !sectionTypeValue && Object.keys(searchFilters).length > 0 ? facetValue = searchFilters[sectionTypeCustomFormFacet] : null // course
  }
  

  const pageLoadWithFacetshandler = () => {
    // Case #1: facetValue - form with custom facetId
    if (facetValue) {
      if (Object.keys(searchFilters).length > 1) {
        // console.log(`Case #1B: facetValue + Pre-select filters: ${JSON.stringify(searchFilters)}`);
        let searchFiltersUpdated = {[sectionType]: searchFilters[sectionTypeCustomFormFacet], ...searchFilters}
        delete searchFiltersUpdated[sectionTypeCustomFormFacet];
        // console.log(searchFiltersUpdated);
        sequentialSimulationOfClickEvent(searchFiltersUpdated, searchFiltersReversed);
      } else {
        // console.log(`Case #1A: facetValue only: ${JSON.stringify(searchFilters)} with ${facetValue}`);
        handleSectionTypeStorage();
        searchFilters[sectionType] = searchFilters[sectionTypeCustomFormFacet];
        delete searchFilters[sectionTypeCustomFormFacet];
        // console.log(searchFilters)
        const tabId = searchFilters[sectionType];
        if (tabId) {
          searchTabs.forEach(b => b.classList.remove('active'));
          document.querySelector(`button[facet-id="${sectionType},${tabId}`).classList.add('active');
        }
        sequentialSimulationOfClickEventCheckOnly();
        facetValue = '';
      }
    } else if (sectionTypeValue) {
      // Case #2A & #2B: sectionTypeValue - url with sectionType param
      delete searchFilters[sectionTypeCustomFormFacet];
      delete searchFiltersReversed[sectionTypeCustomFormFacet];
      sequentialSimulationOfClickEvent(searchFilters, searchFiltersReversed);
    } else if (!facetValue && !sectionTypeValue && searchStudioQuery.length > 0) {
      // Case #3
      // console.log('Case #3: Page loaded with keyword only and triggers handleSectionTypeStorage()');
      loaderToBeTriggered = true;
      handleSectionTypeStorage();
      // updateTabs();
    }
  }


  const handleSectionTypeAdded = (mutationsList, onLoadObserver) => {
    // console.log('handleSectionTypeAdded triggered to find facets')
    const searchForSectionType = (node, elementFound) => {
      const sectionTypeArrayTrimmed = sectionTypeArray.map(each => each.split('-')[0]);
      if (node.nodeType === Node.ELEMENT_NODE && sectionTypeArrayTrimmed.some(className => node.classList.contains(className))) {
        // console.log('handleSectionTypeAdded triggered and sectionType (facets) HTML in DOM. This triggers sectionTypeValueHandler() and handleSectionTypeStorage()');
        return true; // Return true when the element is found
      } else {
        for (const childNode of node.childNodes) {
          // console.log('handleSectionTypeAdded triggered as sectionType not in DOM:  childNode', childNode)
          if (searchForSectionType(childNode, elementFound)) {
            return true; // If the element is found in child nodes, return true
          }
        }
        return false; // Return false if element is not found
      }
    };

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(addedNode => {
          // console.log('handleSectionTypeAdded triggered: addedNode ', addedNode)
          // searchForSectionType(addedNode);
          if (searchForSectionType(addedNode, false)) {
            // console.log('Element found. Stopping further search. The sectionTypeValueHandler() triggered if facet or facetId present, then handleSectionTypeStorage() triggered');
            // sectionTypeValue && sectionTypeValueHandler(sectionTypeValue, 'facet');
            // facetValue && sectionTypeValueHandler(facetValue, 'facetId');
            // handleSectionTypeStorage();
            if (keywordSearchForm) {
              // console.log('keywordSearchForm.value ', keywordSearchForm.value);
              searchStudioQuery = keywordSearchForm.value;
            }
            onLoadObserver.disconnect()
            // pageLoadWithFacetshandler();
            handleSectionTypeStorage();
            return; // Stop further search once element is found
          }
        });
      }
    }
  };

  const targetNode = document.querySelector('.facet-container-wrapper');
  const observerConfig = { childList: true, subtree: true };
  const onLoadObserver = new MutationObserver(mutationsList => {
    handleSectionTypeAdded(mutationsList, onLoadObserver);
  });

  if (document.querySelectorAll('#ss-search-results input').length > 0) {
    // pageLoadWithFacetshandler();
    handleSectionTypeStorage();
  } else {
    // console.log('Page Loaded: sectionType (facets) HTML NOT YET present in DOM - observer triggered');
    // searchTabs.forEach(b => b.getAttribute('facet-id') !== 'all' ? b.disabled = true : null);
    onLoadObserver.observe(targetNode, observerConfig);
  }

  /**
   * KEYWORD SEARCH
   */

  const keywordSearchHandler = () => {

    const observeSearchContainer = () => {
      // console.log('observeSearchContainer running');
      const targetNode = document.querySelector('#searchContainer .sf-list');

      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.target === targetNode) {
            // console.log('Children of #searchContainer were refreshed');
            handleSectionTypeStorage()
            observer.disconnect();
            break;
          } else {
            // console.log('Children of #searchContainer were NOT refreshed');
            triggerLoader('none');
          }
        }
      });

      const config = { attributes: true, childList: true, subtree: true };
      targetNode && observer.observe(targetNode, config);
      !targetNode ? searchResultsDisplayHandler(true) : null
      !targetNode ? triggerLoader('none') : null
      return observer;
    }

    const observer = observeSearchContainer();

    searchTabs.forEach(b => {
      b.classList.remove('active');
    });
    document.querySelector('button[facet-id="all"]').classList.add('active');

  }


  const keywordSearchForm = document.querySelector('#searchTerm'); 

  // Handler to check if the new search was submitted when no search result found, so the .no-results present
  const keywordSearchCheck = () => {
    const noResults = document.querySelector('.no-results');
    if (!noResults) {
      // console.log('Initial search or following search that had results')
      triggerLoader('block');
      keywordSearchHandler();
    } else {
      // console.log('Search following search with NO results found');
      triggerLoader('none');
      searchResultsDisplayHandler(true);
    }
  }

  keywordSearchForm && keywordSearchForm.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      // console.log('Keyword Search triggered with ENTER for ', keywordSearchForm.value);
      // addCloseBtnToInput();
      loaderToBeTriggered = true;
      keywordSearchCheck();
    }
  });

  let keywordSearchButton = document.querySelector('button.search-close-button[type="submit"]');
  const keywordCloseButton = document.querySelector('button.search-close-button[type="button"]');

  keywordSearchButton && keywordSearchButton.addEventListener('click', () => {
    // console.log('Keyword Search triggered with CLICK for ', keywordSearchForm.value);
    // addCloseBtnToInput();
    loaderToBeTriggered = true;
    keywordSearchCheck();
  });

  keywordCloseButton && keywordCloseButton.addEventListener('click', () => {
    // console.log('Keyword Search triggered with CLICK for ', keywordSearchForm.value);
    // addCloseBtnToInput();
    loaderToBeTriggered = true;
    keywordSearchCheck();
  });

  // Lincoln

  // const searchTabsMobileRevealBtn = document.querySelector('.searchTabs-mobile');

  // // mobile view handlers

  // searchTabsMobileRevealBtn.addEventListener('click', () => {
  //   searchTabsMobileRevealBtn.classList.toggle('show');
  //   if (searchTabsMobileRevealBtn.classList.contains('show')) {
  //     document.querySelectorAll('.searchTab').forEach(tab => tab.classList.remove('hidden'));
  //     searchTabsMobileRevealBtn.childNodes[1].innerHTML = '×';
  //     searchTabsMobileRevealBtn.childNodes[1].style.fontSize = '3.25rem';
  //     searchTabsMobileRevealBtn.childNodes[1].style.top = '10px';
  //   } else {
  //     document.querySelectorAll('.searchTab').forEach(tab => tab.classList.add('hidden'));
  //     searchTabsMobileRevealBtn.childNodes[1].innerHTML = '☰';
  //     searchTabsMobileRevealBtn.childNodes[1].style.fontSize = '2.5rem';
  //     searchTabsMobileRevealBtn.childNodes[1].style.top = '10px';
  //   }
  // });

  const handleWindowSize = () => {
    const tabElements = document.querySelectorAll('.searchTab');
    window.innerWidth < 768 ? tabElements.forEach(element => { element.classList.add('hidden') }) : tabElements.forEach(element => { element.classList.remove('hidden') })
    // window.innerWidth < 768 ? searchResultsDisplayHandler(true) : null
  };

  handleWindowSize();

  window.addEventListener('resize', handleWindowSize);

  const clearFiltersOnMobileHandler = () => {
    document.querySelector(`button[facet-id="all"]`).click();
  }

  const removeFilterOnMobileHandler = e => {
    let element = e.target;
    if (element.innerText === '') {
      element = e.target.parentNode
    }
    const elementText = element.innerText.trim().toLowerCase();
    // console.log(elementText)
    const facetId = `${sectionType},${elementText}`;
    // console.log(facetId)
    const tab = document.querySelector(`button[facet-id="${facetId}"]`);
    if (tab && tab.classList.contains('active')) {
      // console.log('pill clicked that matches the tab id with active class')
      clearFiltersOnMobileHandler()
    } else {
      // console.log('pill clicked is just a standard facet');
    }
  }

  const filtersOnMobileHandler = e => {
    e.target.classList.contains('clear-filters') ? clearFiltersOnMobileHandler() : null

    if (e.target.classList.contains('pill') && !e.target.firstElementChild.classList.contains('filter-by')) {
      // console.log(e.target)
      removeFilterOnMobileHandler(e);
    } else if (e.target.classList.contains('pill-close') && !e.target.classList.contains('filter-by')) {
      // console.log(e.target)
      removeFilterOnMobileHandler(e);
    }

  }

  window.addEventListener('click', e => filtersOnMobileHandler(e));

  // Adds close button to search input
  // const addCloseBtnToInput = () => {
    // console.log('addCloseBtnToInput triggered for ', keywordSearchForm.value.trim());
  //   if (keywordSearchForm.value.trim() !== '') {
  //     if (!document.querySelector('.t4-close-search')) {
  //       const buttonElement = document.createElement('button');
  //       buttonElement.classList.add('t4-close-search','btn');
  //       buttonElement.innerHTML = `X<span class="sr-only">Close Search</span>`;
  //       keywordSearchForm.parentElement.appendChild(buttonElement);
  //       buttonElement.addEventListener('click', () => {
  //         const currentUrl = window.location.href.split('?');
  //         window.location.href = `${currentUrl[0]}`;
  //       })
  //     }
  //   } else {
  //     document.querySelector('.t4-close-search') ? document.querySelector('.t4-close-search').remove() : null
  //   }
  // }
  
  // const closeBtnOnInput = document.querySelector('.t4-close-search');
  // if (closeBtnOnInput) {
  //   closeBtnOnInput.addEventListener('click', () => {
  //     triggerLoader('block');
  //     const currentUrl = window.location.href.split('?');
  //     window.location.href = `${currentUrl[0]}`;
  //   })
  // }

  // addCloseBtnToInput();

  keywordSearchForm && keywordSearchForm.addEventListener('input', () => {
    document.querySelector('.t4-close-search') ? document.querySelector('.t4-close-search').remove() : null
  })


});
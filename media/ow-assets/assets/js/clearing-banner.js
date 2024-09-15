let globalCourseData;

// Function to fetch and process course data from the JSON file
async function fetchCombinedCourseData() {
  try {
    const response = await fetch('https://assets.qmul.ac.uk/clearing/test-clearing-listings/combined_data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Filter out any invalid course data
    const validData = data.filter((course) => course !== null);
    // Optionally sort data alphabetically by course name
    validData.sort((a, b) => a.courseName.localeCompare(b.courseName));
    globalCourseData = validData;
  } catch (error) {
    console.error('Error fetching the courses:', error);
    return []; // Return an empty array in case of error
  }
}

async function updateHeroBanner() {
  const heroBanner = document.getElementById('real-time-hero-banner');
  if (!heroBanner) return;

  const ucasCode = heroBanner.dataset.courseUcas;
  const routeCode = heroBanner.dataset.courseRoutecode; // Assuming you have this data attribute as well
  const course = globalCourseData.find((course) => course.programmeCode === ucasCode && course.routeCode === routeCode);

  if (course) {
    let heroBannerHtml = '';
    
    const registerInteresttext = '<a class="text-white" href="https://qmul.tfaforms.net/292?"><strong>Register your interest</strong></a>';
    const applyNowText = '<a class="text-white" href="https://apply.qmul.ac.uk/"><strong>Apply online</strong></a>';

    // MALTA BANNER
    if (ucasCode == 'A110' && course.status === 'OPEN') {
      heroBannerHtml = `<div class="container container--xl overlap"><div class="message-muted message-muted--jade slat mb-5"><div class="slat__container py-2"><h3 class="message-muted__heading">This course is available through Clearing</h3></div></div></div>`;
    } else if (course.status === 'ADJUSTMENT') {
      heroBannerHtml = `<div class="container container--xl overlap"><div class="message-muted message-muted--purple slat mb-5"><div class="slat__container py-2"><h3 class="message-muted__heading">Limited International places available</h3><p class="message-muted__copy">` + applyNowText + `or <a class="text-white" href="https://www.qmul.ac.uk/undergraduate/clearing/"><strong>contact us</strong></a></p></div></div></div>`;
    } else if (course.status === 'OVERSEAS') {
      heroBannerHtml = `<div class="container container--xl overlap"><div class="message-muted message-muted--orange slat mb-5"><div class="slat__container py-2"><h3 class="message-muted__heading">Limited International places available</h3><p class="message-muted__copy">` + applyNowText + ` or <a class="text-white" href="https://www.qmul.ac.uk/undergraduate/clearing/"><strong>contact us</strong></a></p></div></div></div>`;
    } else if (course.status === 'PARTIAL') {
      heroBannerHtml = `<div class="container container--xl overlap"><div class="message-muted message-muted--gold slat mb-5"><div class="slat__container py-2"><h3 class="message-muted__heading">Some options available</h3><p class="message-muted__copy">` + applyNowText + ` or <a class="text-white" href="https://www.qmul.ac.uk/undergraduate/clearing/"><strong>contact us</strong></a></p></div></div></div>`;
    } else if (course.status === 'HOME') {
      heroBannerHtml = `<div class="container container--xl overlap"><div class="message-muted message-muted--blue slat mb-5"><div class="slat__container py-2"><h3 class="message-muted__heading">Limited UK places available</h3><p class="message-muted__copy">` + applyNowText + ` or <a class="text-white" href="https://www.qmul.ac.uk/undergraduate/clearing/"><strong>contact us</strong></a></p></div></div></div>`;
    } else if (course.status === 'OPEN') {
      heroBannerHtml = `<div class="container container--xl overlap"><div class="message-muted message-muted--jade slat mb-5"><div class="slat__container py-2"><h3 class="message-muted__heading">This course is available through Clearing</h3><p class="message-muted__copy">` + applyNowText + ` or <a class="text-white" href="https://www.qmul.ac.uk/undergraduate/clearing/"><strong>contact us</strong></a></p></div></div></div>`;
    } else if (course.status === 'CLOSED') {
      heroBannerHtml = `<div class="container container--xl overlap"><div class="message-muted message-muted--red slat mb-5"><div class="slat__container py-2"><h3 class="message-muted__heading">Closed for Clearing</h3><p class="message-muted__copy">Please check our <a class="text-white" href="https://www.qmul.ac.uk/undergraduate/clearing/find-your-course/"><strong>course finder</strong></a> to find an alternative course.</p></div></div></div>`;
    }

    heroBanner.setAttribute('data-course-status', course.status); // Updating data attribute
    
    if(course.status == 'CLOSED'){
    	$('#clearingApplyButton').hide()
    }

    if (heroBannerHtml) {
      heroBanner.innerHTML = heroBannerHtml;
    }
  } else {
    console.log(`No course found for UCAS code: ${ucasCode}`);
  }
}

async function updateSingleBanner() {
  const bannerElement = document.getElementById('real-time-banner-single');
  if (!bannerElement) return;

  const ucasCode = bannerElement.dataset.courseUcas;
  const routeCode = bannerElement.dataset.courseRoutecode;
  const course = globalCourseData.find((course) => course.programmeCode === ucasCode && course.routeCode === routeCode);

  if (course) {
    let statusClass = '';
    let statusText = '';

    if (course.status === 'ADJUSTMENT') {
      statusClass = 'clear-label__adjust';
      statusText = 'Adjustment only';
    } else if (course.status === 'OVERSEAS') {
      statusClass = 'clear-label__overseas';
      statusText = 'Overseas only';
    } else if (course.status === 'HOME') {
      statusClass = 'clear-label__home';
      statusText = 'Home only';
    } else if (course.status === 'OPEN') {
      statusClass = 'clear-label__open';
      statusText = 'Available';
    } else if (course.status === 'CLOSED') {
      statusClass = 'clear-label__closed';
      statusText = 'Closed';
    }

    // Updating class and text based on course status
    bannerElement.className = `clear-label ${statusClass}`;
    bannerElement.textContent = statusText;
    bannerElement.setAttribute('data-course-status', course.status); // Updating data attribute

    // Update course key info

    let clearingKeyInfo = '';

    if (course.ibRequirementsDescription || course.aLevelRequirementsDescription) {
      if (course.aLevelRequirementsDescription) {
        clearingKeyInfo = `<strong>A-levels:</strong> ${course.aLevelRequirementsDescription}`;
      }
      if (course.ibRequirementsDescription) {
        clearingKeyInfo += `<br /><strong>IB:</strong> HL ${course.ibRequirementsDescription}`;
      }
      if (course.btecRequirementsDescription) {
        clearingKeyInfo += `<br /><strong>BTECs</strong> may be accepted - call the Clearing hotline for further information. <a href="https://www.qmul.ac.uk/undergraduate/apply/entry/btec/">BTEC entry requirements</a>`;
      }
    } else if (ucasCode == 'A110') {
      clearingKeyInfo = `<a href="https://www.qmul.ac.uk/malta/admissions/entry-requirements/">Full entry requirements</a> | <a href="https://www.qmul.ac.uk/malta/admissions/how-to-apply/">How to apply through clearing</a>`;
    } else {
      clearingKeyInfo = `<a href="https://www.qmul.ac.uk/clearing/">Contact us</a> for further information`;
    }

    if (course.btecCurrentYear !== 'BTEC qualifications are considered for entry to this programme.') {
      clearingKeyInfo += `<br /><strong>BTECs</strong> are not accepted for this course`;
    }

    if (course.status === 'OPEN' || course.status === 'OVERSEAS') {
      clearingKeyInfo += `<br /><small>* Clearing entry requirements are indicative only and subject to change. Please check this page regularly for updates.</small>`;
    }

    if (course.status === 'ADJUSTMENT') {
      clearingKeyInfo += `<br /><small>* Adjustment entry requirements are indicative only and subject to change. Please check this page regularly for updates.</small>`;
    }

    const courseElement = document.getElementById('real-time-clearing-key-info');
    if (courseElement) {
      if (course.status === 'ADJUSTMENT') {
        courseElement.innerHTML = `<dt>Adjustment entry requirements *</dt><dd>${clearingKeyInfo}</dd>`;
      } else if (course.status === 'OVERSEAS') {
        courseElement.innerHTML = `<dt>Clearing entry requirements *</dt><dd>${clearingKeyInfo}</dd>`;
      } else if (course.status === 'HOME') {
        courseElement.innerHTML = `<dt>Clearing entry requirements *</dt><dd>${clearingKeyInfo}</dd>`;
      } else if (course.status === 'OPEN') {
        courseElement.innerHTML = `<dt>Clearing entry requirements *</dt><dd>${clearingKeyInfo}</dd>`;
      } else if (course.status === 'CLOSED') {
        courseElement.innerHTML = `<dt>Clearing entry requirements</dt><dd>This course is not available in clearing</dd>`;
      } else {
        courseElement.innerHTML = `<dt>Clearing entry requirements</dt><dd><a href="https://www.qmul.ac.uk/clearing/">Contact us</a> for further information</dd>`;
      }
    }
  } else {
    console.log(`No course found for UCAS code: ${ucasCode}`);
  }
}

async function updateMultipleBanner() {
  const bannerElements = document.getElementsByClassName('real-time-banner-options');
  if (!bannerElements) return;

  Array.from(bannerElements).forEach((bannerElement) => {
    const ucasCode = bannerElement.dataset.courseUcas;
    const routeCode = bannerElement.dataset.courseRoutecode;
    const course = globalCourseData.find((course) => course.programmeCode === ucasCode && course.routeCode === routeCode);

    if (course) {
      let statusClass = '';
      let statusText = '';

      if (course.status === 'ADJUSTMENT') {
        statusClass = 'clear-label__adjust';
        statusText = 'Adjustment only';
      } else if (course.status === 'OVERSEAS') {
        statusClass = 'clear-label__overseas';
        statusText = 'Overseas only';
      } else if (course.status === 'HOME') {
        statusClass = 'clear-label__home';
        statusText = 'Home only';
      } else if (course.status === 'OPEN') {
        statusClass = 'clear-label__open';
        statusText = 'Available';
      } else if (course.status === 'CLOSED') {
        statusClass = 'clear-label__closed';
        statusText = 'Closed';
      }

      // Updating class and text based on course status
      bannerElement.className = `clear-label ${statusClass}`;
      bannerElement.textContent = statusText;
      bannerElement.setAttribute('data-course-status', course.status); // Updating data attribute

      
    } else {
      console.log(`No course found for UCAS code: ${ucasCode} and route code: ${routeCode}`);
      bannerElement.className = 'clear-label clear-label__closed';
      bannerElement.textContent = 'Closed';
    }
  });

  const reqElements = document.getElementsByClassName('real-time-clearing-key-info-options');
  if (!reqElements) return;

  Array.from(reqElements).forEach((reqElement) => {
    const ucasCodeReq = reqElement.dataset.courseUcas;
    const routeCodeReq = reqElement.dataset.courseRoutecode;
    const courseReq = globalCourseData.find((course) => course.programmeCode === ucasCodeReq && course.routeCode === routeCodeReq);

    let clearingKeyInfo = '';
    if (courseReq) {
      // Construct the clearingKeyInfo string based on available course data
      if (courseReq.ibRequirementsDescription || courseReq.aLevelRequirementsDescription) {
        if (courseReq.aLevelRequirementsDescription) {
          clearingKeyInfo = `<strong>A-levels:</strong> ${courseReq.aLevelRequirementsDescription}`;
        }
        if (courseReq.ibRequirementsDescription) {
          clearingKeyInfo += `<br /><strong>IB:</strong> HL ${courseReq.ibRequirementsDescription}`;
        }
        if (courseReq.btecRequirementsDescription) {
          clearingKeyInfo += `<br /><strong>BTECs</strong> may be accepted - call the Clearing hotline for further information. <a href="https://www.qmul.ac.uk/undergraduate/apply/entry/btec/">BTEC entry requirements</a>`;
        }
      } else if (ucasCodeReq == 'A110') {
        clearingKeyInfo = `<a href="https://www.qmul.ac.uk/malta/admissions/entry-requirements/">Full entry requirements</a> | <a href="https://www.qmul.ac.uk/malta/admissions/how-to-apply/">How to apply through clearing</a>`;
      } else {
        clearingKeyInfo = `<a href="https://www.qmul.ac.uk/clearing/">Contact us</a> for further information`;
      }

      if (courseReq.btecCurrentYear !== 'BTEC qualifications are considered for entry to this programme.') {
        clearingKeyInfo += `<br /><strong>BTECs</strong> are not accepted for this course`;
      }

      if (courseReq.status === 'OPEN' || courseReq.status === 'OVERSEAS') {
        clearingKeyInfo += `<br /><small>* Clearing entry requirements are indicative only and subject to change. Please check this page regularly for updates.</small>`;
      }

      if (courseReq.status === 'ADJUSTMENT') {
        clearingKeyInfo += `<br /><small>* Adjustment entry requirements are indicative only and subject to change. Please check this page regularly for updates.</small>`;
      }


          if (courseReq.status === 'ADJUSTMENT') {
            reqElement.innerHTML = `<dt>Adjustment entry requirements *</dt><dd>${clearingKeyInfo}</dd>`;
          } else if (courseReq.status === 'OVERSEAS') {
            reqElement.innerHTML = `<dt>Clearing entry requirements *</dt><dd>${clearingKeyInfo}</dd>`;
          } else if (courseReq.status === 'HOME') {
            reqElement.innerHTML = `<dt>Clearing entry requirements *</dt><dd>${clearingKeyInfo}</dd>`;
          } else if (courseReq.status === 'OPEN') {
            reqElement.innerHTML = `<dt>Clearing entry requirements *</dt><dd>${clearingKeyInfo}</dd>`;
          } else if (courseReq.status === 'CLOSED') {
            reqElement.innerHTML = `<dt>Clearing entry requirements</dt><dd>This course is not available in clearing</dd>`;
          } else {
            reqElement.innerHTML = `<dt>Clearing entry requirements</dt><dd><a href="https://www.qmul.ac.uk/clearing/">Contact us</a> for further information</dd>`;
          }
        } else {
            reqElement.innerHTML = `<dt>Clearing entry requirements</dt><dd>This course is not available in clearing</dd>`;
        }



  });


}

async function showMaltaContactBanner() {
  const maltaContactDiv = document.getElementById('malta-clearing-contact');
  if (!maltaContactDiv) return;
  const maltaCourse = globalCourseData.find((course) => course.programmeCode == 'A110');
  if (maltaCourse.status === 'OPEN') {
    maltaContactDiv.classList.remove('hide');
  }
}

async function updateApplyNowButton() {
  const applyNowContainer = document.getElementById('applyNowContainer');
  if (!applyNowContainer) return;

  const ucasCode = applyNowContainer.getAttribute('data-course-ucas');
  if (!ucasCode) {
    console.error('UCAS code not found.');
    return;
  }

  const course = globalCourseData.find((course) => course.programmeCode === ucasCode);
  if (!course) {
    console.error(`No course found for UCAS code: ${ucasCode}`);
    return;
  }

  let applyNowContent = '';

  if (course.entryYear == '2023' && course.status == 'CLOSED') {
    // Do nothing, no apply now button for closed courses in 2023
  } else if (['N305', 'N304', 'G4DA', 'G4DE'].includes(ucasCode)) {
    // Do not display 'Apply now' button for BSc Applied Physics, Applied Finance, Digital and Technology Solutions (Software Engineer), Digital and Technology Solutions (Data Analyst)
  } else if (ucasCode == 'A110' && course.status != 'CLOSED') {
    // Medicine Malta 5 Year Programme
    applyNowContent =
      '<a href="https://mysis.qmul.ac.uk/urd/sits.urd/run/siw_ipp_lgn.login?process=siw_ipp_app&code1=DFQM-A110-09&code2=0007" class="action action--secondary"><span class="twi action__label"><span class="twi__label">Apply now</span></span></a>';
  } else if (
    !['Y2GI', 'Y2GG', 'Y2GA', 'FGHZ', 'G4DE', 'Y2QF', 'Y2QA'].includes(ucasCode) &&
    course.entryYear == '2023' &&
    course.status !== 'CLOSED' &&
    course.intercalated !== 'Y' &&
    course.degreeApprenticeship !== 'Y'
  ) {
    // General apply now condition for 2023 excluding certain UCAS codes and statuses
    applyNowContent =
      '<a href="http://apply.qmul.ac.uk/" class="action action--secondary"><span class="twi action__label"><span class="twi__label">Apply now</span></span></a>';
  } else {
    if (course.entryYear != '2022') {
      //applyNowContent = '<a class="action action--secondary" href="#custom-modal"  data-modal-trigger><span class="twi  action__label"><span class="twi__label"><span>Apply now</span></span></span></a>';
    }
  }

  applyNowContainer.innerHTML = applyNowContent;
}

async function displayBanners() {
  await fetchCombinedCourseData();
  updateHeroBanner();
  updateSingleBanner();
  updateMultipleBanner();
  showMaltaContactBanner();
  updateApplyNowButton();

  // Display the first study option
  const activeStudyOptionLink = document.querySelector('.study-option.active a');
  if (activeStudyOptionLink) {
    activeStudyOptionLink.click();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  displayBanners();
});




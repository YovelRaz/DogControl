//document.addEventListener("DOMContentLoaded", function () {
//    var container = document.querySelector('.container-edit');
//    if (container) {
//        console.log("ok");
//        var link = document.createElement("link");
//        link.rel = "stylesheet";
//        link.href = "Elearning/styles/myStyle.css";
//        document.head.appendChild(link);

//    }
//});




document.addEventListener("DOMContentLoaded", function () {
    var containerEdit = document.querySelector('.container-edit');
    var viewContainer = document.querySelector('.ViewContainer');

    if (containerEdit || viewContainer) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "Elearning/styles/myStyle.css";
        document.head.appendChild(link);
    }
});



function toggleSwipeActivation(button) {
    button.classList.toggle('active');
    var slider = button.querySelector('.slider');
    slider.classList.toggle('active');
}


function getPageIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('pageid');
    return pageId;
}





///arrows - edit




document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('ViewPage.html') || window.location.pathname.includes('EditPage.html')) {
        const pageId = getPageIdFromUrl();
        const unitId = getUnitIdFromUrl();
        console.log(`Page ID: ${pageId}, Unit ID: ${unitId}`);

    }
});



function getUnitIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const unitId = urlParams.get('unitid');
    console.log(`Extracted Unit ID from URL: ${unitId}`);
    if (unitId) {
        localStorage.setItem('currentUnitId', unitId); // Store unit_id in localStorage
    }
    return unitId || localStorage.getItem('currentUnitId'); // Fallback to localStorage if not in URL
}

function getBaseUrl() {
    const url = window.location.href;
    const baseUrl = url.split('?')[0];
    return baseUrl;
}


async function navigatePage(endpoint, pageId, unitId) {
    try {
        const theunitid = unitId;
        console.log(`Navigating to ${endpoint} with Page ID: ${pageId} and Unit ID: ${theunitid}`);
        const response = await fetch(`/api/EditElearning/${endpoint}?currentPageId=${pageId}&currentUnitId=${theunitid}`);
        if (response.ok) {
            const nextPageId = await response.json();
            const baseUrl = getBaseUrl(); // Get the current base URL (either editPage.html or ViewPage.html)
            console.log(`Navigating to ${baseUrl}?pageid=${nextPageId}&unit_id=${theunitid}`);
            window.location.href = `${baseUrl}?pageid=${nextPageId}&unit_id=${theunitid}`;
        } else {
            console.error('No next/previous page available.');
        }
    } catch (error) {
        console.error('Error navigating to the page:', error);
    }
}

function navigatePagePre() {
    const pageId = getPageIdFromUrl();
    const unitId = getUnitIdFromUrl();
    if (pageId && unitId) {
        navigatePage('GetPreviousPageId', pageId, unitId);
    } else {
        console.error('Page ID or Unit ID is missing.');
    }
}

function navigatePageNext() {
    const pageId = getPageIdFromUrl();
    
    const unitId = getUnitIdFromUrl();
    console.log("page aned unit: "+pageId, unitId)
    if (pageId && unitId) {
        navigatePage('GetNextPageId', pageId, unitId);
    } else {
        console.error('Page ID or Unit ID is missing.');
    }
}







////


async function getPageById(pageId) {
    const baseUrl = 'https://localhost:7036/api/EditElearning/PageInfo';
    try {
        const response = await fetch(`${baseUrl}?pageid=${pageId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch page ID: ${response.statusText}`);
        }

        const pageInfo = await response.json(); // Parse response as JSON

        if (pageInfo && pageInfo.length > 0) {
            const { pageId, pageCode, pageContent } = pageInfo[0];
            //console.log("Page info:", { pageId, pageCode, pageContent });
            return { pageId, pageCode, pageContent };
        } else {
            console.log('Page not found');
            return null; // Return null if page not found
        }
    } catch (error) {
        console.error('Error fetching page data:', error);
        return null; // Return null in case of error
    }
}



async function loadPageContent() {

//function loadPageContent() {

    try {
        console.log('Page content loaded');

        // Extract pageId from the URL
        const pageId = getPageIdFromUrl();

        // Log the page ID if not null or undefined and on the edit page
        //if (pageId && window.location.href.includes('editPage.html')) {
        if (window.location.pathname.includes('ViewPage.html') || window.location.pathname.includes('editPage.html')) {

            //console.log('Page ID:', pageId);


            if (!pageId) {
                console.error('Page ID is undefined');
                return;
            }

            // Call getPageById to fetch page content
            const page = await getPageById(pageId);

            //const page =  getPageById(pageId);


            // Check if the page or page content is null
            if (!page || !page.pageContent) {
                console.error('Page not found or page content is null');
                return;
            }

            // Display the page content in the unit container
            const unitContainer = document.querySelector('.unit-container');
            unitContainer.innerHTML = page.pageContent;

            // If editing page, additional actions can be performed - Yovel - check if yu need it
            //if (window.location.href.includes('editPage.html')) {
            //
            //}
            // Load external JavaScript only after the page content is loaded
            var container = document.querySelector('.container-edit');
            if (container) {
                console.log("ok");
                var script = document.createElement("script");
                script.src = "Elearning/jScripts/javascript.js";
                document.body.appendChild(script);
                console.log("External JS loaded");

            }
        
        }
    } catch (error) {
        console.error('Error loading page content:', error);
    }
}






function enableEdit(element, editButton, pageId) {
    if (pageId <= 47) {
        console.log("Editing is disabled for this page.");
        alert("אין אפשרות לערוך את יחידת המקור"); // Display an alert message

        return; // Exit the function if the pageId is within the restricted range
    }
    var originalContent = element.textContent; // Save the original text content
    isEditMode = true;

    element.contentEditable = true; // Make the text element editable
    element.focus();

    var saveButton = document.createElement('button'); // Create a save button
    saveButton.textContent = 'Save';
        console.log("the parameters: "+element.innerHTML.replace(/\s{2,}/g, ' ').replace(/\n/g, '').replace(/\t/g, '').trim(), pageId, originalContent, editButton, saveButton);

    // Add event listener to the save button to save changes and disable editing
    saveButton.addEventListener('click', function () {
        saveEdit(element.innerHTML.replace(/\s{2,}/g, ' ').replace(/\n/g, '').replace(/\t/g, '').trim(), pageId, originalContent, editButton, saveButton);
    });

    element.parentNode.insertBefore(saveButton, element.nextSibling); // Insert the save button after the text element
    editButton.style.display = 'none'; // Hide the edit button
}



// Inside the function where you handle editing and saving
async function onUnitEdit(ev) {

    const mainButton = ev.target;
    const unitContainer = document.querySelector('.unit-container');
    const pageId = getPageIdFromUrl(); // Assuming you have a function to retrieve the page ID from the URL
    // Check if the pageId is restricted
    if (pageId <= 47) {
        console.log("Editing is disabled for this page.");
        alert("אין אפשרות לערוך את יחידת המקור"); // Display an alert message

        return; // Exit the function if the pageId is within the restricted range
    }

    const isSaveMode = ev.target.textContent === 'שמירה';

    if (isSaveMode) {
        // Saving process
        mainButton.textContent = 'עריכת לומדה';
        unitContainer.contentEditable = false; // Make the text element non-editable

        const editedContent = unitContainer.innerHTML.replace(/\s{2,}/g, ' ').replace(/\n/g, '').replace(/\t/g, '').trim();

        if (!pageId) {
            console.error('Page ID not found');
            return;
        }
        console.log(editedContent, pageId);
        saveEdit(editedContent, pageId); // Pass pageId to the saveEdit function

        const unitMSG = document.querySelector('.unit-success-message');

        unitMSG.style.display = 'block';

        setTimeout(() => {
            unitMSG.style.display = 'none';
        }, 2500);

    } else {
        // Edit process
        unitContainer.contentEditable = true; // Make the text element editable
        unitContainer.focus();

        mainButton.textContent = 'שמירה';
    }
}

   

async function saveEdit(editedContent, pageId) {

    if (pageId <= 47) {
        console.log("Editing is disabled for this page.");
        alert("אין אפשרות לערוך את יחידת המקור"); // Display an alert message

        return; // Exit the function if the pageId is within the restricted range
    }

    try {
       
        const updateResponse = await fetch('https://localhost:7036/api/EditElearning/UpdatePage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Page_id: pageId,
                Page_Content: editedContent,
                Update_Date: new Date().toISOString()
            })
        });

        if (!updateResponse.ok) {
            const errorMessage = await updateResponse.text();
            throw new Error(`Failed to update page: ${errorMessage}`);
        }

        // If the response is successful
        console.log('Page updated successfully');
        console.log(editedContent);

        // Display success message after successful update
        const unitMSG = document.querySelector('.unit-success-message');
        unitMSG.style.display = 'block';
        unitMSG.textContent = 'עריכה נשמרה בהצלחה'; // Set success message text
        setTimeout(() => {
            unitMSG.style.display = 'none';
        }, 2500);

    } catch (error) {
        console.error('Error updating page:', error);
        // If there's an error, hide the success message
        const unitMSG = document.querySelector('.unit-success-message');
        unitMSG.style.display = 'none';
    }
}




let isEditMode = false; 

window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function (event) {
            var unsavedChanges = document.querySelector('[contenteditable="true"]');
            if (unsavedChanges) {
                event.preventDefault();
                if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
                    window.location.href = link.href;
                }
            }
        });
    });

    window.addEventListener('beforeunload', function (event) {
        var unsavedChanges = document.querySelector('[contenteditable="true"]');
        if (unsavedChanges) {
            event.preventDefault();
            event.returnValue = ''; // For older browsers
            return "You have unsaved changes. Are you sure you want to leave?";
        }
    });
});

document.addEventListener('input', function (event) {
    var targetElement = event.target;

    if (targetElement.isContentEditable) {
        editedContent = targetElement.innerHTML;
    }
});

//origibal

//async function duplicateUnit() {
//    try {
//        const response = await fetch('/api/EditElearning/duplicateUnit', {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json'
//            }
//        });

//        if (response.ok) {
//            const result = await response.json();
//            console.log('Unit duplicated successfully:', result.unitId);

//            // Redirect to Templates.html to fill the modal
//            window.location.href = `Templates.html?unit_id=${result.unitId}&openModal=true`;

//        } else {
//            const error = await response.text();
//            console.error('Error duplicating unit:', error);
//        }
//    } catch (error) {
//        console.error('Fetch error:', error);
//    }
//}






//// Function to update image URLs on the page, including background images for buttons
//async function updateImageURLs(unitId) {
//    // Update image 'src' for regular image elements
//    const images = document.querySelectorAll('.media-item');  // Assuming media-item is the class in your HTML
//    images.forEach(image => {
//        const oldSrc = image.src;
//        const newSrc = `/images/${unitId}/${oldSrc.split('/').pop()}`;
//        image.src = newSrc;
//    });

//    // Update background-image for buttons or other elements with background images
//    const buttons = document.querySelectorAll('button');  // You can refine the selector as needed
//    buttons.forEach(button => {
//        const style = window.getComputedStyle(button);
//        const backgroundImage = style.backgroundImage;

//        // Check if the button has a background-image
//        if (backgroundImage && backgroundImage.includes('images/')) {
//            const oldImageUrl = backgroundImage.slice(5, -2); // Extract URL from background-image (removes 'url("")')
//            const newImageUrl = `/images/${unitId}/${oldImageUrl.split('/').pop()}`;

//            // Update the background image with the new unit ID
//            button.style.backgroundImage = `url('${newImageUrl}')`;
//        }
//    });
//}

//// Function to update image URLs on the page
//async function updateImageURLs(unitId) {
//    const images = document.querySelectorAll('.media-item');  // Assuming media-item is the class in your HTML
//    images.forEach(image => {
//        const oldSrc = image.src;
//        const newSrc = `/images/${unitId}/${oldSrc.split('/').pop()}`;
//        image.src = newSrc;
//    });
//}





    //    // Update background-image for buttons or other elements with background images
    //    const buttonIds = ['tipsBtn', 'anotherButtonId']; // List of IDs to check
    //    buttonIds.forEach(buttonId => {
    //        const button = document.getElementById(buttonId);
    //        if (button) {
    //            const style = window.getComputedStyle(button);
    //            const backgroundImage = style.backgroundImage;
    //            if (backgroundImage && backgroundImage.includes('images/')) {
    //                console.log(`Old background-image for ${buttonId}: ${backgroundImage}`);
    //                const oldImageUrl = backgroundImage.slice(5, -2);
    //                const newImageUrl = `/images/${unitId}/${oldImageUrl.split('/').pop()}`;
    //                console.log(`New background-image for ${buttonId}: ${newImageUrl}`);
    //                button.style.backgroundImage = `url('${newImageUrl}')`;
    //            } else {
    //                console.log(`No valid background-image found for button with ID: ${buttonId}`);
    //            }
    //        } else {
    //            console.log(`No button found with ID: ${buttonId}`);
    //        }
    //    });
    //}



    //async function updateImageURLs(unitId) {
    //    // Fetch media items from your database or API to get dynamic IDs and image titles
    //    const mediaItems = await fetchMediaItemsFromDatabase(unitId);

    //    console.log('Fetched media items:', mediaItems); // Log media items

    //    // Update image 'src' for regular image elements by ID
    //    mediaItems.forEach(mediaItem => {
    //        const { id, imageTitle } = mediaItem;

    //        // Query for element with the dynamic ID
    //        const element = document.getElementById(id);
    //        if (element) {
    //            const oldSrc = element.src;
    //            const newSrc = `/images/${unitId}/${imageTitle}`;

    //            // Log the path change
    //            console.log(`Element with ID ${id} - Old src: ${oldSrc}`);
    //            console.log(`Element with ID ${id} - New src: ${newSrc}`);

    //            element.src = newSrc;
    //        } else {
    //            console.log(`No element found with ID: ${id}`); // Log if no element is found
    //        }
    //    });

    //    // Update background-image for buttons or other elements with background images by ID
    //    const buttonIds = ['tipsBtn', 'anotherButtonId']; // Replace with actual IDs or fetch from database if needed
    //    buttonIds.forEach(buttonId => {
    //        const button = document.getElementById(buttonId);
    //        if (button) {
    //            const style = window.getComputedStyle(button);
    //            const backgroundImage = style.backgroundImage;

    //            // Check if the button has a background-image
    //            if (backgroundImage && backgroundImage.includes('images/')) {
    //                const oldImageUrl = backgroundImage.slice(5, -2); // Removes 'url("') and '")'
    //                const newImageUrl = `/images/${unitId}/${oldImageUrl.split('/').pop()}`;

    //                // Log the path change
    //                console.log(`Button with ID ${buttonId} - Old background-image: ${backgroundImage}`);
    //                console.log(`Button with ID ${buttonId} - New background-image: ${newImageUrl}`);

    //                // Update the background image with the new unit ID
    //                button.style.backgroundImage = `url('${newImageUrl}')`;
    //            } else {
    //                console.log(`No valid background-image found for button with ID: ${buttonId}`); // Log if no valid background image is found
    //            }
    //        } else {
    //            console.log(`No button found with ID: ${buttonId}`); // Log if no button is found
    //        }
    //    });
    //}





    //async function updateImageURLs(unitId) {
    //    // Fetch media items from your database or API to get dynamic class and image titles
    //    const mediaItems = await fetchMediaItemsFromDatabase(unitId);

    //    // Update image 'src' for regular image elements
    //    mediaItems.forEach(mediaItem => {
    //        const { className, imageTitle } = mediaItem;

    //        // Query for elements with the dynamic class
    //        const elements = document.querySelectorAll(`.${className}`);
    //        elements.forEach(element => {
    //            const oldSrc = element.src;
    //            const newSrc = `/images/${unitId}/${imageTitle}`;
    //            element.src = newSrc;
    //            console.log(`Updated image src from ${oldSrc} to ${newSrc}`);
    //        });
    //    });

    //    // Update background-image for buttons or other elements with background images
    //    const buttons = document.querySelectorAll('button');  // Refine selector if needed
    //    buttons.forEach(button => {
    //        const style = window.getComputedStyle(button);
    //        const backgroundImage = style.backgroundImage;

    //        // Check if the button has a background-image
    //        if (backgroundImage && backgroundImage.includes('images/')) {
    //            // Extract URL from background-image
    //            const oldImageUrl = backgroundImage.slice(5, -2); // Removes 'url("') and '")'
    //            const newImageUrl = `/images/${unitId}/${oldImageUrl.split('/').pop()}`;

    //            // Update the background image with the new unit ID
    //            button.style.backgroundImage = `url('${newImageUrl}')`;
    //            console.log(`Updated button background image from ${backgroundImage} to ${newImageUrl}`);
    //        }
    //    });
    //}


//async function updateImageURLs(unitId) {
//    // Fetch media items from your database or API to get dynamic class and image titles
//    const mediaItems = await fetchMediaItemsFromDatabase(unitId);
//    console.log('Fetched media items:', mediaItems);

//    // Update image 'src' for regular image elements
//    mediaItems.forEach(mediaItem => {
//        const { className, imageTitle } = mediaItem;
//        const elements = document.querySelectorAll(`.${className}`);
//        console.log(`Updating images for class: ${className}`);

//        elements.forEach(element => {
//            const oldSrc = element.src;
//            console.log(`Old image src: ${oldSrc}`);
//            const newSrc = `/images/${unitId}/${imageTitle}`;
//            console.log(`New image src: ${newSrc}`);
//            element.src = newSrc;
//        });
//    });
//}


    //async function fetchMediaItemsFromDatabase(unitId) {
    //    try {
    //        const url = `/api/Media/GetMediaByUnit?unitId=${unitId}`;
    //        console.log('Fetching media items from:', url); // Log the URL being requested
    //        const response = await fetch(url);
    //        if (response.ok) {
    //            const data = await response.json();
    //            console.log('Fetched media items:', data);
    //            return data;
    //        } else {
    //            console.error('Error fetching media items:', response.statusText);
    //            throw new Error('Failed to fetch media items');
    //        }
    //    } catch (error) {
    //        console.error('Fetch error:', error);
    //        return [];
    //    }
    //}




///13/9

async function duplicateUnit() {
    try {
        const response = await fetch('/api/EditElearning/duplicateUnit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Unit duplicated successfully:', result.unitId);

            // Now update the HTML with the new image URLs
            //await updateImageURLs(result.unitId);
            await updateImageUrls(result.unitId);


            // Redirect to Templates.html to fill the modal
            window.location.href = `Templates.html?unit_id=${result.unitId}&openModal=true`;

        }
        else {
            const error = await response.text();
            console.error('Error duplicating unit:', error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}




/// TRY APPROACH 2

//async function updatePagesContent(unitId) {
//    try {
//        // Fetch all pages for the unit
//        const response = await fetch(`/api/Page/GetPagesByUnit?unitId=${unitId}`);
//        if (!response.ok) {
//            throw new Error('Network response was not ok');
//        }

//        const pages = await response.json();
//        if (!Array.isArray(pages) || pages.length === 0) {
//            console.warn(`No pages found for unit ${unitId}`);
//            return;
//        }

//        for (const page of pages) {
//            // Inject the page content into the HTML
//            document.getElementById(`page-content-${page.Page_id}`).innerHTML = page.Page_Content;

//            // Update image URLs and attributes
//            await updateImageURLs(unitId);
//            await updateImageAttributes(unitId);
//        }

//        console.log('Pages content updated successfully');
//    } catch (error) {
//        console.error('Error updating pages content:', error);
//    }
//}

//async function fetchMediaItemsFromDatabase(unitId) {
//    console.log("unitid from fetch: " + unitId);
//    try {
//        const response = await fetch(`/api/Media/GetMediaByUnit?unitId=${unitId}`);
//        if (!response.ok) {
//            throw new Error('Network response was not ok');
//        }

//        const mediaItems = await response.json();
//        console.log('Fetched media items:', mediaItems);

//        if (!Array.isArray(mediaItems)) {
//            throw new Error('Expected an array of media items');
//        }

//        return mediaItems;
//    } catch (error) {
//        console.error('Error fetching media items:', error);
//        throw error;
//    }
//}



//async function updateImageURLs(unitId) {
//    try {
//        const mediaItems = await fetchMediaItemsFromDatabase(unitId);

//        if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
//            console.warn(`No media items to update for unit ${unitId}`);
//            return;
//        }

//        mediaItems.forEach(media => {
//            console.log(`Processing media item ID: ${media.media_id}`);
//            console.log(`ID from media item: ${media.class}`);
//            console.log(`Image URL: ${media.imageURL}`);

//            if (!media.class) {
//                console.warn(`Media item ${media.media_id} has an invalid or missing ID`);
//                return; // Skip if ID is invalid or missing
//            }

//            const elementId = media.class; // Use the ID directly
//            const element = document.getElementById(elementId);

//            if (!element) {
//                console.warn(`No element found with ID ${elementId}`);
//            } else {
//                console.log(`Updating element with ID ${elementId}`);
//                element.style.backgroundImage = `url(${media.imageURL})`;
//                element.style.backgroundSize = 'cover';
//                element.style.backgroundPosition = 'center';

//                console.log(`Updated background-image for element with ID ${elementId}:`, {
//                    'background-image': element.style.backgroundImage
//                });
//            }
//        });

//        console.log('Image URLs updated successfully for the duplicated unit');
//    } catch (error) {
//        console.error('Error updating image URLs:', error);
//    }
//}

//async function updateImageAttributes(unitId) {
//    try {
//        const mediaItems = await fetchMediaItemsFromDatabase(unitId);

//        if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
//            console.warn(`No media items found for unit ${unitId}`);
//            return;
//        }

//        mediaItems.forEach(item => {
//            console.log(`Processing media item ID: ${item.media_id}`);
//            console.log(`ID from media item: ${item.class}`);
//            console.log(`Image URL: ${item.imageURL}`);
//            console.log(`Alt text: ${item.imageAlt}`);
//            console.log(`Title: ${item.imageTitle}`);

//            if (!item.class) {
//                console.warn(`Media item ${item.media_id} has an invalid or missing ID`);
//                return; // Skip if ID is invalid or missing
//            }

//            const elementId = item.class; // Use the ID directly
//            const element = document.getElementById(elementId);

//            if (!element) {
//                console.warn(`No element found with ID ${elementId}`);
//            } else {
//                console.log(`Updating element with ID ${elementId}`);
//                element.setAttribute('alt', item.imageAlt || '');
//                element.setAttribute('title', item.imageTitle || '');
//                element.setAttribute('src', item.imageURL || '');

//                console.log(`Updated attributes for element with ID ${elementId}:`, {
//                    'alt': item.imageAlt,
//                    'title': item.imageTitle,
//                    'src': item.imageURL
//                });
//            }
//        });

//        console.log('Image attributes updated successfully.');
//    } catch (error) {
//        console.error('Error updating image attributes:', error);
//    }
//}

//async function getPageUrlsForUnit(unitId) {
//    try {
//        const response = await fetch(`/api/Platform/GetPagesByUnit?unitId=${unitId}`);

//        if (!response.ok) {
//            throw new Error('Network response was not ok');
//        }

//        const pageUrls = await response.json();
//        return pageUrls;
//    } catch (error) {
//        console.error('Error fetching page URLs:', error);
//        throw error;
//    }
//}

//async function fetchPageHtml(url) {
//    try {
//        const response = await fetch(url);
//        if (!response.ok) {
//            throw new Error('Network response was not ok');
//        }

//        const html = await response.text();
//        return html;
//    } catch (error) {
//        console.error('Error fetching page HTML:', error);
//        throw error;
//    }
//}


//////TRY APPROACH 1

async function updateImageUrls(unitId) {
    try {
        console.log(`Fetching media items for unit ID: ${unitId}`);

        // Fetch media items by unit ID
        const response = await fetch(`/api/Platform/GetMediaByUnit?unitId=${unitId}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const media = await response.json();
        console.log(`Fetched media items:`, media);

        if (!Array.isArray(media) || media.length === 0) {
            console.warn(`No media found for unit ${unitId}`);
            return;
        }

        // Iterate over media items and update the corresponding buttons
        media.forEach(mediaItem => {
            const buttonId = mediaItem.ImageTitle; // Assuming ImageTitle is used as button ID
            const imageUrl = mediaItem.ImageURL; // The new image URL to be set

            // Find button by its ID
            const button = document.getElementById(buttonId);
            if (button) {
                // Update the background image style
                const updatedStyle = `url('images/${unitId}/${imageUrl}')`;
                console.log(`Updating background-image style for button ID ${buttonId}: ${updatedStyle}`);
                button.style.backgroundImage = updatedStyle;
            } else {
                console.warn(`Button with ID ${buttonId} not found.`);
            }
        });

        console.log('Image URLs updated successfully.');
    } catch (error) {
        console.error('Error updating image URLs:', error);
    }
}







async function updateHtmlContent(unitId) {
    try {
        // Fetch all pages for the unit
        const response = await fetch(`/api/Platform/GetPagesByUnitId?unitId=${unitId}`);
        if (!response.ok) throw new Error(`Failed to fetch pages: ${response.statusText}`);

        const pages = await response.json();
        if (!Array.isArray(pages) || pages.length === 0) {
            console.warn(`No pages found for unit ${unitId}`);
            return;
        }

        // Loop through all pages
        for (const page of pages) {
            let updatedContent = page.Page_Content;

            // Replace the placeholder with the actual unit ID
            updatedContent = updatedContent.replace(/images\/unitIdVar\/([^'"]+)/g, `images/${unitId}/$1`);

            // Update the HTML content in the database
            await updatePageContentInDatabase(page.Page_id, updatedContent);

            console.log(`Updated HTML content for page ${page.Page_id}`);
        }

        console.log('HTML content updated successfully for the duplicated unit');
    } catch (error) {
        console.error('Error updating HTML content:', error.message);
    }
}

async function updatePageContentInDatabase(pageId, updatedContent) {
    try {
        const response = await fetch(`/api/Platform/UpdatePageContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pageId, Page_Content: updatedContent })
        });
        if (!response.ok) throw new Error(`Failed to update page content: ${response.statusText}`);

        console.log(`Page content updated for page ID ${pageId}`);
    } catch (error) {
        console.error('Error updating page content in the database:', error.message);
    }
}




////








    async function getAllUnitPages() {
        // Check if the current URL contains 'PagesOfUnit.html'
        if (!window.location.href.includes('PagesOfUnit.html')) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const unitId = urlParams.get('unit_id');

        if (!unitId) {
            console.error('Unit ID not found in URL');
            return;
        }
        localStorage.setItem('currentUnitId', unitId);
        console.log('currentUnitId', unitId);

        try {
            const response = await fetch(`/api/EditElearning/UnitID?myUnit=${unitId}`);
            console.log('API Response Status:', response.status); // Log the response status
            if (!response.ok) {
                throw new Error(`Failed to fetch unit pages (${response.status})`);
            }
            const pages = await response.json();
            // displayUnitPages(pages);
            displayUnitPages(pages, unitId);


        } catch (error) {
            console.error('Error fetching unit pages:', error);
        }
    }




    function displayUnitPages(pages, unitId) {
        const container = document.getElementById('UnitAllpagesContainer');
        container.innerHTML = ''; // Clear existing content

        if (!pages || pages.length === 0) {
            container.innerHTML = '<p>No pages found for this unit.</p>';
            return;
        }

        pages.forEach(page => {
            const card = createCard(page, unitId);
            container.appendChild(card);
        });
    }


    function createCard(page, unitId) {
        const col = document.createElement('div');
        col.classList.add('col-md-3', 'mb-4'); // 4 cards in a row

        const card = document.createElement('div');
        card.classList.add('card', 'text-center');
        card.style.cursor = 'pointer';
        // Page name section in the body of the card
        const bodyContainer = document.createElement('div');
        bodyContainer.classList.add('card-body', 'd-flex', 'justify-content-center', 'align-items-center');

        const pageTitle = document.createElement('h1');
        pageTitle.classList.add('card-title');
        pageTitle.textContent = page.page_Title; // Set the page title in the body
        bodyContainer.appendChild(pageTitle);
        card.appendChild(bodyContainer);

        // Add click event listener to the card
        card.addEventListener('click', function () {
            console.log("The page ID from click: " + page.page_id);
            window.location.href = `editPage.html?pageid=${page.page_id}&unit_id=${unitId}`;
        });

        col.appendChild(card);
        return col;
    }


    document.addEventListener('DOMContentLoaded', () => {
        getAllUnitPages();
    });




    document.addEventListener('DOMContentLoaded', function () {
        if (window.location.href.includes('PagesOfUnit.html')) {
            const settingsButton = document.getElementById('settingsButton');
            if (settingsButton) {
                const unitId = getUnitIdFromUrl();
                console.log("the unit:" + unitId);
                settingsButton.addEventListener('click', function () {
                    fetchUnitSettingsBTN(unitId);
                });
            } else {
                console.error('Settings button not found.'); // Error handling if the button isn't found
            }
        }
    });




    document.addEventListener('DOMContentLoaded', function () {
        // Ensure this script runs only on the specified page
        if (!window.location.pathname.includes('Templates.html')) {
            return;  // Exit if not on the specified page
        }

        const urlParams = new URLSearchParams(window.location.search);
        const unitId = urlParams.get('unit_id');
        const openModal = urlParams.get('openModal');

        // Automatically open the modal if the `openModal` query parameter is set to true
        if (unitId && openModal === 'true') {
            fetchUnitSettingsBTN(unitId);  // Automatically fetch and display the settings modal
        }

        if (window.location.pathname.includes('PagesOfUnit.html')) {
            // Setup event listener for the settings button to manually open the modal
            const settingsButton = document.getElementById('settingsButton');
            if (settingsButton) {
                settingsButton.addEventListener('click', function () {
                    fetchUnitSettingsBTN(unitId);
                });
            } else {
                console.error('Settings button not found.');
            }
        }

    });

    // Function to fetch unit settings and open the modal
    async function fetchUnitSettingsBTN(unitId) {
        if (unitId === 1) {
            console.log("Editing is disabled for unit 1.");
            alert("אין אפשרות לערוך את יחידת המקור"); // Display an alert message
            return; // Exit the function if the unitId is 1
        }


        try {

            const response = await fetch(`/api/Platform/GetUnitSettings?unitid=${unitId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch unit settings: ' + response.statusText);
            }
            const unitData = await response.json();
            if (unitData.length > 0) {
                // Populate the modal fields with fetched data
                document.getElementById('inputTitle').value = unitData[0].unit_name;
                document.getElementById('inputDescription').value = unitData[0].unit_Description;
                document.getElementById('selectStatus').value = unitData[0].category_name;
                // document.getElementById('checkActive').checked = unitData[0].is_Published === 'Yes';

                // Display the modal
                var settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
                settingsModal.show();

                // Attach event listener to the save changes button
                const saveChangesButton = document.getElementById('saveChangesButton');
                saveChangesButton.onclick = function () {
                    saveChangesOfSettings(unitId, settingsModal);
                };
            } else {
                console.log('No unit settings found for the specified unit ID.');
            }
        } catch (error) {
            console.error('Error fetching unit settings:', error);
        }
    }

    // Function to save changes to unit settings and redirect after saving
    async function saveChangesOfSettings(unitId, modalInstance) {

        if (unitId === 1) {
            console.log("Editing is disabled for unit 1.");
            alert("אין אפשרות לערוך את יחידת המקור"); // Display an alert message

            return; // Exit the function if the unitId is 1
        }


        try {

            const unitName = document.getElementById('inputTitle').value;
            const unitDescription = document.getElementById('inputDescription').value;
            const categoryName = document.getElementById('selectStatus').value;
            // const isPublished = document.getElementById('checkActive').checked;

            const url = '/api/Platform/UpdateUnit';
            const requestData = {
                unit_id: unitId,
                unit_name: unitName,
                Unit_Description: unitDescription,
                category_name: categoryName,
                //is_Published: isPublished
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                let errorMessage = 'Failed to update unit settings.';
                if (response.status === 400) {
                    errorMessage += ' Bad Request: Please check the data you entered.';
                } else {
                    errorMessage += ` ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const updatedUnit = await response.json();
            console.log('Page updated successfully', updatedUnit);

            // Display a success message
            const successMessage = document.querySelector('.unit-success-message');
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
                modalInstance.hide();

                // Redirect to PagesOfUnit.html only if not already there
                if (!window.location.href.includes('PagesOfUnit.html')) {
                    window.location.href = `PagesOfUnit.html?unit_id=${unitId}`;
                }
            }, 500);  // Set a shorter timeout for faster redirection

        } catch (error) {
            console.error('Error updating unit settings:', error);
            const errorMessage = document.querySelector('.unit-error-message');
            if (errorMessage) {
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 2500);
            }
        }
    }






    //////// MEDIA

    /// FOR ALL


    let currentPageId = null; // Global variable to store the current pageId



    // Load both media and audio items on page load
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.pathname.includes('MediaPage.html')) {
            loadMediaItems();
            loadAudioItems();
        }



    });



    function reloadPage() {
        location.reload();
    }


    async function getPageIdByHtmlName(unitId, htmlName) {
        try {
            const response = await fetch(`/api/EditElearning/GetPageIdByHtmlName?unitId=${unitId}&htmlName=${htmlName}`);
            if (response.ok) {
                const pageId = await response.json();
                console.log(`Fetched Page ID: ${pageId} for HTML Name: ${htmlName}`);
                return pageId;
            } else {
                console.error(`Failed to fetch page ID. Status: ${response.status}, StatusText: ${response.statusText}`);
                return null;
            }
        } catch (error) {
            console.error('Error fetching page ID:', error);
            return null;
        }
    }

    function getCurrentUnitIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const unitId = urlParams.get('unit_id');
        console.log(`Extracted Unit ID from URL: ${unitId}`);
        return unitId;
    }

    function getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        console.log(`Current page name: ${page}`);
        return page;
    }

    async function navigateDynamicLink(event, htmlName) {
        event.preventDefault(); // Prevent the default navigation
        const unitId = getCurrentUnitIdFromUrl();
        const currentPageName = getCurrentPageName();
        console.log(`Clicked link for HTML Name: ${htmlName}, Unit ID: ${unitId}`);

        const pageId = await getPageIdByHtmlName(unitId, htmlName);
        if (pageId) {
            const newUrl = `${currentPageName}?pageid=${pageId}&unit_id=${unitId}`;
            console.log(`Navigating to New URL: ${newUrl}`);
            window.location.href = newUrl; // Navigate to the new URL
        } else {
            console.error('Page ID not found.');
        }
    }





    //// IMAGES

    function createMediaItem(media) {
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4');

        const card = document.createElement('div');
        card.classList.add('card', 'text-center');

        // Title section at the top of the card
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('card-header', 'text-center');

        const title = document.createElement('h5');
        title.classList.add('card-title', 'text-muted', 'mb-2');
        title.textContent = media.imageTitle; // Set title text content
        titleContainer.appendChild(title);
        card.appendChild(titleContainer);

        // Image section with click event to open modal
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('card-body', 'text-center');

        const img = document.createElement('img');
        img.src = media.imageURL;
        img.alt = media.imageAlt;
        img.classList.add('card-img-top', 'img-fluid', 'center-img', 'clickable');
        img.setAttribute('data-bs-toggle', 'modal');
        img.setAttribute('data-bs-target', '#editMediaModal');
        img.dataset.pageId = media.page_id;
        img.dataset.unitId = media.unit_id;
        img.dataset.mediaId = media.media_id;
        img.dataset.imageTitle = media.imageTitle;
        img.dataset.imageAlt = media.imageAlt;
        img.dataset.imageURL = media.imageURL;

        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        col.appendChild(card);

        return col;
    }

    function loadMediaItems() {
        const unitId = getCurrentUnitIdFromUrl(); // Ensure unitId is fetched
        fetch(`https://localhost:7036/api/Media/GetMediaByUnit/${unitId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayMediaItems(data);
            })
            .catch(error => {
                console.error('Error fetching media:', error);
            });
    }

    function displayMediaItems(mediaItems) {
        const mediaContainer = document.getElementById('mediaContainer');
        mediaContainer.innerHTML = '';
        mediaItems.forEach(media => {
            const mediaItem = createMediaItem(media);
            mediaContainer.appendChild(mediaItem);

            // Add click event listener to open modal for each media item
            mediaItem.querySelector('img').addEventListener('click', function () {
                currentPageId = media.page_id; // Store the current pageId
                console.log("send:" + media.page_id);

                // Populate modal fields with current media details
                //document.getElementById('unitId').value = media.unit_id;


                //NEED TO CHECK IF THE VIEW PAGE GET THE IMAGE FROM THE DB OR FROM THE CSS

                document.getElementById('mediaId').value = media.media_id;
                document.getElementById('imageTitle').value = media.imageTitle;
                document.getElementById('imageURL').textContent = media.imageURL;
                document.getElementById('imageAlt').value = media.imageAlt;

                // Show modal with the data
                const modal = new bootstrap.Modal(document.getElementById('editMediaModal'));
                modal.show();
            });
        });
    }


    //async function saveMedia() {
    //    const form = document.getElementById('editMediaForm');
    //    const formData = new FormData(form);
    //    const mediaId = formData.get('mediaId');
    //    const imageTitle = formData.get('imageTitle');
    //    const imageAlt = formData.get('imageAlt');
    //    const imageFile = document.getElementById('imageFile') ? document.getElementById('imageFile').files[0] : null;

    //    const unitId = getCurrentUnitIdFromUrl(); // Ensure this function works as expected
    //    const pageId = currentPageId; // Ensure this is set globally

    //    // Ensure the form fields are correctly populated
    //    if (!imageTitle || !imageAlt) {
    //        alert("Please fill in all the required fields.");
    //        return;
    //    }

    //    const mediaDetails = {
    //        Unit_id: unitId,
    //        Media_id: mediaId,
    //        Page_id: pageId,
    //        ImageTitle: imageTitle,
    //        ImageAlt: imageAlt,
    //        ImageURL: document.getElementById('imageURL') ? document.getElementById('imageURL').textContent : ''
    //    };

    //    try {
    //        // Step 1: Update the media details first
    //        const updateDetailsResponse = await fetch(`/api/Media/updateMediaDetails`, {
    //            method: 'POST',
    //            headers: {
    //                'Content-Type': 'application/json'
    //            },
    //            body: JSON.stringify(mediaDetails)
    //        });

    //        if (!updateDetailsResponse.ok) {
    //            const errorText = await updateDetailsResponse.text();
    //            throw new Error(`Failed to update media details: ${errorText}`);
    //        }

    //        console.log('Media details updated successfully');

    //        // Step 2: Replace the image if a new one is uploaded
    //        if (imageFile) {
    //            const requestData = new FormData();
    //            requestData.append('imageFile', imageFile);

    //            const replaceImageResponse = await fetch(`/api/Media/replaceimage/${mediaId}`, {
    //                method: 'POST',
    //                body: requestData
    //            });

    //            if (!replaceImageResponse.ok) {
    //                const errorText = await replaceImageResponse.text();
    //                throw new Error(`Failed to replace image: ${errorText}`);
    //            }

    //            console.log('Image replaced successfully');
    //        }

    //        // Step 3: Fetch the page content by pageId
    //        const page = await getPageById(pageId);
    //        if (!page || !page.pageContent) {
    //            throw new Error('Page not found or page content is null');
    //        }

    //        // Step 4: Parse the HTML content
    //        const parser = new DOMParser();
    //        const doc = parser.parseFromString(page.pageContent, 'text/html');

    //        // Step 5: Update the image attributes in the DOM
    //        const imageElements = doc.getElementsByClassName('chooseBtn');
    //        for (const imageElement of imageElements) {
    //            // Assuming you want to update the first element with the class 'chooseBtn'
    //            imageElement.src = mediaDetails.ImageURL;
    //            imageElement.alt = mediaDetails.ImageAlt;
    //            imageElement.setAttribute('aria-label', mediaDetails.ImageAlt);
    //        }

    //        // Step 6: Serialize the updated DOM back to a string
    //        const updatedPageContent = doc.documentElement.outerHTML;

    //        // Step 7: Save the updated content back to the database
    //        const updatePageResponse = await fetch('/api/EditElearning/UpdatePage', {
    //            method: 'POST',
    //            headers: {
    //                'Content-Type': 'application/json'
    //            },
    //            body: JSON.stringify({
    //                Page_id: pageId,
    //                Page_Content: updatedPageContent,
    //                Update_Date: new Date().toISOString()
    //            })
    //        });

    //        if (!updatePageResponse.ok) {
    //            const errorText = await updatePageResponse.text();
    //            throw new Error(`Failed to update page content: ${errorText}`);
    //        }

    //        console.log('Page content updated successfully');

    //        // Show success message
    //        document.querySelector('.unit-success-message').style.display = 'block';
    //        document.querySelector('.unit-error-message').style.display = 'none';

    //        // Close the modal after a delay
    //        setTimeout(() => {
    //            const modalElement = document.getElementById('editMediaModal');
    //            const modal = bootstrap.Modal.getInstance(modalElement);
    //            if (modal) {
    //                modal.hide();
    //            } else {
    //                const newModal = new bootstrap.Modal(modalElement);
    //                newModal.hide();
    //            }

    //            // Remove modal backdrop
    //            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

    //            // Reset the form
    //            form.reset();
    //            // Optional: location.reload(); // Consider whether this is needed
    //        }, 2000);
    //    } catch (error) {
    //        console.error('Error saving media:', error);

    //        // Show error message
    //        document.querySelector('.unit-success-message').style.display = 'none';
    //        document.querySelector('.unit-error-message').style.display = 'block';

    //        // Hide error message after a delay
    //        setTimeout(() => {
    //            document.querySelector('.unit-error-message').style.display = 'none';
    //        }, 5000);
    //    }
    //}



    //async function saveMedia() {
    //    const form = document.getElementById('editMediaForm');
    //    const formData = new FormData(form);
    //    const mediaId = formData.get('mediaId');
    //    const imageTitle = formData.get('imageTitle');
    //    const imageAlt = formData.get('imageAlt');
    //    const imageFile = document.getElementById('imageFile') ? document.getElementById('imageFile').files[0] : null;

    //    const unitId = getCurrentUnitIdFromUrl(); // Ensure this function works as expected
    //    const pageId = currentPageId; // Ensure this is set globally

    //    // Ensure the form fields are correctly populated
    //    if (!imageTitle || !imageAlt) {
    //        alert("Please fill in all the required fields.");
    //        return;
    //    }

    //    // Get the class name from the database or the clicked card
    //    const imageClass = formData.get('Class'); // Ensure this field is set appropriately

    //    const mediaDetails = {
    //        Unit_id: unitId,
    //        Media_id: mediaId,
    //        Page_id: pageId,
    //        ImageTitle: imageTitle,
    //        ImageAlt: imageAlt,
    //        ImageURL: document.getElementById('imageURL') ? document.getElementById('imageURL').textContent : '',
    //        imageClass: imageClass 
    //    };

    //    try {
    //        // Step 1: Update the media details first
    //        const updateDetailsResponse = await fetch(`/api/Media/updateMediaDetails`, {
    //            method: 'POST',
    //            headers: {
    //                'Content-Type': 'application/json'
    //            },
    //            body: JSON.stringify(mediaDetails)
    //        });

    //        if (!updateDetailsResponse.ok) {
    //            const errorText = await updateDetailsResponse.text();
    //            throw new Error(`Failed to update media details: ${errorText}`);
    //        }

    //        console.log('Media details updated successfully');

    //        // Step 2: Replace the image if a new one is uploaded
    //        if (imageFile) {
    //            const requestData = new FormData();
    //            requestData.append('imageFile', imageFile);

    //            const replaceImageResponse = await fetch(`/api/Media/replaceimage/${mediaId}`, {
    //                method: 'POST',
    //                body: requestData
    //            });

    //            if (!replaceImageResponse.ok) {
    //                const errorText = await replaceImageResponse.text();
    //                throw new Error(`Failed to replace image: ${errorText}`);
    //            }

    //            console.log('Image replaced successfully');
    //        }

    //        // Step 3: Fetch the page content by pageId
    //        const page = await getPageById(pageId);
    //        if (!page || !page.pageContent) {
    //            throw new Error('Page not found or page content is null');
    //        }

    //        // Step 4: Parse the HTML content
    //        const parser = new DOMParser();
    //        const doc = parser.parseFromString(page.pageContent, 'text/html');

    //        // Step 5: Update the image attributes in the DOM based on the dynamic class
    //        const imageElements = doc.getElementsByClassName(imageClass);
    //        for (const imageElement of imageElements) {
    //            imageElement.src = mediaDetails.ImageURL;
    //            imageElement.alt = mediaDetails.ImageAlt;
    //            imageElement.setAttribute('aria-label', mediaDetails.ImageAlt);
    //        }

    //        // Step 6: Serialize the updated DOM back to a string
    //        const updatedPageContent = doc.documentElement.outerHTML;

    //        // Step 7: Save the updated content back to the database
    //        const updatePageResponse = await fetch('/api/EditElearning/UpdatePage', {
    //            method: 'POST',
    //            headers: {
    //                'Content-Type': 'application/json'
    //            },
    //            body: JSON.stringify({
    //                Page_id: pageId,
    //                Page_Content: updatedPageContent,
    //                Update_Date: new Date().toISOString()
    //            })
    //        });

    //        if (!updatePageResponse.ok) {
    //            const errorText = await updatePageResponse.text();
    //            throw new Error(`Failed to update page content: ${errorText}`);
    //        }

    //        console.log('Page content updated successfully');

    //        // Show success message
    //        document.querySelector('.unit-success-message').style.display = 'block';
    //        document.querySelector('.unit-error-message').style.display = 'none';

    //        // Close the modal after a delay
    //        setTimeout(() => {
    //            const modalElement = document.getElementById('editMediaModal');
    //            const modal = bootstrap.Modal.getInstance(modalElement);
    //            if (modal) {
    //                modal.hide();
    //            } else {
    //                const newModal = new bootstrap.Modal(modalElement);
    //                newModal.hide();
    //            }

    //            // Remove modal backdrop
    //            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

    //            // Reset the form
    //            form.reset();
    //            // Optional: location.reload(); // Consider whether this is needed
    //        }, 2000);
    //    } catch (error) {
    //        console.error('Error saving media:', error);

    //        // Show error message
    //        document.querySelector('.unit-success-message').style.display = 'none';
    //        document.querySelector('.unit-error-message').style.display = 'block';

    //        // Hide error message after a delay
    //        setTimeout(() => {
    //            document.querySelector('.unit-error-message').style.display = 'none';
    //        }, 5000);
    //    }
    //}







    async function saveMedia() {
        const form = document.getElementById('editMediaForm');
        const formData = new FormData(form);
        const mediaId = formData.get('mediaId');
        const imageTitle = formData.get('imageTitle');
        const imageAlt = formData.get('imageAlt');
        const imageFile = document.getElementById('imageFile') ? document.getElementById('imageFile').files[0] : null;
        const imageClass = formData.get('Class'); // Retrieve the Class field from the form data

        const unitId = getCurrentUnitIdFromUrl(); // Ensure this function works as expected
        const pageId = currentPageId; // Ensure this is set globally

        // Ensure the form fields are correctly populated
        if (!imageTitle || !imageAlt) {
            alert("Please fill in all the required fields.");
            return;
        }

        const mediaDetails = {
            Unit_id: unitId,
            Media_id: mediaId,
            Page_id: pageId,
            ImageTitle: imageTitle,
            ImageAlt: imageAlt,
            ImageURL: document.getElementById('imageURL') ? document.getElementById('imageURL').textContent : '',
            Class: imageClass // Include the class name
        };

        try {
            // Step 1: Update the media details first
            const updateDetailsResponse = await fetch(`/api/Media/updateMediaDetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mediaDetails)
            });

            if (!updateDetailsResponse.ok) {
                const errorText = await updateDetailsResponse.text();
                throw new Error(`Failed to update media details: ${errorText}`);
            }

            console.log('Media details updated successfully');

            // Step 2: Replace the image if a new one is uploaded
            if (imageFile) {
                const requestData = new FormData();
                requestData.append('imageFile', imageFile);

                const replaceImageResponse = await fetch(`/api/Media/replaceimage/${mediaId}`, {
                    method: 'POST',
                    body: requestData
                });

                if (!replaceImageResponse.ok) {
                    const errorText = await replaceImageResponse.text();
                    throw new Error(`Failed to replace image: ${errorText}`);
                }

                console.log('Image replaced successfully');
            }

            // Step 3: Fetch the page content by pageId
            const page = await getPageById(pageId);
            if (!page || !page.pageContent) {
                throw new Error('Page not found or page content is null');
            }

            // Step 4: Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(page.pageContent, 'text/html');

            // Step 5: Update the image attributes in the DOM based on the dynamic class
            const imageElements = doc.getElementsByClassName(imageClass);
            for (const imageElement of imageElements) {
                imageElement.src = mediaDetails.ImageURL;
                imageElement.alt = mediaDetails.ImageAlt;
                imageElement.setAttribute('aria-label', mediaDetails.ImageAlt);
            }

            // Step 6: Serialize the updated DOM back to a string
            const updatedPageContent = doc.documentElement.outerHTML;

            // Step 7: Save the updated content back to the database
            const updatePageResponse = await fetch('/api/EditElearning/UpdatePage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Page_id: pageId,
                    Page_Content: updatedPageContent,
                    Update_Date: new Date().toISOString()
                })
            });

            if (!updatePageResponse.ok) {
                const errorText = await updatePageResponse.text();
                throw new Error(`Failed to update page content: ${errorText}`);
            }

            console.log('Page content updated successfully');

            // Show success message
            document.querySelector('.unit-success-message').style.display = 'block';
            document.querySelector('.unit-error-message').style.display = 'none';

            // Close the modal after a delay
            setTimeout(() => {
                const modalElement = document.getElementById('editMediaModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                } else {
                    const newModal = new bootstrap.Modal(modalElement);
                    newModal.hide();
                }

                // Remove modal backdrop
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

                // Reset the form
                form.reset();
                // Optional: location.reload(); // Consider whether this is needed
            }, 2000);
        } catch (error) {
            console.error('Error saving media:', error);

            // Show error message
            document.querySelector('.unit-success-message').style.display = 'none';
            document.querySelector('.unit-error-message').style.display = 'block';

            // Hide error message after a delay
            setTimeout(() => {
                document.querySelector('.unit-error-message').style.display = 'none';
            }, 5000);
        }
    }








    // AUDIO

    ///check audio controller

    function loadAudioItems() {
        fetch('https://localhost:7036/api/Media/GetAudio')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // console.log('Audio data:', data); // Log the data being fetched
                displayAudioItems(data);
            })
            .catch(error => {
                console.error('Error fetching audio:', error);
            });
    }

    // Modified displayAudioItems function
    function displayAudioItems(audioItems) {
        const audioContainer = document.getElementById('audContainer');
        audioContainer.innerHTML = '';

        audioItems.forEach(audio => {
            //  console.log('Creating audio item for:', audio); // Log each audio item
            const audioItem = createAudioItem(audio); // Create the audio item element
            audioContainer.appendChild(audioItem);
        });

        // Add event listener for clicks on audio items
        audioContainer.addEventListener('click', function (event) {
            const audioItem = event.target.closest('.audio-card');
            if (audioItem) {
                const mediaId = audioItem.dataset.mediaId;
                const audioTitle = audioItem.dataset.audioTitle;
                const audioURL = audioItem.dataset.audioURL;
                const audio = audioItems.find(item => item.audioURL === audioURL);
                if (audio) {
                    console.log('Audio item clicked:', audio); // Log the audio item click

                    // Populate modal fields with current audio details
                    document.getElementById('mediaId').value = mediaId;
                    document.getElementById('audioTitle').textContent = audioTitle;
                    document.getElementById('audioURL').textContent = audioURL;

                    // Show modal with the data
                    const modal = new bootstrap.Modal(document.getElementById('editAudioModal'));
                    modal.show();
                }
            }
        });
    }



    function createAudioItem(audio) {
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4', 'audio-item', 'clickable'); // Add 'audio-item' class

        const card = document.createElement('div');
        card.classList.add('card', 'audio-card'); // Add 'audio-card' class
        card.dataset.mediaId = audio.mediaId;
        card.dataset.audioTitle = audio.audioTitle;
        card.dataset.audioURL = audio.audioURL; // Store audioURL in dataset for use in modal

        // Title section at the top of the card
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('card-header', 'text-center');

        const title = document.createElement('h1');
        title.classList.add('card-title', 'text-muted', 'mb-2');
        title.textContent = audio.audioTitle; // Set title text content
        titleContainer.appendChild(title);
        card.appendChild(titleContainer);

        // Audio section
        const audioContainer = document.createElement('div');
        audioContainer.classList.add('card-body', 'text-center');

        const audioElem = document.createElement('audio');
        audioElem.src = audio.audioURL;
        audioElem.controls = true;
        audioElem.classList.add('card-audio-top', 'audio-fluid', 'center-audio');

        audioContainer.appendChild(audioElem);
        card.appendChild(audioContainer);

        col.appendChild(card);

        return col;
    }



    // Function to handle save button click in the Edit Audio modal
    function saveAudio() {
        const audioFile = document.getElementById('audioFile').files[0];

        if (!audioFile) {
            return; // No audio file selected, do nothing
        }

        const formData = new FormData();
        formData.append('audioFile', audioFile);

        fetch('https://localhost:7036/api/Media/ReplaceAudio', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                //

            })
            .then(data => {
                // Handle success
                document.querySelector('#editAudioModal .unit-success-message').style.display = 'block';
                location.reload();

                document.querySelector('#editAudioModal .unit-error-message').style.display = 'none';
                loadAudioItems(); // Reload the audio items to reflect the update
            })
            .catch(error => {
                console.error('Error saving audio file:', error);
                // Handle error
                document.querySelector('#editAudioModal .unit-success-message').style.display = 'none';
                document.querySelector('#editAudioModal .unit-error-message').style.display = 'block';
            });
    }


    //// Function to fetch media items by unitId
    //async function fetchMediaItemsByUnit(unitId) {
    //    try {
    //        const response = await fetch(`/api/Media/GetMediaByUnit/${unitId}`);
    //        const mediaItems = await response.json();

    //        mediaItems.forEach(media => {
    //            // Find the button or element by class or other attributes
    //            const button = document.querySelector(`.${media.Class}`);

    //            if (button) {
    //                // Set the background image dynamically
    //                button.style.backgroundImage = `url(${media.ImageURL})`;
    //            }
    //        });
    //    } catch (error) {
    //        console.error('Error fetching media items:', error);
    //    }
    //}

    //// Call this function on page load or when needed
    //document.addEventListener('DOMContentLoaded', () => {
    //    const unitId = getCurrentUnitId(); // Your logic to get the current unit ID
    //    fetchMediaItemsByUnit(unitId);
    //});


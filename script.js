const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

// Scroll To Top, Remove Loader, Show Content
function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');
  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
}

function createDOMNodes(page) {
  // Load ResultsArray or Favorites
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement('div');
    
    card.classList.add('card');
    // Link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    // Image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');

    const video = document.createElement('video');
    video.src = result.url;
    video.alt = 'NASA Video of the Day';
    video.loading = 'lazy';
    video.classList.add('card-img-top');
    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    // Save Text & icon
    const addFavoriteGroup = document.createElement('div');    
    addFavoriteGroup.classList.add('fav-container');
    const saveText = document.createElement('p');

    const myFavIconOff = document.createElement('img');
    myFavIconOff.classList.add('my-favicon-img');
    myFavIconOff.setAttribute("id", result.url + '_off');
    myFavIconOff.src = 'starOff.png';

    const myFavIconOn = document.createElement('img');
    myFavIconOn.classList.add('my-favicon-img');
    myFavIconOn.setAttribute("id", result.url + '_on');    
    myFavIconOn.src = 'starOn.png';

    

    //Belongs to favorites?
    if(isInFavorites(result.url)){
      myFavIconOff.classList.add('hidden');
      myFavIconOn.classList.remove('hidden');
    } else{
      myFavIconOn.classList.add('hidden');
      myFavIconOff.classList.remove('hidden');

    }
   

    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.textContent = 'Add To Favorites';
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favorite';
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    // Date
    const date = document.createElement('strong');
    date.textContent = result.date;
    // Copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    addFavoriteGroup.append(saveText, myFavIconOn, myFavIconOff );
    cardBody.append(cardTitle, addFavoriteGroup, cardText, footer);
    (result.url.includes('youtube')) ? link.appendChild(video) : link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // Get Favorites from localStorage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  // Reset DOM, Create DOM Nodes, Show Content
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
}


// Get 10 images from NASA API
async function getNasaPictures() {
  // Show Loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM('results');
  } catch (error) {
    // Catch Error Here
  }
}


//Check if item is favorite
function isInFavorites(itemUrl){
  return favorites[itemUrl]?true:false;

}

// Add result to Favorites
function saveFavorite(itemUrl) {
 
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      console.log(`${itemUrl}_on`);
      document.getElementById(`${itemUrl}_on`).classList.remove('hidden');
      document.getElementById(`${itemUrl}_off`).classList.add('hidden');

      favorites[itemUrl] = item;
      // Show Save Confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favorites in localStorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  });
}

// Remove item from Favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Set Favorites in localStorage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

// On Load
getNasaPictures();

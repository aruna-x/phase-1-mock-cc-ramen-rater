// IMPROVEMENTS:
// 1 --> Refactor! It's bloated.
// 2 --> prevent that page reload when db is updated, and then uncomment the code that
//       was commented out that allows us to dynamically change the current session.

// write your code here
const ramenMenu = document.getElementById('ramen-menu');
let menuInfo;
let numMenuItems;

fetch('http://localhost:3000/ramens')
    .then(r => r.json())
    .then(renderMenu)
    .catch(e => {console.log(e)});

function renderMenu(menu) {
    console.log(menu);
    // This is for use later when we want to delete items
    menuInfo = [...menu];

    // autopopulate the featured ramen with the first item
    showDetails(menu[0]);

    menu.forEach(renderRamen);
    numMenuItems = menu.length;
}

function renderRamen(ramen) {
    let img = document.createElement('img');
    img.src = ramen.image;
    img.addEventListener('click', () => showDetails(ramen));
    console.log(ramenMenu);

    ramenMenu.appendChild(img);
}

function showDetails(ramen) {
    const detailImage = document.querySelector('.detail-image');
    detailImage.src = ramen.image;
    detailImage.alt = ramen.name;

    const name = document.querySelector('.name');
    name.textContent = ramen.name;

    const restaurant = document.querySelector('.restaurant');
    restaurant.textContent = ramen.restaurant;

    const rating = document.getElementById('rating-display');
    rating.textContent = ramen.rating;

    const comment = document.getElementById('comment-display');
    comment.textContent = ramen.comment;
}

console.log(document.getElementsByClassName('submit')[0]);

document.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;
    const input = form.querySelector('.submit');
    const value = input.value;

    if (value === "Create") {

        const newName = document.getElementById('new-name').value;
        const newRestaurant = document.getElementById('new-restaurant').value;
        const newImage = document.getElementById('new-image').value;
        const newRating = document.getElementById('new-rating').value;
        const newComment = document.getElementById('new-comment').value;
        numMenuItems += 1;
        const newId = numMenuItems;
        console.log(newId);

        const newRamen = {
            id: newId,
            name: newName,
            restaurant: newRestaurant,
            image: newImage,
            rating: newRating,
            comment: newComment
        };
        
        fetch('http://localhost:3000/ramens',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRamen)
        });

        // We don't need this anymore (from previous stage of this challenge)...
        // because when we update the db the page reloads

        // renderRamen(newRamen);

    } else if (value === "Update") {
        const newRating = document.getElementById('update-rating').value;
        const newComment = document.getElementById('update-comment').value;
        updateRamen(newRating, newComment);

        // Find our id
        const name = document.querySelector('.name').textContent;
        const itemInfo = menuInfo.filter((item)=>{
            return item.name === name;
        });
        const itemId = itemInfo[0].id;

        // Prep our package
        const data = {
            rating: newRating,
            comment: newComment
        }

        // update the db
        fetch(`http://localhost:3000/ramens/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
    } else if (value === "Delete") {
        const url = document.querySelector('.detail-image').src;
        const localPath = url.replace('http://127.0.0.1:5501', '.');
        console.log(localPath);
        const newList = menuInfo.filter((menuItem) => {
            return menuItem.image !== localPath;
        });

        // Find our id
        const name = document.querySelector('.name').textContent;
        const itemInfo = menuInfo.filter((item)=>{
            return item.name === name;
        });
        const itemId = itemInfo[0].id;

        fetch(`http://localhost:3000/ramens/${itemId}`, {
            method: 'DELETE'
        });

        // We don't need the below two lines of code anymore (from previous stage of this challenge)...
        // because when we update the db the page reloads

        // clear the menu at top of page
        // ramenMenu.replaceChildren();

        // call render menu to repopulate the page
        // renderMenu(newList);
    }

    // We don't need the below line of code anymore (from previous stage of this challenge)...
    // because when we update the db the page reloads
    
    // form.reset();
});

function updateRamen(newRating, newComment) {
    document.getElementById('rating-display').textContent = newRating;
    document.getElementById('comment-display').textContent = newComment;
}

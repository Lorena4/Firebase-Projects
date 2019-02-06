const restaurantList = document.querySelector('#restaurant-list');
const form = document.querySelector('#add-restaurant-form');

//create element and render restaurant

function renderRestaurant(element) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let del = document.createElement('div');

    li.setAttribute('data-id', element.id);
    name.textContent = element.data().name;
    city.textContent = element.data().city;
    del.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(del);

    restaurantList.appendChild(li);

    //deleting data
    del.addEventListener('click', (event) => {
        event.stopPropagation();
        let id = event.target.parentElement.getAttribute('data-id');
        db.collection('restaurants').doc(id).delete();
    })
}

//saving data
form.addEventListener('submit', (event) => {
    event.preventDefault();
    db.collection('restaurants').add({
        name: form.name.value,
        city: form.city.value
    });
});


//getting data
db.collection('restaurants').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderRestaurant(change.doc);
        } else if (change.type == 'removed') {
            let li = restaurantList.querySelector('[data-id=' + change.doc.id + ']');
            restaurantList.removeChild(li);
        }
    });
});
const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// Getting Document
// create element and render cafe
function renderCafe(doc){
    // 3 On créer les différents tag html
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    
    li.setAttribute('data-id', doc.id); // 4 Pour chaque document on lui ajoute l'attribut data-id avec la valeur de son id
    name.textContent = doc.data().name; // 5 On écrit la valeur de name dans le span 
    city.textContent = doc.data().city; // 6 On écrit la valeur de city dans le span
    cross.textContent = 'x';


    li.appendChild(name); // 7 On ajoute en enfant du li le name (span)
    li.appendChild(city); // 8 On ajoute en enfant du li le city (span)
    li.appendChild(cross); // On ajoute un tag pour la suppression

    cafeList.appendChild(li); // 9 On ajoute en enfant de #cafe-list le li

    // Deleted document
    cross.addEventListener('click', (e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id'); //récupère l'id du document (li)
        db.collection('cafes').doc(id).delete(); //.doc(id) recherche un document qui a l'id qu'on lui passe en paramètre
    })
}

// 1 On fait un snaphost de la collections cafes
/*db.collection('cafes').orderBy('name').get().then((snapshot) => { 
    // snapshot = représentation basic des datas d'une collection
    // Ajouter .orderBy('name') Pour un affichage des documents par ordre croissant
    // Ajouter .where('city', '==', 'marioland') Affichage des données villes qui n'ont que comme valeur marioland
   // console.log(snapshot.docs);

   // 2 Pour chaque document on appel la fonction renderCafe
   snapshot.docs.forEach(doc => {
       //console.log(doc.data());
       renderCafe(doc);
   })
})
*/

// Add document
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Ne pas rafraichir la page si il y a un évènement de type submit
    db.collection('cafes').add({ // Va permettre d'ajouiter un document, ce document contient un objet qui comprend la valeur de name et city
        name: form.name.value,
        city: form.city.value
    })

    // Si on soummet le formulaire, les champs du formulaire remettent une valeur null 
    form.name.value = '';
    form.city.value = '';
})

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data()); //.doc = individual document

        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
})


// update document
db.collection('cafes').doc('kdpHe3pIbkYzulZWNzh7').update({
    city: 'St Malo'
})
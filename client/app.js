var notesInput = document.querySelector('#notesInput')
var notesCard = document.querySelector('#notesCard')
const api = "http://localhost:8000"

notesInput.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        addItem()
    }
})

async function addItem() {
    if (!notesInput.value.length > 3) {
        alert('Please enter more than 3 characters')
        notesInput.value = ""
        return;
    } else if (!isNaN(notesInput.value)) {
        alert('Please Donot enter integer or number')
        notesInput.value = ""
        return;
    }else {

        await fetch(`${api}/addTodo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todo: notesInput.value }),
        });
    
        notesInput.value = ""
        uiRendering()
    }

}

async function uiRendering() {
    const res = await fetch(`${api}/get-todos`);
    const { data: getNotes } = await res.json();
    var cardUi = ""
    
    if (getNotes === null || getNotes.length === 0) {
        cardUi += `<p class="card-text">Nothing to show</p>`;
    } else {
        for (let i = 0; i < getNotes.length; i++) {
            cardUi += `
            <div class="container card mt-5" style="width: 18rem;">
                <div class="card-body">
                    <p class="card-text">${getNotes[i].todo}</p> <!-- Ensure this matches the field in your schema -->
                    <button type="button" onclick="editBtn('${getNotes[i]._id}', '${getNotes[i].todo}')" class="btn btn-warning">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button" onclick="deleteBtn('${getNotes[i]._id}')" class="btn btn-danger">
                        <i class="fa-solid fa-delete-left"></i>
                    </button>
                </div>
            </div>
            `;
        }
        notesCard.innerHTML = cardUi;
    }
}

async function editBtn(id, oldNote) {
    var editPrompt = prompt("Enter The Edit Note", oldNote)
    if (!editPrompt) return;

    await fetch(`${api}/update-todo/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: editPrompt }),
    });

    uiRendering()
}

async function deleteBtn(id) {
    await fetch(`${api}/delete-todo?id=${id}`, {
        method: 'DELETE',
    });
    uiRendering()
    window.location.reload()
}

async function deleteAll() {
    const res = await fetch(`${api}/get-todos`);
    const { data } = await res.json();
    const ids = data.map(item => item._id);

    await fetch(`${api}/delete-all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
    });

    notesCard.innerHTML = "";
    uiRendering()
}

uiRendering()
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('search-results');
    const resultsList = document.getElementById('results-list');
    const queueBox = document.getElementById('queue-box');
    const queueDiv = document.getElementById('queue');
    const nextButton = document.getElementById('next-button');

    let queue = JSON.parse(localStorage.getItem('queue')) || [];

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length > 2) {
            const response = await fetch(`/api/search?q=${query}`);
            const items = await response.json();
            resultsList.innerHTML = '';
            if (items.length > 0) {
                searchResults.style.display = 'block';
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.name} - $${item.price}`;
                    li.addEventListener('click', () => addToQueue(item));
                    resultsList.appendChild(li);
                });
            } else {
                searchResults.style.display = 'none';
            }
        } else {
            searchResults.style.display = 'none';
        }
    });

    function addToQueue(item) {
        const itemInQueue = queue.find(i => i.id === item.id);
        if (!itemInQueue) {
            item.quantity = 1;
            queue.push(item);
        }
        updateQueue();
    }

    function updateQueue() {
        queueDiv.innerHTML = '';
        queue.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('box');
            div.innerHTML = `
                <div class="columns">
                    <div class="column">${item.name}</div>
                    <div class="column">
                        <input class="input" type="number" value="${item.quantity}" min="1" data-index="${index}">
                    </div>
                    <div class="column">
                        <button class="button is-danger" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            queueDiv.appendChild(div);
        });

        const inputs = queueDiv.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', updateQuantity);
        });

        const removeButtons = queueDiv.querySelectorAll('button');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeFromQueue);
        });

        queueBox.style.display = queue.length > 0 ? 'block' : 'none';
    }

    function updateQuantity(event) {
        const index = event.target.dataset.index;
        queue[index].quantity = parseInt(event.target.value, 10);
        localStorage.setItem('queue', JSON.stringify(queue));
    }

    function removeFromQueue(event) {
        const index = event.target.dataset.index;
        queue.splice(index, 1);
        updateQueue();
        localStorage.setItem('queue', JSON.stringify(queue));
    }

    nextButton.addEventListener('click', () => {
        const queue = JSON.parse(localStorage.getItem('queue'));
        const queryString = new URLSearchParams({ queue: JSON.stringify(queue) }).toString();
        window.location.href = `/print?${queryString}`;
    });
    

    updateQueue();
});

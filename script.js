document.getElementById('fetchDataBtn').addEventListener('click', fetchData);

async function fetchData() {
    const query = `
        query {
            items(lang: en, categoryNames: Weapon) {
                id
                name
                shortName
                description
                bartersFor {
                    requiredItems {
                        count
                        item {
                            name
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch('https://api.tarkov.dev/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add new authentication token if required later in development under this line as 'Authorication': 'Bearer my-token-here'
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();

        if (response.ok) {
            // mapBarterUsing(forMapping.data.items)

            displayData(result.data.items);
        } else {
            throw new Error(result.errors ? result.errors[0].message : 'Failed to fetch gql data.')
        }
    } catch (error) {
        console.error('Error fetching gql data:', error);
        alert('Error fetching gql data. Please check the console for more details.')
    }

}


function displayData(items) {
    console.log(items);
    const displayElement = document.getElementById('dataDisplay');
    displayElement.innerHTML = '';

    items.map(item => {

        const barterItems = [];

        item.bartersFor?.map(barter => {
            barter.requiredItems.forEach(required => {
                barterItems.push(`${required.item.name} x${required.count}`);
            })
        })

        // Join all barter items
        const barterItemsString = barterItems.length > 0 ? barterItems.join(", ") : 'No barter items';

        const itemElement = document.createElement('div');
        itemElement.classList.add("dd-items")
        itemElement.innerHTML = `
        <div class="dd-items-content"><p><span>ID:</span> ${item.id}</p></div>
        <div class="dd-items-content"><p><span>Name:</span> ${item.name} (${item.shortName})</p></div>
        <div class="dd-items-content"><p><span>Description:</span> ${item.description}</p></div>
        <div class="dd-items-content"><p><span>Required for barter:</span> ${barterItemsString}</p></div>
        
        `;
        displayElement.appendChild(itemElement);
    })
};
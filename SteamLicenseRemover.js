let removedCount = 0;

async function removeGame(id) {
    console.log(`Removing game with ID ${id}...`);
    try {
        const response = await fetch('https://store.steampowered.com/account/removelicense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `sessionid=${encodeURIComponent(g_sessionID)}&packageid=${encodeURIComponent(id)}`
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                removedCount++;
                console.log(`Game with ID ${id} removed successfully. Total games removed: ${removedCount}`);
            } else {
                console.log(`Failed to remove game with ID ${id}.`);
            }
        } else {
            console.log(`Failed to remove game with ID ${id}. Status: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error while removing game with ID ${id}:`, error);
    }
}

function extractIdFromLink(link) {
    const match = link.match(/RemoveFreeLicense\(\s*(\d+)\s*,/);
    return match ? match[1] : null;
}

function countRemovableGames() {
    const removeLinks = document.querySelectorAll('a[href^="javascript:RemoveFreeLicense"]');
    const totalGames = removeLinks.length;
    console.log(`Total removable games: ${totalGames}`);
    return totalGames;
}

async function removeGames() {
    const totalGames = countRemovableGames();
    const intervalID = setInterval(() => {
        console.log(`Games removed: ${removedCount} of ${totalGames}`);
        if (removedCount >= totalGames) {
            clearInterval(intervalID);
        }
    }, 1000);

    const removeLinks = document.querySelectorAll('a[href^="javascript:RemoveFreeLicense"]');
    for (const link of removeLinks) {
        const id = extractIdFromLink(link.href);
        if (id) {
            await removeGame(id);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Aguarda 10 segundos antes de processar o próximo link
        } else {
            console.log(`Failed to extract ID from link: ${link.href}`);
        }
    }

    console.log(`All games removed. Total games removed: ${removedCount}`);
}

removeGames();


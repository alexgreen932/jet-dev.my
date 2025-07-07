
export default function navigateApp() {
    const items = document.querySelectorAll('.dbi');
    console.log('items: ', items);

    items.forEach((item) => {
        const clicker = item.querySelector('.db-click');
        console.log('clicker: ', clicker);
            const isOpen = item.classList.contains('isOpen');

        clicker.addEventListener('click', () => {
            console.log('isOpen: ', isOpen);

            if (isOpen) {
                console.log('is open');                
                item.classList.remove('isOpen');
                item.classList.add('isClose');
            } else {
                console.log('is closed'); 
                item.classList.remove('isClose');
                item.classList.add('isOpen');
            }
        });

        // clicker.forEach((clicker) => {
        // console.log('clicker: ', clicker);
        //     // Find the target to toggle (either <pre> or parent .dbi)
        //     const target = clicker.closest('pre') || item;

        //     // Initial state: open
        //     target.classList.add('isOpen');
        //     target.classList.remove('isClose');

            
        // });
    });
}

function navigateApp2() {
    const items = document.querySelectorAll('.dbi');

    items.forEach((item) => {
        const clickers = item.querySelectorAll('.db-click');

        clickers.forEach((clicker) => {
        console.log('clicker: ', clicker);
            // Find the target to toggle (either <pre> or parent .dbi)
            const target = clicker.closest('pre') || item;

            // Initial state: open
            target.classList.add('isOpen');
            target.classList.remove('isClose');

            clicker.addEventListener('click', () => {
                const isOpen = target.classList.contains('isOpen');

                if (isOpen) {
                    target.classList.remove('isOpen');
                    target.classList.add('isClose');
                } else {
                    target.classList.remove('isClose');
                    target.classList.add('isOpen');
                }
            });
        });
    });
}

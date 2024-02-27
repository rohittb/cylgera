// JavaScript source code

    let sellers = [];
    let buyers = [];

        document.getElementById('addSeller').addEventListener('click', () => {
            const sellerName = prompt('Enter seller name');
    if (sellerName) {
        sellers.push(sellerName);
    updateSellerList();
            }
        });

        document.getElementById('removeSeller').addEventListener('click', () => {
            const sellerName = prompt('Enter seller name to remove');
    if (sellerName) {
        sellers = sellers.filter(s => s !== sellerName);
    updateSellerList();
            }
        });

        document.getElementById('addBuyer').addEventListener('click', () => {
            const buyerName = prompt('Enter buyer name');
    if (buyerName) {
        buyers.push(buyerName);
    updateBuyerList();
            }
        });

        document.getElementById('removeBuyer').addEventListener('click', () => {
            const buyerName = prompt('Enter buyer name to remove');
    if (buyerName) {
        buyers = buyers.filter(b => b !== buyerName);
    updateBuyerList();
            }
        });

    function updateSellerList() {
            const sellerList = document.getElementById('sellerList');
    sellerList.innerHTML = '';
            sellers.forEach(seller => {
                const li = document.createElement('li');
    li.textContent = seller;
    sellerList.appendChild(li);
            });
        }

    function updateBuyerList() {
            const buyerList = document.getElementById('buyerList');
    buyerList.innerHTML = '';
            buyers.forEach(buyer => {
                const li = document.createElement('li');
    li.textContent = buyer;
    buyerList.appendChild(li);
            });
        }

    // Initialize the lists
    updateSellerList();
    updateBuyerList();

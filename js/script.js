/* ==================================================
   ADORA
   JAVASCRIPT
================================================== */


/* ================= PRODUCTOS ================= */

const products = {

    1: {
        id: 1,
        name: "Labial Velvet",
        price: 12500,
        image: "img/labial.jpg"
    },

    2: {
        id: 2,
        name: "Blush Rosé",
        price: 13500,
        image: "img/rubor.jpg"
    },

    3: {
        id: 3,
        name: "Máscara Volume",
        price: 15900,
        image: "img/mascara.jpg"
    },

    4: {
        id: 4,
        name: "Paleta Nude",
        price: 24900,
        image: "img/paleta.jpg"
    },

    5: {
        id: 5,
        name: "Lip Gloss Crystal",
        price: 10900,
        image: "img/gloss.jpg"
    },

    6: {
        id: 6,
        name: "Base Perfect Skin",
        price: 21500,
        image: "img/base.jpg"
    }

};


/* ================= CARRITO ================= */

let cart = JSON.parse(
    localStorage.getItem("adoraCart")
) || [];


function addToCart(productId) {

    const product = products[productId];

    if (!product) return;


    const existingProduct =
        cart.find(item => item.id === productId);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    openCart();

}


function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    saveCart();

    updateCart();

}


function changeQuantity(productId, change) {

    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    saveCart();

    updateCart();

}


function saveCart() {

    localStorage.setItem(
        "adoraCart",
        JSON.stringify(cart)
    );

}


function updateCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    const cartTotal =
        document.getElementById("cart-total");


    if (!cartItems) return;


    let totalItems = 0;

    let totalPrice = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <p class="empty-cart">

                Tu carrito está vacío.

            </p>

        `;

    } else {

        cartItems.innerHTML = "";


        cart.forEach(item => {

            totalItems += item.quantity;

            totalPrice +=
                item.price * item.quantity;


            const cartItem =
                document.createElement("div");

            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <p class="cart-item-price">

                        $${formatPrice(item.price)}

                    </p>

                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${item.id}, -1)">
                            -
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)">
                            +
                        </button>

                    </div>

                </div>

                <button
                    onclick="removeFromCart(${item.id})"
                    style="
                        border:none;
                        background:none;
                        cursor:pointer;
                    ">

                    🗑️

                </button>

            `;


            cartItems.appendChild(cartItem);

        });

    }


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }


    if (cartTotal) {

        cartTotal.textContent =
            "$" + formatPrice(totalPrice);

    }

}


function formatPrice(price) {

    return price.toLocaleString("es-AR");

}


/* ================= ABRIR CARRITO ================= */

function openCart() {

    const cartElement =
        document.getElementById("cart");

    const overlay =
        document.getElementById("cart-overlay");


    if (cartElement) {

        cartElement.classList.add("active");

    }


    if (overlay) {

        overlay.classList.add("active");

    }

}


function closeCart() {

    const cartElement =
        document.getElementById("cart");

    const overlay =
        document.getElementById("cart-overlay");


    if (cartElement) {

        cartElement.classList.remove("active");

    }


    if (overlay) {

        overlay.classList.remove("active");

    }

}


/* ================= FINALIZAR COMPRA ================= */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    alert(
        "¡Gracias por comprar en ADORA! 💗\n\n" +
        "Esta es una demostración de la tienda."
    );

}


/* ================= FAVORITOS ================= */

let favorites =
    JSON.parse(
        localStorage.getItem("adoraFavorites")
    ) || [];


function toggleFavorite(productId) {

    const index =
        favorites.indexOf(productId);


    if (index === -1) {

        favorites.push(productId);

        alert(
            "Producto agregado a favoritos 💗"
        );

    } else {

        favorites.splice(index, 1);

    }


    localStorage.setItem(
        "adoraFavorites",
        JSON.stringify(favorites)
    );


    updateFavoriteButtons();

}


function updateFavoriteButtons() {

    const buttons =
        document.querySelectorAll(".favorite");


    buttons.forEach(button => {

        const onclick =
            button.getAttribute("onclick");


        if (!onclick) return;


        const match =
            onclick.match(/\d+/);


        if (!match) return;


        const id =
            parseInt(match[0]);


        if (favorites.includes(id)) {

            button.classList.add("active");

            button.textContent = "♥";

        } else {

            button.classList.remove("active");

            button.textContent = "♡";

        }

    });

}


/* ================= FILTROS ================= */

let currentCategory = "todos";


function filterProducts(category, button) {

    currentCategory = category;


    document
        .querySelectorAll(".filter")
        .forEach(filter => {

            filter.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    const productsCards =
        document.querySelectorAll(
            ".product-card"
        );


    const searchInput =
        document.getElementById(
            "product-search"
        );


    const search =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    let visibleProducts = 0;


    productsCards.forEach(card => {

        const categoryCard =
            card.dataset.category;

        const name =
            (card.dataset.name || "").toLowerCase();


        const matchesCategory =
            category === "todos" ||
            categoryCard === category;


        const matchesSearch =
            name.includes(search);


        if (
            matchesCategory &&
            matchesSearch
        ) {

            card.style.display = "";

            visibleProducts++;

        } else {

            card.style.display = "none";

        }

    });


    showNoProducts(
        visibleProducts === 0
    );

}


/* ================= BUSCADOR ================= */

function searchProducts() {

    const searchInput =
        document.getElementById(
            "product-search"
        );


    if (!searchInput) return;


    const search =
        searchInput.value.toLowerCase();


    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    let visibleProducts = 0;


    cards.forEach(card => {

        const name =
            (card.dataset.name || "").toLowerCase();


        const category =
            card.dataset.category;


        const matchesSearch =
            name.includes(search);


        const matchesCategory =
            currentCategory === "todos" ||
            category === currentCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "";

            visibleProducts++;

        } else {

            card.style.display = "none";

        }

    });


    showNoProducts(
        visibleProducts === 0
    );

}


function showNoProducts(show) {

    const message =
        document.getElementById(
            "no-products"
        );


    if (!message) return;


    message.style.display =
        show ? "block" : "none";

}


/* ================= MENU MOBILE ================= */

function toggleMenu() {

    const nav =
        document.querySelector(".nav");


    if (!nav) return;


    nav.classList.toggle("open");

}


/* ================= BUSCADOR HEADER ================= */

function focusSearch() {

    const search =
        document.getElementById(
            "product-search"
        );


    if (search) {

        search.focus();

    } else {

        window.location.href =
            "productos.html";

    }

}


/* ================= CONTACTO ================= */

const contactForm =
    document.getElementById(
        "contact-form"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const message =
                document.getElementById(
                    "message"
                ).value.trim();


            const formMessage =
                document.getElementById(
                    "form-message"
                );


            if (
                name === "" ||
                email === "" ||
                message === ""
            ) {

                formMessage.textContent =
                    "Por favor completá todos los campos.";

                formMessage.style.color =
                    "#630509";

                return;

            }


            formMessage.textContent =
                "¡Mensaje enviado correctamente! 💗";


            formMessage.style.color =
                "#27834B";


            contactForm.reset();

        }
    );

}


/* ================= NEWSLETTER ================= */

const newsletterForm =
    document.getElementById(
        "newsletter-form"
    );


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "newsletter-email"
                ).value;


            if (!email) return;


            alert(
                "¡Gracias por suscribirte a ADORA! 💗"
            );


            newsletterForm.reset();

        }
    );

}


/* ================= URL CATEGORÍA ================= */

function loadCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("categoria");


    if (!category) return;


    const button =
        [...document.querySelectorAll(".filter")]
            .find(
                btn =>
                    btn.textContent
                        .trim()
                        .toLowerCase()
                    === category
            );


    if (button) {

        filterProducts(
            category,
            button
        );

    }

}


/* ================= INICIALIZACIÓN ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCart();

        updateFavoriteButtons();

        loadCategoryFromURL();

    }
);
async function init () {
  const cardGrid = document.querySelector('#card-grid');
  const year = document.querySelector('#year');
  year.innerHTML =  new Date().getFullYear();
  let products = await fetch('./json/products.json')
                  .then(response => response.json())
  products.forEach(product => {
    let productHtmlCreated = createProductCard(product);
    cardGrid.appendChild(productHtmlCreated);
  });
};

init();

function createProductCard (product) {
  const pd = { ...product };
  pd.discount = discountPrice(pd.oldPrice, pd.price);
  pd.installments = calculateInstallments(pd, 10);

  const productCardAvalaible = 
  `
    <div class="prices">
      <span class="price-old ${ pd.discount ? '' : 'disable' }">${ formatPrice(pd.oldPrice) }</span>
      <div class="price">${ formatPrice(pd.price) }</div>
      <div class="installments">${ pd.installments }x de ${ formatPrice(pd.price / pd.installments) }<span> sem juros</span></div>
      <div class="product-btn only-mobile">Ver Produto</div>
    </div>
  `;

  const productCardUnaAvalaible =
  `
    <div class="prices unavailable">
      <div class="disclaimer">Produto Indisponível</div>
      <div class="product-btn only-mobile">Ver Produto</div>
    </div>
  `;

  const productCard = 
  `
    <div 
      data-index=${pd.id}
      class="card-container"
    >
      <div class="${pd.available ? 'available' : 'not-available'}"></div>
      <div class="img-thumbnail">
        <img src=${pd.image_url} alt="${pd.name}" referrerpolicy="no-referrer" />
        <div class="product-btn only-desktop">Ver Produto</div>
        <div class="flag-container">
          <div class="flag ${pd.discount ? 'discount' : ''}">${pd.discount}</div>
          <div class="flag ${pd.details.freeShipping ? 'free-shipping' : ''}">Frete Grátis</div>
        </div>
      </div>
      <div class="product-content">
        <div class="product-name">
          ${pd.name}
        </div>
        ${ pd.available ? productCardAvalaible : productCardUnaAvalaible }
    </div>
  `;

  return stringToHTML(productCard);
};

function stringToHTML (str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body.firstElementChild;
};

function formatPrice (price) {
  return price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

function calculateInstallments (product, defaultInstallments) {
  return product.installments ? product.installments : defaultInstallments
}

function discountPrice (price, oldprice) {
  const discount = ( 100 - ( oldprice * 100 / price )).toFixed(0); 

  if (discount >= 5) {
    return `${discount + "% OFF"}`
  } else {
    return ''
  }
}
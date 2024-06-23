document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.getElementById('categoryFilter');
    const searchBar = document.getElementById('searchBar');
  
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndSearchProducts);
    if (searchBar) searchBar.addEventListener('input', filterAndSearchProducts);
  
    updateCategoryDropdown();
    loadProducts();
  });
  
  function updateCategoryDropdown() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const dropdown = document.getElementById('categoryFilter');
    dropdown.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
      dropdown.innerHTML += `<option value="${category}">${category}</option>`;
    });
  }
  
  function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    displayProducts(products);
  }
  
  function filterAndSearchProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchBar = document.getElementById('searchBar').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem('products')) || [];
  
    const filteredProducts = products.filter(product => {
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesSearch = product.name.toLowerCase().includes(searchBar) || product.copywritings.some(copywriting => copywriting.toLowerCase().includes(searchBar));
      return matchesCategory && matchesSearch;
    });
  
    displayProducts(filteredProducts);
  }
  
  function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
  
    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('p-4', 'bg-gray-700', 'border', 'border-gray-600', 'rounded', 'flex', 'flex-col', 'items-center');
  
      const content = `
        <h3 class="text-lg font-bold text-blue-400 cursor-pointer" onclick="openProductDetail(${product.id})">${product.name}</h3>
        <img src="${product.photos[0]}" alt="${product.name} photo" class="mt-2 max-h-40 cursor-pointer" onclick="openProductDetail(${product.id})">
      `;
      card.innerHTML = content;
      productList.appendChild(card);
    });
  }
  
  function openProductDetail(productId) {
    const product = JSON.parse(localStorage.getItem('products')).find(p => p.id === productId);
    if (!product) return;
  
    const productDetailWindow = window.open('', '_blank');
    productDetailWindow.document.write(`
      <html>
      <head>
        <title>${product.name} - Product Detail</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-900 text-gray-200 p-6">
        <div class="container mx-auto p-6 bg-gray-800 rounded-lg shadow-lg max-w-4xl">
          <h1 class="text-3xl font-bold mb-4">${product.name}</h1>
          <a href="${product.url}" target="_blank" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition mb-4">View Product</a>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              ${product.photos.map(photo => `<div class="p-3 bg-gray-800 border border-gray-600 rounded mb-2"><img src="${photo}" alt="${product.name} photo" class="max-h-60"></div>`).join('')}
              ${product.videos.map(video => `<div class="p-3 bg-gray-800 border border-gray-600 rounded mb-2"><video src="${video}" controls class="max-h-60"></video></div>`).join('')}
            </div>
            <div>
              ${product.copywritings.map((copywriting, index) => `
                <div class="p-3 bg-gray-800 border border-gray-600 rounded mb-4">
                  <h4 class="text-md font-bold mb-2">Copywriting Variation ${index + 1}</h4>
                  <p class="mb-2">${copywriting}</p>
                  <button onclick="copyText('${copywriting.replace(/'/g, "\\'")}')" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition mb-4">Copy Copywriting</button>
                </div>
              `).join('')}
              <button onclick="downloadAllPhotos('${product.photos.join(',').replace(/'/g, "\\'")}')" class="bg-green-600 text-white p-2 rounded hover:bg-green-500 transition mb-4">Download All Photos</button>
              <button onclick="downloadAllVideos('${product.videos.join(',').replace(/'/g, "\\'")}')" class="bg-green-600 text-white p-2 rounded hover:bg-green-500 transition mb-4">Download All Videos</button>
            </div>
          </div>
          <button onclick="window.close()" class="bg-red-600 text-white p-2 rounded hover:bg-red-500 transition mt-4">Close</button>
          <div id="copiedMessage" class="text-green-500 hidden mt-4">Copied to clipboard!</div>
        </div>
      </body>
      <script>
        function copyText(text) {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
  
          const copiedMessage = document.createElement('div');
          copiedMessage.id = 'copiedMessage';
          copiedMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded';
          copiedMessage.textContent = 'Copied to clipboard!';
          document.body.appendChild(copiedMessage);
          setTimeout(() => {
            document.body.removeChild(copiedMessage);
          }, 2000);
        }
  
        function downloadAllPhotos(photoUrls) {
          const urls = photoUrls.split(',');
          urls.forEach(url => downloadFile(url));
        }
  
        function downloadAllVideos(videoUrls) {
          const urls = videoUrls.split(',');
          urls.forEach(url => downloadFile(url));
        }
  
        function downloadFile(url) {
          const a = document.createElement('a');
          a.href = url;
          a.download = url.split('/').pop();
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      </script>
      </html>
    `);
  }
  
document.addEventListener('DOMContentLoaded', () => {
  const addCategoryButton = document.getElementById('addCategoryButton');
  const addProductButton = document.getElementById('addProductButton');
  const addPhotoUrlButton = document.getElementById('addPhotoUrlButton');
  const addAdditionalPhotoButton = document.getElementById('addAdditionalPhotoButton');
  const addBulkPhotoUrlsButton = document.getElementById('addBulkPhotoUrlsButton');
  const addVideoUrlButton = document.getElementById('addVideoUrlButton');
  const addAdditionalVideoButton = document.getElementById('addAdditionalVideoButton');
  const addBulkVideoUrlsButton = document.getElementById('addBulkVideoUrlsButton');
  const addCopywritingFieldButton = document.getElementById('addCopywritingFieldButton');
  const productCategorySelect = document.getElementById('productCategorySelect');
  const categoryFilter = document.getElementById('categoryFilter');
  const searchProduct = document.getElementById('searchProduct');

  if (addCategoryButton) addCategoryButton.addEventListener('click', addCategory);
  if (addProductButton) addProductButton.addEventListener('click', addProduct);
  if (addPhotoUrlButton) addPhotoUrlButton.addEventListener('click', () => addPhotoUrlField());
  if (addAdditionalPhotoButton) addAdditionalPhotoButton.addEventListener('click', () => addPhotoUrlField());
  if (addBulkPhotoUrlsButton) addBulkPhotoUrlsButton.addEventListener('click', addBulkPhotoUrls);
  if (addVideoUrlButton) addVideoUrlButton.addEventListener('click', () => addVideoUrlField());
  if (addAdditionalVideoButton) addAdditionalVideoButton.addEventListener('click', () => addVideoUrlField());
  if (addBulkVideoUrlsButton) addBulkVideoUrlsButton.addEventListener('click', addBulkVideoUrls);
  if (addCopywritingFieldButton) addCopywritingFieldButton.addEventListener('click', addCopywritingField);
  if (productCategorySelect) productCategorySelect.addEventListener('change', showProductForm);
  if (categoryFilter) categoryFilter.addEventListener('change', updateSubjectList);
  if (searchProduct) searchProduct.addEventListener('input', updateSubjectList);

  updateCategoryDropdown();
  updateCategoryFilter();
  updateSubjectList();
});

function updateCategoryDropdown() {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  const dropdown = document.getElementById('productCategorySelect');
  dropdown.innerHTML = '<option value="">Select Category</option>';
  categories.forEach((category, index) => {
    dropdown.innerHTML += `<option value="${category}" data-index="${index}">${category}</option>`;
  });
}

function updateCategoryFilter() {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  const filter = document.getElementById('categoryFilter');
  filter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach((category) => {
    filter.innerHTML += `<option value="${category}">${category}</option>`;
  });
}

function showProductForm() {
  const selectedCategory = document.getElementById('productCategorySelect').value;
  const productForm = document.getElementById('productForm');
  const deleteCategoryButton = document.getElementById('deleteCategoryButton');
  const categoryIndex = document.getElementById('productCategorySelect').selectedIndex - 1; // Adjust for the default option

  if (selectedCategory) {
    productForm.classList.remove('hidden');
    deleteCategoryButton.classList.remove('hidden');
    deleteCategoryButton.setAttribute('onclick', `deleteCategory(${categoryIndex})`);
  } else {
    productForm.classList.add('hidden');
    deleteCategoryButton.classList.add('hidden');
    deleteCategoryButton.removeAttribute('onclick');
  }
}

function addCategory() {
  const newCategory = document.getElementById('newCategory').value.trim();
  if (!newCategory) {
    alert('Please enter a category name.');
    return;
  }

  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  if (categories.includes(newCategory)) {
    alert('This category already exists!');
    return;
  }

  categories.push(newCategory);
  localStorage.setItem('categories', JSON.stringify(categories));
  updateCategoryDropdown();
  updateCategoryFilter();
  document.getElementById('newCategory').value = ''; // Clear input field
  alert('Category added successfully!');
}

function deleteCategory(index) {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  categories.splice(index, 1);
  localStorage.setItem('categories', JSON.stringify(categories));
  updateCategoryDropdown();
  updateCategoryFilter();
  document.getElementById('productForm').classList.add('hidden');
  alert('Category deleted successfully!');
}

function addProduct() {
  const productName = document.getElementById('productName').value.trim();
  const productUrl = document.getElementById('productUrl').value.trim();
  const productPhotos = Array.from(document.querySelectorAll('#photoUrls input')).map(input => input.value.trim());
  const productVideos = Array.from(document.querySelectorAll('#videoUrls input')).map(input => input.value.trim());
  const productCategory = document.getElementById('productCategorySelect').value;
  const copywritings = Array.from(document.querySelectorAll('.copywriting')).map(field => field.value.trim());

  if (!productName || !productUrl || !productCategory || copywritings.some(copywriting => !copywriting)) {
    alert('Please fill all fields.');
    return;
  }

  const products = JSON.parse(localStorage.getItem('products')) || [];
  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name: productName,
    url: productUrl,
    photos: productPhotos,
    videos: productVideos,
    category: productCategory,
    copywritings
  };
  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  alert('Product added successfully!');

  // Clear input fields
  document.getElementById('productName').value = '';
  document.getElementById('productUrl').value = '';
  document.getElementById('photoUrls').innerHTML = '<input type="url" placeholder="Product Photo URL" class="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none focus:border-blue-500 mb-2">';
  document.getElementById('videoUrls').innerHTML = '<input type="url" placeholder="Product Video URL" class="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none focus:border-blue-500 mb-2">';
  document.getElementById('productCategorySelect').value = '';
  document.querySelectorAll('.copywriting').forEach(field => field.remove());

  updateSubjectList();
}

function addPhotoUrlField(value = '') {
  const photoUrls = document.getElementById('photoUrls');
  const fieldContainer = document.createElement('div');
  fieldContainer.classList.add('relative', 'mb-2');

  const newField = document.createElement('input');
  newField.type = 'url';
  newField.value = value;
  newField.placeholder = 'Product Photo URL';
  newField.classList.add('w-full', 'p-3', 'bg-gray-700', 'text-gray-200', 'border', 'border-gray-600', 'rounded', 'focus:outline-none', 'focus:border-blue-500', 'mb-2');
  fieldContainer.appendChild(newField);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('absolute', 'top-0', 'right-0', 'bg-red-500', 'text-white', 'p-1', 'rounded');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    fieldContainer.remove();
  });
  fieldContainer.appendChild(deleteButton);

  photoUrls.appendChild(fieldContainer);
}

function addBulkPhotoUrls() {
  const bulkPhotoUrls = document.getElementById('bulkPhotoUrls').value.trim();
  if (bulkPhotoUrls) {
    const photoUrls = bulkPhotoUrls.split(',').map(url => url.trim());
    photoUrls.forEach(url => addPhotoUrlField(url));
    document.getElementById('bulkPhotoUrls').value = ''; // Clear bulk input field
  }
}

function addVideoUrlField(value = '') {
  const videoUrls = document.getElementById('videoUrls');
  const fieldContainer = document.createElement('div');
  fieldContainer.classList.add('relative', 'mb-2');

  const newField = document.createElement('input');
  newField.type = 'url';
  newField.value = value;
  newField.placeholder = 'Product Video URL';
  newField.classList.add('w-full', 'p-3', 'bg-gray-700', 'text-gray-200', 'border', 'border-gray-600', 'rounded', 'focus:outline-none', 'focus:border-blue-500', 'mb-2');
  fieldContainer.appendChild(newField);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('absolute', 'top-0', 'right-0', 'bg-red-500', 'text-white', 'p-1', 'rounded');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    fieldContainer.remove();
  });
  fieldContainer.appendChild(deleteButton);

  videoUrls.appendChild(fieldContainer);
}

function addBulkVideoUrls() {
  const bulkVideoUrls = document.getElementById('bulkVideoUrls').value.trim();
  if (bulkVideoUrls) {
    const videoUrls = bulkVideoUrls.split(',').map(url => url.trim());
    videoUrls.forEach(url => addVideoUrlField(url));
    document.getElementById('bulkVideoUrls').value = ''; // Clear bulk input field
  }
}

function addCopywritingField() {
  const copywritingFields = document.getElementById('copywritingFields');
  const copywritingCount = copywritingFields.children.length;

  if (copywritingCount >= 10) {
    alert('You can add up to 10 copywriting variations only.');
    return;
  }

  const fieldContainer = document.createElement('div');
  fieldContainer.classList.add('relative', 'mb-2');

  const newField = document.createElement('textarea');
  newField.classList.add('copywriting', 'w-full', 'p-3', 'bg-gray-700', 'text-gray-200', 'border', 'border-gray-600', 'rounded', 'focus:outline-none', 'focus:border-blue-500', 'mb-2');
  newField.placeholder = `Enter copywriting variation ${copywritingCount + 1}`;
  fieldContainer.appendChild(newField);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('absolute', 'top-0', 'right-0', 'bg-red-500', 'text-white', 'p-1', 'rounded');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    fieldContainer.remove();
  });
  fieldContainer.appendChild(deleteButton);

  copywritingFields.appendChild(fieldContainer);
}

function updateSubjectList() {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const searchQuery = document.getElementById('searchProduct').value.toLowerCase();
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const subjectList = document.getElementById('subjectList');
  subjectList.innerHTML = '';

  const filteredProducts = products.filter(product => {
    return (!categoryFilter || product.category === categoryFilter) &&
           (!searchQuery || product.name.toLowerCase().includes(searchQuery));
  });

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    (acc[product.category] = acc[product.category] || []).push(product);
    return acc;
  }, {});

  const container = document.createElement('div');
  container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

  Object.keys(groupedProducts).forEach(category => {
    const categoryHeader = document.createElement('h3');
    categoryHeader.className = 'text-xl font-bold mt-4 col-span-full';
    categoryHeader.innerText = category;
    container.appendChild(categoryHeader);

    groupedProducts[category].forEach((product) => {
      const card = document.createElement('div');
      card.className = 'relative p-4 bg-gray-700 border border-gray-600 rounded transition transform hover:scale-105';

      const productInfo = document.createElement('div');
      productInfo.className = 'absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100';
      productInfo.innerHTML = `
        <button onclick="viewProduct(${product.id})" class="bg-blue-500 text-white p-2 rounded mr-2">View</button>
        <button onclick="editProduct(${product.id})" class="bg-green-500 text-white p-2 rounded">Edit</button>
      `;
      card.appendChild(productInfo);

      card.innerHTML += `
        <h3 class="text-lg font-bold">${product.name}</h3>
        <img src="${product.photos[0]}" alt="${product.name}" class="mt-2 max-h-40 w-full object-cover rounded">
      `;

      container.appendChild(card);
    });
  });

  subjectList.appendChild(container);
}

function viewProduct(id) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === id);
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center overflow-auto';
  modal.innerHTML = `
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-full overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4">${product.name}</h2>
      <p><strong>URL:</strong> <a href="${product.url}" target="_blank" class="text-blue-400 underline">${product.url}</a></p>
      <div class="mt-4">
        <h3 class="text-xl font-semibold">Photos</h3>
        <div class="grid grid-cols-2 gap-2 mt-2">
          ${product.photos.map(photo => `
            <div class="relative">
              <img src="${photo}" alt="${product.name}" class="w-full h-32 object-cover rounded">
              <button onclick="downloadFile('${photo}')" class="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded">Download</button>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-xl font-semibold">Videos</h3>
        <div class="grid grid-cols-2 gap-2 mt-2">
          ${product.videos.map(video => `
            <div class="relative">
              <video src="${video}" controls class="w-full h-32 object-cover rounded"></video>
              <button onclick="downloadFile('${video}')" class="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded">Download</button>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-xl font-semibold">Copywriting</h3>
        ${product.copywritings.map((copywriting, index) => `
          <div class="mt-2">
            <h4 class="text-lg font-medium">Variation ${index + 1}</h4>
            <p class="bg-gray-700 p-3 rounded">${copywriting}</p>
            <button onclick="copyToClipboard('${copywriting}')" class="bg-blue-500 text-white p-2 rounded mt-2">Copy</button>
          </div>
        `).join('')}
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="bg-red-500 text-white p-2 rounded mt-4">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function editProduct(id) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === id);

  // Fill the form with the product details
  document.getElementById('productName').value = product.name;
  document.getElementById('productUrl').value = product.url;
  document.getElementById('productCategorySelect').value = product.category;

  // Fill photos
  const photoUrls = document.getElementById('photoUrls');
  photoUrls.innerHTML = '';
  product.photos.forEach(photo => addPhotoUrlField(photo));

  // Fill videos
  const videoUrls = document.getElementById('videoUrls');
  videoUrls.innerHTML = '';
  product.videos.forEach(video => addVideoUrlField(video));

  // Fill copywritings
  const copywritingFields = document.getElementById('copywritingFields');
  copywritingFields.innerHTML = '';
  product.copywritings.forEach((copywriting, i) => {
    const fieldContainer = document.createElement('div');
    fieldContainer.classList.add('relative', 'mb-2');

    const newField = document.createElement('textarea');
    newField.classList.add('copywriting', 'w-full', 'p-3', 'bg-gray-700', 'text-gray-200', 'border', 'border-gray-600', 'rounded', 'focus:outline-none', 'focus:border-blue-500', 'mb-2');
    newField.placeholder = `Enter copywriting variation ${i + 1}`;
    newField.value = copywriting;
    fieldContainer.appendChild(newField);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('absolute', 'top-0', 'right-0', 'bg-red-500', 'text-white', 'p-1', 'rounded');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
      fieldContainer.remove();
    });
    fieldContainer.appendChild(deleteButton);

    copywritingFields.appendChild(fieldContainer);
  });

  // Update the add product button to save the edited product
  const addProductButton = document.getElementById('addProductButton');
  addProductButton.innerText = 'Save Changes';
  addProductButton.onclick = () => saveEditedProduct(id);
}



function saveEditedProduct(id) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const productIndex = products.findIndex(p => p.id === id);
  const product = products[productIndex];

  product.name = document.getElementById('productName').value.trim();
  product.url = document.getElementById('productUrl').value.trim();
  product.photos = Array.from(document.querySelectorAll('#photoUrls input')).map(input => input.value.trim());
  product.videos = Array.from(document.querySelectorAll('#videoUrls input')).map(input => input.value.trim());
  product.copywritings = Array.from(document.querySelectorAll('.copywriting')).map(field => field.value.trim());
  product.category = document.getElementById('productCategorySelect').value;

  if (!product.name || !product.url || !product.category || product.copywritings.some(copywriting => !copywriting)) {
    alert('Please fill all fields.');
    return;
  }

  products[productIndex] = product;
  localStorage.setItem('products', JSON.stringify(products));
  alert('Product updated successfully!');

  // Clear input fields
  document.getElementById('productName').value = '';
  document.getElementById('productUrl').value = '';
  document.getElementById('photoUrls').innerHTML = '<input type="url" placeholder="Product Photo URL" class="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none focus:border-blue-500 mb-2">';
  document.getElementById('videoUrls').innerHTML = '<input type="url" placeholder="Product Video URL" class="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none focus:border-blue-500 mb-2">';
  document.getElementById('productCategorySelect').value = '';
  document.querySelectorAll('.copywriting').forEach(field => field.remove());

  updateSubjectList();

  // Reset add product button
  addProductButton.innerText = 'Add Product';
  addProductButton.onclick = addProduct;
}

function downloadFile(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = url.split('/').pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard');
  });
}

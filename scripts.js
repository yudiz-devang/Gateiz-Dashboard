let products = [];
let plans = [];
let features = [];

// Function to show the relevant section
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(sectionId).classList.remove('hidden');
}

// Initially show the dashboard
showSection('dashboard');

// Setup Chart.js for the dashboard
const ctx = document.getElementById('dashboardChart').getContext('2d');
const dashboardChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      label: 'Revenue',
      data: [1200, 1500, 1800, 2000, 2200, 2400],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Function to populate features dropdown in the plan modal
// Function to populate features dropdown in the plan modal
function populateFeatureOptions() {
  const planFeaturesDropdown = document.getElementById('planFeatures');
  planFeaturesDropdown.innerHTML = '';

  function createFeatureOption(feature, level = 0) {
    const option = document.createElement('div');
    option.classList.add('dropdown-item');
    if (level > 0) {
      option.classList.add('nested-feature');
    }
    option.innerHTML = `
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="feature-${feature.id}" value="${feature.id}" data-parent-id="${feature.parentId}" checked>
        <label class="form-check-label" for="feature-${feature.id}">${feature.name}</label>
      </div>
    `;
    planFeaturesDropdown.appendChild(option);
  }

  function renderNestedFeatures(parentId = null, level = 0) {
    const nestedFeatures = features.filter(feature => feature.parentId === parentId);
    nestedFeatures.forEach(feature => {
      createFeatureOption(feature, level);
      renderNestedFeatures(feature.id, level + 1);
    });
  }

  renderNestedFeatures();
}

// Call this function when the modal is shown
$('#addPlanModal').on('show.bs.modal', function () {
  populateFeatureOptions();
});

// Populate product options in plan and feature forms
function populateProductOptions() {
  const planProductSelect = document.getElementById('planProduct');
  const featureProductSelect = document.getElementById('featureProduct');

  planProductSelect.innerHTML = '';
  featureProductSelect.innerHTML = '';

  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.name;

    planProductSelect.appendChild(option.cloneNode(true));
    featureProductSelect.appendChild(option.cloneNode(true));
  });
}

// Initialize product and feature options
document.addEventListener('DOMContentLoaded', function () {
  populateProductOptions();
  // Assume features are fetched from server or predefined
  populateFeatureOptions();
});

// Product management functions
function addProduct() {
  const productName = document.getElementById('productName').value;
  const productDescription = document.getElementById('productDescription').value;

  if (productName && productDescription) {
    const newProduct = {
      id: products.length + 1,
      name: productName,
      description: productDescription,
      status: 'Active'
    };
    products.push(newProduct);
    renderProductList();
    populateProductOptions();
    document.getElementById('addProductForm').reset();
    $('#addProductModal').modal('hide');
  }
}

function renderProductList() {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.description}</td>
      <td>${product.status}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
      </td>
    `;
    productList.appendChild(row);
  });
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  // Implement logic to edit the product
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  renderProductList();
  populateProductOptions();
}

// Plan management functions
function addPlan() {
  const planProduct = document.getElementById('planProduct').value;
  const planName = document.getElementById('planName').value;
  const planDescription = document.getElementById('planDescription').value;
  const planPrice = document.getElementById('planPrice').value;
  const planFeatures = Array.from(document.querySelectorAll('#planFeatures input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.value);

  if (planProduct && planName && planDescription && planPrice) {
    const newPlan = {
      id: plans.length + 1,
      product: planProduct,
      name: planName,
      description: planDescription,
      price: planPrice,
      features: planFeatures,
      status: 'Active'
    };
    plans.push(newPlan);
    renderPlanList();
    document.getElementById('addPlanForm').reset();
    $('#addPlanModal').modal('hide');
  }
}

function renderPlanList() {
  const planList = document.getElementById('planList');
  planList.innerHTML = '';

  plans.forEach(plan => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${plan.id}</td>
      <td>${plan.product}</td>
      <td>${plan.name}</td>
      <td>${plan.price}</td>
      <td>${plan.status}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editPlan(${plan.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deletePlan(${plan.id})">Delete</button>
      </td>
    `;
    planList.appendChild(row);
  });
}

function editPlan(id) {
  const plan = plans.find(p => p.id === id);
  // Implement logic to edit the plan
}

function deletePlan(id) {
  plans = plans.filter(p => p.id !== id);
  renderPlanList();
}

// Feature management functions
function addFeature() {
  const featureName = document.getElementById('featureName').value;
  const featureDescription = document.getElementById('featureDescription').value;
  const featureProduct = document.getElementById('featureProduct').value;
  const isNestedFeature = document.getElementById('isNestedFeature').checked;
  const featureParent = isNestedFeature ? document.getElementById('featureParent').value : null;

  if (featureName && featureDescription && featureProduct) {
    const newFeature = {
      id: features.length + 1,
      name: featureName,
      description: featureDescription,
      product: featureProduct,
      parentId: featureParent ? parseInt(featureParent) : null
    };
    features.push(newFeature);
    renderFeatureList();
    updateFeatureParentOptions();
    document.getElementById('addFeatureForm').reset();
    $('#addFeatureModal').modal('hide');
  }
}

function renderFeatureList() {
  const featureList = document.getElementById('featureList');
  featureList.innerHTML = '';

  const rootFeatures = features.filter(feature => !feature.parentId);

  function renderFeature(feature, level = 0) {
    const indent = '&nbsp;&nbsp;'.repeat(level);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${feature.id}</td>
      <td>${indent}${feature.name}</td>
      <td>${feature.description}</td>
      <td>${feature.product}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editFeature(${feature.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteFeature(${feature.id})">Delete</button>
      </td>
    `;
    featureList.appendChild(row);

    const nestedFeatures = features.filter(f => f.parentId === feature.id);
    nestedFeatures.forEach(nestedFeature => renderFeature(nestedFeature, level + 1));
  }

  rootFeatures.forEach(feature => renderFeature(feature));
}

function updateFeatureParentOptions() {
  const featureParentSelect = document.getElementById('featureParent');
  featureParentSelect.innerHTML = '<option value="">Root Feature</option>';

  const rootFeatures = features.filter(feature => !feature.parentId);
  rootFeatures.forEach(feature => {
    const option = document.createElement('option');
    option.value = feature.id;
    option.textContent = feature.name;
    featureParentSelect.appendChild(option);
  });
}

function editFeature(id) {
  const feature = features.find(f => f.id === id);
  // Implement logic to edit the feature
}

function deleteFeature(id) {
  features = features.filter(f => f.id !== id);
  renderFeatureList();
  updateFeatureParentOptions();
}

// Handle nested feature checkbox
const isNestedFeatureCheckbox = document.getElementById('isNestedFeature');
const featureParentContainer = document.getElementById('featureParentContainer');

isNestedFeatureCheckbox.addEventListener('change', function() {
  if (this.checked) {
    featureParentContainer.style.display = 'block';
  } else {
    featureParentContainer.style.display = 'none';
    document.getElementById('featureParent').value = '';
  }
});
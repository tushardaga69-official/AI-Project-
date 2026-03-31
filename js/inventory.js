/* ================================================
   NEXSTOCK AI — INVENTORY MANAGEMENT
   js/inventory.js
================================================ */

let products    = [];
let editingId   = null;
let deletingId  = null;
let currentPage = 1;
let sortKey     = 'name';
let sortDir     = 1;
const PER_PAGE  = 8;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  products = NexDB.getProducts();
  renderInventory();
  bindControls();
});

/* ================================================
   BIND CONTROLS
================================================ */
function bindControls() {
  document.getElementById('inventorySearch')?.addEventListener('input',  () => { currentPage = 1; renderInventory(); });
  document.getElementById('categoryFilter')?.addEventListener('change',  () => { currentPage = 1; renderInventory(); });
  document.getElementById('statusFilter')?.addEventListener('change',    () => { currentPage = 1; renderInventory(); });
  document.getElementById('addProductBtn')?.addEventListener('click',    openAddModal);
  document.getElementById('productForm')?.addEventListener('submit',     (e) => { e.preventDefault(); saveProduct(); });
  document.getElementById('deleteConfirmBtn')?.addEventListener('click', confirmDelete);
}

/* ================================================
   FILTER & SORT
================================================ */
function getFilteredProducts() {
  const q    = (document.getElementById('inventorySearch')?.value || '').toLowerCase().trim();
  const cat  = document.getElementById('categoryFilter')?.value  || '';
  const stat = document.getElementById('statusFilter')?.value    || '';

  return products
    .filter(p => {
      const matchQ   = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = !cat  || p.category  === cat;
      const matchSt  = !stat || NexDB.getStatus(p) === stat;
      return matchQ && matchCat && matchSt;
    })
    .sort((a, b) => {
      let va = a[sortKey] ?? '', vb = b[sortKey] ?? '';
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return va < vb ? -sortDir : va > vb ? sortDir : 0;
    });
}

window.sortTable = function(key) {
  if (sortKey === key) sortDir *= -1;
  else { sortKey = key; sortDir = 1; }

  document.querySelectorAll('thead th.sortable').forEach(th => {
    th.classList.remove('sort-active');
    th.querySelector('.sort-arrow')?.remove();
  });
  const activeHeader = document.querySelector(`th[data-sort="${key}"]`);
  if (activeHeader) {
    activeHeader.classList.add('sort-active');
    const arrow = document.createElement('span');
    arrow.className = 'sort-arrow';
    arrow.textContent = sortDir === 1 ? ' ↑' : ' ↓';
    activeHeader.appendChild(arrow);
  }

  renderInventory();
};

/* ================================================
   RENDER TABLE
================================================ */
function renderInventory() {
  const filtered   = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start  = (currentPage - 1) * PER_PAGE;
  const paged  = filtered.slice(start, start + PER_PAGE);

  // Page info
  const infoEl = document.getElementById('pageInfo');
  if (infoEl) {
    infoEl.textContent = filtered.length === 0
      ? 'No products found'
      : `Showing ${start + 1}–${Math.min(start + PER_PAGE, filtered.length)} of ${filtered.length} products`;
  }

  // Table body
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  if (paged.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted)">No products match your filters</td></tr>`;
    renderPagination(0, 1);
    return;
  }

  tbody.innerHTML = paged.map(p => buildRow(p)).join('');
  renderPagination(filtered.length, totalPages);
}

function buildRow(p) {
  const status  = NexDB.getStatus(p);
  const maxQty  = p.threshold * 12;
  const pct     = Math.min(100, Math.round((p.quantity / maxQty) * 100));
  const color   = {
    'In Stock':    'var(--accent-emerald)',
    'Low Stock':   'var(--accent-rose)',
    'Overstock':   'var(--accent-amber)',
    'Out of Stock':'var(--text-muted)',
  }[status] || 'var(--accent-emerald)';

  const needed    = NexDB.getForecastUnits(p);
  const needMore  = p.quantity < needed;
  const chipClass = status === 'Overstock' ? 'over' : needMore ? 'need' : 'ok';
  const chipText  = status === 'Overstock'
    ? `📦 ${p.quantity - needed} excess`
    : needMore
      ? `⚠ Order ${needed - p.quantity}`
      : `✓ Sufficient`;

  const catColor = NexDB.getCategoryColor(p.category);
  const catBg    = NexDB.getCategoryBg(p.category);

  return `
    <tr>
      <td>
        <div class="cell-product">
          <div class="product-icon" style="background:${catBg};">${p.emoji || '📦'}</div>
          <div>
            <div class="product-name">${p.name}</div>
            <div class="product-sku">${Fmt.padId(p.id)}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="badge" style="background:${catBg};color:${catColor}">${p.category}</span>
      </td>
      <td>
        <div class="qty-cell">
          <span class="qty-value">${p.quantity}</span>
          <div class="qty-bar-track">
            <div class="qty-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
        </div>
      </td>
      <td class="mono">${Fmt.currency(p.price)}</td>
      <td>${renderStatusBadge(status)}</td>
      <td><span class="forecast-chip ${chipClass}">${chipText}</span></td>
      <td>
        <div class="cell-actions">
          <button class="action-btn edit" onclick="openEditModal(${p.id})" title="Edit">✏</button>
          <button class="action-btn del"  onclick="openDeleteModal(${p.id})" title="Delete">🗑</button>
        </div>
      </td>
    </tr>`;
}

function renderStatusBadge(status) {
  const map = {
    'In Stock':    'badge-emerald',
    'Low Stock':   'badge-rose',
    'Overstock':   'badge-amber',
    'Out of Stock':'badge-muted',
  };
  return `<span class="badge ${map[status] || 'badge-muted'}">${status}</span>`;
}

/* ================================================
   PAGINATION
================================================ */
function renderPagination(total, totalPages) {
  const container = document.getElementById('pageButtons');
  if (!container) return;
  container.innerHTML = '';

  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.textContent = '‹';
  prev.disabled = currentPage === 1;
  prev.onclick = () => { if (currentPage > 1) { currentPage--; renderInventory(); } };
  container.appendChild(prev);

  const maxButtons = 5;
  let start = Math.max(1, currentPage - 2);
  let end   = Math.min(totalPages, start + maxButtons - 1);
  if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    const page = i;
    btn.onclick = () => { currentPage = page; renderInventory(); };
    container.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'page-btn';
  next.textContent = '›';
  next.disabled = currentPage === totalPages;
  next.onclick = () => { if (currentPage < totalPages) { currentPage++; renderInventory(); } };
  container.appendChild(next);
}

/* ================================================
   ADD MODAL
================================================ */
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = '＋ Add Product';
  document.getElementById('productForm').reset();
  document.getElementById('modalProductId').value = '';
  Modal.open('productModal');
}

/* ================================================
   EDIT MODAL
================================================ */
window.openEditModal = function(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  editingId = id;

  document.getElementById('modalTitle').textContent            = '✏ Edit Product';
  document.getElementById('modalProductId').value              = p.id;
  document.getElementById('modalName').value                   = p.name;
  document.getElementById('modalCategory').value               = p.category;
  document.getElementById('modalQuantity').value               = p.quantity;
  document.getElementById('modalPrice').value                  = p.price;
  document.getElementById('modalThreshold').value              = p.threshold;
  if (document.getElementById('modalEmoji')) document.getElementById('modalEmoji').value = p.emoji || '';

  Modal.open('productModal');
};

/* ================================================
   SAVE PRODUCT
================================================ */
function saveProduct() {
  const name      = document.getElementById('modalName').value.trim();
  const category  = document.getElementById('modalCategory').value;
  const quantity  = parseInt(document.getElementById('modalQuantity').value);
  const price     = parseFloat(document.getElementById('modalPrice').value);
  const threshold = parseInt(document.getElementById('modalThreshold').value) || 20;
  const emoji     = document.getElementById('modalEmoji')?.value.trim() || '📦';

  // Validation
  if (!name)               { Toast.show('Product name is required', 'error'); return; }
  if (isNaN(quantity) || quantity < 0) { Toast.show('Enter a valid quantity', 'error'); return; }
  if (isNaN(price)    || price < 0)    { Toast.show('Enter a valid price',    'error'); return; }

  if (editingId) {
    const idx = products.findIndex(x => x.id === editingId);
    if (idx !== -1) products[idx] = { ...products[idx], name, category, quantity, price, threshold, emoji };
    Toast.show(`✓ "${name}" updated`, 'success');
  } else {
    const newProduct = { id: NexDB.getNextId(), name, category, quantity, price, threshold, emoji };
    products.push(newProduct);
    Toast.show(`✓ "${name}" added to inventory`, 'success');
  }

  NexDB.saveProducts(products);
  Modal.close('productModal');
  renderInventory();
}

/* ================================================
   DELETE MODAL
================================================ */
window.openDeleteModal = function(id) {
  deletingId = id;
  const p = products.find(x => x.id === id);
  const nameEl = document.getElementById('deleteProductName');
  if (nameEl) nameEl.textContent = p?.name || 'this product';
  Modal.open('deleteModal');
};

function confirmDelete() {
  const p = products.find(x => x.id === deletingId);
  products  = products.filter(x => x.id !== deletingId);
  NexDB.saveProducts(products);
  Modal.close('deleteModal');
  renderInventory();
  Toast.show(`🗑 "${p?.name || 'Product'}" deleted`, 'info');
  deletingId = null;
}

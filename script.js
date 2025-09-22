
(function(){
  const cart = new Map();
  function updateBadge(){
    let total = 0;
    for (const [, item] of cart) total += item.qty;
    if (!document.getElementById('cart-badge')) {
      const badge = document.createElement('div');
      badge.id = 'cart-badge';
      badge.style.position='fixed'; badge.style.right='16px'; badge.style.bottom='16px';
      badge.style.padding='10px 14px'; badge.style.borderRadius='999px';
      badge.style.background='#4fd1c5'; badge.style.color='#071316'; badge.style.fontWeight='800';
      document.body.appendChild(badge);
    }
    document.getElementById('cart-badge').textContent = 'Košík: ' + total;
  }
  document.querySelectorAll('button[data-sku]').forEach(btn => {
    btn.addEventListener('click', e => {
      const sku = e.currentTarget.dataset.sku;
      const title = e.currentTarget.closest('.card').querySelector('h3').textContent;
      const price = e.currentTarget.closest('.card').querySelector('.price').textContent;
      const current = cart.get(sku) || { title, price, qty: 0 };
      current.qty += 1;
      cart.set(sku, current);
      updateBadge();
    });
  });
  updateBadge();
})();

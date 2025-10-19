function openCheckout({product, qty}){
  const root = document.getElementById("checkout-root");
  const amount = (product.price * qty).toFixed(2);
  const curr = product.currency || "€";
  const el = document.createElement("div");
  el.className = "checkout-backdrop";
  el.innerHTML = `
    <div class="checkout-modal">
      <h3>Checkout</h3>
      <div class="checkout-rows">
        <div><strong>Produkt:</strong> ${product.name}</div>
        <div><strong>Množství:</strong> ${qty} ks</div>
        <div><strong>Celkem:</strong> ${curr}${amount}</div>
        <hr/>
        <div><strong>Způsob platby:</strong></div>
        <div>
          <label><input type="radio" name="pay" value="bank" checked> Převodem (IBAN + QR)</label><br/>
          <label><input type="radio" name="pay" value="stripe"> Karta (Stripe – test)</label><br/>
          <label><input type="radio" name="pay" value="paypal"> PayPal (sandbox)</label>
        </div>
        <div id="payPanel" class="pay-panel" style="margin-top:8px; border:1px dashed rgba(0,183,255,.35); padding:10px; border-radius:8px;"></div>
      </div>
      <div class="checkout-actions">
        <button class="btn secondary" id="closeCk">Zavřít</button>
        <button class="btn" id="confirmPay">Zaplatit</button>
      </div>
    </div>`;
  root.innerHTML = ""; root.appendChild(el);
  const close = ()=> root.innerHTML="";
  el.querySelector("#closeCk").addEventListener("click", close);
  const payPanel = el.querySelector("#payPanel");
  function renderBank(){ payPanel.innerHTML = `
      <div><strong>Účet:</strong> Premium Gadget EU</div>
      <div><strong>IBAN:</strong> <code>YOUR_IBAN_HERE</code></div>
      <div><strong>SWIFT/BIC:</strong> <code>YOUR_SWIFT_HERE</code></div>
      <div style="margin-top:6px; opacity:.8">QR kód se vygeneruje po aktivaci IBAN (připraveno).</div>`; }
  function renderStripe(){ payPanel.innerHTML = `Stripe (test) – vložte PK:
      <code>pk_test_XXXXXXXXXXXXXXXXXXXXXXXX</code>`; }
  function renderPaypal(){ payPanel.innerHTML = `PayPal (sandbox) – vložte Client ID:
      <code>YOUR_SANDBOX_CLIENT_ID</code>`; }
  renderBank();
  el.querySelectorAll('input[name="pay"]').forEach(r => r.addEventListener("change", () => {
    if (r.checked){
      if (r.value === "bank") renderBank();
      if (r.value === "stripe") renderStripe();
      if (r.value === "paypal") renderPaypal();
    }
  }));
  el.querySelector("#confirmPay").addEventListener("click", () => {
    alert("Platba zpracována (simulace). Děkujeme!");
    if (window.playCash) window.playCash();
    close();
  });
}
window.openCheckout = openCheckout;

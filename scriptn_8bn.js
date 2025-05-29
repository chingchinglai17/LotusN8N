function submitForm() {
  const orderDate = document.getElementById("orderDate").value;
  const platform = document.getElementById("platform").value;
  const buyerName = document.getElementById("buyerName").value;
  const receiverName = document.getElementById("receiverName").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const shipping = document.querySelector('input[name="shipping"]:checked').value;

  const products = Array.from(document.querySelectorAll(".product")).map((productDiv) => {
    const label = productDiv.querySelector(".product-label").innerText;
    const input = productDiv.querySelector(".qty-input");
    const qty = parseInt(input.value) || 0;
    const price = parseInt(input.dataset.price);
    const weight = parseFloat(input.dataset.weight);

    return {
      name: label,
      qty,
      price,
      weight,
      subtotal: qty * price
    };
  }).filter(p => p.qty > 0);

  const total = products.reduce((sum, p) => sum + p.subtotal, 0);

  const orderData = {
    orderDate,
    platform,
    buyerName,
    receiverName,
    address,
    phone,
    shipping,
    products,
    total
  };

  fetch("https://chingchinglai1717.app.n8n.cloud/webhook/lotus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData) // orderData 是你從表單組好的 JSON 資料
  })
  .then(res => {
    if (res.ok) {
      document.getElementById("submitStatus").innerText = "✅ 訂單已成功送出！";
      // 如果你想列印，這裡可以觸發列印畫面
      window.print();
    } else {
      document.getElementById("submitStatus").innerText = "❌ 發送失敗，請稍後再試。";
    }
  })
  .catch(err => {
    console.error("送出錯誤", err);
    document.getElementById("submitStatus").innerText = "❌ 系統錯誤，請聯絡管理員。";
  });
}

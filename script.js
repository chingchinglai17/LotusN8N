// script.js

// 用於存儲計算結果的物件，避免重複計算
let calculatedOrderData = {
  products: [],
  weight: 0,
  productTotal: 0,
  shippingType: "cold", // 預設值
  shippingFee: 0,
  finalTotal: 0,
  shippingText: ""
};

function updateSummary() {
  const inputs = document.querySelectorAll(".qty-input");
  let products = [];
  let weight = 0;
  let productTotal = 0;

  inputs.forEach(input => {
    const label = input.parentElement.querySelector('.product-label').innerText;
    const qty = Number(input.value);
    const price = Number(input.dataset.price);
    const itemWeight = Number(input.dataset.weight);
    if (qty > 0) {
      products.push({ label, qty, price, subtotal: price * qty });
      weight += qty * itemWeight;
      productTotal += price * qty;
    }
  });

  const shippingType = document.querySelector('input[name="shipping"]:checked')?.value || "cold";
  let shippingFee = 0;
  let shippingText = "";
  if (shippingType === "cold") {
    if (weight <= 5) { shippingFee = 170; shippingText = "黑貓冷藏 1~5包，運費170元"; }
    else if (weight <= 19) { shippingFee = 235; shippingText = "黑貓冷藏 6~19包，運費235元"; }
    else { shippingFee = 0; shippingText = "黑貓冷藏 20包以上，免運費"; }
  } else if (shippingType === "post") {
    if (weight <= 4) { shippingFee = 80; shippingText = "郵局常溫 4斤內，運費80元"; }
    else if (weight <= 10) { shippingFee = 100; shippingText = "郵局常溫 5~10斤，運費100元"; }
    else { shippingFee = 0; shippingText = "郵局常溫 超過10斤，免運費"; }
  }

  const finalTotal = productTotal + shippingFee;

  // 更新全局的計算結果物件
  calculatedOrderData = {
    products,
    weight,
    productTotal,
    shippingType,
    shippingFee,
    finalTotal,
    shippingText
  };

  // 更新訂單摘要顯示
  const summaryEl = document.getElementById("orderSummary");
  summaryEl.innerHTML = `<h3>訂單明細：</h3>`;
  products.forEach(p => {
    summaryEl.innerHTML += `<div>${p.label} x ${p.qty} = $${p.subtotal}</div>`;
  });
  summaryEl.innerHTML += `<div>${shippingText}</div>`;
  summaryEl.innerHTML += `<strong style="color: red;">總金額：$${finalTotal}</strong>`;
}

// 在 DOM 加載完成後綁定事件監聽器並首次更新摘要
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", updateSummary);
    el.addEventListener("change", updateSummary);
  });
  // 頁面加載後首次調用，確保摘要是正確的
  updateSummary();
});

function submitForm() {
  // 確保在提交前數據是最新的
  updateSummary();

  const { products, weight, productTotal, shippingType, shippingFee, finalTotal } = calculatedOrderData;

  const formData = {
    orderDate: document.getElementById("orderDate").value,
    platform: document.getElementById("platform").value,
    buyerName: document.getElementById("buyerName").value,
    receiverName: document.getElementById("receiverName").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
    // 將產品列表格式化為單一字串，以便寫入 Google Sheet 的一個欄位
    products: products.map(p => `${p.label} x ${p.qty}`).join(', '),
    totalWeight: weight,
    productTotal: productTotal,
    shippingMethod: shippingType,
    shippingFee: shippingFee,
    finalTotal: finalTotal
  };

  // 請務必將此 URL 替換為您重新部署後的 Google Apps Script 網路應用程式 URL
  const scriptURL = "https://script.google.com/macros/s/AKfycbwoVDwwr1DTs58ZztfmEPqTEXU6cOdwcBoHWrRYDXZqXosMbtGBszrh8wqSi2YldKoJ/exec"; 

  const submitStatusEl = document.getElementById("submitStatus");
  submitStatusEl.innerText = "正在送出訂單..."; // 顯示正在提交的狀態
// script.js

// 用於存儲計算結果的物件，避免重複計算
let calculatedOrderData = {
  products: [],
  weight: 0,
  productTotal: 0,
  shippingType: "cold", // 預設值
  shippingFee: 0,
  finalTotal: 0,
  shippingText: ""
};

function updateSummary() {
  const inputs = document.querySelectorAll(".qty-input");
  let products = [];
  let weight = 0;
  let productTotal = 0;

  inputs.forEach(input => {
    const label = input.parentElement.querySelector('.product-label').innerText;
    const qty = Number(input.value);
    const price = Number(input.dataset.price);
    const itemWeight = Number(input.dataset.weight);
    if (qty > 0) {
      products.push({ label, qty, price, subtotal: price * qty });
      weight += qty * itemWeight;
      productTotal += price * qty;
    }
  });

  const shippingType = document.querySelector('input[name="shipping"]:checked')?.value || "cold";
  let shippingFee = 0;
  let shippingText = "";
  if (weight === 0) {
    shippingFee = 0;
    shippingText = "無選購商品，免運費";
  } else if (shippingType === "cold") {
    if (weight <= 5) { shippingFee = 170; shippingText = "黑貓冷藏 1~5包，運費170元"; }
    else if (weight <= 19) { shippingFee = 235; shippingText = "黑貓冷藏 6~19包，運費235元"; }
    else { shippingFee = 0; shippingText = "黑貓冷藏 20包以上，免運費"; }
  } else if (shippingType === "post") {
    if (weight <= 4) { shippingFee = 80; shippingText = "郵局常溫 4斤內，運費80元"; }
    else if (weight <= 10) { shippingFee = 100; shippingText = "郵局常溫 5~10斤，運費100元"; }
    else { shippingFee = 0; shippingText = "郵局常溫 超過10斤，免運費"; }
  }

  const finalTotal = productTotal + shippingFee;

  // 更新全局的計算結果物件
  calculatedOrderData = {
    products,
    weight,
    productTotal,
    shippingType,
    shippingFee,
    finalTotal,
    shippingText
  };

  // 更新訂單摘要顯示
  const summaryEl = document.getElementById("orderSummary");
  summaryEl.innerHTML = `<h3>訂單明細：</h3>`;
  products.forEach(p => {
    summaryEl.innerHTML += `<div>${p.label} x ${p.qty} = $${p.subtotal}</div>`;
  });
  summaryEl.innerHTML += `<div>${shippingText}</div>`;
  summaryEl.innerHTML += `<strong style="color: red;">總金額：$${finalTotal}</strong>`;
}

// 在 DOM 加載完成後綁定事件監聽器並首次更新摘要
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", updateSummary);
    el.addEventListener("change", updateSummary);
  });
  // 頁面加載後首次調用，確保摘要是正確的
  updateSummary();
});

function submitForm() {
  // 檢查必填欄位
  const requiredFields = ['orderDate', 'buyerName', 'address', 'phone'];
  for (let field of requiredFields) {
    if (!document.getElementById(field).value.trim()) {
      document.getElementById('submitStatus').innerText = '❌ 請填寫所有必填欄位！';
      return;
    }
  }

  // 確保在提交前數據是最新的
  updateSummary();

  const { products, weight, productTotal, shippingType, shippingFee, finalTotal } = calculatedOrderData;

  const formData = {
    orderDate: document.getElementById("orderDate").value,
    platform: document.getElementById("platform").value,
    buyerName: document.getElementById("buyerName").value,
    receiverName: document.getElementById("receiverName").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
    // 將產品列表格式化為單一字串，以便寫入 Google Sheet 的一個欄位
    products: products.map(p => `${p.label} x ${p.qty}`).join(', '),
    totalWeight: weight,
    productTotal: productTotal,
    shippingMethod: shippingType,
    shippingFee: shippingFee,
    finalTotal: finalTotal
  };

  // 請務必將此 URL 替換為您重新部署後的 Google Apps Script 網路應用程式 URL
  const scriptURL = "https://script.google.com/macros/s/AKfycbwoVDwwr1DTs58ZztfmEPqTEXU6cOdwcBoHWrRYDXZqXosMbtGBszrh8wqSi2YldKoJ/exec"; 

  const submitStatusEl = document.getElementById("submitStatus");
  submitStatusEl.innerText = "正在送出訂單..."; // 顯示正在提交的狀態

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(formData), // 將數據轉換為 JSON 字串
    headers: {
      "Content-Type": "application/json" // 告知伺服器發送的是 JSON
    }
  })
  .then(res => {
    // 檢查 HTTP 響應狀態碼，如果不是 2xx，則認為是錯誤
    if (!res.ok) {
      // 嘗試解析錯誤響應的 JSON 內容，以獲取更詳細的訊息
      return res.json().then(errorData => {
        throw new Error(errorData.message || `HTTP 錯誤：${res.status} ${res.statusText}`);
      }).catch(() => {
        // 如果無法解析 JSON 錯誤，則使用通用的 HTTP 錯誤訊息
        throw new Error(`HTTP 錯誤：${res.status} ${res.statusText}`);
      });
    }
    // 如果 HTTP 響應成功 (2xx)，則解析其 JSON 內容
    return res.json();
  })
  .then(apiResponse => {
    // 檢查 Apps Script 返回的 JSON 內容中的 'result' 欄位
    if (apiResponse.result === 'success') {
      submitStatusEl.innerText = "✅ 訂單已送出！";
      clearForm(); // 成功後清除表單
    } else {
      // Apps Script 內部處理失敗
      submitStatusEl.innerText = `❌ 送出失敗：${apiResponse.message || '未知錯誤'}`;
    }
  })
  .catch(err => {
    // 捕獲所有網路錯誤或上述 .then 中拋出的錯誤
    console.error("提交訂單時發生錯誤：", err);
    submitStatusEl.innerText = `❌ 送出失敗，請稍後再試。\n錯誤訊息：${err.message || '網路或伺服器錯誤'}`;
  });
}

// 新增一個清除表單的函數
function clearForm() {
  document.getElementById("orderDate").value = '';
  document.getElementById("platform").value = '';
  document.getElementById("buyerName").value = '';
  document.getElementById("receiverName").value = '';
  document.getElementById("address").value = '';
  document.getElementById("phone").value = '';

  // 清除數量輸入框
  document.querySelectorAll(".qty-input").forEach(input => {
    input.value = '';
  });

  // 重置運送選擇 (例如，選回預設的冷藏)
  const defaultShipping = document.querySelector('input[name="shipping"][value="cold"]');
  if (defaultShipping) {
    defaultShipping.checked = true;
  }

  // 更新摘要以反映清空的狀態
  updateSummary();
}
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(formData), // 將數據轉換為 JSON 字串
    headers: {
      "Content-Type": "application/json" // 告知伺服器發送的是 JSON
    }
  })
  .then(res => {
    // 檢查 HTTP 響應狀態碼，如果不是 2xx，則認為是錯誤
    if (!res.ok) {
      // 嘗試解析錯誤響應的 JSON 內容，以獲取更詳細的訊息
      return res.json().then(errorData => {
        throw new Error(errorData.message || `HTTP 錯誤：${res.status} ${res.statusText}`);
      }).catch(() => {
        // 如果無法解析 JSON 錯誤，則使用通用的 HTTP 錯誤訊息
        throw new Error(`HTTP 錯誤：${res.status} ${res.statusText}`);
      });
    }
    // 如果 HTTP 響應成功 (2xx)，則解析其 JSON 內容
    return res.json();
  })
  .then(apiResponse => {
    // 檢查 Apps Script 返回的 JSON 內容中的 'result' 欄位
    if (apiResponse.result === 'success') {
      submitStatusEl.innerText = "✅ 訂單已送出！";
      clearForm(); // 成功後清除表單
    } else {
      // Apps Script 內部處理失敗
      submitStatusEl.innerText = `❌ 送出失敗：${apiResponse.message || '未知錯誤'}`;
    }
  })
  .catch(err => {
    // 捕獲所有網路錯誤或上述 .then 中拋出的錯誤
    console.error("提交訂單時發生錯誤：", err);
    submitStatusEl.innerText = `❌ 送出失敗，請稍後再試。\n錯誤訊息：${err.message || '網路或伺服器錯誤'}`;
  });
}

// 新增一個清除表單的函數
function clearForm() {
  document.getElementById("orderDate").value = '';
  document.getElementById("platform").value = '';
  document.getElementById("buyerName").value = '';
  document.getElementById("receiverName").value = '';
  document.getElementById("address").value = '';
  document.getElementById("phone").value = '';

  // 清除數量輸入框
  document.querySelectorAll(".qty-input").forEach(input => {
    input.value = '';
  });

  // 重置運送選擇 (例如，選回預設的冷藏)
  const defaultShipping = document.querySelector('input[name="shipping"][value="cold"]');
  if (defaultShipping) {
    defaultShipping.checked = true;
  }

  // 更新摘要以反映清空的狀態
  updateSummary();
}
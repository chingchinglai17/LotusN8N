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
  if (weight === 0) { // 這是來自您提供的 script.js 較新版本的邏輯
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

// --- 整合修改後的 submitForm 函數 ---
function submitForm() {
  // 檢查必填欄位 (來自您提供的 script.js 較新版本)
  const requiredFields = ['orderDate', 'buyerName', 'address', 'phone'];
  for (let field of requiredFields) {
    if (!document.getElementById(field).value.trim()) {
      document.getElementById('submitStatus').innerText = '❌ 請填寫所有必填欄位！';
      return;
    }
  }

  // 確保在提交前數據是最新的
  updateSummary(); // 此函數已填充 calculatedOrderData

  const { products, weight, productTotal, shippingType, shippingFee, finalTotal } = calculatedOrderData;

  // 準備給 Google Sheet 的商品數量
  const productQuantitiesForSheet = {
    "去膜去芯": 0,
    "含膜去芯": 0,
    "含膜含芯": 0,
    "蓮藕粉": 0,
    "蓮芯": 0
  };

  // 這個對照表是為了將 HTML 中的完整產品標籤 (如 "去膜去芯1斤/450元")
  // 轉換為 productQuantitiesForSheet 中使用的較短鍵名
  const productLabelToSheetKey = {
    "去膜去芯1斤/450元": "去膜去芯",
    "含膜去芯1斤/420元": "含膜去芯",
    "含膜含芯1斤/400元": "含膜含芯",
    "蓮藕粉1斤/500元": "蓮藕粉",
    "蓮芯100g/125元": "蓮芯"
  };

  products.forEach(p => {
    const sheetKey = productLabelToSheetKey[p.label];
    if (sheetKey) {
      productQuantitiesForSheet[sheetKey] = p.qty;
    }
  });

  const formData = {
    orderDate: document.getElementById("orderDate").value,
    platform: document.getElementById("platform").value,
    buyerName: document.getElementById("buyerName").value,
    receiverName: document.getElementById("receiverName").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,

    // 各別商品數量
    qty_peeled_cored: productQuantitiesForSheet["去膜去芯"],
    qty_unpeeled_cored: productQuantitiesForSheet["含膜去芯"],
    qty_unpeeled_uncored: productQuantitiesForSheet["含膜含芯"],
    qty_lotus_powder: productQuantitiesForSheet["蓮藕粉"],
    qty_lotus_plumule: productQuantitiesForSheet["蓮芯"],

    totalWeight: weight,
    productTotal: productTotal,
    shippingMethod: shippingType, // Apps Script 預期 'shippingMethod'
    shippingFee: shippingFee,
    finalTotal: finalTotal
  };

  // 請務必將此 URL 替換為您重新部署後的 Google Apps Script 網路應用程式 URL
  // 這裡保留您 script.js 中原有的 URL
  const scriptURL = "https://script.google.com/macros/s/AKfycbwoVDwwr1DTs58ZztfmEPqTEXU6cOdwcBoHWrRYDXZqXosMbtGBszrh8wqSi2YldKoJ/exec"; 

  const submitStatusEl = document.getElementById("submitStatus");
  submitStatusEl.innerText = "正在送出訂單...";

  // fetch 的錯誤處理邏輯來自您提供的 script.js 較新版本
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(formData), // 將數據轉換為 JSON 字串
    headers: {
      "Content-Type": "application/json" // 告知伺服器發送的是 JSON
    }
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(errorData => {
        throw new Error(errorData.message || `HTTP 錯誤：${res.status} ${res.statusText}`);
      }).catch(() => {
        throw new Error(`HTTP 錯誤：${res.status} ${res.statusText}`);
      });
    }
    return res.json();
  })
  .then(apiResponse => {
    if (apiResponse.result === 'success') {
      submitStatusEl.innerText = "✅ 訂單已送出！";
      clearForm(); // 成功後清除表單
    } else {
      submitStatusEl.innerText = `❌ 送出失敗：${apiResponse.message || '未知錯誤'}`;
    }
  })
  .catch(err => {
    console.error("提交訂單時發生錯誤：", err);
    submitStatusEl.innerText = `❌ 送出失敗，請稍後再試。\n錯誤訊息：${err.message || '網路或伺服器錯誤'}`;
  });
}
// --- submitForm 函數結束 ---

// 新增一個清除表單的函數 (來自您提供的 script.js 較新版本)
function clearForm() {
  document.getElementById("orderDate").value = '';
  document.getElementById("platform").value = ''; // 您原始碼中這行是 document.getElementById("platform").value = ''; 我假設這是對的
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
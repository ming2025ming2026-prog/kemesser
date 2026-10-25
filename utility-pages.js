// Loaded only by forms, downloads, comparison and local-history pages.
(() => {
  const { isEnglish, translateProductName, updateQueryState } = window.KEMESSER_UI;
  const productOptions = document.querySelectorAll("[data-product-options]");
  productOptions.forEach((select) => {
    const englishProductNames = {
      "thawhome-tube": "ThawHome Tube",
      "thawhome-bag": "ThawHome Bag"
    };
    select.innerHTML = `<option value="">${isEnglish ? "Please select" : "请选择"}</option>${(window.KEMESSER_PRODUCTS || []).map((item) => {
      const label = isEnglish ? (englishProductNames[item.id] || item.name) : item.name;
      return `<option value="${label}">${label}</option>`;
    }).join("")}<option value="${isEnglish ? "Other" : "其他"}">${isEnglish ? "Other" : "其他"}</option>`;
    const rawProduct = new URLSearchParams(location.search).get("product");
    const requestedProduct = rawProduct ? translateProductName(rawProduct) : "";
    if (requestedProduct && Array.from(select.options).some((option) => option.value === requestedProduct)) {
      select.value = requestedProduct;
    }
    select.addEventListener("change", () => updateQueryState("product", select.value));
  });

  const manualTable = document.querySelector("[data-manual-table]");
  document.querySelectorAll(".table-card").forEach((region) => {
    region.tabIndex = 0;
    region.setAttribute("role", "region");
    region.setAttribute("aria-label", region.querySelector("table")?.getAttribute("aria-label") || (isEnglish ? "Product table, scroll horizontally" : "产品表格，可横向滚动"));
  });
  const englishSeries = { "复苏系列": "Thawing", "冻存系列": "Cryopreservation", "冷冻操作": "Cold Handling" };
  const englishTypes = {
    "管式细胞复苏仪": "Tube Cell Thawing System",
    "袋式细胞复苏仪": "Bag Cell Thawing System",
    "程序降温盒": "Controlled-rate Freezing Container"
  };
  const filterParams = new URLSearchParams(location.search);
  document.querySelectorAll("[data-manual-filter], [data-manual-search], [data-compare-search]").forEach((control) => {
    const key = control.dataset.manualFilter || "q";
    const value = filterParams.get(key);
    if (value && (control.tagName !== "SELECT" || Array.from(control.options).some((option) => option.value === value))) control.value = value;
  });
  const filterBar = document.querySelector(".filter-bar");
  const filterStatus = document.createElement("p");
  filterStatus.className = "filter-status";
  filterStatus.setAttribute("role", "status");
  filterStatus.setAttribute("aria-live", "polite");
  if (document.querySelector("[data-manual-table], [data-compare-table]")) filterBar?.after(filterStatus);
  const renderManuals = () => {
    if (!manualTable || !window.KEMESSER_MANUALS) return;
    const series = document.querySelector('[data-manual-filter="series"]')?.value || "";
    const language = document.querySelector('[data-manual-filter="language"]')?.value || "";
    const query = (document.querySelector("[data-manual-search]")?.value || "").trim().toLowerCase();
    const rows = KEMESSER_MANUALS.filter((item) => {
      const translatedText = isEnglish
        ? `${englishSeries[item.series] || ""} ${englishTypes[item.type] || ""} ${item.language === "中文" ? "Chinese" : item.language}`
        : "";
      const text = `${item.product} ${translateProductName(item.product)} ${item.series} ${item.type} ${item.language} ${translatedText}`.toLowerCase();
      return (!series || item.series === series) && (!language || item.language === language) && (!query || text.includes(query));
    });
    manualTable.querySelector("tbody").innerHTML = rows.map((item) => {
      const product = isEnglish ? item.product.replace(" 管式", " Tube").replace(" 袋式", " Bag") : item.product;
      const seriesLabel = isEnglish ? (englishSeries[item.series] || item.series) : item.series;
      const typeLabel = isEnglish ? (englishTypes[item.type] || item.type) : item.type;
      const languageLabel = isEnglish && item.language === "中文" ? "Chinese" : item.language;
      const file = isEnglish ? `../${item.file}` : item.file;
      return `<tr><td>${product}</td><td>${seriesLabel}</td><td>${typeLabel}</td><td>${languageLabel}</td><td>${item.version}</td><td>${item.updated}</td><td>${item.size}</td><td><a class="table-link" href="${file}" target="_blank" rel="noreferrer" aria-label="${product} - ${languageLabel} PDF">${isEnglish ? "Download Manual" : "下载说明书"}</a></td></tr>`;
    }).join("");
    const empty = document.querySelector("[data-manual-empty]");
    if (empty) empty.hidden = rows.length > 0;
    filterStatus.textContent = isEnglish ? `${rows.length} manuals` : `共 ${rows.length} 份说明书`;
  };
  document.querySelectorAll("[data-manual-filter], [data-manual-search]").forEach((node) => node.addEventListener("input", () => {
    updateQueryState(node.dataset.manualFilter || "q", node.value);
    renderManuals();
  }));
  renderManuals();

  const compareTable = document.querySelector("[data-compare-table]");
  const compareEmpty = document.createElement("div");
  compareEmpty.className = "empty-state";
  compareEmpty.hidden = true;
  compareEmpty.textContent = isEnglish ? "No matching products. Try another keyword or contact Kemesser for help." : "未找到匹配产品，请更换关键词，或联系科默斯协助选型。";
  compareTable?.closest(".table-card")?.after(compareEmpty);
  const englishProductDetails = {
    thawline: ["Tube Cell Thawing System", "Cryovials, test tubes, injection vials and other tube-format samples", "Four-channel parallel thawing / Two-level access control / SD card storage / PC export"],
    "thawline-pro": ["Tube Cell Thawing System", "Standardized laboratories with multiple users, roles and sample batches", "Three-level access / Run profiles / Bluetooth printing / Temperature curves"],
    thawwaker: ["Bag Cell Thawing System", "Cryobags, cell bags, blood bags and other bag-format samples", "Sample-volume adaptation / Conforming heated lid / Emergency stop / Dynamic sensing"],
    "thawhome-tube": ["Tube Cell Thawing System", "Multiple tube formats", "Water-free thawing / Four independent channels / Real-time alarms / Energy-efficient operation"],
    "thawhome-bag": ["Bag Cell Thawing System", "Bag-format frozen samples", "Water-free thawing / Telescopic heated lid / Real-time alarms / Energy-efficient operation"],
    mobithaw: ["Portable Cell Thawing System", "Mobile workflows, small laboratories and temporary processing", "Type-C charging / Water-free thawing / Data export / Ozone disinfection"],
    cellhome: ["Controlled-rate Freezing Container", "Controlled cooling and standardized sample management for cell cryopreservation", "No auxiliary materials required / Consistent cooling rate / Multiple formats / Reusable"],
    coolhome: ["Ice-free Workstation", "Low-temperature handling and sample processing", "Ice-free operation / Sample processing / Multiple workstation configurations"],
    holderhome: ["Ice-free Low-temperature Container", "Short-term cold storage and sample handling", "Short-term cold storage / Ice-free operation / Benchtop use"],
    blockhome: ["Tube Module", "Positions for multiple test tube and cryovial formats", "Modular positions / Separate sample areas / Batch handling"],
    transhome: ["Dry Ice Transport Container", "Low-temperature sample transport and transfer", "Cold transport / Protection during handling / Flexible transfer applications"],
    icehome: ["Ice Pan and Bucket", "Laboratory low-temperature handling", "Cooling support / Flexible combinations / Easy handling"]
  };
  const renderCompare = () => {
    if (!compareTable || !window.KEMESSER_PRODUCTS) return;
    const query = (document.querySelector("[data-compare-search]")?.value || "").trim().toLowerCase();
    const rows = KEMESSER_PRODUCTS.filter((item) => {
      const translated = englishProductDetails[item.id] || [];
      return `${item.name} ${translateProductName(item.name)} ${item.type} ${item.scenario} ${item.features} ${translated.join(" ")}`.toLowerCase().includes(query);
    });
    compareTable.querySelector("tbody").innerHTML = rows.map((item) => {
      const manuals = window.KEMESSER_MANUALS || [];
      const manual = manuals.find((m) => m.productId === item.id && m.language === (isEnglish ? "English" : "中文")) || manuals.find((m) => m.productId === item.id);
      const manualFile = manual ? (isEnglish ? `../${manual.file}` : manual.file) : "";
      const translated = englishProductDetails[item.id] || [item.type, item.scenario, item.features];
      const productName = isEnglish ? item.name.replace(" 管式", " Tube").replace(" 袋式", " Bag") : item.name;
      return `<tr><td><strong>${productName}</strong><br><a class="table-link" href="${item.url}">${isEnglish ? "View Details" : "查看详情"}</a></td><td>${isEnglish ? translated[0] : item.type}</td><td>${isEnglish ? translated[1] : item.scenario}</td><td>${isEnglish ? translated[2] : item.features}</td><td>${manual ? `<a class="table-link" href="${manualFile}" target="_blank" rel="noreferrer" aria-label="${productName} PDF">${isEnglish ? "Download Manual" : "下载说明书"}</a>` : `<a class="table-link" href="inquiry.html?product=${encodeURIComponent(productName)}">${isEnglish ? "Request documentation" : "联系获取资料"}</a>`}</td></tr>`;
    }).join("");
    compareEmpty.hidden = rows.length > 0;
    filterStatus.textContent = isEnglish ? `${rows.length} products` : `共 ${rows.length} 款产品`;
  };
  document.querySelector("[data-compare-search]")?.addEventListener("input", (event) => {
    updateQueryState("q", event.target.value);
    renderCompare();
  });
  renderCompare();

  document.querySelectorAll("[data-kemesser-form]").forEach((form) => {
    let hasUnsavedChanges = false;
    const warnBeforeLeaving = event => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const message = form.querySelector("[data-form-message]");
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    const localCopyLabel = document.createElement("label");
    localCopyLabel.className = "privacy-check";
    const localCopy = document.createElement("input");
    localCopy.type = "checkbox";
    localCopy.dataset.localCopy = "";
    localCopyLabel.append(localCopy, document.createTextNode(isEnglish
      ? "Keep a copy in this browser for 7 days (do not select on shared devices)."
      : "在此浏览器保留副本 7 天（共用设备请勿勾选）。"));
    form.querySelector('button[type="submit"]').before(localCopyLabel);
    const showFormMessage = (text, state) => {
      message.textContent = text;
      message.dataset.state = state;
    };
    form.addEventListener("input", () => {
      if (!hasUnsavedChanges) window.addEventListener("beforeunload", warnBeforeLeaving);
      hasUnsavedChanges = true;
      if (form.dataset.submitting !== "true") showFormMessage("", "idle");
    });
    form.querySelectorAll('input[type="file"]').forEach((input) => {
      input.addEventListener("change", () => {
        const files = Array.from(form.querySelectorAll('input[type="file"]')).flatMap((el) => Array.from(el.files || []));
        const unsupported = files.some(file => !/\.(png|jpe?g|webp|pdf|txt)$/i.test(file.name));
        input.setCustomValidity(unsupported
          ? (isEnglish ? "Choose a PNG, JPG, JPEG, WebP, PDF or TXT file." : "请选择 PNG、JPG、JPEG、WebP、PDF 或 TXT 文件。")
          : files.reduce((size, file) => size + file.size, 0) > 10000000
            ? (isEnglish ? "Attachments must total 10 MB or less." : "附件总大小不能超过 10 MB。") : "");
      });
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.submitting === "true") return;
      form.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not([type="hidden"]), textarea').forEach(control => {
        control.value = control.value.trim();
      });
      if (!form.reportValidity()) return;
      const submit = form.querySelector('button[type="submit"]');
      const isSupport = form.dataset.formType === "support";
      const originalLabel = isEnglish
        ? (isSupport ? "Submit Service Request" : "Submit Inquiry")
        : (isSupport ? "提交售后工单" : "提交询盘");

      if (location.protocol === "file:" || !navigator.onLine) {
        showFormMessage(isEnglish
          ? "Please connect to the internet and submit through www.kemesser.com, or contact us by email."
          : "请连接网络后通过 www.kemesser.com 提交，或直接通过邮箱联系科默斯。", "error");
        return;
      }
      submit.disabled = true;
      form.dataset.submitting = "true";
      message.setAttribute("role", "status");
      message.setAttribute("aria-live", "polite");
      form.setAttribute("aria-busy", "true");
      submit.textContent = isEnglish ? "Submitting…" : "提交中…";
      showFormMessage(isEnglish ? "Sending your request…" : "正在发送，请稍候…", "pending");
      const requestController = new AbortController();
      const requestTimeout = window.setTimeout(() => requestController.abort(), 30000);
      const lockedControls = [];

      try {
        const formData = new FormData(form);
        const keepLocalCopy = localCopy.checked;
        const submittedData = Object.fromEntries(Array.from(formData.entries(), ([key, value]) => [key, value instanceof File ? value.name : value]));
        form.querySelectorAll("input, select, textarea").forEach((control) => {
          if (!control.disabled) {
            control.disabled = true;
            lockedControls.push(control);
          }
        });
        const visitorEmail = formData.get(isEnglish ? "Email" : "邮箱");
        formData.set("_subject", isEnglish
          ? (isSupport ? "[Kemesser Website] After-sales Service Request" : "[Kemesser Website] Sales Inquiry")
          : (isSupport ? "【科默斯官网】售后服务工单" : "【科默斯官网】售前咨询"));
        formData.set("_cc", "khaleesi@kemesser.com,chens@kemesser.com");
        formData.set("_template", "table");
        formData.set("_url", window.location.href);
        formData.set(isEnglish ? "Page" : "提交页面", window.location.href);
        formData.set(isEnglish ? "Submitted at" : "提交时间", new Date().toISOString());
        if (visitorEmail) formData.set("_replyto", visitorEmail);

        const response = await fetch("https://formsubmit.co/ajax/andy@kemesser.com", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
          signal: requestController.signal
        });
        if (!response.ok) throw new Error("Form submission failed");
        const result = await response.json();
        if (result.success !== true && result.success !== "true") throw new Error("Form submission rejected");

        // Browser storage is optional; a storage failure must not report a sent message as failed.
        if (keepLocalCopy) {
          try {
            const records = readLocalRecords();
            records.unshift({ type: form.dataset.formType, createdAt: new Date().toLocaleString(), expiresAt: Date.now() + 7 * 86400000, data: submittedData });
            localStorage.setItem("kemesser-submissions", JSON.stringify(records.slice(0, 50)));
          } catch (_) { /* Private browsing or storage quotas may prevent local history. */ }
        }

        showFormMessage(isEnglish
          ? (isSupport
            ? "Your service request has been submitted. The Kemesser technical support team will investigate using the information provided. Please keep your phone or email available for follow-up."
            : "Your inquiry has been submitted. The Kemesser team will contact you shortly.")
          : (isSupport
            ? "您的售后工单已提交成功。科默斯技术支持团队将根据您提供的信息进行排查，请保持电话或邮箱畅通。"
            : "提交成功，科默斯团队将尽快与您联系。"), "success");
        hasUnsavedChanges = false;
        window.removeEventListener("beforeunload", warnBeforeLeaving);
        form.reset();
        updateQueryState("product", "");
      } catch (error) {
        showFormMessage(error.name === "AbortError"
          ? (isEnglish ? "The request timed out. Delivery could not be confirmed. Check with Kemesser before resubmitting, or email khaleesi@kemesser.com."
            : "发送超时，暂时无法确认是否送达。请先联系科默斯确认，避免重复提交，也可发送邮件至 andy@kemesser.com。")
          : (isEnglish ? "Submission failed. Please try again later or email khaleesi@kemesser.com directly."
            : "提交未成功，请稍后重试或直接发送邮件至 andy@kemesser.com。"), "error");
      } finally {
        window.clearTimeout(requestTimeout);
        lockedControls.forEach((control) => { control.disabled = false; });
        submit.disabled = false;
        delete form.dataset.submitting;
        form.removeAttribute("aria-busy");
        submit.textContent = originalLabel;
      }
    });
  });

  const recordsList = document.querySelector("[data-records-list]");
  function readLocalRecords() {
    const stored = JSON.parse(localStorage.getItem("kemesser-submissions") || "[]");
    if (!Array.isArray(stored)) return [];
    const records = stored.filter(record => record && typeof record === "object" && (!record.expiresAt || record.expiresAt > Date.now()));
    if (records.length !== stored.length) localStorage.setItem("kemesser-submissions", JSON.stringify(records));
    return records;
  }
  const renderRecords = () => {
    if (!recordsList) return;
    let records = [];
    try {
      records = readLocalRecords();
    } catch (_) { /* Local history may be unavailable. */ }
    recordsList.replaceChildren();
    records.forEach((record) => {
      const article = document.createElement("article");
      article.className = "record-card";
      const heading = document.createElement("h2");
      heading.textContent = `${record.type === "support" ? "售后工单" : "售前询盘"} · ${record.createdAt}`;
      const details = document.createElement("pre");
      details.textContent = JSON.stringify(record.data, null, 2);
      article.append(heading, details);
      recordsList.append(article);
    });
    if (!records.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "暂无提交记录。";
      recordsList.append(empty);
    }
  };
  document.querySelector("[data-export-records]")?.addEventListener("click", () => {
    let records;
    try { records = readLocalRecords(); } catch (_) { alert("浏览器存储不可用，无法导出记录。请检查浏览器隐私设置。"); return; }
    const blob = new Blob([JSON.stringify(records)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kemesser-submissions.json";
    link.click();
    URL.revokeObjectURL(url);
  });
  document.querySelector("[data-clear-records]")?.addEventListener("click", () => {
    if (confirm("确认清空本地提交记录？")) {
      try { localStorage.removeItem("kemesser-submissions"); } catch (_) { alert("浏览器存储不可用，无法清空记录。请检查浏览器隐私设置。"); return; }
      renderRecords();
    }
  });
  renderRecords();
})();

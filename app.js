const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const heroVideo = document.querySelector("[data-hero-video]");
const footer = document.querySelector(".site-footer");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

menuButton?.setAttribute("aria-expanded", "false");

document.body.classList.add("page-enter");

if (heroVideo) {
  let heroVideoLoaded = false;
  const tryPlayHeroVideo = () => {
    if (document.visibilityState === "hidden") return;
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    heroVideo.play().catch(() => {});
  };

  const loadHeroVideo = () => {
    if (heroVideoLoaded) {
      tryPlayHeroVideo();
      return;
    }
    heroVideoLoaded = true;
    heroVideo.querySelectorAll("source[data-src]").forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute("data-src");
    });
    heroVideo.load();
    tryPlayHeroVideo();
  };

  heroVideo.addEventListener("loadeddata", tryPlayHeroVideo);
  heroVideo.addEventListener("canplay", tryPlayHeroVideo);
  document.addEventListener("visibilitychange", tryPlayHeroVideo);
  document.addEventListener("pointerdown", tryPlayHeroVideo, { once: true, passive: true });
  document.addEventListener("touchstart", tryPlayHeroVideo, { once: true, passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHeroVideo, { once: true });
  } else {
    loadHeroVideo();
  }
}

if (footer) {
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="assets/brand/kemesser-logo.png" alt="Kemesser Technology" />
        <p>专注细胞冻存、复苏与冷冻操作低温流程，为科研、生物样本库、医院与实验室用户提供稳定、规范、可追溯的产品方案。</p>
        <div class="footer-actions">
          <a class="footer-button primary" href="inquiry.html">售前咨询</a>
          <a class="footer-button" href="support.html">售后服务</a>
          <a class="footer-button" href="downloads.html">下载中心</a>
        </div>
      </div>
      <div class="footer-col">
        <h3>网站导航</h3>
        <a href="index.html">首页</a>
        <a href="about.html">关于我们</a>
        <a href="downloads.html">下载中心</a>
      </div>
      <div class="footer-col">
        <h3>服务与联系</h3>
        <a href="inquiry.html">售前咨询</a>
        <a href="support.html">售后服务</a>
        <a href="contact.html">联系我们</a>
      </div>
      <div class="footer-col">
        <h3>产品系列</h3>
        <a href="thawing.html">复苏系列</a>
        <a href="cryo.html">冻存系列</a>
        <a href="cold-operation.html">冷冻操作</a>
      </div>
      <div class="footer-col">
        <h3>重点产品</h3>
        <a href="product-thawline.html">ThawLINE</a>
        <a href="product-thawline-pro.html">ThawLINE Pro</a>
        <a href="product-thawwaker.html">ThawWaker</a>
        <a href="product-cellhome.html">CellHome</a>
      </div>
      <div class="footer-contact">
        <h3>联系方式</h3>
        <strong>电话</strong>
        <a href="tel:057187156759">0571-87156759</a>
        <a href="tel:057187156259">0571-87156259</a>
        <strong>邮箱</strong>
        <a href="mailto:andy@kemesser.com">andy@kemesser.com</a>
        <a href="mailto:rain@kemesser.com">rain@kemesser.com</a>
        <a href="mailto:demi@kemesser.com">demi@kemesser.com</a>
        <strong>地址</strong>
        <a href="contact.html">浙江省杭州市上城区丁兰街道桃花湖慧星中心1号楼610室、611室</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 杭州科默斯科技有限公司</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">浙ICP备13016285号-2</a>
    </div>
  `;
}

const currentFile = location.pathname.split("/").pop() || "index.html";
const servicePages = new Set(["inquiry.html", "support.html", "contact.html"]);
const inquiryProductByPage = {
  "product-thawline.html": "ThawLINE",
  "product-thawline-pro.html": "ThawLINE Pro",
  "product-thawwaker.html": "ThawWaker",
  "product-thawhome.html": "ThawHome 管式",
  "product-thawhome-bag.html": "ThawHome 袋式",
  "product-mobithaw.html": "MobiThaw",
  "product-cellhome.html": "CellHome",
  "product-coolhome.html": "CoolHome",
  "product-holderhome.html": "HolderHome",
  "product-blockhome.html": "BlockHome",
  "product-transhome.html": "TransHome",
  "product-icehome.html": "IceHome"
};

if (inquiryProductByPage[currentFile]) {
  document.querySelectorAll('.detail-copy .btn[href^="inquiry.html"]').forEach((link) => {
    link.href = `inquiry.html?product=${encodeURIComponent(inquiryProductByPage[currentFile])}`;
  });
}

document.querySelectorAll(".main-nav").forEach((nav) => {
  let downloadsLink = Array.from(nav.children).find(
    (item) => item.matches?.('a[href="downloads.html"]')
  );

  if (!downloadsLink) {
    downloadsLink = document.createElement("a");
    downloadsLink.href = "downloads.html";
    downloadsLink.textContent = "下载中心";
    nav.append(downloadsLink);
  }

  Array.from(nav.children).forEach((item) => {
    if (
      item.matches?.('a[href="inquiry.html"], a[href="support.html"], a[href="contact.html"]')
    ) {
      item.remove();
    }
  });

  const dropdown = document.createElement("div");
  dropdown.className = "nav-dropdown";
  dropdown.innerHTML = `
    <button class="nav-dropdown-trigger" type="button" aria-expanded="false" aria-haspopup="true">
      <span>服务与联系</span>
    </button>
    <div class="nav-dropdown-menu">
      <a href="inquiry.html">售前咨询</a>
      <a href="support.html">售后服务</a>
      <a href="contact.html">联系我们</a>
    </div>
  `;
  downloadsLink.insertAdjacentElement("afterend", dropdown);

  nav.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === currentFile) link.setAttribute("aria-current", "page");
  });

  const trigger = dropdown.querySelector(".nav-dropdown-trigger");
  if (servicePages.has(currentFile)) trigger.setAttribute("aria-current", "page");

  trigger.addEventListener("click", () => {
    const willOpen = !dropdown.classList.contains("is-open");
    document.querySelectorAll(".nav-dropdown.is-open").forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
    });
    dropdown.classList.toggle("is-open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
});


document.querySelectorAll("[data-card-link]").forEach((card) => {
  if (card.matches("a[href]")) return;
  card.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = card.dataset.cardLink || card.getAttribute("href");
    if (href) window.location.href = href;
  });
});
document.querySelectorAll(".nav-cta").forEach((cta) => {
  if (!cta.href.includes("mailto:")) {
    cta.href = "inquiry.html";
    cta.textContent = "售前咨询";
  }
});

const syncScrollState = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 18);

  if (heroVideo && !reducedMotion) {
    const progress = Math.min(y / window.innerHeight, 1);
    document.documentElement.style.setProperty("--hero-scale", String(1 + progress * 0.08));
    document.documentElement.style.setProperty("--hero-brightness", String(0.66 - progress * 0.16));
  }
};

syncScrollState();
let scrollFrame = 0;
window.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    syncScrollState();
    scrollFrame = 0;
  });
}, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("is-open") || false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "打开菜单");
    document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
    });
  });
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
    if (dropdown.contains(event.target)) return;
    dropdown.classList.remove("is-open");
    dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  header?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "打开菜单");
  document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
    dropdown.classList.remove("is-open");
    dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
  });
});

if (reducedMotion) {
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" }
  );

  document.querySelectorAll(".reveal").forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    revealObserver.observe(node);
  });
}

if (!reducedMotion) {
  document.querySelectorAll(".btn, .nav-cta, .footer-button").forEach((control) => {
    control.addEventListener("pointerdown", (event) => {
      const rect = control.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      control.append(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });
}

const productOptions = document.querySelectorAll("[data-product-options]");
productOptions.forEach((select) => {
  select.innerHTML = `<option value="">请选择</option>${(window.KEMESSER_PRODUCTS || []).map((item) => `<option value="${item.name}">${item.name}</option>`).join("")}<option value="其他">其他</option>`;
  const requestedProduct = new URLSearchParams(location.search).get("product");
  if (requestedProduct && Array.from(select.options).some((option) => option.value === requestedProduct)) {
    select.value = requestedProduct;
  }
});

const manualTable = document.querySelector("[data-manual-table]");
const renderManuals = () => {
  if (!manualTable || !window.KEMESSER_MANUALS) return;
  const series = document.querySelector('[data-manual-filter="series"]')?.value || "";
  const language = document.querySelector('[data-manual-filter="language"]')?.value || "";
  const query = (document.querySelector("[data-manual-search]")?.value || "").trim().toLowerCase();
  const rows = KEMESSER_MANUALS.filter((item) => {
    const text = `${item.product} ${item.series} ${item.type} ${item.language}`.toLowerCase();
    return (!series || item.series === series) && (!language || item.language === language) && (!query || text.includes(query));
  });
  manualTable.querySelector("tbody").innerHTML = rows.map((item) => `<tr><td>${item.product}</td><td>${item.series}</td><td>${item.type}</td><td>${item.language}</td><td>${item.version}</td><td>${item.updated}</td><td>${item.size}</td><td><a class="table-link" href="${item.file}" target="_blank" rel="noreferrer">下载说明书</a></td></tr>`).join("");
  const empty = document.querySelector("[data-manual-empty]");
  if (empty) empty.hidden = rows.length > 0;
};
document.querySelectorAll("[data-manual-filter], [data-manual-search]").forEach((node) => node.addEventListener("input", renderManuals));
renderManuals();

const compareTable = document.querySelector("[data-compare-table]");
const renderCompare = () => {
  if (!compareTable || !window.KEMESSER_PRODUCTS) return;
  const query = (document.querySelector("[data-compare-search]")?.value || "").trim().toLowerCase();
  const rows = KEMESSER_PRODUCTS.filter((item) => `${item.name} ${item.type} ${item.scenario} ${item.features}`.toLowerCase().includes(query));
  compareTable.querySelector("tbody").innerHTML = rows.map((item) => {
    const manual = (window.KEMESSER_MANUALS || []).find((m) => m.productId === item.id);
    return `<tr><td><strong>${item.name}</strong><br><a class="table-link" href="${item.url}">查看详情</a></td><td>${item.type}</td><td>${item.scenario}</td><td>${item.features}</td><td>${manual ? `<a class="table-link" href="${manual.file}" target="_blank" rel="noreferrer">下载说明书</a>` : "说明书暂未上传"}</td></tr>`;
  }).join("");
};
document.querySelector("[data-compare-search]")?.addEventListener("input", renderCompare);
renderCompare();

document.querySelectorAll("[data-kemesser-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const message = form.querySelector("[data-form-message]");
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = "提交中...";
    const record = {
      type: form.dataset.formType,
      createdAt: new Date().toLocaleString(),
      data: Object.fromEntries(new FormData(form).entries())
    };
    const records = JSON.parse(localStorage.getItem("kemesser-submissions") || "[]");
    records.unshift(record);
    localStorage.setItem("kemesser-submissions", JSON.stringify(records));
    setTimeout(() => {
      message.textContent = form.dataset.formType === "support"
        ? "您的售后工单已提交成功。科默斯技术支持团队将根据您提供的信息进行排查，请保持电话或邮箱畅通。"
        : "提交成功，科默斯团队将尽快与您联系。";
      form.reset();
      submit.disabled = false;
      submit.textContent = form.dataset.formType === "support" ? "提交售后工单" : "提交询盘";
    }, 400);
  });
});

const recordsList = document.querySelector("[data-records-list]");
const renderRecords = () => {
  if (!recordsList) return;
  const records = JSON.parse(localStorage.getItem("kemesser-submissions") || "[]");
  recordsList.innerHTML = records.length
    ? records.map((record) => `<article class="record-card"><h2>${record.type === "support" ? "售后工单" : "售前询盘"} · ${record.createdAt}</h2><pre>${JSON.stringify(record.data, null, 2)}</pre></article>`).join("")
    : `<div class="empty-state">暂无提交记录。</div>`;
};
document.querySelector("[data-export-records]")?.addEventListener("click", () => {
  const blob = new Blob([localStorage.getItem("kemesser-submissions") || "[]"], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kemesser-submissions.json";
  link.click();
  URL.revokeObjectURL(url);
});
document.querySelector("[data-clear-records]")?.addEventListener("click", () => {
  if (confirm("确认清空本地提交记录？")) {
    localStorage.removeItem("kemesser-submissions");
    renderRecords();
  }
});
renderRecords();

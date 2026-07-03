const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const heroVideo = document.querySelector("[data-hero-video]");
const footer = document.querySelector(".site-footer");

document.body.classList.add("page-enter");

if (heroVideo) {
  const loadHeroVideo = () => {
    heroVideo.querySelectorAll("source[data-src]").forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute("data-src");
    });
    heroVideo.load();
    heroVideo.play().catch(() => {});
  };
  const scheduleHeroVideo = () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadHeroVideo, { timeout: 1400 });
    } else {
      setTimeout(loadHeroVideo, 700);
    }
  };
  if (document.readyState === "complete") scheduleHeroVideo();
  else window.addEventListener("load", scheduleHeroVideo, { once: true });
}

if (footer) {
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="assets/brand/kemesser-logo.png" alt="Kemesser Technology" />
        <p>专注细胞冻存、复苏与冷冻操作低温流程，为科研、生物样本库、医院与实验室用户提供稳定、规范、可追溯的产品方案。</p>
        <div class="footer-actions">
          <a class="footer-button primary" href="inquiry.html">咨询产品</a>
          <a class="footer-button" href="downloads.html">下载中心</a>
          <a class="footer-button" href="tel:057187156759">拨打电话</a>
        </div>
      </div>
      <div class="footer-col">
        <h3>网站导航</h3>
        <a href="index.html">首页</a>
        <a href="about.html">关于我们</a>
        <a href="downloads.html">下载中心</a>
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
        <a href="contact.html">浙江省杭州市上城区笕丁路168号14幢206室</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 杭州科默斯科技有限公司</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">浙ICP备13016285号-2</a>
    </div>
  `;
}

const currentFile = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav").forEach((nav) => {
  const existing = Array.from(nav.querySelectorAll("a")).map((a) => a.getAttribute("href"));
  [
    ["downloads.html", "下载中心"],
  ].forEach(([href, label]) => {
    if (!existing.includes(href)) {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      nav.insertBefore(link, nav.querySelector('a[href="contact.html"]'));
    }
  });
  nav.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === currentFile) link.setAttribute("aria-current", "page");
  });
});

document.querySelectorAll(".nav-cta").forEach((cta) => {
  if (!cta.href.includes("mailto:")) cta.href = "inquiry.html";
});

const syncScrollState = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 18);

  if (heroVideo) {
    const progress = Math.min(y / window.innerHeight, 1);
    document.documentElement.style.setProperty("--hero-scale", String(1 + progress * 0.08));
    document.documentElement.style.setProperty("--hero-brightness", String(0.66 - progress * 0.16));
  }
};

syncScrollState();
window.addEventListener("scroll", syncScrollState, { passive: true });

menuButton?.addEventListener("click", () => {
  header?.classList.toggle("is-open");
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => header?.classList.remove("is-open"));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(node);
});

const productOptions = document.querySelectorAll("[data-product-options]");
productOptions.forEach((select) => {
  select.innerHTML = `<option value="">请选择</option>${(window.KEMESSER_PRODUCTS || []).map((item) => `<option value="${item.name}">${item.name}</option>`).join("")}<option value="其他">其他</option>`;
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

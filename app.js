const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const heroVideo = document.querySelector("[data-hero-video]");
const footer = document.querySelector(".site-footer");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
const translateProductName = (name, english = isEnglish) => english
  ? name.replace(" 管式", " Tube").replace(" 袋式", " Bag").replace(/^其他$/, "Other")
  : name.replace(" Tube", " 管式").replace(" Bag", " 袋式").replace(/^Other$/, "其他");
const languageHref = (file) => {
  if (["admin.html", "404.html"].includes(file)) file = "index.html";
  const params = new URLSearchParams(location.search);
  if (params.has("product")) params.set("product", translateProductName(params.get("product"), !isEnglish));
  const query = params.toString();
  return `${isEnglish ? "../" : "en/"}${file}${query ? `?${query}` : ""}${location.hash}`;
};
const updateQueryState = (key, value) => {
  const url = new URL(location.href);
  if (value) url.searchParams.set(key, value);
  else url.searchParams.delete(key);
  try { history.replaceState(null, "", url); } catch (_) { /* Offline file previews may restrict History APIs. */ }
  document.querySelectorAll(".language-switch, .nav-cta").forEach((link) => { link.href = languageHref(currentFile); });
};

const closeDropdowns = () => {
  document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
    dropdown.classList.remove("is-open");
    dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
  });
};
const closeNavigation = () => {
  header?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", isEnglish ? "Open menu" : "打开菜单");
  closeDropdowns();
};

menuButton?.setAttribute("aria-expanded", "false");

if (heroVideo) {
  let heroVideoLoaded = false;
  let heroInView = true;
  let manuallyPaused = false;
  let manuallyStarted = false;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  heroVideo.id ||= "hero-video";
  const videoToggle = document.createElement("button");
  videoToggle.type = "button";
  videoToggle.className = "hero-video-toggle";
  videoToggle.setAttribute("aria-controls", heroVideo.id);
  videoToggle.hidden = true;
  heroVideo.closest(".video-hero").append(videoToggle);
  const syncVideoToggle = () => {
    videoToggle.textContent = heroVideo.paused ? (isEnglish ? "Play video" : "播放视频") : (isEnglish ? "Pause video" : "暂停视频");
  };
  const tryPlayHeroVideo = () => {
    if (document.visibilityState === "hidden" || !heroInView || manuallyPaused || (motionPreference.matches && !manuallyStarted)) {
      heroVideo.pause();
      syncVideoToggle();
      return;
    }
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
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const useLightVideo = Boolean(
      connection?.saveData ||
      /(^|-)2g/.test(connection?.effectiveType || "")
    );
    heroVideo.querySelectorAll("source[data-src], source[data-src-high]").forEach((source) => {
      source.src = source.dataset.srcHigh
        ? (useLightVideo ? source.dataset.srcLow : source.dataset.srcHigh)
        : source.dataset.src;
      source.removeAttribute("data-src");
      source.removeAttribute("data-src-high");
      source.removeAttribute("data-src-low");
    });
    heroVideo.load();
    tryPlayHeroVideo();
  };

  const scheduleHeroVideo = () => {
    const loadWhenIdle = () => window.setTimeout(loadHeroVideo, 80);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadWhenIdle, { timeout: 350 });
    } else {
      loadWhenIdle();
    }
  };

  heroVideo.addEventListener("loadeddata", () => {
    heroVideo.classList.add("is-ready");
    videoToggle.hidden = false;
    tryPlayHeroVideo();
  });
  heroVideo.addEventListener("play", syncVideoToggle);
  heroVideo.addEventListener("pause", syncVideoToggle);
  videoToggle.addEventListener("click", () => {
    manuallyPaused = !heroVideo.paused;
    manuallyStarted = !manuallyPaused;
    loadHeroVideo();
  });
  heroVideo.addEventListener("canplay", tryPlayHeroVideo);
  document.addEventListener("visibilitychange", tryPlayHeroVideo);
  motionPreference.addEventListener("change", () => {
    manuallyStarted = false;
    tryPlayHeroVideo();
  });
  window.addEventListener("pageshow", tryPlayHeroVideo);
  window.addEventListener("pagehide", () => heroVideo.pause());
  const videoObserver = new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting;
    if (heroVideoLoaded) tryPlayHeroVideo();
  });
  videoObserver.observe(heroVideo);
  document.addEventListener("pointerdown", loadHeroVideo, { once: true, passive: true });
  document.addEventListener("touchstart", loadHeroVideo, { once: true, passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleHeroVideo, { once: true });
  } else {
    scheduleHeroVideo();
  }
}

if (footer) {
  footer.innerHTML = isEnglish ? `
    <div class="footer-inner">
      <div class="footer-brand">
        <img width="688" height="402" src="../assets/brand/kemesser-logo-web.png" alt="Kemesser Technology" />
        <p>Reliable, standardized and traceable low-temperature solutions for cell cryopreservation, thawing and cold operations in research, biobanking, hospitals and laboratories.</p>
        <div class="footer-actions">
          <a class="footer-button primary" href="inquiry.html">Sales Inquiry</a>
          <a class="footer-button" href="support.html">After-sales Service</a>
          <a class="footer-button" href="downloads.html">Download Center</a>
        </div>
      </div>
      <div class="footer-col"><h3>Navigation</h3><a href="index.html">Home</a><a href="about.html">About Us</a><a href="downloads.html">Downloads</a></div>
      <div class="footer-col"><h3>Service & Contact</h3><a href="inquiry.html">Sales Inquiry</a><a href="support.html">After-sales Service</a><a href="contact.html">Contact Us</a></div>
      <div class="footer-col"><h3>Product Series</h3><a href="thawing.html">Thawing</a><a href="cryo.html">Cryopreservation</a><a href="cold-operation.html">Cold Operation</a><a href="compare.html">Compare Products</a></div>
      <div class="footer-col"><h3>Featured Products</h3><a href="product-thawline.html">ThawLINE</a><a href="product-thawline-pro.html">ThawLINE Pro</a><a href="product-thawwaker.html">ThawWaker</a><a href="product-cellhome.html">CellHome</a></div>
      <div class="footer-contact">
        <h3>Contact</h3><strong>International Sales</strong><a href="tel:+8619975273716">+86 19975273716</a><strong>Tel</strong><a href="tel:+8657187156759">+86 571 8715 6759</a><a href="tel:+8657187156259">+86 571 8715 6259</a>
        <strong>Email</strong><a href="mailto:khaleesi@kemesser.com">khaleesi@kemesser.com</a>
        <strong>Address</strong><a href="contact.html">Rooms 610 & 611, Building 1, Huixing Center, Taohuahu, Dinglan Subdistrict, Shangcheng District, Hangzhou, Zhejiang, China</a>
      </div>
    </div>
    <div class="footer-bottom"><span>© 2026 Hangzhou Kemesser Technology Co., Ltd.</span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">Zhejiang ICP No. 13016285-2</a></div>
  ` : `
    <div class="footer-inner">
      <div class="footer-brand">
        <img width="688" height="402" src="assets/brand/kemesser-logo-web.png" alt="Kemesser Technology" />
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
        <a href="compare.html">产品对比</a>
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
        <strong>国内业务对接</strong>
        <a href="tel:+8615372025538">+86 15372025538</a>
        <strong>电话</strong>
        <a href="tel:057187156759">0571-87156759</a>
        <a href="tel:057187156259">0571-87156259</a>
        <strong>邮箱</strong>
        <a href="mailto:andy@kemesser.com">andy@kemesser.com</a>
        <a href="mailto:chens@kemesser.com">chens@kemesser.com</a>
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
const sectionFile = /^(product-(thaw|mobi)|thawing-)/.test(currentFile) ? "thawing.html"
  : currentFile === "product-cellhome.html" ? "cryo.html"
    : /^product-(cool|holder|block|trans|ice)/.test(currentFile) ? "cold-operation.html" : currentFile;
// Load the third-party chat only after the first screen is responsive.
const loadCustomerService = () => {
  if (document.getElementById("kemesser-53kf-script")) return;
  const serviceScript = document.createElement("script");
  serviceScript.id = "kemesser-53kf-script";
  serviceScript.src = "https://tb.53kf.com/code/code/a1dbfbac5296e4307c128960a4477d502/7";
  serviceScript.async = true;
  document.head.append(serviceScript);
};

const scheduleCustomerService = () => {
  window.setTimeout(() => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadCustomerService, { timeout: 1200 });
    else loadCustomerService();
  }, 1200);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleCustomerService, { once: true });
} else {
  scheduleCustomerService();
}

const servicePages = new Set(["inquiry.html", "support.html", "contact.html"]);
const inquiryProductByPage = {
  "product-thawline.html": "ThawLINE",
  "product-thawline-pro.html": "ThawLINE Pro",
  "product-thawwaker.html": "ThawWaker",
  "product-thawhome.html": isEnglish ? "ThawHome Tube" : "ThawHome 管式",
  "product-thawhome-bag.html": isEnglish ? "ThawHome Bag" : "ThawHome 袋式",
  "product-mobithaw.html": "MobiThaw",
  "product-cellhome.html": "CellHome",
  "product-coolhome.html": "CoolHome",
  "product-holderhome.html": "HolderHome",
  "product-blockhome.html": "BlockHome",
  "product-transhome.html": "TransHome",
  "product-icehome.html": "IceHome"
};

if (inquiryProductByPage[currentFile]) {
  document.querySelectorAll('main a[href^="inquiry.html"]').forEach((link) => {
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
    downloadsLink.textContent = isEnglish ? "Downloads" : "下载中心";
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
    <button class="nav-dropdown-trigger" type="button" aria-expanded="false" aria-controls="service-links">
      <span>${isEnglish ? "Service & Contact" : "服务与联系"}</span>
    </button>
    <div class="nav-dropdown-menu" id="service-links">
      <a href="inquiry.html">${isEnglish ? "Sales Inquiry" : "售前咨询"}</a>
      <a href="support.html">${isEnglish ? "After-sales Service" : "售后服务"}</a>
      <a href="contact.html">${isEnglish ? "Contact Us" : "联系我们"}</a>
    </div>
  `;
  downloadsLink.insertAdjacentElement("afterend", dropdown);

  const languageSwitch = document.createElement("a");
  languageSwitch.className = "language-switch mobile-language-switch";
  languageSwitch.href = languageHref(currentFile);
  languageSwitch.textContent = isEnglish ? "中文" : "English";
  languageSwitch.setAttribute("aria-label", isEnglish ? "切换到中文" : "Switch to English");
  nav.append(languageSwitch);

  nav.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === currentFile) link.setAttribute("aria-current", "page");
    else if (link.getAttribute("href") === sectionFile) link.setAttribute("aria-current", "true");
  });

  const trigger = dropdown.querySelector(".nav-dropdown-trigger");
  if (servicePages.has(currentFile)) trigger.setAttribute("aria-current", "page");
  let closeTimer;
  let openedByHover = false;
  const setOpen = (open, source = "explicit") => {
    window.clearTimeout(closeTimer);
    if (open) closeDropdowns();
    openedByHover = open && source === "hover";
    dropdown.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
  };

  trigger.addEventListener("click", () => {
    setOpen(!dropdown.classList.contains("is-open") || openedByHover);
  });
  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    setOpen(true);
    dropdown.querySelector(".nav-dropdown-menu a")?.focus();
  });
  dropdown.addEventListener("pointerenter", () => {
    window.clearTimeout(closeTimer);
    if (!dropdown.classList.contains("is-open") && window.matchMedia("(hover: hover) and (min-width: 1201px)").matches) setOpen(true, "hover");
  });
  dropdown.addEventListener("pointerleave", () => {
    if (!dropdown.contains(document.activeElement)) closeTimer = window.setTimeout(() => setOpen(false), 140);
  });
  dropdown.addEventListener("focusout", (event) => {
    if (!dropdown.contains(event.relatedTarget)) setOpen(false);
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
  cta.href = languageHref(currentFile);
  cta.textContent = isEnglish ? "中文" : "English";
  cta.setAttribute("aria-label", isEnglish ? "切换到中文" : "Switch to English");
});

const syncScrollState = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 18);

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
  const isOpen = !header?.classList.contains("is-open");
  closeNavigation();
  header?.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? (isEnglish ? "Close menu" : "关闭菜单") : (isEnglish ? "Open menu" : "打开菜单"));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});
window.matchMedia("(max-width: 1200px)").addEventListener("change", closeNavigation);

// Warm up a local page only after the visitor shows intent to open it.
// This keeps initial loading light while making navigation feel immediate.
const prefetchedPages = new Set();
const prefetchPage = (href) => {
  if (!href) return;
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g/.test(connection?.effectiveType || "")) return;
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.endsWith(".html")) return;
  if (prefetchedPages.has(url.href) || url.href === window.location.href) return;
  prefetchedPages.add(url.href);
  const prefetch = document.createElement("link");
  prefetch.rel = "prefetch";
  prefetch.href = url.href;
  prefetch.as = "document";
  document.head.append(prefetch);
};

document.querySelectorAll('a[href$=".html"], [data-card-link]').forEach((link) => {
  const href = link.getAttribute("href") || link.dataset.cardLink;
  const warmPage = () => prefetchPage(href);
  link.addEventListener("pointerenter", warmPage, { once: true, passive: true });
  link.addEventListener("focus", warmPage, { once: true });
  link.addEventListener("touchstart", warmPage, { once: true, passive: true });
});

document.addEventListener("click", (event) => {
  if (!header?.contains(event.target)) closeNavigation();
  document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
    if (dropdown.contains(event.target)) return;
    dropdown.classList.remove("is-open");
    dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const wasMobileOpen = header?.classList.contains("is-open");
  const activeDropdown = document.activeElement?.closest(".nav-dropdown");
  closeNavigation();
  if (wasMobileOpen) menuButton?.focus();
  else activeDropdown?.querySelector(".nav-dropdown-trigger")?.focus();
});

if (reducedMotion) {
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-pending");
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px 80px" }
  );

  document.querySelectorAll(".reveal").forEach((node, index) => {
    if (node.getBoundingClientRect().top < window.innerHeight + 80) {
      node.classList.add("is-visible");
    } else {
      node.classList.add("is-pending");
      node.style.transitionDelay = `${Math.min(index % 3, 2) * 30}ms`;
      revealObserver.observe(node);
    }
  });
  document.addEventListener("focusin", (event) => {
    const hiddenSection = event.target.closest(".reveal.is-pending");
    if (!hiddenSection) return;
    hiddenSection.classList.remove("is-pending");
    hiddenSection.classList.add("is-visible");
  });
}

window.KEMESSER_UI = Object.freeze({ isEnglish, translateProductName, updateQueryState });

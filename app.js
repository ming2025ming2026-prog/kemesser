const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const heroVideo = document.querySelector("[data-hero-video]");
const footer = document.querySelector(".site-footer");

document.body.classList.add("page-enter");

if (footer) {
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="assets/brand/kemesser-logo.png" alt="Kemesser Technology" />
        <p>专注细胞冻存、复苏与冷冻操作低温流程，为科研、生物样本库、医院与实验室用户提供稳定、规范、可追溯的产品方案。</p>
        <div class="footer-actions">
          <a class="footer-button primary" href="contact.html">咨询产品</a>
          <a class="footer-button" href="tel:057187156759">拨打电话</a>
        </div>
      </div>
      <div class="footer-col">
        <h3>网站导航</h3>
        <a href="index.html">首页</a>
        <a href="about.html">关于我们</a>
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
        <a href="contact.html">杭州市余杭区径山镇漕桥村香下桥1幢 1-5 层</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 杭州科默斯科技有限公司</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">浙ICP备13016285号-2</a>
    </div>
  `;
}

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

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || link.target === "_blank") return;
  event.preventDefault();
  window.location.href = href;
});

document.querySelectorAll(".btn, .nav-cta, .product-tile, .series-card, .map-card").forEach((el) => {
  el.addEventListener("pointerdown", (event) => {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });
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

document.querySelectorAll(".product-tile, .series-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

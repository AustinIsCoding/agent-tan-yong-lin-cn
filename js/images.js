document.addEventListener("DOMContentLoaded", () => {
  const data = [
    {
      id: 1,
      imgUrl:
        "https://austiniscoding.github.io/agent-tan-yong-lin-cn/assets/images/background.jpg",
      alt: "Anime Background",
      title: "示例标题 1",
      description: "示例描述 1",
    },
    {
      id: 2,
      imgUrl:
        "https://austiniscoding.github.io/agent-tan-yong-lin-cn/assets/images/Lake_Bridge.jpg",
      alt: "Lake Bridge",
      title: "示例标题 2",
      description: "示例描述 2",
    },
    {
      id: 3,
      imgUrl:
        "https://austiniscoding.github.io/agent-tan-yong-lin-cn/assets/images/Consultanting.webp",
      alt: "Consultant",
      title: "客户咨询",
      description: "永霖于 2023 年 3 月在Kulim，完成了他首次的保险检视咨询。",
    },
    {
      id: 4,
      imgUrl:
        "https://austiniscoding.github.io/agent-tan-yong-lin-cn/assets/images/Moon-Landscape.jpg",
      alt: "Moon Landscape",
      title: "示例标题 4",
      description: "示例描述 4",
    },
    {
      id: 5,
      imgUrl:
        "https://austiniscoding.github.io/agent-tan-yong-lin-cn/assets/images/Night_Sky.avif",
      alt: "Night Sky",
      title: "示例标题 5",
      description: "示例描述 5",
    },
    {
      id: 6,
      imgUrl:
        "https://austiniscoding.github.io/agent-tan-yong-lin-cn/assets/images/ranger-4df6c1b6.avif",
      alt: "Consulting",
      title: "示例标题 6",
      description: "示例描述 6",
    },
    {
      id: 7,
      imgUrl:
        "https://austiniscoding.github.io/agent-tan-yong-lin-cn/assets/images/background2.jpg",
      alt: "Background 2",
      title: "示例标题 7",
      description: "示例描述 7",
    },
  ];

  const slider = document.querySelector(".image-slider");
  if (!slider) return; // safety

  // prev/next buttons must exist inside .image-slider per your HTML
  const btnPrev = slider.querySelector(".next-prev-nav .prev");
  const btnNext = slider.querySelector(".next-prev-nav .next");

  // --- Generate image nodes dynamically from data ---
  data.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("images");
    wrapper.innerHTML = `
      <img 
        src="${item.imgUrl}" 
        alt="${item.alt}" 
        data-index="${item.id}"
      >
    `;
    // insert before nav so nav stays on top
    slider.insertBefore(wrapper, slider.querySelector(".next-prev-nav"));
  });

  // --- Create description container dynamically if missing ---
  let descContainer = slider.querySelector(".desc-container");
  if (!descContainer) {
    descContainer = document.createElement("div");
    descContainer.classList.add("desc-container");
    descContainer.innerHTML = `<h4></h4><p></p>`;
    slider.appendChild(descContainer);
  }
  const descTitle = descContainer.querySelector("h4");
  const descText = descContainer.querySelector("p");

  // --- Collect nodes after generation ---
  const imageNodes = Array.from(slider.querySelectorAll(".images"));
  if (imageNodes.length === 0) return;

  // --- State ---
  let centerIndex = Math.min(2, imageNodes.length - 1); // safe initial center
  const transitionDuration = 450; // match your CSS
  let isAnimating = false;
  const mod = (n, m) => ((n % m) + m) % m;

  // --- Helpers ---
  function clearRoles(node) {
    node.classList.remove(
      "left2",
      "left1",
      "center",
      "right1",
      "right2",
      "closing",
      "closed"
    );
    node.style.left = "";
    node.style.opacity = "";
    node.style.pointerEvents = "";
    // do NOT set transform here — let CSS classes define transforms
  }

  function hideDesc() {
    descContainer.classList.add("hidden");
  }
  function showDesc() {
    descContainer.classList.remove("hidden");
  }
  function updateDescContentFromData(index) {
    const item = data[index] || {};
    descTitle.textContent = item.title || "";
    descText.textContent = item.description || "";
  }

  // --- Render roles & description ---
  function render() {
    const len = imageNodes.length;
    for (let i = 0; i < len; i++) {
      const node = imageNodes[i];
      clearRoles(node);

      let rel = i - centerIndex;
      if (rel > 2) rel -= len;
      if (rel < -2) rel += len;

      if (rel === -2) node.classList.add("left2");
      else if (rel === -1) node.classList.add("left1");
      else if (rel === 0) node.classList.add("center");
      else if (rel === 1) node.classList.add("right1");
      else if (rel === 2) node.classList.add("right2");
      else {
        node.classList.add("closed");
        // rely on .images.closed CSS to hide and scale down
        node.style.pointerEvents = "none";
      }
    }

    // update description from data array (single source of truth)
    updateDescContentFromData(centerIndex);
  }

  // --- Slide animation ---
  function slide(direction = "next") {
    if (isAnimating) return;
    isAnimating = true;

    const oldCenterNode = imageNodes[centerIndex];
    hideDesc();

    if (oldCenterNode) {
      oldCenterNode.classList.remove("center");
      oldCenterNode.classList.add("closing");
    }

    // wait a moment for closing animation, then update center index and render
    setTimeout(() => {
      if (oldCenterNode) {
        oldCenterNode.classList.remove("closing");
        oldCenterNode.classList.add("closed");
      }

      centerIndex =
        direction === "next"
          ? mod(centerIndex + 1, imageNodes.length)
          : mod(centerIndex - 1, imageNodes.length);

      render();

      // after slide transition, show description
      setTimeout(() => {
        showDesc();
        isAnimating = false;
      }, transitionDuration + 20);
    }, 180);
  }

  // --- Events ---
  if (btnPrev) btnPrev.addEventListener("click", () => slide("prev"));
  if (btnNext) btnNext.addEventListener("click", () => slide("next"));

  imageNodes.forEach((node, idx) => {
    node.addEventListener("click", () => {
      if (isAnimating || idx === centerIndex) return;
      hideDesc();
      const old = imageNodes[centerIndex];
      if (old) {
        old.classList.remove("center");
        old.classList.add("closing");
      }

      setTimeout(() => {
        if (old) {
          old.classList.remove("closing");
          old.classList.add("closed");
        }
        centerIndex = idx;
        render();
        setTimeout(() => {
          showDesc();
          isAnimating = false;
        }, transitionDuration + 20);
      }, 180);
    });
  });

  // --- Init ---
  render();
  showDesc();

  // responsive: re-render on resize
  window.addEventListener("resize", () => {
    clearTimeout(window.__imageSliderResizeTimer);
    window.__imageSliderResizeTimer = setTimeout(() => render(), 120);
  });
});

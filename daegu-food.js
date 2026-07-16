(() => {
  const API_BASE = "https://www.daegufood.go.kr/kor/api/tasty.html";
  const LOCAL_PROXY = "/api/tasty";
  const LOCAL_CACHE_DIR = "./data/daegu";
  const DISTRICT_CACHE_FILES = {
    중구: "jung",
    동구: "dong",
    서구: "seo",
    남구: "nam",
    북구: "buk",
    수성구: "suseong",
    달서구: "dalseo",
    달성군: "dalseong",
  };

  const DISTRICTS = [
    "중구",
    "동구",
    "서구",
    "남구",
    "북구",
    "수성구",
    "달서구",
    "달성군",
  ];

  const PAGE_SIZE = 12;

  const els = {
    districtGrid: document.getElementById("districtGrid"),
    foodList: document.getElementById("foodList"),
    foodStatus: document.getElementById("foodStatus"),
    resultsMeta: document.getElementById("resultsMeta"),
    foodSearch: document.getElementById("foodSearch"),
    pagination: document.getElementById("foodPagination"),
  };

  if (!els.districtGrid || !els.foodList) return;

  /** @type {any[]} */
  let currentItems = [];
  /** @type {any[]} */
  let filteredItems = [];
  let currentDistrict = "";
  let currentPage = 1;
  let activeRequestId = 0;

  function escapeHtml(text) {
    return String(text ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatMenuHtml(raw) {
    return String(raw || "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .split("\n")
      .map((line) => escapeHtml(line.trim()))
      .filter(Boolean)
      .join("<br>");
  }

  function cleanText(value) {
    const text = String(value ?? "").trim();
    if (!text || text === "없음") return "";
    return text;
  }

  function setStatus(message, isError = false) {
    els.foodStatus.textContent = message || "";
    els.foodStatus.classList.toggle("is-error", Boolean(isError));
  }

  function buildDirectApiUrl(district) {
    const url = new URL(API_BASE);
    url.searchParams.set("mode", "json");
    url.searchParams.set("addr", district);
    return url.toString();
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      headers: { Accept: "application/json,text/plain,*/*" },
    });
    if (!response.ok) {
      let detail = "";
      try {
        const errBody = await response.json();
        detail = errBody?.error ? ` — ${errBody.error}` : "";
      } catch {
        /* ignore */
      }
      throw new Error(`API 요청 실패 (${response.status})${detail}`);
    }
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("API 응답을 해석하지 못했습니다.");
    }
  }

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-daegu-cache="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.daeguCache = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`스크립트 로드 실패: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function fetchFromScriptCache(district) {
    window.DAEGU_FOOD_CACHE = window.DAEGU_FOOD_CACHE || {};
    if (window.DAEGU_FOOD_CACHE[district]) {
      return window.DAEGU_FOOD_CACHE[district];
    }
    // file:// 에서도 동작: <script>로 로컬 JS 캐시 로드
    await loadScriptOnce(`${LOCAL_CACHE_DIR}/${DISTRICT_CACHE_FILES[district] || district}.js`);
    const payload = window.DAEGU_FOOD_CACHE[district];
    if (!payload) {
      throw new Error(`${district} 캐시 데이터가 없습니다.`);
    }
    return payload;
  }

  /**
   * 1) JS 캐시 스크립트 — file:// / http 모두 동작
   * 2) 로컬 프록시(/api/tasty) — python server.py 사용 시 최신 API
   * 3) 로컬 JSON fetch — http 정적 서버
   * 4) 직접 API — CORS로 대부분 실패
   */
  async function fetchTastyList(district) {
    const errors = [];

    // 1. Script cache (works even on file://)
    try {
      return await fetchFromScriptCache(district);
    } catch (error) {
      errors.push(`JS캐시: ${error instanceof Error ? error.message : error}`);
    }

    // 2. Local proxy (live API)
    if (window.location.protocol !== "file:") {
      try {
        const proxyUrl = `${LOCAL_PROXY}?addr=${encodeURIComponent(district)}`;
        return await fetchJson(proxyUrl);
      } catch (error) {
        errors.push(`프록시: ${error instanceof Error ? error.message : error}`);
      }

      // 3. Local cached JSON
      try {
        const cacheUrl = `${LOCAL_CACHE_DIR}/${encodeURIComponent(district)}.json`;
        return await fetchJson(cacheUrl);
      } catch (error) {
        errors.push(`JSON캐시: ${error instanceof Error ? error.message : error}`);
      }

      // 4. Direct API
      try {
        return await fetchJson(buildDirectApiUrl(district));
      } catch (error) {
        errors.push(`직접호출: ${error instanceof Error ? error.message : error}`);
      }
    }

    throw new Error(
      "맛집 데이터를 불러오지 못했습니다. 페이지를 새로고침하거나 python server.py 실행 후 http://127.0.0.1:8080 으로 열어 주세요. (" +
        errors.join(" / ") +
        ")"
    );
  }

  function renderDistricts() {
    els.districtGrid.innerHTML = DISTRICTS.map(
      (name) => `
        <button
          type="button"
          class="food-district"
          data-district="${escapeHtml(name)}"
          role="tab"
          aria-selected="false"
        >
          ${escapeHtml(name)}
        </button>
      `
    ).join("");
  }

  function setActiveDistrict(district) {
    els.districtGrid.querySelectorAll(".food-district").forEach((btn) => {
      const active = btn.getAttribute("data-district") === district;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function filterItems(items, query) {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const haystack = [item.BZ_NM, item.FD_CS, item.GNG_CS, item.SMPL_DESC]
        .map((v) => String(v || "").toLowerCase())
        .join(" ");
      return haystack.includes(q);
    });
  }

  function renderList(items) {
    if (!items.length) {
      els.foodList.innerHTML = `
        <div class="food-empty">
          <p>조건에 맞는 맛집이 없습니다.</p>
        </div>
      `;
      return;
    }

    els.foodList.innerHTML = items
      .map((item) => {
        const name = cleanText(item.BZ_NM) || "이름 없음";
        const category = cleanText(item.FD_CS) || "분류 없음";
        const address = cleanText(item.GNG_CS);
        const phone = cleanText(item.TLNO);
        const hours = cleanText(item.MBZ_HR);
        const desc = cleanText(item.SMPL_DESC);
        const menu = formatMenuHtml(item.MNU);
        const subway = cleanText(item.SBW);
        const bus = cleanText(item.BUS);
        const homepage = cleanText(item.HP);
        const seat = cleanText(item.SEAT_CNT);
        const parking = cleanText(item.PKPL);

        const phoneLink = phone
          ? `<a href="tel:${escapeHtml(phone.replace(/\s+/g, ""))}">${escapeHtml(phone)}</a>`
          : "";

        const homeLink =
          homepage && /^https?:\/\//i.test(homepage)
            ? `<a href="${escapeHtml(homepage)}" target="_blank" rel="noopener noreferrer">홈페이지</a>`
            : homepage && !homepage.includes("*")
              ? `<a href="https://${escapeHtml(homepage)}" target="_blank" rel="noopener noreferrer">홈페이지</a>`
              : "";

        return `
          <article class="food-card">
            <header class="food-card__head">
              <div>
                <p class="food-card__category">${escapeHtml(category)}</p>
                <h3 class="food-card__title">${escapeHtml(name)}</h3>
              </div>
            </header>
            ${desc ? `<p class="food-card__desc">${escapeHtml(desc)}</p>` : ""}
            <dl class="food-card__meta">
              ${address ? `<div><dt>주소</dt><dd>${escapeHtml(address)}</dd></div>` : ""}
              ${hours ? `<div><dt>영업시간</dt><dd>${escapeHtml(hours)}</dd></div>` : ""}
              ${phone ? `<div><dt>전화</dt><dd>${phoneLink}</dd></div>` : ""}
              ${seat ? `<div><dt>좌석</dt><dd>${escapeHtml(seat)}</dd></div>` : ""}
              ${parking ? `<div><dt>주차</dt><dd>${escapeHtml(parking)}</dd></div>` : ""}
              ${subway ? `<div><dt>지하철</dt><dd>${escapeHtml(subway)}</dd></div>` : ""}
              ${bus ? `<div><dt>버스</dt><dd>${escapeHtml(bus)}</dd></div>` : ""}
            </dl>
            ${
              menu
                ? `<div class="food-card__menu"><h4>메뉴</h4><div class="food-card__menu-body">${menu}</div></div>`
                : ""
            }
            ${homeLink ? `<div class="food-card__links">${homeLink}</div>` : ""}
          </article>
        `;
      })
      .join("");
  }

  function getTotalPages(total) {
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }

  function getPageItems(items, page) {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }

  function renderPagination(total, page) {
    if (!els.pagination) return;

    const totalPages = getTotalPages(total);
    if (!currentDistrict || total === 0 || totalPages <= 1) {
      els.pagination.hidden = true;
      els.pagination.innerHTML = "";
      return;
    }

    els.pagination.hidden = false;

    const buttons = [];
    buttons.push(
      `<button type="button" class="food-page-btn" data-page="${page - 1}" ${
        page <= 1 ? "disabled" : ""
      } aria-label="이전 페이지">이전</button>`
    );

    const windowSize = 5;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    if (start > 1) {
      buttons.push(`<button type="button" class="food-page-btn" data-page="1">1</button>`);
      if (start > 2) buttons.push(`<span class="food-page-ellipsis" aria-hidden="true">…</span>`);
    }

    for (let i = start; i <= end; i += 1) {
      buttons.push(
        `<button type="button" class="food-page-btn${i === page ? " is-active" : ""}" data-page="${i}" ${
          i === page ? 'aria-current="page"' : ""
        }>${i}</button>`
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(`<span class="food-page-ellipsis" aria-hidden="true">…</span>`);
      }
      buttons.push(
        `<button type="button" class="food-page-btn" data-page="${totalPages}">${totalPages}</button>`
      );
    }

    buttons.push(
      `<button type="button" class="food-page-btn" data-page="${page + 1}" ${
        page >= totalPages ? "disabled" : ""
      } aria-label="다음 페이지">다음</button>`
    );

    els.pagination.innerHTML = buttons.join("");
  }

  function goToPage(page) {
    const totalPages = getTotalPages(filteredItems.length);
    const next = Math.min(Math.max(1, page), totalPages);
    if (next === currentPage && els.foodList.children.length) {
      renderPagination(filteredItems.length, currentPage);
      return;
    }
    currentPage = next;
    renderList(getPageItems(filteredItems, currentPage));
    renderPagination(filteredItems.length, currentPage);
    els.foodList.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateResultsView({ resetPage = false } = {}) {
    const query = els.foodSearch?.value || "";
    filteredItems = filterItems(currentItems, query);

    if (!currentDistrict) {
      els.resultsMeta.textContent = "구역을 선택해 주세요.";
      els.foodList.innerHTML = "";
      filteredItems = [];
      currentPage = 1;
      renderPagination(0, 1);
      return;
    }

    if (resetPage) currentPage = 1;

    const totalPages = getTotalPages(filteredItems.length);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = filteredItems.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
    const end = Math.min(currentPage * PAGE_SIZE, filteredItems.length);

    els.resultsMeta.textContent = query.trim()
      ? `${currentDistrict} · 검색 ${filteredItems.length}곳 중 ${start}–${end} · ${currentPage}/${totalPages}페이지`
      : `${currentDistrict} · 총 ${filteredItems.length}곳 중 ${start}–${end} · ${currentPage}/${totalPages}페이지`;

    renderList(getPageItems(filteredItems, currentPage));
    renderPagination(filteredItems.length, currentPage);
  }

  async function loadDistrict(district) {
    const requestId = ++activeRequestId;
    currentDistrict = district;
    currentItems = [];
    filteredItems = [];
    currentPage = 1;
    setActiveDistrict(district);
    setStatus(`${district} 맛집을 불러오는 중…`);
    els.resultsMeta.textContent = `${district} · 불러오는 중`;
    els.foodList.innerHTML = `<div class="food-empty"><p>데이터를 불러오는 중입니다.</p></div>`;
    renderPagination(0, 1);

    try {
      const payload = await fetchTastyList(district);
      if (requestId !== activeRequestId) return;

      if (!payload || payload.status !== "DONE" || !Array.isArray(payload.data)) {
        throw new Error("맛집 데이터 형식이 올바르지 않습니다.");
      }

      currentItems = payload.data;
      setStatus("");
      updateResultsView({ resetPage: true });
      els.foodList.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      if (requestId !== activeRequestId) return;
      currentItems = [];
      filteredItems = [];
      currentPage = 1;
      els.foodList.innerHTML = "";
      renderPagination(0, 1);
      els.resultsMeta.textContent = `${district} · 불러오기 실패`;
      setStatus(
        error instanceof Error
          ? error.message
          : "맛집 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        true
      );
    }
  }

  function bindEvents() {
    els.districtGrid.addEventListener("click", (event) => {
      const btn = event.target.closest(".food-district");
      if (!btn) return;
      const district = btn.getAttribute("data-district");
      if (!district || district === currentDistrict) return;
      loadDistrict(district);
    });

    els.foodSearch?.addEventListener("input", () => {
      updateResultsView({ resetPage: true });
    });

    els.pagination?.addEventListener("click", (event) => {
      const btn = event.target.closest(".food-page-btn");
      if (!btn || btn.disabled) return;
      const page = Number(btn.getAttribute("data-page"));
      if (!Number.isFinite(page)) return;
      goToPage(page);
    });
  }

  function initFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const district = params.get("addr");
    if (district && DISTRICTS.includes(district)) {
      loadDistrict(district);
    }
  }

  renderDistricts();
  bindEvents();
  initFromQuery();
})();

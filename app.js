const PROJECTS = [
  {
    title: "TaskFlow — 할 일 관리 앱",
    year: "2026",
    summary: "우선순위와 마감일을 기준으로 하루 작업을 정리하는 웹 앱입니다.",
    role: "기획 · UI · 프론트엔드 전담",
    contribution: "로컬 저장 기반 CRUD, 필터링, 반응형 레이아웃 구현",
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/",
    live: "#",
  },
  {
    title: "Prompt Lab — 프롬프트 아카이브",
    year: "2026",
    summary: "재사용 가능한 프롬프트를 카테고리별로 저장하고 검색하는 도구입니다.",
    role: "프로덕트 설계 · 프론트엔드",
    contribution: "태그 검색, 다크모드, 복사 UX까지 제품형 흐름으로 구성",
    stack: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    github: "https://github.com/",
    live: "#",
  },
  {
    title: "Portfolio OS — 개인 포트폴리오",
    year: "2026",
    summary: "채용 담당자가 30초 안에 기술과 결과물을 파악하도록 설계한 포트폴리오입니다.",
    role: "디자인 시스템 · 프론트엔드",
    contribution: "라이트/다크 테마, 프로젝트-스택 연결 구조, 접근성 기본 적용",
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/",
    live: "#",
  },
];

const STACK = [
  {
    category: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    category: "Backend",
    items: ["Node.js", "REST API"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code", "Cursor"],
  },
  {
    category: "AI / Workflow",
    items: ["Prompt Engineering", "Vibe Coding", "LLM 활용"],
  },
];

const THEME_KEY = "vibe-portfolio-theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.setAttribute(
      "aria-label",
      theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
    );
  }
}

function initTheme() {
  applyTheme(getPreferredTheme());

  const toggle = document.getElementById("themeToggle");
  toggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
}

function renderProjects() {
  const list = document.getElementById("projectList");
  if (!list) return;

  list.innerHTML = PROJECTS.map(
    (project) => `
      <li class="project reveal">
        <div class="project__body">
          <div class="project__top">
            <h3 class="project__title">${project.title}</h3>
            <span class="project__year">${project.year}</span>
          </div>
          <p class="project__summary">${project.summary}</p>
          <dl class="project__meta">
            <div>
              <dt>Role</dt>
              <dd><strong>역할</strong> · ${project.role}</dd>
            </div>
            <div>
              <dt>Contribution</dt>
              <dd><strong>기여</strong> · ${project.contribution}</dd>
            </div>
          </dl>
        </div>
        <div class="project__aside">
          <ul class="tags" aria-label="기술 스택">
            ${project.stack.map((tech) => `<li>${tech}</li>`).join("")}
          </ul>
          <div class="project__links">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="${project.live}" ${project.live === "#" ? "" : 'target="_blank" rel="noopener noreferrer"'}>Live Demo</a>
          </div>
        </div>
      </li>
    `
  ).join("");
}

function renderStack() {
  const grid = document.getElementById("stackGrid");
  if (!grid) return;

  grid.innerHTML = STACK.map(
    (group) => `
      <article class="stack-card reveal">
        <h3>${group.category}</h3>
        <ul class="tags">
          ${group.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `
  ).join("");
}

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index % 6, 4) * 60}ms`;
    observer.observe(node);
  });
}

function initFooterYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderProjects();
  renderStack();
  initFooterYear();
  initReveal();
});

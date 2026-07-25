(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  // Sticky nav background on scroll
  function onScroll() {
    if (window.scrollY > 12) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  navToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Active nav link highlighting based on section in view
  var sections = document.querySelectorAll("main .section");
  var navLinkMap = {};
  navLinks.querySelectorAll(".nav__link").forEach(function (link) {
    navLinkMap[link.getAttribute("href").slice(1)] = link;
  });

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var link = navLinkMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.values(navLinkMap).forEach(function (l) {
            l.classList.remove("active");
          });
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // Fade-in on scroll
  var fadeEls = document.querySelectorAll(".fade-in");
  var fadeObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  fadeEls.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // Projects filter
  var filterBar = document.getElementById("projectFilters");
  var projectsGrid = document.getElementById("projectsGrid");
  var projectsEmpty = document.getElementById("projectsEmpty");

  if (filterBar && projectsGrid) {
    var projectCards = projectsGrid.querySelectorAll(".project-card");

    filterBar.addEventListener("click", function (event) {
      var button = event.target.closest(".filter-btn");
      if (!button) return;

      filterBar.querySelectorAll(".filter-btn").forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      var filter = button.getAttribute("data-filter");
      var visibleCount = 0;

      projectCards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });

      if (projectsEmpty) {
        projectsEmpty.hidden = visibleCount !== 0;
      }
    });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach(function (question) {
    var answer = question.nextElementSibling;
    question.addEventListener("click", function () {
      var isOpen = question.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-question").forEach(function (q) {
        q.setAttribute("aria-expanded", "false");
        q.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen) {
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

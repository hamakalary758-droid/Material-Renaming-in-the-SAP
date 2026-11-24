/* ----- SAND PAPER MODULE ----- */
window.QS_MODULES.push({
  id: "sandpaper",
  name: "Sand paper",
  searchWords: ["sand", "sand paper", "sandpaper", "emery", "grit"],
  tileBg: "#CCEFE2",
  tileColor: "#0E3B30",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="5" y="3.5" width="14" height="17" rx="2"></rect>' +
      '<circle cx="9.5" cy="8.5" r="0.8" fill="currentColor"></circle>' +
      '<circle cx="14.5" cy="8" r="0.8" fill="currentColor"></circle>' +
      '<circle cx="12" cy="11.5" r="0.8" fill="currentColor"></circle>' +
      '<circle cx="9" cy="14.5" r="0.8" fill="currentColor"></circle>' +
      '<circle cx="15" cy="14" r="0.8" fill="currentColor"></circle>' +
      '<circle cx="11.5" cy="17" r="0.8" fill="currentColor"></circle>' +
    '</svg>',

  /* SAP export defaults for Sand paper */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Sand paper dropdown list */
  lists: {
    grit: ["P40", "P60", "P80", "P100", "P120", "P150", "P180", "P200", "P220", "P320", "P400", "P600"]
  },

  /* Easy-to-edit sheet colors by grit range for the drawing */
  sheetColors: {
    dark: { fill: "#6B4423", backing: "#4E3017", stroke: "#3B220E", dotDark: "#381F0B", dotLight: "#8F5E34" },
    medium: { fill: "#A47148", backing: "#7F5432", stroke: "#5E3C20", dotDark: "#523218", dotLight: "#C79266" },
    light: { fill: "#D6B48C", backing: "#B59168", stroke: "#8C6842", dotDark: "#785735", dotLight: "#EDD6BA" },
    empty: { fill: "#EEF2F6", backing: "#E2E8F0", stroke: "#94A3B8", dotDark: "#CBD5E1", dotLight: "#F8FAFC" }
  },

  /* Easy-to-edit plain-word meanings for Long text (leave "" for default: Sand paper, grit [grit].) */
  meanings: {
    grit: {
      "P40": "",
      "P60": "",
      "P80": "",
      "P100": "",
      "P120": "",
      "P150": "",
      "P180": "",
      "P200": "",
      "P220": "",
      "P320": "",
      "P400": "",
      "P600": ""
    }
  },

  /* Build SAP Short Text (max 40 chars) from current values */
  buildShortText: function (values) {
    const grit = String(values.grit || "").trim().replace(/\s+/g, " ").toUpperCase();
    return "SAND PAPER " + (grit || "?");
  },

  /* Build plain-word Long Text from current values and meanings */
  buildLongText: function (values) {
    const mod = this;
    const grit = String(values.grit || "").trim().replace(/\s+/g, " ").toUpperCase();
    if (!grit) {
      return "";
    }
    const wording = (mod.meanings && mod.meanings.grit && mod.meanings.grit[grit])
      ? String(mod.meanings.grit[grit]).trim()
      : "";
    if (wording) {
      return wording;
    }
    return "Sand paper, grit " + grit + ".";
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const missing = [];
    if (!String(values.grit || "").trim()) missing.push("Grit");
    return missing;
  },

  /* Build clean Sand paper SVG drawing (dot size and brown shade follow grit) */
  buildDrawingSvg: function (values, shortNameText) {
    const mod = this;
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const esc = function (s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    };
    const wrapLines = function (text, maxChars) {
      const str = clean(text);
      if (!str) return [];
      const words = str.split(" ");
      const lines = [];
      let current = "";
      words.forEach(function (w) {
        if (w.length > maxChars) {
          if (current) {
            lines.push(current);
            current = "";
          }
          for (let i = 0; i < w.length; i += maxChars) {
            lines.push(w.slice(i, i + maxChars));
          }
        } else if (!current) {
          current = w;
        } else if ((current + " " + w).length <= maxChars) {
          current += " " + w;
        } else {
          lines.push(current);
          current = w;
        }
      });
      if (current) lines.push(current);
      return lines;
    };

    const grit = upper(values.grit);
    const gritMatch = grit.match(/(\d+)/);
    const gritNum = gritMatch ? parseInt(gritMatch[1], 10) : 0;

    const colors = mod.sheetColors || {};
    let palette = colors.empty || { fill: "#EEF2F6", backing: "#E2E8F0", stroke: "#94A3B8", dotDark: "#CBD5E1", dotLight: "#F8FAFC" };
    let dotRadius = 1.6;
    let dotCount = 70;

    if (grit && gritNum > 0) {
      if (gritNum <= 80) {
        palette = colors.dark || palette;
      } else if (gritNum <= 180) {
        palette = colors.medium || palette;
      } else {
        palette = colors.light || palette;
      }

      if (gritNum <= 40) {
        dotRadius = 3.5;
        dotCount = 48;
      } else if (gritNum <= 60) {
        dotRadius = 3.0;
        dotCount = 62;
      } else if (gritNum <= 80) {
        dotRadius = 2.6;
        dotCount = 76;
      } else if (gritNum <= 120) {
        dotRadius = 2.1;
        dotCount = 104;
      } else if (gritNum <= 180) {
        dotRadius = 1.7;
        dotCount = 132;
      } else if (gritNum <= 220) {
        dotRadius = 1.35;
        dotCount = 158;
      } else if (gritNum <= 400) {
        dotRadius = 1.1;
        dotCount = 185;
      } else {
        dotRadius = 0.85;
        dotCount = 215;
      }
    }

    /* Top short-name lines */
    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["SAND PAPER ?"];
    const topIsPlaceholder = !topText || topText === "SAND PAPER ?";
    const topShift = Math.max(0, topLines.length - 1) * 15;

    const topSvg = topLines.map(function (line, i) {
      const y = 22 + i * 15;
      const color = topIsPlaceholder ? "#64748B" : "#10302A";
      return (
        '<text x="190" y="' + y + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + color + '">' +
          esc(line) +
        '</text>'
      );
    }).join("");

    const yOffset = topShift;
    const sheetX = 76;
    const sheetY = 66 + yOffset;
    const sheetW = 148;
    const sheetH = 168;

    /* Deterministic rough abrasive grains distributed across sheet */
    const padX = 11;
    const padY = 11;
    const innerW = sheetW - padX * 2;
    const innerH = sheetH - padY * 2;
    let seed = 137 + gritNum * 17;
    const nextRand = function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const dots = [];
    for (let i = 0; i < dotCount; i++) {
      const rx = nextRand();
      const ry = nextRand();
      const rs = nextRand();
      const cx = (sheetX + padX + rx * innerW).toFixed(1);
      const cy = (sheetY + padY + ry * innerH).toFixed(1);
      const r = Math.max(0.7, dotRadius * (0.78 + rs * 0.42)).toFixed(2);
      const fill = (i % 3 === 0) ? palette.dotLight : palette.dotDark;
      dots.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" />');
    }

    const shapeSvg =
      /* Backing paper layer slightly offset to look like a real sheet */
      '<rect x="' + (sheetX + 5) + '" y="' + (sheetY + 5) + '" width="' + sheetW + '" height="' + sheetH + '" rx="4" fill="' + palette.backing + '" stroke="' + palette.stroke + '" stroke-width="1.3" opacity="0.85" />' +
      /* Main abrasive sheet */
      '<rect x="' + sheetX + '" y="' + sheetY + '" width="' + sheetW + '" height="' + sheetH + '" rx="4" fill="' + palette.fill + '" stroke="' + palette.stroke + '" stroke-width="1.8" />' +
      /* Subtle edge highlight */
      '<line x1="' + (sheetX + 6) + '" y1="' + (sheetY + 4) + '" x2="' + (sheetX + sheetW - 6) + '" y2="' + (sheetY + 4) + '" stroke="#FFFFFF" stroke-width="1.2" opacity="0.28" stroke-linecap="round" />' +
      dots.join("");

    /* Right-side Grit pointer label */
    const yLabel = 144 + yOffset;
    const gritLabel = grit ? ("Grit: " + grit) : "Grit: ?";
    const labelColor = grit ? "#10302A" : "#64748B";
    const pointerSvg =
      '<polyline points="216,' + yLabel + ' 242,' + yLabel + ' 250,' + yLabel + '" fill="none" stroke="' + labelColor + '" stroke-width="1.2" />' +
      '<circle cx="216" cy="' + yLabel + '" r="2.3" fill="' + labelColor + '" />' +
      '<circle cx="258" cy="' + yLabel + '" r="4.8" fill="' + palette.fill + '" stroke="' + palette.stroke + '" stroke-width="1.1" />' +
      '<text x="268" y="' + (yLabel + 4) + '" text-anchor="start" font-size="12.5" font-weight="700" fill="' + labelColor + '">' + esc(gritLabel) + '</text>';

    const totalHeight = 258 + yOffset;

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" role="img" aria-label="Sand paper drawing">' +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          shapeSvg +
        '</g>' +
        pointerSvg +
      '</svg>'
    );
  },

  /* Draw the Sand paper screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    function makeOptionsHtml(items, placeholderText) {
      const opts = ['<option value="">' + placeholderText + '</option>'];
      items.forEach(function (item) {
        opts.push('<option value="' + item + '">' + item + '</option>');
      });
      return opts.join("");
    }

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="sandpaper-back-btn" aria-label="Back to Rules">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M15 18l-6-6 6-6"></path>' +
          '</svg>' +
        '</button>' +
        '<h1 class="item-screen-title">' + mod.name + '</h1>' +
      '</div>' +

      '<section class="card name-card card-stagger" style="--card-index: 1;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">SAP Short Text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="sandpaper-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="sandpaper-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="sandpaper-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="sandpaper-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="sandpaper-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="sandpaper-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="sandpaper-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="sandpaper-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="sandpaper-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="sandpaper-add-export-btn">Add to export list</button>' +
        '<p id="sandpaper-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="sandpaper-grit">Grit</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="sandpaper-grit" class="field-control">' +
              makeOptionsHtml(mod.lists.grit, "Select grit") +
            '</select>' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("sandpaper-back-btn");
    const nameBox = document.getElementById("sandpaper-name-box");
    const charCounter = document.getElementById("sandpaper-char-counter");
    const missingNote = document.getElementById("sandpaper-missing-note");
    const rebuildBtn = document.getElementById("sandpaper-rebuild-btn");
    const copyBtn = document.getElementById("sandpaper-copy-btn");
    const longBox = document.getElementById("sandpaper-long-box");
    const longRebuildBtn = document.getElementById("sandpaper-long-rebuild-btn");
    const longCopyBtn = document.getElementById("sandpaper-long-copy-btn");
    const drawingFrame = document.getElementById("sandpaper-drawing-frame");
    const addExportBtn = document.getElementById("sandpaper-add-export-btn");
    const exportFeedback = document.getElementById("sandpaper-export-feedback");

    const inputs = {
      grit: document.getElementById("sandpaper-grit")
    };

    function readFieldValues() {
      return {
        grit: inputs.grit.value
      };
    }

    function clearExportFeedback() {
      exportFeedback.textContent = "";
      exportFeedback.className = "add-export-feedback is-hidden";
    }

    function showExportFeedback(message, isError) {
      exportFeedback.textContent = message;
      exportFeedback.className = "add-export-feedback " + (isError ? "is-error" : "is-success");
    }

    function updateStatusDisplay() {
      const len = nameBox.value.length;
      const isOver = len > 40;
      const isNear = len >= 36 && !isOver;

      nameBox.classList.toggle("is-over", isOver);
      charCounter.classList.toggle("is-near", isNear);
      charCounter.classList.toggle("is-over", isOver);
      charCounter.textContent = isOver ? ("Too long: " + len + " / 40") : (len + " / 40");

      const missing = mod.getMissingRequired(readFieldValues());
      if (missing.length > 0) {
        missingNote.textContent = "Missing: " + missing.join(", ");
        missingNote.classList.remove("is-hidden");
      } else {
        missingNote.textContent = "";
        missingNote.classList.add("is-hidden");
      }
    }

    function updateDrawing() {
      drawingFrame.innerHTML = mod.buildDrawingSvg(readFieldValues(), nameBox.value);
    }

    function rebuildShortFromFields() {
      nameBox.value = mod.buildShortText(readFieldValues());
      updateStatusDisplay();
      updateDrawing();
      clearExportFeedback();
    }

    function rebuildLongFromFields() {
      longBox.value = mod.buildLongText(readFieldValues());
    }

    function rebuildAllFromFields() {
      rebuildShortFromFields();
      rebuildLongFromFields();
    }

    function copyTextarea(textarea, buttonEl) {
      const textToCopy = textarea.value;
      const showCopied = function () {
        buttonEl.textContent = "Copied";
        setTimeout(function () {
          buttonEl.textContent = "Copy";
        }, 1400);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(showCopied).catch(function () {
          textarea.select();
          document.execCommand("copy");
          showCopied();
        });
      } else {
        textarea.select();
        document.execCommand("copy");
        showCopied();
      }
    }

    Object.keys(inputs).forEach(function (key) {
      const el = inputs[key];
      el.addEventListener("input", rebuildAllFromFields);
      el.addEventListener("change", rebuildAllFromFields);
    });

    nameBox.addEventListener("input", function () {
      const start = nameBox.selectionStart;
      const end = nameBox.selectionEnd;
      const upper = nameBox.value.toUpperCase();
      if (nameBox.value !== upper) {
        nameBox.value = upper;
        if (typeof start === "number" && typeof end === "number") {
          nameBox.setSelectionRange(start, end);
        }
      }
      updateStatusDisplay();
      updateDrawing();
      clearExportFeedback();
    });

    rebuildBtn.addEventListener("click", rebuildShortFromFields);

    copyBtn.addEventListener("click", function () {
      copyTextarea(nameBox, copyBtn);
    });

    longRebuildBtn.addEventListener("click", rebuildLongFromFields);

    longCopyBtn.addEventListener("click", function () {
      copyTextarea(longBox, longCopyBtn);
    });

    addExportBtn.addEventListener("click", function () {
      const values = readFieldValues();
      const shortName = String(nameBox.value || "").trim();
      const longText = String(longBox.value || "").trim();
      const missing = mod.getMissingRequired(values);
      const reasons = [];

      if (missing.length > 0) {
        reasons.push("Missing required: " + missing.join(", "));
      }
      if (!shortName) {
        reasons.push("Short name is empty");
      } else if (shortName.length > 40) {
        reasons.push("Short name is over 40 characters (" + shortName.length + " / 40)");
      }

      if (reasons.length > 0) {
        showExportFeedback("Cannot add: " + reasons.join(". ") + ".", true);
        return;
      }

      const newCount = QSExport.add({
        moduleId: mod.id,
        moduleName: mod.name,
        shortName: shortName,
        longText: longText,
        fields: {
          grit: String(values.grit || "").trim()
        },
        sapDefaults: {
          materialType: mod.exportDefaults.materialType,
          baseUnit: mod.exportDefaults.baseUnit,
          materialGroup: mod.exportDefaults.materialGroup
        }
      });

      showExportFeedback(
        "Added. " + newCount + (newCount === 1 ? " item" : " items") + " in the list",
        false
      );
    });

    backBtn.addEventListener("click", goBack);

    rebuildAllFromFields();
  }
});

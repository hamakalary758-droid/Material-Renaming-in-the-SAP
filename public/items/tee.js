/* ----- PIPE TEE MODULE ----- */
window.QS_MODULES.push({
  id: "tee",
  name: "Pipe tee",
  searchWords: ["PIPE TEE", "EQUAL TEE", "UNEQUAL TEE", "LATERAL TEE"],
  searchRegexPatterns: [
    /(^|[^a-z0-9])tee[\s-]+(?:lat|swp|crn|var|w|thd)?[\s-]*(?:\d+(?:[.\s]+\d+\/\d+|\/\d+)?\s*(?:"|inch|in|mm|nb)|dn\s*\d+)/i,
    /(^|[^a-z0-9])(?:\d+(?:[.\s]+\d+\/\d+|\/\d+)?\s*(?:"|inch|in|mm|nb)|dn\s*\d+)[\s-]+(?:[a-z0-9.]+\s+){0,2}tee($|[^a-z0-9])/i
  ],
  notAScrewWords: [
    "TEE HANDLE", "HANDLE", "NUT", "TEE NUT", "BOLT", "TEE BOLT",
    "T-BOLT", "T BOLT", "CLAMP", "HOSE", "HOSES", "HOSE TEE",
    "HYDRAULIC", "HYD", "ELECTRICAL", "ELECTRIC", "CABLE", "CONDUIT",
    "TORCH", "CUTTING TORCH"
  ],
  tileBg: "#CBEFE3",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 13h16"></path>' +
      '<path d="M4 18h16"></path>' +
      '<path d="M4 13v5"></path>' +
      '<path d="M20 13v5"></path>' +
      '<path d="M9.5 13V5h5v8"></path>' +
      '<path d="M9.5 5h5"></path>' +
    '</svg>',

  /* SAP export defaults for Pipe tee */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Pipe tee dropdown lists */
  lists: {
    material: ["MS", "CS", "SS", "GI", "PVC", "CI"],
    special: [
      { code: "LAT", label: "LAT (45 degree lateral / wye)" },
      { code: "SWP", label: "SWP (sanitary / sweep)" },
      { code: "CRN", label: "CRN (3-way corner)" },
      { code: "VAR", label: "VAR (variable angle, structural)" }
    ],
    endType: [
      { code: "W", label: "W (weldable)" },
      { code: "THD", label: "THD (threaded)" }
    ],
    inchSize: ["1/2", "3/4", "1", "1.1/4", "1.1/2", "2", "2.1/2", "3", "4", "5", "6", "8", "10", "12", "14", "16", "18", "20", "24"],
    threadType: ["BSPT", "NPT", "BSPP"],
    schedule: ["SCH10S", "SCH20", "SCH40", "SCH80", "SCH160"],
    pressureClass: ["150#", "300#", "600#", "2000#", "3000#", "6000#"]
  },

  /* Easy-to-edit material colors for the drawing */
  materialColors: {
    "MS": { fill: "#6B7280", shade: "#4B5563", stroke: "#1F2937", detail: "#374151", dot: "#5B6472", shine: false },
    "CS": { fill: "#525C68", shade: "#363F4A", stroke: "#111827", detail: "#1F2937", dot: "#414A54", shine: false },
    "SS": { fill: "#E8EEF4", shade: "#CBD5E1", stroke: "#475569", detail: "#64748B", dot: "#DCE5EE", shine: true },
    "GI": { fill: "#F1F5F9", shade: "#DCE4EC", stroke: "#64748B", detail: "#94A3B8", dot: "#E5ECF3", shine: false },
    "PVC": { fill: "#CBD5E1", shade: "#94A3B8", stroke: "#334155", detail: "#475569", dot: "#B8C4D4", shine: false },
    "CI": { fill: "#4B5563", shade: "#374151", stroke: "#111827", detail: "#1F2937", dot: "#434C59", shine: false }
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    material: {
      "MS": "Mild steel",
      "CS": "Carbon steel",
      "SS": "Stainless steel",
      "GI": "Galvanized iron",
      "PVC": "PVC",
      "CI": "Cast iron"
    },
    special: {
      "LAT": "lateral 45 degree",
      "SWP": "sanitary sweep",
      "CRN": "3-way corner",
      "VAR": "variable angle"
    },
    endType: {
      "W": "weldable",
      "THD": "threaded"
    }
  },

  /* Build SAP Short Text (max 40 chars, UPPERCASE, no commas) */
  buildShortText: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (raw === "STEEL" || raw === "MILD STEEL") return "MS";
      if (raw === "GALVANIZED" || raw === "GALVANISED" || raw === "GALVANIZED IRON") return "GI";
      return raw;
    };
    const resolveChoiceUpper = function (choice, otherVal) {
      return choice === "__OTHER__" ? upper(otherVal) : upper(choice);
    };
    const formatInchSize = function (choice, otherVal) {
      if (choice === "__OTHER__") {
        const typed = String(otherVal || "").trim();
        if (!typed) return "";
        const u = typed.toUpperCase();
        return /"$/.test(u) ? u : (u + '"');
      }
      const picked = clean(choice);
      if (!picked) return "";
      const core = picked.replace(/"/g, "").toUpperCase();
      return core ? (core + '"') : "";
    };
    const formatSchedule = function (choice, otherVal) {
      const raw = resolveChoiceUpper(choice, otherVal);
      if (!raw) return "";
      return /^SCH/.test(raw) ? raw : ("SCH" + raw);
    };

    const material = normalizeMaterial(values.material, values.materialOther);
    const special = resolveChoiceUpper(values.special, values.specialOther);
    const end1 = upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const end3 = upper(values.end3);
    const size3 = formatInchSize(values.size3, values.size3Other);
    const thread = resolveChoiceUpper(values.thread, values.threadOther);
    const schedule = formatSchedule(values.schedule, values.scheduleOther);

    const hasAnyField = Boolean(
      material || special || end1 || size1 || end2 || size2 || end3 || size3 || thread || schedule
    );
    if (!hasAnyField) {
      return "";
    }

    const matPart = material || "?";
    const hasSide2 = Boolean(end2 || size2);
    const hasSide3 = Boolean(end3 || size3);
    const hasSide1 = Boolean(end1 || size1);

    let endSizePart = "?";

    if (!hasSide1 && !hasSide2 && !hasSide3) {
      endSizePart = "?";
    } else if (!hasSide2 && !hasSide3) {
      /* Only side 1 picked -> same end & size on all three sides */
      endSizePart = (end1 || "?") + (size1 || "?");
    } else {
      const effEnd1 = end1 || "";
      const effEnd2 = end2 || effEnd1;
      const effEnd3 = end3 || effEnd1;
      const effSize1 = size1 || "";
      const effSize2 = size2 || effSize1;
      const effSize3 = size3 || effSize1;

      const allEndsExplicitAndEqual = Boolean(end1 && end2 && end3 && end1 === end2 && end2 === end3);
      const allSizesEqual = Boolean(effSize1 && effSize1 === effSize2 && effSize2 === effSize3);

      if (allEndsExplicitAndEqual && allSizesEqual) {
        endSizePart = effEnd1 + effSize1;
      } else {
        const p1 = (effEnd1 || "?") + (effSize1 || "?");
        const p2 = (end2 ? end2 : (effEnd2 && effEnd2 !== effEnd1 ? effEnd2 : "")) + (effSize2 || "?");
        const p3 = (end3 ? end3 : (effEnd3 && effEnd3 !== effEnd1 ? effEnd3 : "")) + (effSize3 || "?");
        endSizePart = p1 + "X" + p2 + "X" + p3;
      }
    }

    const hasThdEnd = end1 === "THD" || end2 === "THD" || end3 === "THD";
    const threadPart = thread ? thread : (hasThdEnd ? "?" : "");
    const schPart = schedule || "?";

    const parts = [matPart, "TEE"];
    if (special) parts.push(special);
    parts.push(endSizePart);
    if (threadPart) parts.push(threadPart);
    parts.push(schPart);
    return parts.join(" ");
  },

  /* Build plain-word Long Text from current values and meanings */
  buildLongText: function (values) {
    const mod = this;
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? clean(otherVal) : clean(choice);
      if (!raw) return "";
      const u = raw.toUpperCase();
      if (u === "STEEL" || u === "MILD STEEL") return "MS";
      if (u === "GALVANIZED" || u === "GALVANISED" || u === "GALVANIZED IRON") return "GI";
      return raw;
    };
    const resolveChoiceClean = function (choice, otherVal) {
      return choice === "__OTHER__" ? clean(otherVal) : clean(choice);
    };
    const formatInchSize = function (choice, otherVal) {
      if (choice === "__OTHER__") {
        const typed = String(otherVal || "").trim();
        if (!typed) return "";
        return /"$/.test(typed) ? typed : (typed + '"');
      }
      const picked = clean(choice);
      if (!picked) return "";
      const core = picked.replace(/"/g, "");
      return core ? (core + '"') : "";
    };

    const matRaw = normalizeMaterial(values.material, values.materialOther);
    const matCode = upper(matRaw);
    const specialRaw = resolveChoiceClean(values.special, values.specialOther);
    const specialCode = upper(specialRaw);

    const end1 = upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const end3 = upper(values.end3);
    const size3 = formatInchSize(values.size3, values.size3Other);

    const threadRaw = resolveChoiceClean(values.thread, values.threadOther);
    const threadCode = upper(threadRaw);
    const schRaw = resolveChoiceClean(values.schedule, values.scheduleOther);
    const schClean = schRaw ? schRaw.replace(/^SCH/i, "").trim() : "";
    const pressureRaw = resolveChoiceClean(values.pressureClass, values.pressureClassOther);

    const hasAnyField = Boolean(
      matRaw || specialRaw || end1 || size1 || end2 || size2 || end3 || size3 || threadRaw || schClean || pressureRaw
    );
    if (!hasAnyField) {
      return "";
    }

    const matWord = matCode ? (mod.meanings.material[matCode] || matRaw) : "";
    const specialWord = specialCode ? (mod.meanings.special[specialCode] || specialRaw) : "";
    const lead = [matWord, specialWord, "pipe tee"].filter(Boolean).join(" ");
    const leadFormatted = lead.charAt(0).toUpperCase() + lead.slice(1);

    const endWord = function (code) {
      return code ? (mod.meanings.endType[code] || code.toLowerCase()) : "";
    };
    const sidePhrase = function (label, e, s) {
      const ew = endWord(e);
      if (ew && s) return label + " is " + ew + " with " + s;
      if (ew) return label + " is " + ew;
      if (s) return label + " is " + s;
      return "";
    };

    const hasSide1 = Boolean(end1 || size1);
    const hasSide2 = Boolean(end2 || size2);
    const hasSide3 = Boolean(end3 || size3);
    let endsClause = "";

    if (hasSide1 && !hasSide2 && !hasSide3) {
      const ew = endWord(end1);
      if (ew && size1) endsClause = "all three sides are " + ew + " with " + size1;
      else if (ew) endsClause = "all three sides are " + ew;
      else if (size1) endsClause = "all three sides with " + size1;
    } else if (hasSide1 || hasSide2 || hasSide3) {
      const effEnd1 = end1;
      const effEnd2 = end2 || effEnd1;
      const effEnd3 = end3 || effEnd1;
      const effSize1 = size1;
      const effSize2 = size2 || effSize1;
      const effSize3 = size3 || effSize1;

      if (effEnd1 === effEnd2 && effEnd2 === effEnd3 && effSize1 === effSize2 && effSize2 === effSize3) {
        const ew = endWord(effEnd1);
        if (ew && effSize1) endsClause = "all three sides are " + ew + " with " + effSize1;
        else if (ew) endsClause = "all three sides are " + ew;
        else if (effSize1) endsClause = "all three sides with " + effSize1;
      } else {
        endsClause = [
          sidePhrase("side 1", effEnd1, effSize1),
          sidePhrase("side 2", effEnd2, effSize2),
          sidePhrase("branch side", effEnd3, effSize3)
        ].filter(Boolean).join(", ");
      }
    }

    const clauses = [leadFormatted];
    if (endsClause) clauses.push(endsClause);
    if (threadCode) clauses.push("with " + threadCode + " thread");
    if (schClean) clauses.push("with the schedule " + schClean + " thickness");
    if (pressureRaw) clauses.push("with " + pressureRaw + " pressure class");

    if (clauses.length === 1) {
      return clauses[0];
    }
    return clauses[0] + ", " + clauses.slice(1).join(" ");
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return clean(otherVal);
      return clean(choice);
    };

    const missing = [];
    if (!resolveChoice(values.material, values.materialOther)) missing.push("Material");
    return missing;
  },

  /* Build crisp T-shape or 45-degree LAT SVG drawing showing W or THD on each of the 3 sides */
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
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (raw === "STEEL" || raw === "MILD STEEL") return "MS";
      if (raw === "GALVANIZED" || raw === "GALVANISED" || raw === "GALVANIZED IRON") return "GI";
      return raw;
    };
    const resolveChoiceUpper = function (choice, otherVal) {
      return choice === "__OTHER__" ? upper(otherVal) : upper(choice);
    };
    const formatInchSize = function (choice, otherVal) {
      if (choice === "__OTHER__") {
        const typed = String(otherVal || "").trim();
        if (!typed) return "";
        const u = typed.toUpperCase();
        return /"$/.test(u) ? u : (u + '"');
      }
      const picked = clean(choice);
      if (!picked) return "";
      const core = picked.replace(/"/g, "").toUpperCase();
      return core ? (core + '"') : "";
    };
    const formatSchedule = function (choice, otherVal) {
      const raw = resolveChoiceUpper(choice, otherVal);
      if (!raw) return "";
      return /^SCH/.test(raw) ? raw : ("SCH" + raw);
    };

    const material = normalizeMaterial(values.material, values.materialOther);
    const special = resolveChoiceUpper(values.special, values.specialOther);
    const end1Raw = upper(values.end1);
    const size1Raw = formatInchSize(values.size1, values.size1Other);
    const end2Raw = upper(values.end2);
    const size2Raw = formatInchSize(values.size2, values.size2Other);
    const end3Raw = upper(values.end3);
    const size3Raw = formatInchSize(values.size3, values.size3Other);
    const thread = resolveChoiceUpper(values.thread, values.threadOther);
    const schedule = formatSchedule(values.schedule, values.scheduleOther);
    const pressure = resolveChoiceUpper(values.pressureClass, values.pressureClassOther);

    const side1End = end1Raw;
    const side1Size = size1Raw;
    const side2End = end2Raw || end1Raw;
    const side2Size = size2Raw || size1Raw;
    const side3End = end3Raw || end1Raw;
    const side3Size = size3Raw || size1Raw;

    const hasMat = Boolean(material);
    const matPalette = (material && mod.materialColors && mod.materialColors[material]) ? mod.materialColors[material] : null;
    const useShine = Boolean(matPalette && matPalette.shine);
    const cFill = matPalette ? matPalette.fill : (hasMat ? "#D5DCE3" : "#EEF2F6");
    const cShade = matPalette ? matPalette.shade : (hasMat ? "#94A3B8" : "#CBD5E1");
    const cMidHi = useShine ? "#FFFFFF" : cFill;
    const strokeColor = matPalette ? matPalette.stroke : (hasMat ? "#475569" : "#94A3B8");
    const detailColor = matPalette ? matPalette.detail : (hasMat ? "#64748B" : "#94A3B8");
    const dotColor = matPalette ? matPalette.dot : (hasMat ? "#D5DCE3" : "#EEF2F6");

    mod._svgUid = (mod._svgUid || 0) + 1;
    const uid = "tee-g" + mod._svgUid + "-" + Math.random().toString(36).slice(2, 6);

    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW PIPE TEE"];
    const topIsPlaceholder = !topText;
    const topShift = Math.max(0, topLines.length - 1) * 15;

    const topSvg = topLines.map(function (line, i) {
      const y = 22 + i * 15;
      const color = topIsPlaceholder ? "#94A3B8" : "#10302A";
      return (
        '<text x="190" y="' + y + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + color + '">' +
          esc(line) +
        '</text>'
      );
    }).join("");

    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";
    const isLat = special === "LAT";

    const yOff = topShift;
    const cx = 190;
    const cy = 152 + yOff;
    const halfW = 19;
    const runLeft = 72;
    const runRight = 308;

    const buildEndFeature = function (endCode, mx, my, tx, ty, nx, ny, gradId) {
      if (endCode === "W") {
        /* Machined weld bevel: thin light ring + thin dark ring + chamfered edges */
        const bx = mx + tx * 5;
        const by = my + ty * 5;
        const lx = mx + tx * 2.4;
        const ly = my + ty * 2.4;
        const dx = mx + tx * 4.8;
        const dy = my + ty * 4.8;
        return (
          '<line x1="' + (lx - nx * (halfW - 1.5)).toFixed(1) + '" y1="' + (ly - ny * (halfW - 1.5)).toFixed(1) +
            '" x2="' + (lx + nx * (halfW - 1.5)).toFixed(1) + '" y2="' + (ly + ny * (halfW - 1.5)).toFixed(1) +
            '" stroke="#FFFFFF" stroke-width="1.3" opacity="0.72" />' +
          '<line x1="' + (dx - nx * (halfW - 1)).toFixed(1) + '" y1="' + (dy - ny * (halfW - 1)).toFixed(1) +
            '" x2="' + (dx + nx * (halfW - 1)).toFixed(1) + '" y2="' + (dy + ny * (halfW - 1)).toFixed(1) +
            '" stroke="' + detailColor + '" stroke-width="1.2" />' +
          '<line x1="' + (mx - nx * halfW).toFixed(1) + '" y1="' + (my - ny * halfW).toFixed(1) +
            '" x2="' + (bx - nx * (halfW - 4)).toFixed(1) + '" y2="' + (by - ny * (halfW - 4)).toFixed(1) +
            '" stroke="' + strokeColor + '" stroke-width="1" />' +
          '<line x1="' + (mx + nx * halfW).toFixed(1) + '" y1="' + (my + ny * halfW).toFixed(1) +
            '" x2="' + (bx + nx * (halfW - 4)).toFixed(1) + '" y2="' + (by + ny * (halfW - 4)).toFixed(1) +
            '" stroke="' + strokeColor + '" stroke-width="1" />'
        );
      }
      if (endCode === "THD") {
        /* Threaded end: slightly thicker shaded collar with crisp slanted thread lines */
        const cHalf = halfW + 2.5;
        const cLen = 18;
        const p1x = mx - nx * cHalf;
        const p1y = my - ny * cHalf;
        const p2x = mx + tx * cLen - nx * cHalf;
        const p2y = my + ty * cLen - ny * cHalf;
        const p3x = mx + tx * cLen + nx * cHalf;
        const p3y = my + ty * cLen + ny * cHalf;
        const p4x = mx + nx * cHalf;
        const p4y = my + ny * cHalf;
        const collarPath =
          "M " + p1x.toFixed(1) + " " + p1y.toFixed(1) +
          " L " + p2x.toFixed(1) + " " + p2y.toFixed(1) +
          " L " + p3x.toFixed(1) + " " + p3y.toFixed(1) +
          " L " + p4x.toFixed(1) + " " + p4y.toFixed(1) + " Z";
        const ridges = [];
        for (let t = 3.5; t <= 15.5; t += 3) {
          const rx = mx + tx * t;
          const ry = my + ty * t;
          ridges.push(
            '<line x1="' + (rx + tx * 1.1 - nx * (cHalf - 1.2)).toFixed(1) + '" y1="' + (ry + ty * 1.1 - ny * (cHalf - 1.2)).toFixed(1) +
              '" x2="' + (rx - tx * 1.1 + nx * (cHalf - 1.2)).toFixed(1) + '" y2="' + (ry - ty * 1.1 + ny * (cHalf - 1.2)).toFixed(1) +
              '" stroke="' + strokeColor + '" stroke-width="1.15" />'
          );
        }
        return (
          '<path d="' + collarPath + '" fill="url(#' + gradId + ')" stroke="' + strokeColor + '" stroke-width="1.1" stroke-linejoin="round" />' +
          '<line x1="' + (p1x + tx * 2).toFixed(1) + '" y1="' + (p1y + ty * 2).toFixed(1) +
            '" x2="' + (p2x - tx * 1).toFixed(1) + '" y2="' + (p2y - ty * 1).toFixed(1) +
            '" stroke="#FFFFFF" stroke-width="1.1" opacity="' + (useShine ? "0.65" : "0.42") + '" />' +
          ridges.join("")
        );
      }
      return (
        '<line x1="' + (mx + tx * 10 - nx * halfW).toFixed(1) + '" y1="' + (my + ty * 10 - ny * halfW).toFixed(1) +
          '" x2="' + (mx + tx * 10 + nx * halfW).toFixed(1) + '" y2="' + (my + ty * 10 + ny * halfW).toFixed(1) +
          '" stroke="' + strokeColor + '" stroke-width="1" stroke-dasharray="3 3" />'
      );
    };

    const cylStops =
      '<stop offset="0%" stop-color="' + cShade + '" />' +
      '<stop offset="28%" stop-color="' + cFill + '" />' +
      '<stop offset="48%" stop-color="' + cMidHi + '" />' +
      '<stop offset="72%" stop-color="' + cFill + '" />' +
      '<stop offset="100%" stop-color="' + cShade + '" />';

    const topY = cy - halfW;
    const botY = cy + halfW;

    const runGrad =
      '<linearGradient id="' + uid + '-run" gradientUnits="userSpaceOnUse" x1="' + runLeft + '" y1="' + topY + '" x2="' + runLeft + '" y2="' + botY + '">' +
        cylStops +
      '</linearGradient>';

    const runFillSvg =
      '<rect x="' + (runLeft - 2) + '" y="' + (topY - 2) + '" width="' + (runRight - runLeft + 4) + '" height="' + (halfW * 2 + 4) + '" fill="url(#' + uid + '-run)" />';

    const runHighlightSvg =
      '<line x1="' + runLeft + '" y1="' + (topY + 8) + '" x2="' + runRight + '" y2="' + (topY + 8) + '" stroke="#FFFFFF" stroke-width="' + (useShine ? "3.2" : "2.2") + '" stroke-linecap="round" opacity="' + (useShine ? "0.72" : "0.45") + '" />';

    let bodyPath = "";
    let branchGrad = "";
    let branchFillSvg = "";
    let branchHighlightSvg = "";
    let junctionBlendSvg = "";
    let centerPath = "";
    let end1Features = "";
    let end2Features = "";
    let end3Features = "";
    let angleGuideSvg = "";
    let branchLabelX = cx;
    let branchLabelY = cy - 92;

    if (isLat) {
      /* 45-degree lateral / wye tee: branch angles up-right at 45° from junction */
      const c45 = Math.SQRT1_2;
      const jx = 166; /* shift junction slightly left so branch stays balanced horizontally */
      const bLen = 84;
      const bx = jx + bLen * c45;
      const by = cy - bLen * c45;

      /* Pipe half-width perpendicular to 45° up-right vector (c45, -c45) is (c45, c45) */
      const wOff = halfW / c45; /* intersection offset along horizontal top wall */
      const jLeftX = jx - wOff + halfW;
      const jRightX = jx + wOff + halfW;

      /* Upper-left and lower-right corners of 45° branch mouth */
      const mUpperX = bx - halfW * c45;
      const mUpperY = by - halfW * c45;
      const mLowerX = bx + halfW * c45;
      const mLowerY = by + halfW * c45;

      bodyPath =
        "M " + runLeft + " " + botY +
        " L " + runRight + " " + botY +
        " L " + runRight + " " + topY +
        " L " + jRightX.toFixed(1) + " " + topY +
        " L " + mLowerX.toFixed(1) + " " + mLowerY.toFixed(1) +
        " L " + mUpperX.toFixed(1) + " " + mUpperY.toFixed(1) +
        " L " + jLeftX.toFixed(1) + " " + topY +
        " L " + runLeft + " " + topY + " Z";

      branchGrad =
        '<linearGradient id="' + uid + '-br" gradientUnits="userSpaceOnUse" x1="' + mUpperX.toFixed(1) + '" y1="' + mUpperY.toFixed(1) + '" x2="' + mLowerX.toFixed(1) + '" y2="' + mLowerY.toFixed(1) + '">' +
          cylStops +
        '</linearGradient>';

      const saddleCx = (jLeftX + jRightX) / 2 + 2;
      const saddleCy = topY + 12;
      const branchPoly =
        "M " + jLeftX.toFixed(1) + " " + topY +
        " Q " + saddleCx.toFixed(1) + " " + saddleCy.toFixed(1) + " " + jRightX.toFixed(1) + " " + topY +
        " L " + (mLowerX + 2).toFixed(1) + " " + (mLowerY - 2).toFixed(1) +
        " L " + (mUpperX - 2).toFixed(1) + " " + (mUpperY - 2).toFixed(1) + " Z";
      branchFillSvg = '<path d="' + branchPoly + '" fill="url(#' + uid + '-br)" />';

      const hiOff = halfW - 8;
      const bHiStartX = jLeftX + hiOff * c45;
      const bHiStartY = topY + 3;
      const bHiEndX = bx - hiOff * c45;
      const bHiEndY = by - hiOff * c45;
      branchHighlightSvg =
        '<line x1="' + bHiStartX.toFixed(1) + '" y1="' + bHiStartY.toFixed(1) + '" x2="' + bHiEndX.toFixed(1) + '" y2="' + bHiEndY.toFixed(1) + '" stroke="#FFFFFF" stroke-width="' + (useShine ? "3" : "2") + '" stroke-linecap="round" opacity="' + (useShine ? "0.68" : "0.42") + '" />';

      junctionBlendSvg =
        '<path d="M ' + (jLeftX + 1.5).toFixed(1) + ' ' + topY + ' Q ' + saddleCx.toFixed(1) + ' ' + (saddleCy - 0.5).toFixed(1) + ' ' + (jRightX - 1.5).toFixed(1) + ' ' + topY + '" fill="none" stroke="' + cShade + '" stroke-width="1.5" opacity="0.52" />' +
        '<path d="M ' + (jLeftX + 2.5).toFixed(1) + ' ' + (topY + 1.5) + ' Q ' + saddleCx.toFixed(1) + ' ' + (saddleCy + 1.2).toFixed(1) + ' ' + (jRightX - 2.5).toFixed(1) + ' ' + (topY + 1.5) + '" fill="none" stroke="#FFFFFF" stroke-width="1.1" opacity="' + (useShine ? "0.65" : "0.44") + '" />';

      centerPath =
        "M " + (runLeft - 6) + " " + cy + " L " + (runRight + 6) + " " + cy +
        " M " + jx + " " + cy + " L " + (bx + 6 * c45).toFixed(1) + " " + (by - 6 * c45).toFixed(1);

      end1Features = buildEndFeature(side1End, runLeft, cy, 1, 0, 0, 1, uid + "-run");
      end2Features = buildEndFeature(side2End, runRight, cy, -1, 0, 0, 1, uid + "-run");
      end3Features = buildEndFeature(side3End, bx, by, -c45, c45, c45, c45, uid + "-br");

      angleGuideSvg =
        '<path d="M ' + (jx + 34) + ' ' + cy + ' A 34 34 0 0 0 ' + (jx + 24) + ' ' + (cy - 24) + '" fill="none" stroke="' + reqColor + '" stroke-width="1.1" />' +
        '<text x="' + (jx + 42) + '" y="' + (cy - 26) + '" text-anchor="start" font-size="11" font-weight="700" fill="' + reqColor + '">45 deg</text>';

      branchLabelX = bx + 12;
      branchLabelY = mUpperY - 10;
    } else {
      /* Standard 90-degree T shape */
      const branchTop = cy - 78;
      const branchLeft = cx - halfW;
      const branchRight = cx + halfW;

      bodyPath =
        "M " + runLeft + " " + botY +
        " L " + runRight + " " + botY +
        " L " + runRight + " " + topY +
        " L " + branchRight + " " + topY +
        " L " + branchRight + " " + branchTop +
        " L " + branchLeft + " " + branchTop +
        " L " + branchLeft + " " + topY +
        " L " + runLeft + " " + topY + " Z";

      branchGrad =
        '<linearGradient id="' + uid + '-br" gradientUnits="userSpaceOnUse" x1="' + branchLeft + '" y1="' + branchTop + '" x2="' + branchRight + '" y2="' + branchTop + '">' +
          cylStops +
        '</linearGradient>';

      const saddleCy = topY + 12;
      const branchPoly =
        "M " + branchLeft + " " + topY +
        " Q " + cx + " " + saddleCy + " " + branchRight + " " + topY +
        " L " + (branchRight + 1) + " " + (branchTop - 2) +
        " L " + (branchLeft - 1) + " " + (branchTop - 2) + " Z";
      branchFillSvg = '<path d="' + branchPoly + '" fill="url(#' + uid + '-br)" />';

      branchHighlightSvg =
        '<line x1="' + (branchLeft + 8) + '" y1="' + (branchTop + 2) + '" x2="' + (branchLeft + 8) + '" y2="' + (topY + 2) + '" stroke="#FFFFFF" stroke-width="' + (useShine ? "3" : "2") + '" stroke-linecap="round" opacity="' + (useShine ? "0.68" : "0.42") + '" />';

      junctionBlendSvg =
        '<path d="M ' + (branchLeft + 1.5) + ' ' + topY + ' Q ' + cx + ' ' + (saddleCy - 0.5) + ' ' + (branchRight - 1.5) + ' ' + topY + '" fill="none" stroke="' + cShade + '" stroke-width="1.5" opacity="0.52" />' +
        '<path d="M ' + (branchLeft + 2.5) + ' ' + (topY + 1.5) + ' Q ' + cx + ' ' + (saddleCy + 1.2) + ' ' + (branchRight - 2.5) + ' ' + (topY + 1.5) + '" fill="none" stroke="#FFFFFF" stroke-width="1.1" opacity="' + (useShine ? "0.65" : "0.44") + '" />';

      centerPath =
        "M " + (runLeft - 6) + " " + cy + " L " + (runRight + 6) + " " + cy +
        " M " + cx + " " + cy + " L " + cx + " " + (branchTop - 6);

      end1Features = buildEndFeature(side1End, runLeft, cy, 1, 0, 0, 1, uid + "-run");
      end2Features = buildEndFeature(side2End, runRight, cy, -1, 0, 0, 1, uid + "-run");
      end3Features = buildEndFeature(side3End, cx, branchTop, 0, 1, 1, 0, uid + "-br");

      branchLabelX = cx;
      branchLabelY = branchTop - 12;
    }

    const defsSvg =
      '<defs>' +
        runGrad +
        branchGrad +
        '<clipPath id="' + uid + '-clip"><path d="' + bodyPath + '" /></clipPath>' +
      '</defs>';

    const s1Text = "1: " + (side1End || "?") + (side1Size ? (" " + side1Size) : "");
    const s2Text = "2: " + (side2End || "?") + (side2Size ? (" " + side2Size) : "");
    const s3Text = "3: " + (side3End || "?") + (side3Size ? (" " + side3Size) : "");

    const endLabelsSvg =
      '<text x="' + (runLeft + 18) + '" y="' + (cy + halfW + 22) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + ((side1End || side1Size) ? optColor : missingColor) + '">' +
        esc(s1Text) +
      '</text>' +
      '<text x="' + (runRight - 18) + '" y="' + (cy + halfW + 22) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + ((side2End || side2Size) ? optColor : missingColor) + '">' +
        esc(s2Text) +
      '</text>' +
      '<text x="' + branchLabelX.toFixed(0) + '" y="' + branchLabelY.toFixed(0) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + ((side3End || side3Size) ? optColor : missingColor) + '">' +
        esc(s3Text) +
      '</text>';

    const infoStartY = cy + halfW + 50;
    const matLabel = material ? ("Material: " + material) : "Material: ?";
    const matCol = material ? reqColor : missingColor;

    const specItems = [];
    if (special) specItems.push("Type: " + special);
    if (thread) specItems.push("Thread: " + thread);
    specItems.push("Schedule: " + (schedule || "?"));
    if (pressure) specItems.push("Class: " + pressure);

    const specLines = wrapLines(specItems.join("  |  "), 46);

    const infoSvg =
      '<circle cx="132" cy="' + (infoStartY - 4) + '" r="5" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1" />' +
      '<text x="142" y="' + infoStartY + '" text-anchor="start" font-size="12" font-weight="700" fill="' + matCol + '">' + esc(matLabel) + '</text>' +
      specLines.map(function (line, i) {
        const y = infoStartY + 18 + i * 16;
        return '<text x="190" y="' + y + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + optColor + '">' + esc(line) + '</text>';
      }).join("");

    const totalHeight = infoStartY + 18 + specLines.length * 16 + 12;

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Pipe tee technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<ellipse cx="190" cy="' + (botY + 7) + '" rx="96" ry="4" fill="#0f172a" opacity="0.12" />' +
        '<g class="bolt-shape-animate">' +
          '<g clip-path="url(#' + uid + '-clip)">' +
            runFillSvg +
            runHighlightSvg +
            branchFillSvg +
            branchHighlightSvg +
            junctionBlendSvg +
          '</g>' +
          '<path d="' + bodyPath + '" fill="none" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="round" />' +
          '<path d="' + centerPath + '" fill="none" stroke="' + detailColor + '" stroke-width="1" stroke-dasharray="5 3" />' +
          end1Features +
          end2Features +
          end3Features +
        '</g>' +
        angleGuideSvg +
        endLabelsSvg +
        infoSvg +
      '</svg>'
    );
  },

  /* Draw the Pipe tee screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    function makeOptionsHtml(items, placeholderText, includeOther) {
      const opts = placeholderText ? ['<option value="">' + placeholderText + '</option>'] : [];
      items.forEach(function (item) {
        if (item && typeof item === "object") {
          opts.push('<option value="' + item.code + '">' + item.label + '</option>');
        } else {
          opts.push('<option value="' + item + '">' + item + '</option>');
        }
      });
      if (includeOther) {
        opts.push('<option value="__OTHER__">Other (type it)</option>');
      }
      return opts.join("");
    }

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="tee-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="tee-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="tee-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="tee-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="tee-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="tee-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="tee-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="tee-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="tee-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="tee-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="tee-add-export-btn">Add to export list</button>' +
        '<p id="tee-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-material">Material</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="tee-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material", true) +
            '</select>' +
            '<input id="tee-material-other" type="text" class="field-control" style="display: none;" placeholder="Type material code" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-special">Special tee type</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-special" class="field-control">' +
              makeOptionsHtml(mod.lists.special, "Normal tee", true) +
            '</select>' +
            '<input id="tee-special-other" type="text" class="field-control" style="display: none;" placeholder="Type special code" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-end1">Side 1 end</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-end1" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Select end type", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-size1">Side 1 size (inch)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-size1" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
            '</select>' +
            '<input id="tee-size1-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 2.1/4" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-end2">Side 2 end (if different)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-end2" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Same as side 1", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-size2">Side 2 size (if different)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-size2" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Same as side 1", true) +
            '</select>' +
            '<input id="tee-size2-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 1.1/2" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-end3">Branch side end (if different)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-end3" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Same as side 1", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-size3">Branch side size (if different)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-size3" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Same as side 1", true) +
            '</select>' +
            '<input id="tee-size3-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 1" />' +
          '</div>' +

          '<div class="field-group" id="tee-thread-group" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-thread">Thread</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-thread" class="field-control">' +
              makeOptionsHtml(mod.lists.threadType, "Select thread", true) +
            '</select>' +
            '<input id="tee-thread-other" type="text" class="field-control" style="display: none;" placeholder="Type thread, e.g. BSP" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-schedule">Schedule</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-schedule" class="field-control">' +
              makeOptionsHtml(mod.lists.schedule, "Select schedule", true) +
            '</select>' +
            '<input id="tee-schedule-other" type="text" class="field-control" style="display: none;" placeholder="Type schedule, e.g. SCH10S" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="tee-pressure">Pressure class (long text)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="tee-pressure" class="field-control">' +
              makeOptionsHtml(mod.lists.pressureClass, "Select pressure class", true) +
            '</select>' +
            '<input id="tee-pressure-other" type="text" class="field-control" style="display: none;" placeholder="Type class, e.g. 3000#" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("tee-back-btn");
    const nameBox = document.getElementById("tee-name-box");
    const charCounter = document.getElementById("tee-char-counter");
    const missingNote = document.getElementById("tee-missing-note");
    const rebuildBtn = document.getElementById("tee-rebuild-btn");
    const copyBtn = document.getElementById("tee-copy-btn");
    const longBox = document.getElementById("tee-long-box");
    const longRebuildBtn = document.getElementById("tee-long-rebuild-btn");
    const longCopyBtn = document.getElementById("tee-long-copy-btn");
    const drawingFrame = document.getElementById("tee-drawing-frame");
    const addExportBtn = document.getElementById("tee-add-export-btn");
    const exportFeedback = document.getElementById("tee-export-feedback");
    const threadGroup = document.getElementById("tee-thread-group");

    const inputs = {
      material: document.getElementById("tee-material"),
      materialOther: document.getElementById("tee-material-other"),
      special: document.getElementById("tee-special"),
      specialOther: document.getElementById("tee-special-other"),
      end1: document.getElementById("tee-end1"),
      size1: document.getElementById("tee-size1"),
      size1Other: document.getElementById("tee-size1-other"),
      end2: document.getElementById("tee-end2"),
      size2: document.getElementById("tee-size2"),
      size2Other: document.getElementById("tee-size2-other"),
      end3: document.getElementById("tee-end3"),
      size3: document.getElementById("tee-size3"),
      size3Other: document.getElementById("tee-size3-other"),
      thread: document.getElementById("tee-thread"),
      threadOther: document.getElementById("tee-thread-other"),
      schedule: document.getElementById("tee-schedule"),
      scheduleOther: document.getElementById("tee-schedule-other"),
      pressureClass: document.getElementById("tee-pressure"),
      pressureClassOther: document.getElementById("tee-pressure-other")
    };

    function hasThreadedEnd() {
      return (
        inputs.end1.value === "THD" ||
        inputs.end2.value === "THD" ||
        inputs.end3.value === "THD"
      );
    }

    function syncConditionalControls() {
      inputs.materialOther.style.display = inputs.material.value === "__OTHER__" ? "" : "none";
      inputs.specialOther.style.display = inputs.special.value === "__OTHER__" ? "" : "none";
      inputs.size1Other.style.display = inputs.size1.value === "__OTHER__" ? "" : "none";
      inputs.size2Other.style.display = inputs.size2.value === "__OTHER__" ? "" : "none";
      inputs.size3Other.style.display = inputs.size3.value === "__OTHER__" ? "" : "none";
      inputs.scheduleOther.style.display = inputs.schedule.value === "__OTHER__" ? "" : "none";
      inputs.pressureClassOther.style.display = inputs.pressureClass.value === "__OTHER__" ? "" : "none";

      const showThread = hasThreadedEnd();
      if (threadGroup) {
        threadGroup.style.display = showThread ? "" : "none";
      }
      inputs.threadOther.style.display = (showThread && inputs.thread.value === "__OTHER__") ? "" : "none";
    }

    function readFieldValues() {
      const out = {};
      Object.keys(inputs).forEach(function (k) {
        out[k] = inputs[k].value;
      });
      if (!hasThreadedEnd()) {
        out.thread = "";
        out.threadOther = "";
      }
      return out;
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
      syncConditionalControls();
      nameBox.value = mod.buildShortText(readFieldValues());
      updateStatusDisplay();
      updateDrawing();
      clearExportFeedback();
    }

    function rebuildLongFromFields() {
      syncConditionalControls();
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
        fields: values,
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

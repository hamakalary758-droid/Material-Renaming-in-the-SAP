/* ----- PIPE REDUCER MODULE ----- */
window.QS_MODULES.push({
  id: "reducer",
  name: "Pipe reducer",
  searchWords: ["REDUCER", "PIPE REDUCER", "CONC REDUCER", "ECC REDUCER"],
  notAScrewWords: [
    "NIPPLE", "REDUCING NIPPLE", "BRASS REDUCING NIPPLE",
    "HOSE", "HOSES", "HYDRAULIC", "BUSHING", "COUPLING"
  ],
  tileBg: "#D8F5EA",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 6h4l8 3h4v6h-4l-8 3H4V6z"></path>' +
      '<path d="M8 6v12"></path>' +
      '<path d="M16 9v6"></path>' +
    '</svg>',

  /* SAP export defaults for Pipe reducer */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Pipe reducer dropdown lists */
  lists: {
    material: ["MS", "CS", "SS", "GI", "PVC", "CI"],
    reducerType: [
      { code: "CONC", label: "CONC (concentric)" },
      { code: "ECC", label: "ECC (eccentric)" }
    ],
    endType: [
      { code: "W", label: "W (weldable)" },
      { code: "THD", label: "THD (threaded)" }
    ],
    inchSize: ["1/2", "3/4", "1", "1.1/4", "1.1/2", "2", "2.1/2", "3", "4", "5", "6", "8", "10", "12", "14", "16", "18", "20", "24"],
    threadType: ["BSPT", "NPT", "BSPP"],
    schedule: ["SCH10S", "SCH20", "SCH40", "SCH80", "SCH160"]
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
    reducerType: {
      "CONC": "concentric",
      "ECC": "eccentric"
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
    const parseInchValue = function (sizeStr) {
      if (!sizeStr) return NaN;
      const s = String(sizeStr).replace(/"/g, "").trim();
      const mixed = s.match(/^(\d+)[.\s]+(\d+)\/(\d+)$/);
      if (mixed) {
        return Number(mixed[1]) + (Number(mixed[2]) / Number(mixed[3]));
      }
      const frac = s.match(/^(\d+)\/(\d+)$/);
      if (frac) {
        return Number(frac[1]) / Number(frac[2]);
      }
      const num = parseFloat(s);
      return isNaN(num) ? NaN : num;
    };
    const formatEndPart = function (endCode, sizeStr) {
      if (!endCode && !sizeStr) return "?";
      return (endCode || "?") + (sizeStr || "?");
    };

    const material = normalizeMaterial(values.material, values.materialOther);
    const reducerType = upper(values.reducerType);
    const end1 = upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const thread = resolveChoiceUpper(values.thread, values.threadOther);
    const schedule = formatSchedule(values.schedule, values.scheduleOther);

    const hasAnyField = Boolean(
      material || reducerType || end1 || size1 || end2 || size2 || thread || schedule
    );
    if (!hasAnyField) {
      return "";
    }

    let first = { end: end1, size: size1 };
    let second = { end: end2, size: size2 };
    const v1 = parseInchValue(size1);
    const v2 = parseInchValue(size2);
    if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
      first = { end: end2, size: size2 };
      second = { end: end1, size: size1 };
    }

    const matPart = material || "?";
    const typePart = reducerType || "?";
    const sidesPart = formatEndPart(first.end, first.size) + "X" + formatEndPart(second.end, second.size);
    const hasThd = end1 === "THD" || end2 === "THD";
    const threadPart = hasThd ? (thread || "?") : "";
    const schPart = schedule || "?";

    return [matPart, "REDUCER", typePart, sidesPart, threadPart, schPart]
      .filter(Boolean)
      .join(" ");
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
    const parseInchValue = function (sizeStr) {
      if (!sizeStr) return NaN;
      const s = String(sizeStr).replace(/"/g, "").trim();
      const mixed = s.match(/^(\d+)[.\s]+(\d+)\/(\d+)$/);
      if (mixed) return Number(mixed[1]) + (Number(mixed[2]) / Number(mixed[3]));
      const frac = s.match(/^(\d+)\/(\d+)$/);
      if (frac) return Number(frac[1]) / Number(frac[2]);
      const num = parseFloat(s);
      return isNaN(num) ? NaN : num;
    };

    const matRaw = normalizeMaterial(values.material, values.materialOther);
    const matCode = upper(matRaw);
    const typeCode = upper(values.reducerType);
    const end1 = upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const threadRaw = resolveChoiceClean(values.thread, values.threadOther);
    const threadCode = upper(threadRaw);
    const schRaw = resolveChoiceClean(values.schedule, values.scheduleOther);
    const schClean = schRaw ? schRaw.replace(/^SCH/i, "").trim() : "";

    const hasAnyField = Boolean(
      matRaw || typeCode || end1 || size1 || end2 || size2 || threadRaw || schClean
    );
    if (!hasAnyField) {
      return "";
    }

    const matWord = matCode ? (mod.meanings.material[matCode] || matRaw) : "Not specified material";
    const leadPhrase = matWord + " pipe reducer";

    const typePhrase = typeCode
      ? ((mod.meanings.reducerType[typeCode] || typeCode.toLowerCase()) + " type")
      : "type not specified";

    let bigger = { end: end1, size: size1 };
    let smaller = { end: end2, size: size2 };
    const v1 = parseInchValue(size1);
    const v2 = parseInchValue(size2);
    if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
      bigger = { end: end2, size: size2 };
      smaller = { end: end1, size: size1 };
    }

    const hasThd = end1 === "THD" || end2 === "THD";
    const threadNote = hasThd ? (" " + (threadCode || "not specified") + " thread") : "";

    const describeSide = function (label, sideObj, attachThread) {
      const ew = sideObj.end ? (mod.meanings.endType[sideObj.end] || sideObj.end.toLowerCase()) : "";
      const sw = sideObj.size || "";
      let base = "";
      if (ew && sw) {
        base = label + " is " + ew + " with " + sw;
      } else if (ew) {
        base = label + " is " + ew + " with size not specified";
      } else if (sw) {
        base = label + " has end type not specified with " + sw;
      } else {
        base = label + " is not specified";
      }
      if (attachThread && sideObj.end === "THD") {
        base += threadNote;
      }
      return base;
    };

    const attachToSmaller = smaller.end === "THD";
    const biggerText = describeSide("the bigger side", bigger, !attachToSmaller);
    const smallerText = describeSide("the smaller side", smaller, attachToSmaller);
    const sidesClause = biggerText + " and " + smallerText;

    const schClause = schClean
      ? ("with the schedule " + schClean + " thickness")
      : "with the schedule not specified";

    return leadPhrase + ", " + typePhrase + ", " + sidesClause + ", " + schClause;
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

  /* Build crisp CONC (centerline) or ECC (flat-one-side) SVG showing W or THD per side */
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
    const parseInchValue = function (sizeStr) {
      if (!sizeStr) return NaN;
      const s = String(sizeStr).replace(/"/g, "").trim();
      const mixed = s.match(/^(\d+)[.\s]+(\d+)\/(\d+)$/);
      if (mixed) return Number(mixed[1]) + (Number(mixed[2]) / Number(mixed[3]));
      const frac = s.match(/^(\d+)\/(\d+)$/);
      if (frac) return Number(frac[1]) / Number(frac[2]);
      const num = parseFloat(s);
      return isNaN(num) ? NaN : num;
    };

    const material = normalizeMaterial(values.material, values.materialOther);
    const reducerType = upper(values.reducerType);
    const end1 = upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const thread = resolveChoiceUpper(values.thread, values.threadOther);
    const schedule = formatSchedule(values.schedule, values.scheduleOther);

    let bigSide = { end: end1, size: size1 };
    let smallSide = { end: end2, size: size2 };
    const v1 = parseInchValue(size1);
    const v2 = parseInchValue(size2);
    if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
      bigSide = { end: end2, size: size2 };
      smallSide = { end: end1, size: size1 };
    }

    const hasMat = Boolean(material);
    const matPalette = (material && mod.materialColors && mod.materialColors[material]) ? mod.materialColors[material] : null;
    const useShine = Boolean(matPalette && matPalette.shine);
    const fillColor = matPalette
      ? (useShine ? "url(#reducer-ss-grad)" : matPalette.fill)
      : (hasMat ? "#D5DCE3" : "#EEF2F6");
    const strokeColor = matPalette ? matPalette.stroke : (hasMat ? "#475569" : "#94A3B8");
    const detailColor = matPalette ? matPalette.detail : (hasMat ? "#64748B" : "#94A3B8");
    const dotColor = matPalette ? matPalette.dot : (hasMat ? "#D5DCE3" : "#EEF2F6");

    const defsSvg = useShine
      ? '<defs><linearGradient id="reducer-ss-grad" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#F8FAFC" />' +
          '<stop offset="35%" stop-color="#FFFFFF" />' +
          '<stop offset="70%" stop-color="#CBD5E1" />' +
          '<stop offset="100%" stop-color="#F1F5F9" />' +
        '</linearGradient></defs>'
      : "";

    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW PIPE REDUCER"];
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
    const isEcc = reducerType === "ECC";

    const yOff = topShift;
    const cyBig = 114 + yOff;
    const rBig = 36;
    const rSmall = 20;

    const xLeft = 82;
    const xTaperStart = 128;
    const xTaperEnd = 248;
    const xRight = 294;

    const leftTop = cyBig - rBig;
    const leftBot = cyBig + rBig;

    const cySmall = isEcc ? (leftBot - rSmall) : cyBig;
    const rightTop = cySmall - rSmall;
    const rightBot = cySmall + rSmall;

    const bodyPath =
      "M " + xLeft + " " + leftTop +
      " L " + xTaperStart + " " + leftTop +
      " L " + xTaperEnd + " " + rightTop +
      " L " + xRight + " " + rightTop +
      " L " + xRight + " " + rightBot +
      " L " + xTaperEnd + " " + rightBot +
      " L " + xTaperStart + " " + leftBot +
      " L " + xLeft + " " + leftBot + " Z";

    const buildSideDetails = function (endCode, xMouth, dirInward, yCenter, halfH) {
      if (endCode === "W") {
        const bx = xMouth + dirInward * 6;
        return (
          '<line x1="' + bx + '" y1="' + (yCenter - halfH + 1) + '" x2="' + bx + '" y2="' + (yCenter + halfH - 1) + '" stroke="' + detailColor + '" stroke-width="1.1" />' +
          '<line x1="' + xMouth + '" y1="' + (yCenter - halfH) + '" x2="' + bx + '" y2="' + (yCenter - halfH + 4) + '" stroke="' + strokeColor + '" stroke-width="1" />' +
          '<line x1="' + xMouth + '" y1="' + (yCenter + halfH) + '" x2="' + bx + '" y2="' + (yCenter + halfH - 4) + '" stroke="' + strokeColor + '" stroke-width="1" />'
        );
      }
      if (endCode === "THD") {
        const lines = [];
        for (let t = 5; t <= 25; t += 5) {
          const rx = xMouth + dirInward * t;
          lines.push(
            '<line x1="' + rx + '" y1="' + (yCenter - halfH) + '" x2="' + rx + '" y2="' + (yCenter + halfH) + '" stroke="' + strokeColor + '" stroke-width="1.2" />'
          );
        }
        return lines.join("");
      }
      const dx = xMouth + dirInward * 12;
      return '<line x1="' + dx + '" y1="' + (yCenter - halfH) + '" x2="' + dx + '" y2="' + (yCenter + halfH) + '" stroke="' + strokeColor + '" stroke-width="1" stroke-dasharray="3 3" />';
    };

    const leftDetails = buildSideDetails(bigSide.end, xLeft, 1, cyBig, rBig);
    const rightDetails = buildSideDetails(smallSide.end, xRight, -1, cySmall, rSmall);

    const centerLinesSvg = isEcc
      ? '<line x1="' + (xLeft - 8) + '" y1="' + cyBig + '" x2="' + (xTaperStart + 22) + '" y2="' + cyBig + '" stroke="' + detailColor + '" stroke-width="1" stroke-dasharray="5 3" />' +
        '<line x1="' + (xTaperEnd - 22) + '" y1="' + cySmall + '" x2="' + (xRight + 8) + '" y2="' + cySmall + '" stroke="' + detailColor + '" stroke-width="1" stroke-dasharray="5 3" />' +
        '<line x1="188" y1="' + cyBig + '" x2="188" y2="' + cySmall + '" stroke="' + reqColor + '" stroke-width="1" />' +
        '<text x="188" y="' + (leftBot + 16) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + optColor + '">Flat bottom (ECC)</text>'
      : '<line x1="' + (xLeft - 8) + '" y1="' + cyBig + '" x2="' + (xRight + 8) + '" y2="' + cyBig + '" stroke="' + detailColor + '" stroke-width="1" stroke-dasharray="5 3" />';

    const bigLabel = "Bigger: " + (bigSide.end || "?") + (bigSide.size ? (" " + bigSide.size) : "");
    const smallLabel = "Smaller: " + (smallSide.end || "?") + (smallSide.size ? (" " + smallSide.size) : "");

    const endLabelsSvg =
      '<text x="' + (xLeft + 24) + '" y="' + (leftTop - 12) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + ((bigSide.end || bigSide.size) ? optColor : missingColor) + '">' +
        esc(bigLabel) +
      '</text>' +
      '<text x="' + (xRight - 22) + '" y="' + (rightTop - 12) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + ((smallSide.end || smallSide.size) ? optColor : missingColor) + '">' +
        esc(smallLabel) +
      '</text>';

    const infoStartY = leftBot + 38;
    const matLabel = material ? ("Material: " + material) : "Material: ?";
    const matCol = material ? reqColor : missingColor;
    const hasThd = end1 === "THD" || end2 === "THD";

    const specs = ["Type: " + (reducerType || "?")];
    if (hasThd) specs.push("Thread: " + (thread || "?"));
    specs.push("Schedule: " + (schedule || "?"));
    const specLines = wrapLines(specs.join("  |  "), 46);

    const infoSvg =
      '<circle cx="132" cy="' + (infoStartY - 4) + '" r="5" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1" />' +
      '<text x="142" y="' + infoStartY + '" text-anchor="start" font-size="12" font-weight="700" fill="' + matCol + '">' + esc(matLabel) + '</text>' +
      specLines.map(function (line, i) {
        const y = infoStartY + 18 + i * 16;
        return '<text x="190" y="' + y + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + optColor + '">' + esc(line) + '</text>';
      }).join("");

    const totalHeight = infoStartY + 18 + specLines.length * 16 + 12;

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Pipe reducer technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          '<path d="' + bodyPath + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="round" />' +
          '<line x1="' + xTaperStart + '" y1="' + leftTop + '" x2="' + xTaperStart + '" y2="' + leftBot + '" stroke="' + detailColor + '" stroke-width="0.9" stroke-dasharray="3 3" />' +
          '<line x1="' + xTaperEnd + '" y1="' + rightTop + '" x2="' + xTaperEnd + '" y2="' + rightBot + '" stroke="' + detailColor + '" stroke-width="0.9" stroke-dasharray="3 3" />' +
          centerLinesSvg +
          leftDetails +
          rightDetails +
        '</g>' +
        endLabelsSvg +
        infoSvg +
      '</svg>'
    );
  },

  /* Draw the Pipe reducer screen */
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
        '<button type="button" class="back-btn" id="reducer-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="reducer-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="reducer-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="reducer-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="reducer-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="reducer-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="reducer-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="reducer-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="reducer-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="reducer-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="reducer-add-export-btn">Add to export list</button>' +
        '<p id="reducer-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="reducer-material">Material</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="reducer-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material", true) +
            '</select>' +
            '<input id="reducer-material-other" type="text" class="field-control" style="display: none;" placeholder="Type material code" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="reducer-type">Type</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="reducer-type" class="field-control">' +
              makeOptionsHtml(mod.lists.reducerType, "Select type", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="reducer-end1">Side 1 end</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="reducer-end1" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Select end type", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="reducer-size1">Side 1 size (inch)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="reducer-size1" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
            '</select>' +
            '<input id="reducer-size1-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 2.1/4" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="reducer-end2">Side 2 end</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="reducer-end2" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Select end type", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="reducer-size2">Side 2 size (inch)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="reducer-size2" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
            '</select>' +
            '<input id="reducer-size2-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 1.1/2" />' +
          '</div>' +

          '<div class="field-group" id="reducer-thread-group" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="reducer-thread">Thread</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="reducer-thread" class="field-control">' +
              makeOptionsHtml(mod.lists.threadType, "Select thread", true) +
            '</select>' +
            '<input id="reducer-thread-other" type="text" class="field-control" style="display: none;" placeholder="Type thread, e.g. BSP" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="reducer-schedule">Schedule</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="reducer-schedule" class="field-control">' +
              makeOptionsHtml(mod.lists.schedule, "Select schedule", true) +
            '</select>' +
            '<input id="reducer-schedule-other" type="text" class="field-control" style="display: none;" placeholder="Type schedule, e.g. SCH10S" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("reducer-back-btn");
    const nameBox = document.getElementById("reducer-name-box");
    const charCounter = document.getElementById("reducer-char-counter");
    const missingNote = document.getElementById("reducer-missing-note");
    const rebuildBtn = document.getElementById("reducer-rebuild-btn");
    const copyBtn = document.getElementById("reducer-copy-btn");
    const longBox = document.getElementById("reducer-long-box");
    const longRebuildBtn = document.getElementById("reducer-long-rebuild-btn");
    const longCopyBtn = document.getElementById("reducer-long-copy-btn");
    const drawingFrame = document.getElementById("reducer-drawing-frame");
    const addExportBtn = document.getElementById("reducer-add-export-btn");
    const exportFeedback = document.getElementById("reducer-export-feedback");
    const threadGroup = document.getElementById("reducer-thread-group");

    const inputs = {
      material: document.getElementById("reducer-material"),
      materialOther: document.getElementById("reducer-material-other"),
      reducerType: document.getElementById("reducer-type"),
      end1: document.getElementById("reducer-end1"),
      size1: document.getElementById("reducer-size1"),
      size1Other: document.getElementById("reducer-size1-other"),
      end2: document.getElementById("reducer-end2"),
      size2: document.getElementById("reducer-size2"),
      size2Other: document.getElementById("reducer-size2-other"),
      thread: document.getElementById("reducer-thread"),
      threadOther: document.getElementById("reducer-thread-other"),
      schedule: document.getElementById("reducer-schedule"),
      scheduleOther: document.getElementById("reducer-schedule-other")
    };

    function hasThreadedEnd() {
      return inputs.end1.value === "THD" || inputs.end2.value === "THD";
    }

    function syncConditionalControls() {
      inputs.materialOther.style.display = inputs.material.value === "__OTHER__" ? "" : "none";
      inputs.size1Other.style.display = inputs.size1.value === "__OTHER__" ? "" : "none";
      inputs.size2Other.style.display = inputs.size2.value === "__OTHER__" ? "" : "none";
      inputs.scheduleOther.style.display = inputs.schedule.value === "__OTHER__" ? "" : "none";

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

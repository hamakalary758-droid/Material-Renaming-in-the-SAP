/* ----- PIPE ELBOW MODULE ----- */
window.QS_MODULES.push({
  id: "elbow",
  name: "Pipe elbow",
  searchWords: ["ELBOW", "ELBOW 90", "PIPE ELBOW"],
  notAScrewWords: [
    "TORCH", "CUTTING TORCH", "HOSE", "HOSES", "HYDRAULIC", "HYD"
  ],
  tileBg: "#D8F5EA",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 12h4a5 5 0 0 1 5 5v3"></path>' +
      '<path d="M4 18h4a1 1 0 0 1 1 1v1"></path>' +
      '<path d="M4 12v6"></path>' +
      '<path d="M9 20h4"></path>' +
      '<path d="M4 10h2v8H4"></path>' +
      '<path d="M13 20v-2h2v2"></path>' +
    '</svg>',

  /* SAP export defaults for Pipe elbow */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Pipe elbow dropdown lists */
  lists: {
    material: ["MS", "CS", "SS", "GI", "PVC", "CI"],
    angle: ["90", "45"],
    endType: [
      { code: "W", label: "W (weldable)" },
      { code: "THD", label: "THD (threaded)" }
    ],
    inchSize: ["1/2", "3/4", "1", "1.1/4", "1.1/2", "2", "2.1/2", "3", "4", "5", "6", "8", "10", "12", "14", "16", "18", "20", "24"],
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
    const normalizeAngle = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      const numOnly = raw.replace(/°|DEGREE|DEGREES|DEG|D$/gi, "").trim();
      return numOnly;
    };
    const formatInchSize = function (choice, otherVal) {
      if (choice === "__OTHER__") {
        const typed = String(otherVal || "").trim();
        if (!typed) return "";
        const upperTyped = typed.toUpperCase();
        return /"$/.test(upperTyped) ? upperTyped : (upperTyped + '"');
      }
      const picked = clean(choice);
      if (!picked) return "";
      const core = picked.replace(/"/g, "").toUpperCase();
      return core ? (core + '"') : "";
    };
    const formatSchedule = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
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
    const angle = normalizeAngle(values.angle, values.angleOther);
    const end1 = upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const schedule = formatSchedule(values.schedule, values.scheduleOther);

    const hasAnyField = Boolean(
      material || angle || end1 || size1 || end2 || size2 || schedule
    );
    if (!hasAnyField) {
      return "";
    }

    const matPart = material || "?";
    const anglePart = angle || "?";
    const schPart = schedule || "?";

    let endSizePart = "?";
    const hasSide1 = Boolean(end1 || size1);
    const hasSide2 = Boolean(end2 || size2);

    if (!hasSide1 && !hasSide2) {
      endSizePart = "?";
    } else if (!hasSide2) {
      endSizePart = formatEndPart(end1, size1);
    } else if (!hasSide1) {
      endSizePart = formatEndPart(end2, size2);
    } else if (end1 === end2 && size1 === size2) {
      endSizePart = formatEndPart(end1, size1);
    } else {
      const part1 = formatEndPart(end1, size1);
      const part2 = formatEndPart(end2, size2);
      const v1 = parseInchValue(size1);
      const v2 = parseInchValue(size2);
      if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
        endSizePart = part2 + "X" + part1;
      } else {
        endSizePart = part1 + "X" + part2;
      }
    }

    return [matPart, "ELBOW", anglePart, endSizePart, schPart].join(" ");
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
    const normalizeAngle = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? clean(otherVal) : clean(choice);
      if (!raw) return "";
      return raw.replace(/°|degree|degrees|deg|d$/gi, "").trim();
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

    const matRaw = normalizeMaterial(values.material, values.materialOther);
    const matCode = upper(matRaw);
    const angle = normalizeAngle(values.angle, values.angleOther);
    const end1 = upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const schRaw = values.schedule === "__OTHER__" ? clean(values.scheduleOther) : clean(values.schedule);
    const schClean = schRaw ? schRaw.replace(/^SCH/i, "").trim() : "";

    const hasAnyField = Boolean(
      matRaw || angle || end1 || size1 || end2 || size2 || schClean
    );
    if (!hasAnyField) {
      return "";
    }

    const matWord = matCode ? (mod.meanings.material[matCode] || matRaw) : "";
    const lead = matWord ? (matWord + " pipe elbow") : "Pipe elbow";
    const leadWithAngle = angle ? (lead + " with " + angle + " degree") : lead;

    const endWords = function (endCode) {
      return endCode ? (mod.meanings.endType[endCode] || endCode.toLowerCase()) : "";
    };

    const describeBoth = function (endCode, sizeStr) {
      const ew = endWords(endCode);
      if (ew && sizeStr) return "both sides are " + ew + " with " + sizeStr;
      if (ew) return "both sides are " + ew;
      if (sizeStr) return "both sides with " + sizeStr;
      return "";
    };

    const describeOne = function (endCode, sizeStr) {
      const ew = endWords(endCode);
      if (ew && sizeStr) return "one side is " + ew + " with " + sizeStr;
      if (ew) return "one side is " + ew;
      if (sizeStr) return "one side with " + sizeStr;
      return "";
    };

    const hasSide1 = Boolean(end1 || size1);
    const hasSide2 = Boolean(end2 || size2);
    let endsClause = "";

    if (hasSide1 && !hasSide2) {
      endsClause = describeBoth(end1, size1);
    } else if (!hasSide1 && hasSide2) {
      endsClause = describeBoth(end2, size2);
    } else if (hasSide1 && hasSide2) {
      if (end1 === end2 && size1 === size2) {
        endsClause = describeBoth(end1, size1);
      } else {
        const v1 = parseInchValue(size1);
        const v2 = parseInchValue(size2);
        let first = { end: end1, size: size1 };
        let second = { end: end2, size: size2 };
        if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
          first = { end: end2, size: size2 };
          second = { end: end1, size: size1 };
        }
        endsClause = [describeOne(first.end, first.size), describeOne(second.end, second.size)]
          .filter(Boolean)
          .join(" and ");
      }
    }

    const schClause = schClean ? ("with the schedule " + schClean + " thickness") : "";
    const tail = [endsClause, schClause].filter(Boolean).join(" ");

    if (tail) {
      return leadWithAngle + ", " + tail;
    }
    return leadWithAngle;
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
    if (!resolveChoice(values.angle, values.angleOther)) missing.push("Angle");
    return missing;
  },

  /* Build crisp 90 or 45 elbow SVG showing W (plain end) or THD (thread lines) on each side */
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
    const normalizeAngle = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      return raw.replace(/°|DEGREE|DEGREES|DEG|D$/gi, "").trim();
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
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
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
    const angle = normalizeAngle(values.angle, values.angleOther);
    const end1Raw = upper(values.end1);
    const size1Raw = formatInchSize(values.size1, values.size1Other);
    const end2Raw = upper(values.end2);
    const size2Raw = formatInchSize(values.size2, values.size2Other);
    const schedule = formatSchedule(values.schedule, values.scheduleOther);

    /* Order sides identically to short text (if both sides set and side 2 > side 1, side 2 leads) */
    let leftEnd = end1Raw;
    let leftSize = size1Raw;
    let rightEnd = end2Raw;
    let rightSize = size2Raw;

    if ((end1Raw || size1Raw) && !(end2Raw || size2Raw)) {
      rightEnd = end1Raw;
      rightSize = size1Raw;
    } else if (!(end1Raw || size1Raw) && (end2Raw || size2Raw)) {
      leftEnd = end2Raw;
      leftSize = size2Raw;
    } else if ((end1Raw || size1Raw) && (end2Raw || size2Raw)) {
      const v1 = parseInchValue(size1Raw);
      const v2 = parseInchValue(size2Raw);
      if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
        leftEnd = end2Raw;
        leftSize = size2Raw;
        rightEnd = end1Raw;
        rightSize = size1Raw;
      }
    }

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
    const uid = "elbow-g" + mod._svgUid + "-" + Math.random().toString(36).slice(2, 6);

    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW PIPE ELBOW"];
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
    const is45 = angle === "45" || /^45(\.0+)?$/.test(angle);

    /* Draw either a crisp 90-degree or 45-degree swept elbow */
    const yOff = topShift;
    const cx = 160;
    const cy = 104 + yOff;
    const Ri = 42;
    const Ro = 84;
    const Rm = 63; /* Midline radius */
    const halfW = 21;

    /* Helper to draw weld bevel (W) or threaded collar + slanted ridges (THD) at any mouth center (mx, my)
       with unit inward axis (tx, ty) and unit perpendicular cross-pipe axis (nx, ny) */
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

    const bendStops =
      '<stop offset="50%" stop-color="' + cShade + '" />' +
      '<stop offset="64%" stop-color="' + cFill + '" />' +
      '<stop offset="74%" stop-color="' + cMidHi + '" />' +
      '<stop offset="86%" stop-color="' + cFill + '" />' +
      '<stop offset="100%" stop-color="' + cShade + '" />';

    let bodyPath = "";
    let leg1Grad = "";
    let leg2Grad = "";
    let leg1FillSvg = "";
    let bendFillSvg = "";
    let leg2FillSvg = "";
    let highlightPath = "";
    let centerPath = "";
    let end1Features = "";
    let end2Features = "";
    let angleGuideSvg = "";
    let end1LabelX = 114;
    let end1LabelY = cy + Ro + 22;
    let end2LabelX = 244;
    let end2LabelY = cy - 42;
    let bottomAnchorY = cy + Ro;
    let shadowCx = cx - 8;

    const hiR = Ri + 10;

    if (is45) {
      /* 45-degree bend: left horizontal mouth at x=114, sweeping 45° up-right */
      const stub1 = 46;
      const stub2 = 38;
      const c45 = Math.SQRT1_2;
      const xStart = cx - stub1;

      const outEndX = cx + Ro * c45;
      const outEndY = cy + Ro * c45;
      const inEndX = cx + Ri * c45;
      const inEndY = cy + Ri * c45;

      /* Outward direction at 45° mouth: (c45, -c45) */
      const m2OutX = outEndX + stub2 * c45;
      const m2OutY = outEndY - stub2 * c45;
      const m2InX = inEndX + stub2 * c45;
      const m2InY = inEndY - stub2 * c45;

      bodyPath =
        "M " + xStart + " " + (cy + Ro) +
        " L " + cx + " " + (cy + Ro) +
        " A " + Ro + " " + Ro + " 0 0 0 " + outEndX.toFixed(1) + " " + outEndY.toFixed(1) +
        " L " + m2OutX.toFixed(1) + " " + m2OutY.toFixed(1) +
        " L " + m2InX.toFixed(1) + " " + m2InY.toFixed(1) +
        " L " + inEndX.toFixed(1) + " " + inEndY.toFixed(1) +
        " A " + Ri + " " + Ri + " 0 0 1 " + cx + " " + (cy + Ri) +
        " L " + xStart + " " + (cy + Ri) + " Z";

      leg1Grad =
        '<linearGradient id="' + uid + '-l1" gradientUnits="userSpaceOnUse" x1="' + xStart + '" y1="' + (cy + Ri) + '" x2="' + xStart + '" y2="' + (cy + Ro) + '">' +
          cylStops +
        '</linearGradient>';
      leg2Grad =
        '<linearGradient id="' + uid + '-l2" gradientUnits="userSpaceOnUse" x1="' + inEndX.toFixed(1) + '" y1="' + inEndY.toFixed(1) + '" x2="' + outEndX.toFixed(1) + '" y2="' + outEndY.toFixed(1) + '">' +
          cylStops +
        '</linearGradient>';

      leg1FillSvg =
        '<rect x="' + (xStart - 2) + '" y="' + (cy + Ri - 2) + '" width="' + (cx - xStart + 2.6) + '" height="' + (Ro - Ri + 4) + '" fill="url(#' + uid + '-l1)" />';

      const bendPath =
        "M " + (cx - 0.5) + " " + (cy + Ro + 1) +
        " A " + Ro + " " + Ro + " 0 0 0 " + (outEndX + 0.5).toFixed(1) + " " + (outEndY + 0.5).toFixed(1) +
        " L " + (inEndX - 0.5).toFixed(1) + " " + (inEndY - 0.5).toFixed(1) +
        " A " + Ri + " " + Ri + " 0 0 1 " + (cx - 0.5) + " " + (cy + Ri - 1) + " Z";
      bendFillSvg = '<path d="' + bendPath + '" fill="url(#' + uid + '-bend)" />';

      const leg2Path =
        "M " + (outEndX - 0.4 * c45).toFixed(1) + " " + (outEndY + 0.4 * c45).toFixed(1) +
        " L " + (m2OutX + 2).toFixed(1) + " " + (m2OutY - 2).toFixed(1) +
        " L " + (m2InX - 2).toFixed(1) + " " + (m2InY - 2).toFixed(1) +
        " L " + (inEndX - 0.4 * c45).toFixed(1) + " " + (inEndY + 0.4 * c45).toFixed(1) + " Z";
      leg2FillSvg = '<path d="' + leg2Path + '" fill="url(#' + uid + '-l2)" />';

      const hiBendX = cx + hiR * c45;
      const hiBendY = cy + hiR * c45;
      highlightPath =
        "M " + xStart + " " + (cy + hiR) +
        " L " + cx + " " + (cy + hiR) +
        " A " + hiR + " " + hiR + " 0 0 0 " + hiBendX.toFixed(1) + " " + hiBendY.toFixed(1) +
        " L " + (hiBendX + stub2 * c45).toFixed(1) + " " + (hiBendY - stub2 * c45).toFixed(1);

      const midBendX = cx + Rm * c45;
      const midBendY = cy + Rm * c45;
      const m2MidX = (m2OutX + m2InX) / 2;
      const m2MidY = (m2OutY + m2InY) / 2;

      centerPath =
        "M " + (xStart - 6) + " " + (cy + Rm) +
        " L " + cx + " " + (cy + Rm) +
        " A " + Rm + " " + Rm + " 0 0 0 " + midBendX.toFixed(1) + " " + midBendY.toFixed(1) +
        " L " + (m2MidX + 5 * c45).toFixed(1) + " " + (m2MidY - 5 * c45).toFixed(1);

      end1Features = buildEndFeature(leftEnd, xStart, cy + Rm, 1, 0, 0, 1, uid + "-l1");
      end2Features = buildEndFeature(rightEnd, m2MidX, m2MidY, -c45, c45, c45, c45, uid + "-l2");

      /* Angle arc guide for 45° */
      angleGuideSvg =
        '<line x1="' + cx + '" y1="' + (cy + Rm) + '" x2="' + (cx + 72) + '" y2="' + (cy + Rm) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3 3" />' +
        '<path d="M ' + (cx + 42) + ' ' + (cy + Rm) + ' A 42 42 0 0 0 ' + (cx + 30) + ' ' + (cy + Rm - 30) + '" fill="none" stroke="' + reqColor + '" stroke-width="1.1" />' +
        '<text x="' + (cx + 50) + '" y="' + (cy + Rm - 10) + '" text-anchor="start" font-size="11.5" font-weight="700" fill="' + reqColor + '">45 deg</text>';

      end1LabelX = xStart + 24;
      end1LabelY = cy + Ro + 22;
      end2LabelX = m2MidX + 8;
      end2LabelY = m2InY - 14;
      bottomAnchorY = cy + Ro;
      shadowCx = cx + 8;
    } else {
      /* 90-degree bend: left horizontal mouth at x=116, vertical top mouth at y=cy-42 */
      const stub1 = 44;
      const stub2 = 38;
      const xStart = cx - stub1;
      const yTop = cy - stub2;

      bodyPath =
        "M " + xStart + " " + (cy + Ro) +
        " L " + cx + " " + (cy + Ro) +
        " A " + Ro + " " + Ro + " 0 0 0 " + (cx + Ro) + " " + cy +
        " L " + (cx + Ro) + " " + yTop +
        " L " + (cx + Ri) + " " + yTop +
        " L " + (cx + Ri) + " " + cy +
        " A " + Ri + " " + Ri + " 0 0 1 " + cx + " " + (cy + Ri) +
        " L " + xStart + " " + (cy + Ri) + " Z";

      leg1Grad =
        '<linearGradient id="' + uid + '-l1" gradientUnits="userSpaceOnUse" x1="' + xStart + '" y1="' + (cy + Ri) + '" x2="' + xStart + '" y2="' + (cy + Ro) + '">' +
          cylStops +
        '</linearGradient>';
      leg2Grad =
        '<linearGradient id="' + uid + '-l2" gradientUnits="userSpaceOnUse" x1="' + (cx + Ri) + '" y1="' + yTop + '" x2="' + (cx + Ro) + '" y2="' + yTop + '">' +
          cylStops +
        '</linearGradient>';

      leg1FillSvg =
        '<rect x="' + (xStart - 2) + '" y="' + (cy + Ri - 2) + '" width="' + (cx - xStart + 2.6) + '" height="' + (Ro - Ri + 4) + '" fill="url(#' + uid + '-l1)" />';

      const bendPath =
        "M " + (cx - 0.5) + " " + (cy + Ro + 1) +
        " A " + Ro + " " + Ro + " 0 0 0 " + (cx + Ro + 1) + " " + (cy - 0.5) +
        " L " + (cx + Ri - 1) + " " + (cy - 0.5) +
        " A " + Ri + " " + Ri + " 0 0 1 " + (cx - 0.5) + " " + (cy + Ri - 1) + " Z";
      bendFillSvg = '<path d="' + bendPath + '" fill="url(#' + uid + '-bend)" />';

      leg2FillSvg =
        '<rect x="' + (cx + Ri - 2) + '" y="' + (yTop - 2) + '" width="' + (Ro - Ri + 4) + '" height="' + (cy - yTop + 2.6) + '" fill="url(#' + uid + '-l2)" />';

      highlightPath =
        "M " + xStart + " " + (cy + hiR) +
        " L " + cx + " " + (cy + hiR) +
        " A " + hiR + " " + hiR + " 0 0 0 " + (cx + hiR) + " " + cy +
        " L " + (cx + hiR) + " " + yTop;

      centerPath =
        "M " + (xStart - 6) + " " + (cy + Rm) +
        " L " + cx + " " + (cy + Rm) +
        " A " + Rm + " " + Rm + " 0 0 0 " + (cx + Rm) + " " + cy +
        " L " + (cx + Rm) + " " + (yTop - 6);

      end1Features = buildEndFeature(leftEnd, xStart, cy + Rm, 1, 0, 0, 1, uid + "-l1");
      end2Features = buildEndFeature(rightEnd, cx + Rm, yTop, 0, 1, 1, 0, uid + "-l2");

      const angleLbl = angle ? (angle + " deg") : "Angle: ?";
      const angleCol = angle ? reqColor : missingColor;
      angleGuideSvg =
        '<path d="M ' + (cx + Rm - 24) + ' ' + (cy + Rm) + ' L ' + (cx + Rm) + ' ' + (cy + Rm) + ' L ' + (cx + Rm) + ' ' + (cy + Rm - 24) + '" fill="none" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3 3" />' +
        '<path d="M ' + (cx + Rm - 14) + ' ' + (cy + Rm) + ' L ' + (cx + Rm - 14) + ' ' + (cy + Rm - 14) + ' L ' + (cx + Rm) + ' ' + (cy + Rm - 14) + '" fill="none" stroke="' + angleCol + '" stroke-width="1" />' +
        '<text x="' + (cx + Rm + 10) + '" y="' + (cy + Rm + 4) + '" text-anchor="start" font-size="11.5" font-weight="700" fill="' + angleCol + '">' + esc(angleLbl) + '</text>';

      end1LabelX = xStart + 22;
      end1LabelY = cy + Ro + 22;
      end2LabelX = cx + Rm;
      end2LabelY = yTop - 12;
      bottomAnchorY = cy + Ro;
      shadowCx = cx - 4;
    }

    const defsSvg =
      '<defs>' +
        leg1Grad +
        leg2Grad +
        '<radialGradient id="' + uid + '-bend" gradientUnits="userSpaceOnUse" cx="' + cx + '" cy="' + cy + '" r="' + Ro + '">' +
          bendStops +
        '</radialGradient>' +
        '<clipPath id="' + uid + '-clip"><path d="' + bodyPath + '" /></clipPath>' +
      '</defs>';

    const side1Text = (leftEnd || "?") + (leftSize ? (" " + leftSize) : "");
    const side2Text = (rightEnd || "?") + (rightSize ? (" " + rightSize) : "");
    const side1Ok = Boolean(leftEnd || leftSize);
    const side2Ok = Boolean(rightEnd || rightSize);

    const endLabelsSvg =
      '<text x="' + end1LabelX.toFixed(0) + '" y="' + end1LabelY.toFixed(0) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (side1Ok ? optColor : missingColor) + '">' +
        esc("End 1: " + side1Text) +
      '</text>' +
      '<text x="' + end2LabelX.toFixed(0) + '" y="' + end2LabelY.toFixed(0) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (side2Ok ? optColor : missingColor) + '">' +
        esc("End 2: " + side2Text) +
      '</text>';

    const infoStartY = bottomAnchorY + 48;
    const matLabel = material ? ("Material: " + material) : "Material: ?";
    const matCol = material ? reqColor : missingColor;
    const schLabel = schedule ? ("Schedule: " + schedule) : "Schedule: ?";
    const schCol = schedule ? optColor : missingColor;
    const angleSummary = angle ? ("Angle: " + angle) : "Angle: ?";

    const infoSvg =
      '<circle cx="132" cy="' + (infoStartY - 4) + '" r="5" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1" />' +
      '<text x="142" y="' + infoStartY + '" text-anchor="start" font-size="12" font-weight="700" fill="' + matCol + '">' + esc(matLabel) + '</text>' +
      '<text x="190" y="' + (infoStartY + 18) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + schCol + '">' +
        esc(angleSummary + "  |  " + schLabel) +
      '</text>';

    const totalHeight = infoStartY + 34;

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Pipe elbow technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<ellipse cx="' + shadowCx + '" cy="' + (bottomAnchorY + 6) + '" rx="62" ry="4" fill="#0f172a" opacity="0.12" />' +
        '<g class="bolt-shape-animate">' +
          '<g clip-path="url(#' + uid + '-clip)">' +
            leg1FillSvg +
            bendFillSvg +
            leg2FillSvg +
            '<path d="' + highlightPath + '" fill="none" stroke="#FFFFFF" stroke-width="' + (useShine ? "3.6" : "2.4") + '" stroke-linecap="round" opacity="' + (useShine ? "0.72" : "0.46") + '" />' +
          '</g>' +
          '<path d="' + bodyPath + '" fill="none" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="round" />' +
          '<path d="' + centerPath + '" fill="none" stroke="' + detailColor + '" stroke-width="1" stroke-dasharray="5 3" />' +
          end1Features +
          end2Features +
        '</g>' +
        angleGuideSvg +
        endLabelsSvg +
        infoSvg +
      '</svg>'
    );
  },

  /* Draw the Pipe elbow screen */
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
        '<button type="button" class="back-btn" id="elbow-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="elbow-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="elbow-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="elbow-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="elbow-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="elbow-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="elbow-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="elbow-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="elbow-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="elbow-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="elbow-add-export-btn">Add to export list</button>' +
        '<p id="elbow-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="elbow-material">Material</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="elbow-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material", true) +
            '</select>' +
            '<input id="elbow-material-other" type="text" class="field-control" style="display: none;" placeholder="Type material code" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="elbow-angle">Angle</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="elbow-angle" class="field-control">' +
              makeOptionsHtml(mod.lists.angle, "Select angle", true) +
            '</select>' +
            '<input id="elbow-angle-other" type="text" class="field-control" style="display: none;" placeholder="Type angle number, e.g. 60" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="elbow-end1">Side 1 end</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="elbow-end1" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Select end type", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="elbow-size1">Side 1 size (inch)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="elbow-size1" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
            '</select>' +
            '<input id="elbow-size1-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 2.1/4" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="elbow-end2">Side 2 end (if different)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="elbow-end2" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Same as side 1", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="elbow-size2">Side 2 size (if different)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="elbow-size2" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Same as side 1", true) +
            '</select>' +
            '<input id="elbow-size2-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 1.1/2" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="elbow-schedule">Schedule</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="elbow-schedule" class="field-control">' +
              makeOptionsHtml(mod.lists.schedule, "Select schedule", true) +
            '</select>' +
            '<input id="elbow-schedule-other" type="text" class="field-control" style="display: none;" placeholder="Type schedule, e.g. SCH10S" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("elbow-back-btn");
    const nameBox = document.getElementById("elbow-name-box");
    const charCounter = document.getElementById("elbow-char-counter");
    const missingNote = document.getElementById("elbow-missing-note");
    const rebuildBtn = document.getElementById("elbow-rebuild-btn");
    const copyBtn = document.getElementById("elbow-copy-btn");
    const longBox = document.getElementById("elbow-long-box");
    const longRebuildBtn = document.getElementById("elbow-long-rebuild-btn");
    const longCopyBtn = document.getElementById("elbow-long-copy-btn");
    const drawingFrame = document.getElementById("elbow-drawing-frame");
    const addExportBtn = document.getElementById("elbow-add-export-btn");
    const exportFeedback = document.getElementById("elbow-export-feedback");

    const inputs = {
      material: document.getElementById("elbow-material"),
      materialOther: document.getElementById("elbow-material-other"),
      angle: document.getElementById("elbow-angle"),
      angleOther: document.getElementById("elbow-angle-other"),
      end1: document.getElementById("elbow-end1"),
      size1: document.getElementById("elbow-size1"),
      size1Other: document.getElementById("elbow-size1-other"),
      end2: document.getElementById("elbow-end2"),
      size2: document.getElementById("elbow-size2"),
      size2Other: document.getElementById("elbow-size2-other"),
      schedule: document.getElementById("elbow-schedule"),
      scheduleOther: document.getElementById("elbow-schedule-other")
    };

    function syncConditionalControls() {
      inputs.materialOther.style.display = inputs.material.value === "__OTHER__" ? "" : "none";
      inputs.angleOther.style.display = inputs.angle.value === "__OTHER__" ? "" : "none";
      inputs.size1Other.style.display = inputs.size1.value === "__OTHER__" ? "" : "none";
      inputs.size2Other.style.display = inputs.size2.value === "__OTHER__" ? "" : "none";
      inputs.scheduleOther.style.display = inputs.schedule.value === "__OTHER__" ? "" : "none";
    }

    function readFieldValues() {
      const out = {};
      Object.keys(inputs).forEach(function (k) {
        out[k] = inputs[k].value;
      });
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

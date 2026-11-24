/* ----- BOLT MODULE ----- */
window.QS_MODULES.push({
  id: "bolt",
  name: "Bolt",
  tileBg: "#D6F6E9",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M6 4h12l2 3.5-2 3.5H6L4 7.5 6 4z"></path>' +
      '<path d="M9 11v9l3 2 3-2v-9"></path>' +
      '<path d="M9 14.5h6"></path>' +
      '<path d="M9 17.5h6"></path>' +
    '</svg>',

  /* SAP export defaults for Bolt */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Bolt dropdown lists */
  lists: {
    material: ["MS", "SS", "GI", "HT", "COPPER"],
    type: ["HEX", "ALLEN", "ANCHOR", "STUD", "WEDGE ANCHOR"],
    diameter: ["M6", "M8", "M10", "M12", "M14", "M16", "M18", "M20", "M22", "M24", "M27", "M30"],
    thread: ["FULL THD", "HALF THD", "QTR THD"],
    grade: ["G8.8", "G10.9", "G12.9", "A2-70"],
    withNut: ["No", "Yes"]
  },

  /* Easy-to-edit material colors for the drawing */
  materialColors: {
    "MS": { fill: "#8D99A6", shade: "#6E7B88", stroke: "#334155", thread: "#475569", dot: "#7A8694", shine: false },
    "SS": { fill: "#E8EEF4", shade: "#CBD5E1", stroke: "#475569", thread: "#64748B", dot: "#DCE5EE", shine: true },
    "GI": { fill: "#F3D26A", shade: "#D9AC36", stroke: "#7C5E10", thread: "#9A7618", dot: "#EAB308", shine: false },
    "HT": { fill: "#454C56", shade: "#2D323B", stroke: "#111827", thread: "#1F2937", dot: "#2B3038", shine: false },
    "COPPER": { fill: "#E08A54", shade: "#C06533", stroke: "#6E3213", thread: "#8A421D", dot: "#D97742", shine: false }
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    material: {
      "MS": "mild steel",
      "SS": "stainless steel",
      "GI": "galvanized iron",
      "HT": "high tensile steel",
      "COPPER": "copper"
    },
    type: {
      "HEX": "hexagon head bolt",
      "ALLEN": "socket head bolt (Allen key)",
      "ANCHOR": "anchor bolt",
      "STUD": "stud bolt (threaded rod)",
      "WEDGE ANCHOR": "wedge anchor bolt"
    },
    thread: {
      "FULL THD": "fully threaded",
      "HALF THD": "half threaded",
      "QTR THD": "quarter threaded"
    },
    grade: {
      "G8.8": "strength grade 8.8",
      "G10.9": "strength grade 10.9",
      "G12.9": "strength grade 12.9",
      "A2-70": "stainless steel A2, strength class 70"
    }
  },

  /* Build SAP Short Text (max 40 chars) from current values */
  buildShortText: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ").toUpperCase();
    };

    const material = clean(values.material);
    const type = clean(values.type);
    const diameter = clean(values.diameter);
    const length = clean(values.length);
    const pitch = clean(values.pitch);
    const thread = clean(values.thread);
    const grade = clean(values.grade);
    const machine = clean(values.machine);
    const withNut = clean(values.withNut) === "YES" || values.withNut === true;

    const hasAnyField = Boolean(
      material || type || diameter || length || pitch || thread || grade || machine
    );
    if (!hasAnyField) {
      return "";
    }

    const size = (!diameter && !length)
      ? (pitch ? ("?X?X" + pitch) : "?")
      : [diameter || "?", length || "?", pitch].filter(Boolean).join("X");
    const typePart = type || "?";
    const withNutPart = withNut ? "WITH NUT" : "";
    const gradePart = grade || "?";
    const forMachine = machine
      ? (/^FOR(?:\s|$)/.test(machine) ? machine : ("FOR " + machine))
      : "";

    return [material, typePart, "BOLT", withNutPart, size, thread, gradePart, forMachine]
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

    const matCode = upper(values.material);
    const typeCode = upper(values.type);
    const diaCode = upper(values.diameter);
    const lenVal = clean(values.length);
    const pitchVal = clean(values.pitch);
    const threadCode = upper(values.thread);
    const gradeCode = upper(values.grade);
    const machineVal = clean(values.machine);
    const withNutOn = upper(values.withNut) === "YES" || values.withNut === true;

    const hasOtherFields = Boolean(
      matCode || typeCode || diaCode || lenVal || pitchVal || threadCode || gradeCode || machineVal
    );
    if (!hasOtherFields) {
      return "";
    }

    const matText = mod.meanings.material[matCode] || "";
    const typeText = mod.meanings.type[typeCode] || "";
    const leadPhrase = [matText, typeText].filter(Boolean).join(" ");

    const parts = [];
    if (leadPhrase) {
      parts.push(leadPhrase);
    }
    if (withNutOn) {
      parts.push("supplied with a nut");
    }

    if (diaCode) {
      if (diaCode.charAt(0) === "M") {
        parts.push("metric");
        parts.push("diameter " + diaCode.slice(1) + " mm");
      } else {
        parts.push("diameter " + diaCode + " mm");
      }
    }

    if (pitchVal) {
      parts.push("pitch " + pitchVal + " mm");
    }

    if (lenVal) {
      parts.push("length " + lenVal + " mm");
    }

    const threadText = mod.meanings.thread[threadCode] || "";
    if (threadText) {
      parts.push(threadText);
    }

    const gradeText = mod.meanings.grade[gradeCode] || "";
    if (gradeText) {
      parts.push(gradeText);
    }

    let sentence = "";
    if (parts.length > 0) {
      const joined = parts.join(", ");
      sentence = joined.charAt(0).toUpperCase() + joined.slice(1) + ".";
    }

    if (machineVal) {
      const machineClause = "For machine: " + machineVal + ".";
      sentence = sentence ? (sentence + " " + machineClause) : machineClause;
    }

    return sentence;
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const missing = [];
    if (!String(values.type || "").trim()) missing.push("Type");
    if (!String(values.diameter || "").trim()) missing.push("Diameter");
    if (!String(values.length || "").trim()) missing.push("Length");
    if (!String(values.grade || "").trim()) missing.push("Grade");
    return missing;
  },

  /* Build clean side-view + head-view SVG drawing with material colors & labels */
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
    const hexPoints = function (hx, hy, rad) {
      const pts = [];
      for (let k = 0; k < 6; k++) {
        const ang = (k * 60) * Math.PI / 180;
        pts.push((hx + rad * Math.cos(ang)).toFixed(2) + "," + (hy + rad * Math.sin(ang)).toFixed(2));
      }
      return pts.join(" ");
    };

    const material = upper(values.material);
    const type = upper(values.type);
    const diameter = upper(values.diameter);
    const length = clean(values.length);
    const pitch = clean(values.pitch);
    const thread = upper(values.thread);
    const grade = upper(values.grade);
    const machine = clean(values.machine);

    const hasType = Boolean(type);
    const matPalette = (material && mod.materialColors && mod.materialColors[material]) ? mod.materialColors[material] : null;
    const useShine = Boolean(matPalette && matPalette.shine);
    const fillColor = matPalette
      ? (useShine ? "url(#bolt-ss-grad)" : matPalette.fill)
      : (hasType ? "#D5DCE3" : "#EEF2F6");
    const shadeColor = matPalette ? matPalette.shade : (hasType ? "#BCC7D2" : "#E2E8F0");
    const strokeColor = matPalette ? matPalette.stroke : (hasType ? "#475569" : "#94A3B8");
    const threadColor = matPalette ? matPalette.thread : (hasType ? "#64748B" : "#CBD5E1");
    const dotColor = matPalette ? matPalette.dot : "#EEF2F6";

    const defsSvg = useShine
      ? '<defs><linearGradient id="bolt-ss-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#F8FAFC" />' +
          '<stop offset="35%" stop-color="#FFFFFF" />' +
          '<stop offset="68%" stop-color="#CBD5E1" />' +
          '<stop offset="100%" stop-color="#F1F5F9" />' +
        '</linearGradient></defs>'
      : "";

    /* Top short-name lines */
    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW BOLT"];
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

    /* Bolt geometry anchored around cx = 158 */
    const cx = 158;
    const halfW = 14;
    const xL = cx - halfW;
    const xR = cx + halfW;
    const yOffset = topShift;
    const yTip = 264 + yOffset;
    const yTipEnd = 270 + yOffset;

    let dimTopY = 64 + yOffset;
    let shapeSvg = "";
    let threadStartY = 178 + yOffset;
    let threadEndY = 262 + yOffset;

    const drawThreads = function (y1, y2) {
      const lines = [];
      for (let y = y1; y <= y2; y += 6) {
        lines.push(
          '<line x1="' + (xL + 1) + '" y1="' + y + '" x2="' + (xR - 1) + '" y2="' + (y + 3) + '" stroke="' + threadColor + '" stroke-width="1" />'
        );
      }
      return lines.join("");
    };

    const shineOverlay = function (y1, y2) {
      return useShine
        ? '<line x1="' + (cx - 6) + '" y1="' + y1 + '" x2="' + (cx - 6) + '" y2="' + y2 + '" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.85" />'
        : "";
    };

    if (type === "ALLEN") {
      dimTopY = 60 + yOffset;
      const yHeadTop = 60 + yOffset;
      const yHeadBot = 92 + yOffset;

      if (thread === "FULL THD") threadStartY = yHeadBot + 4;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      shapeSvg =
        '<rect x="136" y="' + yHeadTop + '" width="44" height="32" rx="3" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<line x1="140" y1="' + (yHeadTop + 4) + '" x2="140" y2="' + (yHeadBot - 4) + '" stroke="' + threadColor + '" stroke-width="1" />' +
        '<line x1="176" y1="' + (yHeadTop + 4) + '" x2="176" y2="' + (yHeadBot - 4) + '" stroke="' + threadColor + '" stroke-width="1" />' +
        '<path d="M150 ' + yHeadTop + ' v15 l8 4 l8 -4 v-15" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1" stroke-dasharray="3 2" stroke-linejoin="miter" />' +
        '<path d="M' + xL + ' ' + yHeadBot + ' H' + xR + ' V' + yTip + ' L' + (xR - 3) + ' ' + yTipEnd + ' H' + (xL + 3) + ' L' + xL + ' ' + yTip + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="miter" />' +
        shineOverlay(yHeadBot + 6, yTip - 8) +
        drawThreads(threadStartY, threadEndY);
    } else if (type === "ANCHOR") {
      dimTopY = 56 + yOffset;
      const yShankTop = 104 + yOffset;

      if (thread === "FULL THD") threadStartY = yShankTop + 4;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      const hookFill = matPalette ? (useShine ? "#E2E8F0" : matPalette.fill) : "#D5DCE3";
      shapeSvg =
        '<path d="M192 ' + (70 + yOffset) + ' H172 Q158 ' + (70 + yOffset) + ' 158 ' + (86 + yOffset) + ' V' + yTip + '" fill="none" stroke="' + strokeColor + '" stroke-width="28" stroke-linecap="butt" stroke-linejoin="miter" />' +
        '<path d="M192 ' + (70 + yOffset) + ' H172 Q158 ' + (70 + yOffset) + ' 158 ' + (86 + yOffset) + ' V' + yTip + '" fill="none" stroke="' + hookFill + '" stroke-width="26" stroke-linecap="butt" stroke-linejoin="miter" />' +
        '<line x1="192" y1="' + (56 + yOffset) + '" x2="192" y2="' + (84 + yOffset) + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<polygon points="' + xL + ',' + yTip + ' ' + xR + ',' + yTip + ' ' + (xR - 3) + ',' + yTipEnd + ' ' + (xL + 3) + ',' + yTipEnd + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="miter" />' +
        shineOverlay(yShankTop, yTip - 8) +
        drawThreads(threadStartY, threadEndY);
    } else if (type === "STUD") {
      dimTopY = 66 + yOffset;
      const yStudTop = 72 + yOffset;
      const yStudTopStart = 66 + yOffset;

      let studThreads = "";
      if (thread === "FULL THD") {
        studThreads = drawThreads(yStudTop + 2, threadEndY);
      } else if (thread === "QTR THD") {
        studThreads = drawThreads(yStudTop + 2, 112 + yOffset) + drawThreads(220 + yOffset, threadEndY);
      } else {
        studThreads = drawThreads(yStudTop + 2, 132 + yOffset) + drawThreads(200 + yOffset, threadEndY);
      }

      shapeSvg =
        '<path d="M' + (xL + 3) + ' ' + yStudTopStart + ' H' + (xR - 3) + ' L' + xR + ' ' + yStudTop + ' V' + yTip + ' L' + (xR - 3) + ' ' + yTipEnd + ' H' + (xL + 3) + ' L' + xL + ' ' + yTip + ' V' + yStudTop + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="miter" />' +
        shineOverlay(yStudTop + 8, yTip - 8) +
        studThreads;
    } else if (type === "WEDGE ANCHOR") {
      dimTopY = 66 + yOffset;
      const yTop = 72 + yOffset;
      const yNutTop = 94 + yOffset;
      const yNutBot = 116 + yOffset;
      const yWashTop = 116 + yOffset;
      const yClipTop = 224 + yOffset;
      const yClipBot = 256 + yOffset;

      let topThreadEnd = 148 + yOffset;
      if (thread === "FULL THD") topThreadEnd = 220 + yOffset;
      else if (thread === "QTR THD") topThreadEnd = 138 + yOffset;

      shapeSvg =
        '<path d="M' + (xL + 3) + ' ' + dimTopY + ' H' + (xR - 3) + ' L' + xR + ' ' + yTop + ' V' + yClipBot + ' L' + (xR + 3) + ' ' + yTipEnd + ' H' + (xL - 3) + ' L' + xL + ' ' + yClipBot + ' V' + yTop + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="miter" />' +
        shineOverlay(yTop + 8, yClipTop - 6) +
        drawThreads(yTop + 2, topThreadEnd) +
        '<rect x="132" y="' + yNutTop + '" width="52" height="22" rx="2" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<line x1="145" y1="' + yNutTop + '" x2="145" y2="' + yNutBot + '" stroke="' + strokeColor + '" stroke-width="1" />' +
        '<line x1="171" y1="' + yNutTop + '" x2="171" y2="' + yNutBot + '" stroke="' + strokeColor + '" stroke-width="1" />' +
        '<rect x="127" y="' + yWashTop + '" width="62" height="7" rx="1" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.1" />' +
        '<rect x="141" y="' + yClipTop + '" width="34" height="32" rx="2" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.1" />' +
        '<line x1="147" y1="' + (yClipTop + 4) + '" x2="147" y2="' + (yClipBot - 4) + '" stroke="' + strokeColor + '" stroke-width="1" />' +
        '<line x1="169" y1="' + (yClipTop + 4) + '" x2="169" y2="' + (yClipBot - 4) + '" stroke="' + strokeColor + '" stroke-width="1" />';
    } else {
      /* HEX or No Type chosen yet (light grey simple hex bolt) */
      dimTopY = 64 + yOffset;
      const yHeadTop = 64 + yOffset;
      const yHeadBot = 92 + yOffset;

      if (thread === "FULL THD") threadStartY = yHeadBot + 4;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      shapeSvg =
        '<rect x="132" y="' + yHeadTop + '" width="52" height="28" rx="2" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<line x1="146" y1="' + yHeadTop + '" x2="146" y2="' + yHeadBot + '" stroke="' + strokeColor + '" stroke-width="1" />' +
        '<line x1="170" y1="' + yHeadTop + '" x2="170" y2="' + yHeadBot + '" stroke="' + strokeColor + '" stroke-width="1" />' +
        '<path d="M' + xL + ' ' + yHeadBot + ' H' + xR + ' V' + yTip + ' L' + (xR - 3) + ' ' + yTipEnd + ' H' + (xL + 3) + ' L' + xL + ' ' + yTip + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="miter" />' +
        shineOverlay(yHeadBot + 6, yTip - 8) +
        drawThreads(threadStartY, threadEndY);
    }

    /* Head view (top view next to side view) */
    const hx = 290;
    const hy = 228 + yOffset;
    let headShapeSvg = "";
    if (!type || type === "HEX") {
      const hvFill = !type && !matPalette ? "#EEF2F6" : fillColor;
      const hvStroke = !type && !matPalette ? "#94A3B8" : strokeColor;
      const hvShade = !type && !matPalette ? "#CBD5E1" : shadeColor;
      headShapeSvg =
        '<polygon points="' + hexPoints(hx, hy, 25) + '" fill="' + hvFill + '" stroke="' + hvStroke + '" stroke-width="1.2" stroke-linejoin="miter" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="19" fill="none" stroke="' + hvShade + '" stroke-width="1" />';
    } else if (type === "ALLEN") {
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="23" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="19" fill="none" stroke="' + shadeColor + '" stroke-width="1" />' +
        '<polygon points="' + hexPoints(hx, hy, 10) + '" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.1" stroke-linejoin="miter" />';
    } else {
      /* STUD, ANCHOR, WEDGE ANCHOR: plain round circle (end of rod) */
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="18" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="14" fill="none" stroke="' + shadeColor + '" stroke-width="1" />';
    }
    if (useShine) {
      headShapeSvg += '<path d="M' + (hx - 12) + ' ' + (hy - 12) + ' A16 16 0 0 1 ' + (hx + 2) + ' ' + (hy - 16) + '" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.9" />';
    }
    const headViewSvg =
      '<g class="head-view-animate">' +
        '<text x="' + hx + '" y="' + (190 + yOffset) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">Head view</text>' +
        headShapeSvg +
      '</g>';

    /* Dimension & Pointer Labels */
    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";

    /* Left side: Diameter across shank */
    const yDia = 140 + yOffset;
    const diaLabel = diameter ? ("Diameter: " + diameter) : "Diameter: ?";
    const diaColor = diameter ? reqColor : missingColor;
    const diaSvg =
      '<line x1="114" y1="' + yDia + '" x2="' + xR + '" y2="' + yDia + '" stroke="' + diaColor + '" stroke-width="1" />' +
      '<polygon points="' + xL + ',' + yDia + ' ' + (xL - 5) + ',' + (yDia - 3) + ' ' + (xL - 5) + ',' + (yDia + 3) + '" fill="' + diaColor + '" />' +
      '<polygon points="' + xR + ',' + yDia + ' ' + (xR + 5) + ',' + (yDia - 3) + ' ' + (xR + 5) + ',' + (yDia + 3) + '" fill="' + diaColor + '" />' +
      '<text x="110" y="' + (yDia - 4) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + diaColor + '">' + esc(diaLabel) + '</text>';

    /* Left side: Length arrow along bolt */
    const xLenArrow = 122;
    const yLenMid = Math.round((dimTopY + yTipEnd) / 2);
    const lenLabel = length ? ("Length: " + length + " mm") : "Length: ?";
    const lenColor = length ? reqColor : missingColor;
    const lenSvg =
      '<line x1="' + xLenArrow + '" y1="' + dimTopY + '" x2="' + (xL - 4) + '" y2="' + dimTopY + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
      '<line x1="' + xLenArrow + '" y1="' + yTipEnd + '" x2="' + (xL - 4) + '" y2="' + yTipEnd + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
      '<line x1="' + xLenArrow + '" y1="' + (dimTopY + 3) + '" x2="' + xLenArrow + '" y2="' + (yTipEnd - 3) + '" stroke="' + lenColor + '" stroke-width="1" />' +
      '<polygon points="' + xLenArrow + ',' + dimTopY + ' ' + (xLenArrow - 3) + ',' + (dimTopY + 6) + ' ' + (xLenArrow + 3) + ',' + (dimTopY + 6) + '" fill="' + lenColor + '" />' +
      '<polygon points="' + xLenArrow + ',' + yTipEnd + ' ' + (xLenArrow - 3) + ',' + (yTipEnd - 6) + ' ' + (xLenArrow + 3) + ',' + (yTipEnd - 6) + '" fill="' + lenColor + '" />' +
      '<text x="110" y="' + (yLenMid + 4) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + lenColor + '">' + esc(lenLabel) + '</text>';

    /* Left side: Pitch (only if filled) */
    let pitchSvg = "";
    if (pitch) {
      const yPitch = 236 + yOffset;
      pitchSvg =
        '<line x1="114" y1="' + yPitch + '" x2="' + (xL - 1) + '" y2="' + yPitch + '" stroke="' + optColor + '" stroke-width="1" />' +
        '<circle cx="' + (xL - 1) + '" cy="' + yPitch + '" r="2" fill="' + optColor + '" />' +
        '<text x="110" y="' + (yPitch + 4) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + optColor + '">Pitch: ' + esc(pitch) + '</text>';
    }

    /* Right side upper pointers (above Head view, ordered top to bottom so lines never cross) */
    const rightPointer = function (yLabel, yTarget, xTarget, labelText, color) {
      const fontSize = labelText.length > 16 ? "11" : "12";
      return (
        '<polyline points="' + xTarget + ',' + yTarget + ' 200,' + yLabel + ' 208,' + yLabel + '" fill="none" stroke="' + color + '" stroke-width="1" />' +
        '<circle cx="' + xTarget + '" cy="' + yTarget + '" r="2" fill="' + color + '" />' +
        '<text x="212" y="' + (yLabel + 4) + '" text-anchor="start" font-size="' + fontSize + '" font-weight="700" fill="' + color + '">' + esc(labelText) + '</text>'
      );
    };

    const typeLabel = type ? ("Type: " + type) : "Type: ?";
    const typeTargetX = (type === "HEX" || type === "ALLEN" || !type) ? 184 : (type === "ANCHOR" ? 192 : 172);
    const typeSvg = rightPointer(68 + yOffset, 74 + yOffset, typeTargetX, typeLabel, type ? reqColor : missingColor);

    let materialSvg = "";
    if (material) {
      const yMat = 96 + yOffset;
      const matText = "Material: " + material;
      const matFs = matText.length > 15 ? "11" : "12";
      materialSvg =
        '<polyline points="' + xR + ',' + (104 + yOffset) + ' 200,' + yMat + ' 208,' + yMat + '" fill="none" stroke="' + optColor + '" stroke-width="1" />' +
        '<circle cx="' + xR + '" cy="' + (104 + yOffset) + '" r="2" fill="' + optColor + '" />' +
        '<circle cx="216" cy="' + yMat + '" r="5" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1" />' +
        '<text x="225" y="' + (yMat + 4) + '" text-anchor="start" font-size="' + matFs + '" font-weight="700" fill="' + optColor + '">' + esc(matText) + '</text>';
    }

    let gradeSvg = "";
    let threadSvg = "";
    if (type === "WEDGE ANCHOR") {
      if (thread) {
        threadSvg = rightPointer(124 + yOffset, 134 + yOffset, xR, "Thread: " + thread, optColor);
      }
      const gradeLabel = grade ? ("Grade: " + grade) : "Grade: ?";
      gradeSvg = rightPointer(152 + yOffset, 174 + yOffset, xR, gradeLabel, grade ? reqColor : missingColor);
    } else {
      const gradeLabel = grade ? ("Grade: " + grade) : "Grade: ?";
      gradeSvg = rightPointer(124 + yOffset, 132 + yOffset, xR, gradeLabel, grade ? reqColor : missingColor);
      if (thread) {
        const thTargetY = (type === "STUD") ? (158 + yOffset) : (188 + yOffset);
        threadSvg = rightPointer(152 + yOffset, thTargetY, xR, "Thread: " + thread, optColor);
      }
    }

    /* Bottom: For machine (only if filled, wraps cleanly below both views) */
    let machineSvg = "";
    let machineHeight = 0;
    if (machine) {
      const machineLines = wrapLines("For machine: " + machine, 40);
      machineHeight = machineLines.length * 16 + 10;
      machineSvg = machineLines.map(function (line, i) {
        const y = 300 + yOffset + i * 16;
        return (
          '<text x="190" y="' + y + '" text-anchor="middle" font-size="12" font-weight="700" fill="#0F3B33">' +
            esc(line) +
          '</text>'
        );
      }).join("");
    }

    const totalHeight = Math.max(296 + yOffset + machineHeight, 316 + yOffset);

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Bolt technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          shapeSvg +
        '</g>' +
        headViewSvg +
        diaSvg +
        lenSvg +
        pitchSvg +
        typeSvg +
        materialSvg +
        gradeSvg +
        threadSvg +
        machineSvg +
      '</svg>'
    );
  },

  /* Draw the Bolt screen */
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
        '<button type="button" class="back-btn" id="bolt-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="bolt-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="bolt-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="bolt-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="bolt-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="bolt-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="bolt-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="bolt-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="bolt-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="bolt-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="bolt-add-export-btn">Add to export list</button>' +
        '<p id="bolt-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-material">Material</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="bolt-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-type">Type</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="bolt-type" class="field-control">' +
              makeOptionsHtml(mod.lists.type, "Select type") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-diameter">Diameter</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="bolt-diameter" class="field-control">' +
              makeOptionsHtml(mod.lists.diameter, "Select diameter") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-length">Length in mm</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="bolt-length" type="number" inputmode="decimal" min="1" step="any" class="field-control" placeholder="e.g. 65" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-pitch">Pitch, the third number</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="bolt-pitch" type="text" inputmode="decimal" class="field-control" placeholder="e.g. 1.5" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-thread">Thread</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="bolt-thread" class="field-control">' +
              makeOptionsHtml(mod.lists.thread, "Select thread") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-grade">Grade</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="bolt-grade" class="field-control">' +
              makeOptionsHtml(mod.lists.grade, "Select grade") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-machine">For machine</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="bolt-machine" type="text" class="field-control" placeholder="e.g. ROLLING MILL" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="bolt-with-nut">With nut</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="bolt-with-nut" class="field-control">' +
              '<option value="No" selected>No</option>' +
              '<option value="Yes">Yes</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("bolt-back-btn");
    const nameBox = document.getElementById("bolt-name-box");
    const charCounter = document.getElementById("bolt-char-counter");
    const missingNote = document.getElementById("bolt-missing-note");
    const rebuildBtn = document.getElementById("bolt-rebuild-btn");
    const copyBtn = document.getElementById("bolt-copy-btn");
    const longBox = document.getElementById("bolt-long-box");
    const longRebuildBtn = document.getElementById("bolt-long-rebuild-btn");
    const longCopyBtn = document.getElementById("bolt-long-copy-btn");
    const drawingFrame = document.getElementById("bolt-drawing-frame");
    const addExportBtn = document.getElementById("bolt-add-export-btn");
    const exportFeedback = document.getElementById("bolt-export-feedback");

    const inputs = {
      material: document.getElementById("bolt-material"),
      type: document.getElementById("bolt-type"),
      diameter: document.getElementById("bolt-diameter"),
      length: document.getElementById("bolt-length"),
      pitch: document.getElementById("bolt-pitch"),
      thread: document.getElementById("bolt-thread"),
      grade: document.getElementById("bolt-grade"),
      machine: document.getElementById("bolt-machine"),
      withNut: document.getElementById("bolt-with-nut")
    };

    function readFieldValues() {
      return {
        material: inputs.material.value,
        type: inputs.type.value,
        diameter: inputs.diameter.value,
        length: inputs.length.value,
        pitch: inputs.pitch.value,
        thread: inputs.thread.value,
        grade: inputs.grade.value,
        machine: inputs.machine.value,
        withNut: inputs.withNut.value
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
          material: String(values.material || "").trim(),
          type: String(values.type || "").trim(),
          diameter: String(values.diameter || "").trim(),
          length: String(values.length || "").trim(),
          pitch: String(values.pitch || "").trim(),
          thread: String(values.thread || "").trim(),
          grade: String(values.grade || "").trim(),
          machine: String(values.machine || "").trim(),
          withNut: String(values.withNut || "No").trim() || "No"
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

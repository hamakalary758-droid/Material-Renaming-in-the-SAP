/* ----- SCREW MODULE ----- */
window.QS_MODULES.push({
  id: "screw",
  name: "Screw",
  searchWords: ["screw", "screws", "grub", "self tapping"],
  /* Easy-to-edit words that mean "not a screw" (sorted to Other in Existing materials) */
  notAScrewWords: ["PITCH GAUGE", "SCREWDRIVER", "SCREW DRIVER", "SCREW JACK"],
  tileBg: "#DCF7EC",
  tileColor: "#114639",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M5 7c0-2.2 3.1-4 7-4s7 1.8 7 4v1.5H5V7z"></path>' +
      '<path d="M12 3v3"></path>' +
      '<path d="M9.5 8.5v9.5L12 22l2.5-4V8.5"></path>' +
      '<path d="M9.5 12l5 1.5"></path>' +
      '<path d="M9.5 15.5l5 1.5"></path>' +
    '</svg>',

  /* SAP export defaults for Screw */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Screw dropdown lists */
  lists: {
    material: ["MS", "SS", "GI", "HT", "COPPER"],
    type: ["ALLEN", "GRUB", "CSK", "PAN", "PH", "SD", "ST", "SP", "SET", "LOCKING"],
    diameter: ["M3", "M4", "M5", "M6", "M8", "M10", "M12"],
    thread: ["FULL THD", "HALF THD", "QTR THD"],
    grade: ["G8.8", "G10.9", "G12.9", "A2-70"]
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
      "ALLEN": "socket head screw (Allen key)",
      "GRUB": "grub screw (no head)",
      "CSK": "countersunk head screw",
      "PAN": "pan head screw",
      "PH": "Phillips head screw",
      "SD": "self drilling screw",
      "ST": "self tapping screw",
      "SP": "[CHECK: meaning of SP]",
      "SET": "set screw",
      "LOCKING": "locking screw"
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
    const head = clean(values.head);
    const forText = clean(values.forText);

    const hasAnyField = Boolean(
      material || type || diameter || length || pitch || thread || grade || head || forText
    );
    if (!hasAnyField) {
      return "";
    }

    const size = [diameter, pitch, length].filter(Boolean).join("X");
    const forPart = forText ? ("FOR " + forText) : "";

    return [material, type, "SCREW", size, thread, grade, head, forPart]
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
    const headVal = clean(values.head);
    const forVal = clean(values.forText);

    const matText = mod.meanings.material[matCode] || "";
    const typeText = mod.meanings.type[typeCode] || "";
    const leadPhrase = [matText, typeText].filter(Boolean).join(" ");

    const parts = [];
    if (leadPhrase) {
      parts.push(leadPhrase);
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

    const sentences = [];
    if (parts.length > 0) {
      const joined = parts.join(", ");
      sentences.push(joined.charAt(0).toUpperCase() + joined.slice(1) + ".");
    }

    if (headVal) {
      sentences.push("Head: " + headVal + ".");
    }

    if (forVal) {
      sentences.push("For: " + forVal + ".");
    }

    return sentences.join(" ");
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const missing = [];
    if (!String(values.type || "").trim()) missing.push("Type");
    if (!String(values.diameter || "").trim()) missing.push("Diameter");
    if (!String(values.length || "").trim()) missing.push("Length");
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
        pts.push((hx + rad * Math.cos(ang)).toFixed(1) + "," + (hy + rad * Math.sin(ang)).toFixed(1));
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
    const head = clean(values.head);
    const forText = clean(values.forText);

    const hasType = Boolean(type);
    const matPalette = (material && mod.materialColors && mod.materialColors[material]) ? mod.materialColors[material] : null;
    const useShine = Boolean(matPalette && matPalette.shine);
    const fillColor = matPalette
      ? (useShine ? "url(#screw-ss-grad)" : matPalette.fill)
      : (hasType ? "#D5DCE3" : "#EEF2F6");
    const shadeColor = matPalette ? matPalette.shade : (hasType ? "#BCC7D2" : "#E2E8F0");
    const strokeColor = matPalette ? matPalette.stroke : (hasType ? "#475569" : "#94A3B8");
    const threadColor = matPalette ? matPalette.thread : (hasType ? "#64748B" : "#CBD5E1");
    const dotColor = matPalette ? matPalette.dot : "#EEF2F6";

    const defsSvg = useShine
      ? '<defs><linearGradient id="screw-ss-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#F8FAFC" />' +
          '<stop offset="35%" stop-color="#FFFFFF" />' +
          '<stop offset="68%" stop-color="#CBD5E1" />' +
          '<stop offset="100%" stop-color="#F1F5F9" />' +
        '</linearGradient></defs>'
      : "";

    /* Top short-name lines */
    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW SCREW"];
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

    /* Screw geometry anchored around cx = 158 */
    const cx = 158;
    const halfW = 13;
    const xL = cx - halfW;
    const xR = cx + halfW;
    const yOffset = topShift;
    const yTip = 262 + yOffset;
    const yTipEnd = 270 + yOffset;

    let dimTopY = 66 + yOffset;
    let dimBotY = yTipEnd;
    let shapeSvg = "";
    let threadStartY = 178 + yOffset;
    let threadEndY = 260 + yOffset;
    let typeTargetX = 186;
    let typeTargetY = 74 + yOffset;
    let headTargetX = 182;
    let headTargetY = 86 + yOffset;

    const drawThreads = function (y1, y2, sharp) {
      const lines = [];
      if (sharp) {
        for (let y = y1; y <= y2; y += 7) {
          lines.push(
            '<polyline points="' + (xL - 2) + ',' + y + ' ' + (xR + 2) + ',' + (y + 3) + '" fill="none" stroke="' + strokeColor + '" stroke-width="1.35" />' +
            '<polygon points="' + xL + ',' + (y - 1.5) + ' ' + (xL - 3) + ',' + (y + 0.5) + ' ' + xL + ',' + (y + 2.5) + '" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="0.9" />' +
            '<polygon points="' + xR + ',' + (y + 1.5) + ' ' + (xR + 3) + ',' + (y + 3.5) + ' ' + xR + ',' + (y + 5.5) + '" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="0.9" />'
          );
        }
      } else {
        for (let y = y1; y <= y2; y += 6) {
          lines.push(
            '<line x1="' + (xL + 1) + '" y1="' + y + '" x2="' + (xR - 1) + '" y2="' + (y + 3) + '" stroke="' + threadColor + '" stroke-width="1.35" />'
          );
        }
      }
      return lines.join("");
    };

    const shineOverlay = function (y1, y2) {
      return useShine
        ? '<line x1="' + (cx - 5) + '" y1="' + y1 + '" x2="' + (cx - 5) + '" y2="' + y2 + '" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" opacity="0.85" />'
        : "";
    };

    const drawFlatShank = function (yTop) {
      return (
        '<path d="M' + xL + ' ' + yTop + ' H' + xR + ' V' + yTip + ' L' + (xR - 3) + ' ' + yTipEnd + ' H' + (xL + 3) + ' L' + xL + ' ' + yTip + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        shineOverlay(yTop + 6, yTip - 8)
      );
    };

    const drawPointedShank = function (yTop, drillFlute) {
      const yConeStart = 244 + yOffset;
      const yPointTip = 274 + yOffset;
      dimBotY = yPointTip;
      let extra = "";
      if (drillFlute) {
        extra =
          '<line x1="' + (cx - 4) + '" y1="' + yConeStart + '" x2="' + (cx + 1) + '" y2="' + (yPointTip - 4) + '" stroke="' + strokeColor + '" stroke-width="1.4" />' +
          '<line x1="' + (cx + 5) + '" y1="' + (yConeStart + 3) + '" x2="' + cx + '" y2="' + (yPointTip - 4) + '" stroke="' + strokeColor + '" stroke-width="1.4" />';
      }
      return (
        '<path d="M' + xL + ' ' + yTop + ' H' + xR + ' V' + yConeStart + ' L' + cx + ' ' + yPointTip + ' L' + xL + ' ' + yConeStart + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        shineOverlay(yTop + 6, yConeStart - 6) +
        extra
      );
    };

    if (type === "ALLEN") {
      const yHeadTop = 60 + yOffset;
      const yHeadBot = 92 + yOffset;
      dimTopY = yHeadTop;
      typeTargetX = 180;
      typeTargetY = 74 + yOffset;
      headTargetX = 180;
      headTargetY = 86 + yOffset;

      if (thread === "FULL THD") threadStartY = yHeadBot + 4;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      shapeSvg =
        '<rect x="136" y="' + yHeadTop + '" width="44" height="32" rx="3" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<line x1="140" y1="' + (yHeadTop + 4) + '" x2="140" y2="' + (yHeadBot - 4) + '" stroke="' + threadColor + '" stroke-width="1.2" />' +
        '<line x1="176" y1="' + (yHeadTop + 4) + '" x2="176" y2="' + (yHeadBot - 4) + '" stroke="' + threadColor + '" stroke-width="1.2" />' +
        '<path d="M150 ' + yHeadTop + ' v15 l8 4 l8 -4 v-15" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.4" stroke-dasharray="3 2" />' +
        drawFlatShank(yHeadBot) +
        drawThreads(threadStartY, threadEndY, false);
    } else if (type === "GRUB") {
      const yTop = 68 + yOffset;
      dimTopY = 64 + yOffset;
      typeTargetX = xR;
      typeTargetY = 74 + yOffset;
      headTargetX = xR;
      headTargetY = 86 + yOffset;

      if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else if (thread === "HALF THD") threadStartY = 174 + yOffset;
      else threadStartY = yTop + 4;

      shapeSvg =
        '<path d="M' + (xL + 2) + ' ' + dimTopY + ' H' + (xR - 2) + ' L' + xR + ' ' + yTop + ' V' + yTip + ' L' + (xR - 3) + ' ' + yTipEnd + ' H' + (xL + 3) + ' L' + xL + ' ' + yTip + ' V' + yTop + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<path d="M152 ' + dimTopY + ' v12 l6 3.5 l6 -3.5 v-12" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.4" stroke-dasharray="3 2" />' +
        shineOverlay(yTop + 14, yTip - 8) +
        drawThreads(threadStartY, threadEndY, false);
    } else if (type === "CSK") {
      const yHeadTop = 64 + yOffset;
      const yHeadBot = 90 + yOffset;
      dimTopY = yHeadTop;
      typeTargetX = 187;
      typeTargetY = 70 + yOffset;
      headTargetX = 179;
      headTargetY = 82 + yOffset;

      if (thread === "FULL THD") threadStartY = yHeadBot + 4;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      shapeSvg =
        '<polygon points="126,' + yHeadTop + ' 190,' + yHeadTop + ' ' + xR + ',' + yHeadBot + ' ' + xL + ',' + yHeadBot + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<rect x="155" y="' + yHeadTop + '" width="6" height="9" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.3" />' +
        drawFlatShank(yHeadBot) +
        drawThreads(threadStartY, threadEndY, false);
    } else if (type === "PH") {
      const yHeadBot = 90 + yOffset;
      dimTopY = 64 + yOffset;
      typeTargetX = 185;
      typeTargetY = 74 + yOffset;
      headTargetX = 184;
      headTargetY = 86 + yOffset;

      if (thread === "FULL THD") threadStartY = yHeadBot + 4;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      shapeSvg =
        '<path d="M130 ' + yHeadBot + ' C130 ' + (60 + yOffset) + ', 186 ' + (60 + yOffset) + ', 186 ' + yHeadBot + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<path d="M158 ' + (66 + yOffset) + ' v12 M152 ' + (72 + yOffset) + ' h12" stroke="' + strokeColor + '" stroke-width="2" stroke-linecap="round" />' +
        drawFlatShank(yHeadBot) +
        drawThreads(threadStartY, threadEndY, false);
    } else if (type === "SD") {
      const yHeadTop = 62 + yOffset;
      const yHexBot = 84 + yOffset;
      const yWashBot = 91 + yOffset;
      dimTopY = yHeadTop;
      typeTargetX = 184;
      typeTargetY = 74 + yOffset;
      headTargetX = 190;
      headTargetY = 87 + yOffset;

      if (thread === "FULL THD") threadStartY = yWashBot + 4;
      else if (thread === "QTR THD") threadStartY = 208 + yOffset;
      else threadStartY = 166 + yOffset;

      shapeSvg =
        '<rect x="132" y="' + yHeadTop + '" width="52" height="22" rx="2.5" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<line x1="146" y1="' + yHeadTop + '" x2="146" y2="' + yHexBot + '" stroke="' + strokeColor + '" stroke-width="1.3" />' +
        '<line x1="170" y1="' + yHeadTop + '" x2="170" y2="' + yHexBot + '" stroke="' + strokeColor + '" stroke-width="1.3" />' +
        '<rect x="125" y="' + yHexBot + '" width="66" height="7" rx="2" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.6" />' +
        drawPointedShank(yWashBot, true) +
        drawThreads(threadStartY, 240 + yOffset, false);
    } else if (type === "ST") {
      const yHeadBot = 90 + yOffset;
      dimTopY = 66 + yOffset;
      typeTargetX = 185;
      typeTargetY = 76 + yOffset;
      headTargetX = 185;
      headTargetY = 86 + yOffset;

      if (thread === "FULL THD") threadStartY = yHeadBot + 6;
      else if (thread === "QTR THD") threadStartY = 212 + yOffset;
      else threadStartY = 172 + yOffset;

      shapeSvg =
        '<path d="M130 ' + yHeadBot + ' H186 V' + (78 + yOffset) + ' Q186 ' + (66 + yOffset) + ' 174 ' + (66 + yOffset) + ' H142 Q130 ' + (66 + yOffset) + ' 130 ' + (78 + yOffset) + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<rect x="155" y="' + (66 + yOffset) + '" width="6" height="8" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.3" />' +
        drawPointedShank(yHeadBot, false) +
        drawThreads(threadStartY, 242 + yOffset, true);
    } else if (type === "SP") {
      const yHeadTop = 68 + yOffset;
      const yHeadBot = 90 + yOffset;
      dimTopY = yHeadTop;
      typeTargetX = 182;
      typeTargetY = 76 + yOffset;
      headTargetX = 182;
      headTargetY = 86 + yOffset;

      if (thread === "FULL THD") threadStartY = yHeadBot + 4;
      else if (thread === "QTR THD") threadStartY = 212 + yOffset;
      else threadStartY = 172 + yOffset;

      shapeSvg =
        '<rect x="134" y="' + yHeadTop + '" width="48" height="22" rx="3" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<line x1="158" y1="' + yHeadTop + '" x2="158" y2="' + (yHeadTop + 8) + '" stroke="' + strokeColor + '" stroke-width="2" />' +
        drawPointedShank(yHeadBot, false) +
        drawThreads(threadStartY, 242 + yOffset, false);
    } else if (type === "SET") {
      const yTop = 68 + yOffset;
      dimTopY = 64 + yOffset;
      typeTargetX = xR;
      typeTargetY = 74 + yOffset;
      headTargetX = xR;
      headTargetY = 86 + yOffset;

      if (thread === "FULL THD") threadStartY = yTop + 6;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      shapeSvg =
        '<path d="M' + (xL + 2) + ' ' + dimTopY + ' H' + (xR - 2) + ' L' + xR + ' ' + yTop + ' V' + yTip + ' L' + (xR - 3) + ' ' + yTipEnd + ' H' + (xL + 3) + ' L' + xL + ' ' + yTip + ' V' + yTop + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<rect x="155" y="' + dimTopY + '" width="6" height="10" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.3" />' +
        shineOverlay(yTop + 12, yTip - 8) +
        drawThreads(threadStartY, threadEndY, false);
    } else if (type === "LOCKING") {
      const yHeadTop = 62 + yOffset;
      const yHexBot = 86 + yOffset;
      const yRingBot = 94 + yOffset;
      dimTopY = yHeadTop;
      typeTargetX = 184;
      typeTargetY = 74 + yOffset;
      headTargetX = 188;
      headTargetY = 90 + yOffset;

      if (thread === "FULL THD") threadStartY = yRingBot + 4;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      shapeSvg =
        '<rect x="132" y="' + yHeadTop + '" width="52" height="24" rx="2.5" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<line x1="146" y1="' + yHeadTop + '" x2="146" y2="' + yHexBot + '" stroke="' + strokeColor + '" stroke-width="1.3" />' +
        '<line x1="170" y1="' + yHeadTop + '" x2="170" y2="' + yHexBot + '" stroke="' + strokeColor + '" stroke-width="1.3" />' +
        '<rect x="128" y="' + yHexBot + '" width="60" height="8" rx="2" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.6" />' +
        '<line x1="138" y1="' + yHexBot + '" x2="138" y2="' + yRingBot + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<line x1="178" y1="' + yHexBot + '" x2="178" y2="' + yRingBot + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<line x1="158" y1="' + yHexBot + '" x2="158" y2="' + yRingBot + '" stroke="' + strokeColor + '" stroke-width="1.5" />' +
        drawFlatShank(yRingBot) +
        drawThreads(threadStartY, threadEndY, false);
    } else {
      /* PAN or No Type chosen yet */
      const yHeadBot = 90 + yOffset;
      dimTopY = 66 + yOffset;
      typeTargetX = 185;
      typeTargetY = 76 + yOffset;
      headTargetX = 185;
      headTargetY = 86 + yOffset;

      if (thread === "FULL THD") threadStartY = yHeadBot + 4;
      else if (thread === "QTR THD") threadStartY = 220 + yOffset;
      else threadStartY = 178 + yOffset;

      shapeSvg =
        '<path d="M130 ' + yHeadBot + ' H186 V' + (78 + yOffset) + ' Q186 ' + (66 + yOffset) + ' 174 ' + (66 + yOffset) + ' H142 Q130 ' + (66 + yOffset) + ' 130 ' + (78 + yOffset) + ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<rect x="155" y="' + (66 + yOffset) + '" width="6" height="8" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.3" />' +
        drawFlatShank(yHeadBot) +
        drawThreads(threadStartY, threadEndY, false);
    }

    /* Head view (top view next to side view) */
    const hx = 290;
    const hy = 232 + yOffset;
    let headShapeSvg = "";
    if (!type) {
      const hvFill = matPalette ? fillColor : "#EEF2F6";
      const hvStroke = matPalette ? strokeColor : "#94A3B8";
      headShapeSvg = '<polygon points="' + hexPoints(hx, hy, 25) + '" fill="' + hvFill + '" stroke="' + hvStroke + '" stroke-width="1.8" stroke-linejoin="round" />';
    } else if (type === "LOCKING" || type === "SD") {
      headShapeSvg =
        '<polygon points="' + hexPoints(hx, hy, 25) + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="19" fill="none" stroke="' + shadeColor + '" stroke-width="1.2" />';
    } else if (type === "ALLEN") {
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="23" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="19" fill="none" stroke="' + shadeColor + '" stroke-width="1.1" />' +
        '<polygon points="' + hexPoints(hx, hy, 10.5) + '" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.5" stroke-linejoin="round" />';
    } else if (type === "PH") {
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="23" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="19" fill="none" stroke="' + shadeColor + '" stroke-width="1.1" />' +
        '<path d="M' + (hx - 3) + ' ' + (hy - 13) + ' h6 v10 h10 v6 h-10 v10 h-6 v-10 h-10 v-6 h10 Z" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.3" stroke-linejoin="round" />';
    } else if (type === "GRUB") {
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="20" fill="none" stroke="' + threadColor + '" stroke-width="1.1" stroke-dasharray="3 2" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="17" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<polygon points="' + hexPoints(hx, hy, 9.5) + '" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.4" stroke-linejoin="round" />';
    } else if (type === "SET") {
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="20" fill="none" stroke="' + threadColor + '" stroke-width="1.1" stroke-dasharray="3 2" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="17" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<rect x="' + (hx - 15) + '" y="' + (hy - 2.6) + '" width="30" height="5.2" rx="1" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.3" />';
    } else {
      /* CSK, PAN, ST, SP: round head with a slot */
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="23" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="19" fill="none" stroke="' + shadeColor + '" stroke-width="1.1" />' +
        '<rect x="' + (hx - 19) + '" y="' + (hy - 2.8) + '" width="38" height="5.6" rx="1" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.3" />';
    }
    if (useShine && type) {
      headShapeSvg += '<path d="M' + (hx - 12) + ' ' + (hy - 12) + ' A16 16 0 0 1 ' + (hx + 2) + ' ' + (hy - 16) + '" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9" />';
    }
    const headViewSvg =
      '<g class="head-view-animate">' +
        '<text x="' + hx + '" y="' + (192 + yOffset) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#476B62">Head view</text>' +
        headShapeSvg +
      '</g>';

    /* Dimension & Pointer Labels */
    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";

    /* Left side: Diameter across shank */
    const yDia = 136 + yOffset;
    const diaLabel = diameter ? ("Diameter: " + diameter) : "Diameter: ?";
    const diaColor = diameter ? reqColor : missingColor;
    const diaSvg =
      '<line x1="112" y1="' + yDia + '" x2="' + xR + '" y2="' + yDia + '" stroke="' + diaColor + '" stroke-width="1.3" />' +
      '<polygon points="' + xL + ',' + yDia + ' ' + (xL - 5) + ',' + (yDia - 3) + ' ' + (xL - 5) + ',' + (yDia + 3) + '" fill="' + diaColor + '" />' +
      '<polygon points="' + xR + ',' + yDia + ' ' + (xR + 5) + ',' + (yDia - 3) + ' ' + (xR + 5) + ',' + (yDia + 3) + '" fill="' + diaColor + '" />' +
      '<text x="108" y="' + (yDia - 4) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + diaColor + '">' + esc(diaLabel) + '</text>';

    /* Left side: Length arrow along screw */
    const xLenArrow = 122;
    const yLenLabel = 186 + yOffset;
    const lenLabel = length ? ("Length: " + length + " mm") : "Length: ?";
    const lenColor = length ? reqColor : missingColor;
    const lenSvg =
      '<line x1="' + xLenArrow + '" y1="' + dimTopY + '" x2="' + (xL - 4) + '" y2="' + dimTopY + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
      '<line x1="' + xLenArrow + '" y1="' + dimBotY + '" x2="' + (xL - 4) + '" y2="' + dimBotY + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
      '<line x1="' + xLenArrow + '" y1="' + (dimTopY + 3) + '" x2="' + xLenArrow + '" y2="' + (dimBotY - 3) + '" stroke="' + lenColor + '" stroke-width="1.4" />' +
      '<polygon points="' + xLenArrow + ',' + dimTopY + ' ' + (xLenArrow - 3.5) + ',' + (dimTopY + 6) + ' ' + (xLenArrow + 3.5) + ',' + (dimTopY + 6) + '" fill="' + lenColor + '" />' +
      '<polygon points="' + xLenArrow + ',' + dimBotY + ' ' + (xLenArrow - 3.5) + ',' + (dimBotY - 6) + ' ' + (xLenArrow + 3.5) + ',' + (dimBotY - 6) + '" fill="' + lenColor + '" />' +
      '<text x="108" y="' + yLenLabel + '" text-anchor="end" font-size="12" font-weight="700" fill="' + lenColor + '">' + esc(lenLabel) + '</text>';

    /* Left side: Pitch (only if filled) */
    let pitchSvg = "";
    if (pitch) {
      const yPitch = 236 + yOffset;
      pitchSvg =
        '<line x1="112" y1="' + yPitch + '" x2="' + (xL - 1) + '" y2="' + yPitch + '" stroke="' + optColor + '" stroke-width="1.2" />' +
        '<circle cx="' + (xL - 1) + '" cy="' + yPitch + '" r="2.2" fill="' + optColor + '" />' +
        '<text x="108" y="' + (yPitch + 4) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + optColor + '">Pitch: ' + esc(pitch) + '</text>';
    }

    /* Right side upper pointer labels (ordered top to bottom above Head view so lines never cross) */
    const rightPointer = function (yLabel, yTarget, xTarget, labelText, color) {
      const fontSize = labelText.length > 15 ? "11.5" : "12";
      return (
        '<polyline points="' + xTarget + ',' + yTarget + ' 200,' + yLabel + ' 208,' + yLabel + '" fill="none" stroke="' + color + '" stroke-width="1.2" />' +
        '<circle cx="' + xTarget + '" cy="' + yTarget + '" r="2.2" fill="' + color + '" />' +
        '<text x="212" y="' + (yLabel + 4) + '" text-anchor="start" font-size="' + fontSize + '" font-weight="700" fill="' + color + '">' + esc(labelText) + '</text>'
      );
    };

    const typeLabel = type ? ("Type: " + type) : "Type: ?";
    const typeSvg = rightPointer(64 + yOffset, typeTargetY, typeTargetX, typeLabel, type ? reqColor : missingColor);

    let headSvg = "";
    if (head) {
      headSvg = rightPointer(88 + yOffset, headTargetY, headTargetX, "Head: " + head, optColor);
    }

    let materialSvg = "";
    if (material) {
      const yMat = 112 + yOffset;
      const matText = "Material: " + material;
      const matFs = matText.length > 15 ? "11.5" : "12";
      materialSvg =
        '<polyline points="' + xR + ',' + (114 + yOffset) + ' 200,' + yMat + ' 208,' + yMat + '" fill="none" stroke="' + optColor + '" stroke-width="1.2" />' +
        '<circle cx="' + xR + '" cy="' + (114 + yOffset) + '" r="2.2" fill="' + optColor + '" />' +
        '<circle cx="216" cy="' + yMat + '" r="4.8" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1.1" />' +
        '<text x="225" y="' + (yMat + 4) + '" text-anchor="start" font-size="' + matFs + '" font-weight="700" fill="' + optColor + '">' + esc(matText) + '</text>';
    }

    let gradeSvg = "";
    if (grade) {
      gradeSvg = rightPointer(136 + yOffset, 140 + yOffset, xR, "Grade: " + grade, optColor);
    }

    let threadSvg = "";
    if (thread) {
      threadSvg = rightPointer(160 + yOffset, 186 + yOffset, xR, "Thread: " + thread, optColor);
    }

    /* Bottom: For (only if filled, wraps cleanly below both views) */
    let forSvg = "";
    let forHeight = 0;
    if (forText) {
      const forLines = wrapLines("For: " + forText, 40);
      forHeight = forLines.length * 16 + 10;
      forSvg = forLines.map(function (line, i) {
        const y = 300 + yOffset + i * 16;
        return (
          '<text x="190" y="' + y + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F3B33">' +
            esc(line) +
          '</text>'
        );
      }).join("");
    }

    const totalHeight = Math.max(296 + yOffset + forHeight, 316 + yOffset);

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" role="img" aria-label="Screw technical drawing">' +
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
        headSvg +
        materialSvg +
        gradeSvg +
        threadSvg +
        forSvg +
      '</svg>'
    );
  },

  /* Draw the Screw screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    function escAttr(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function makeOptionsHtml(items, placeholderText) {
      const opts = ['<option value="">' + escAttr(placeholderText) + '</option>'];
      items.forEach(function (item) {
        opts.push('<option value="' + escAttr(item) + '">' + escAttr(item) + '</option>');
      });
      return opts.join("");
    }

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="screw-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="screw-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="screw-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="screw-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="screw-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="screw-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="screw-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="screw-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="screw-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="screw-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="screw-add-export-btn">Add to export list</button>' +
        '<p id="screw-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-material">Material</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="screw-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-type">Type</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="screw-type" class="field-control">' +
              makeOptionsHtml(mod.lists.type, "Select type") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-diameter">Diameter</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="screw-diameter" class="field-control">' +
              makeOptionsHtml(mod.lists.diameter, "Select diameter") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-length">Length in mm</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="screw-length" type="number" inputmode="decimal" min="1" step="any" class="field-control" placeholder="e.g. 30" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-pitch">Pitch</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="screw-pitch" type="text" inputmode="decimal" class="field-control" placeholder="e.g. 1.25" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-thread">Thread</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="screw-thread" class="field-control">' +
              makeOptionsHtml(mod.lists.thread, "Select thread") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-grade">Grade</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="screw-grade" class="field-control">' +
              makeOptionsHtml(mod.lists.grade, "Select grade") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-head">Head</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="screw-head" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 5" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-for">For</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="screw-for" type="text" class="field-control" placeholder="e.g. GUIDEBOX" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("screw-back-btn");
    const nameBox = document.getElementById("screw-name-box");
    const charCounter = document.getElementById("screw-char-counter");
    const missingNote = document.getElementById("screw-missing-note");
    const rebuildBtn = document.getElementById("screw-rebuild-btn");
    const copyBtn = document.getElementById("screw-copy-btn");
    const longBox = document.getElementById("screw-long-box");
    const longRebuildBtn = document.getElementById("screw-long-rebuild-btn");
    const longCopyBtn = document.getElementById("screw-long-copy-btn");
    const drawingFrame = document.getElementById("screw-drawing-frame");
    const addExportBtn = document.getElementById("screw-add-export-btn");
    const exportFeedback = document.getElementById("screw-export-feedback");

    const inputs = {
      material: document.getElementById("screw-material"),
      type: document.getElementById("screw-type"),
      diameter: document.getElementById("screw-diameter"),
      length: document.getElementById("screw-length"),
      pitch: document.getElementById("screw-pitch"),
      thread: document.getElementById("screw-thread"),
      grade: document.getElementById("screw-grade"),
      head: document.getElementById("screw-head"),
      forText: document.getElementById("screw-for")
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
        head: inputs.head.value,
        forText: inputs.forText.value
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
          head: String(values.head || "").trim(),
          forText: String(values.forText || "").trim()
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

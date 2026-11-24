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
    "MS": { c1: "#E3E8ED", c2: "#A9B4BF", c3: "#5E6B78", cs: "#3B4856" },
    "GI": { c1: "#F6E7A6", c2: "#D8B94E", c3: "#8C7420", cs: "#6B5A18" },
    "SS": { c1: "#FFFFFF", c2: "#D5DCE4", c3: "#7D8896", cs: "#5A6572" },
    "HT": { c1: "#7B8794", c2: "#3B4551", c3: "#11161C", cs: "#0B0F13" },
    "COPPER": { c1: "#F2B58A", c2: "#E08A54", c3: "#A8501F", cs: "#6E3213" }
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

  /* Build clean side-view + head-view SVG drawing with 3D shading & size scaling */
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

    /* Palette (c1 light, c2 mid, c3 dark, cs outline) */
    const defaultPal = { c1: "#F1F5F9", c2: "#D5DCE3", c3: "#94A3B8", cs: "#64748B" };
    const pal = (material && mod.materialColors && mod.materialColors[material])
      ? mod.materialColors[material]
      : defaultPal;
    const c1 = pal.c1;
    const c2 = pal.c2;
    const c3 = pal.c3;
    const cs = pal.cs;

    /* Unique gradient ID prefix per drawing */
    mod._svgUid = (mod._svgUid || 0) + 1;
    const uid = "bolt-g" + mod._svgUid + "-" + Math.random().toString(36).slice(2, 6);
    const gShank = uid + "-shank";
    const gHeadL = uid + "-hl";
    const gHeadC = uid + "-hc";
    const gHeadR = uid + "-hr";
    const gHeadV = uid + "-hv";
    const gSock = uid + "-sock";
    const gWash = uid + "-wash";

    const defsSvg =
      "<defs>" +
        '<linearGradient id="' + gShank + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c3 + '" />' +
          '<stop offset="25%" stop-color="' + c1 + '" />' +
          '<stop offset="50%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gHeadL + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c2 + '" />' +
          '<stop offset="55%" stop-color="' + c1 + '" />' +
          '<stop offset="100%" stop-color="' + c2 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gHeadC + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c1 + '" />' +
          '<stop offset="55%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gHeadR + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gHeadV + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="' + c1 + '" />' +
          '<stop offset="55%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gSock + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="' + c3 + '" />' +
          '<stop offset="100%" stop-color="' + cs + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gWash + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c3 + '" />' +
          '<stop offset="30%" stop-color="' + c1 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
      "</defs>";

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
        "</text>"
      );
    }).join("");

    /* Size scaling calculations */
    const dMatch = diameter.match(/^M(\d+(?:\.\d+)?)$/);
    const dParsed = dMatch ? parseFloat(dMatch[1]) : NaN;
    const dNum = (!isNaN(dParsed) && dParsed > 0) ? dParsed : 16;

    const lenParsed = parseFloat(length);
    const lenNum = (length && !isNaN(lenParsed) && lenParsed > 0) ? lenParsed : 65;

    const k = 0.65 * dNum;
    const W = 1.73 * dNum;
    const sc = Math.min(6, 200 / (k + lenNum), 110 / W);

    const shankW = dNum * sc;
    const halfW = shankW / 2;
    const shankLen = lenNum * sc;
    const headH = k * sc;
    const headW = W * sc;

    const PITCH_TABLE = {
      4: 0.7, 5: 0.8, 6: 1, 7: 1, 8: 1.25, 10: 1.5, 12: 1.75, 14: 2,
      16: 2, 18: 2.5, 20: 2.5, 22: 2.5, 24: 3, 27: 3, 30: 3.5, 36: 4, 42: 4.5
    };
    const stdPitch = PITCH_TABLE[Math.round(dNum)] || Math.max(0.7, dNum * 0.125);
    const threadStep = Math.max(stdPitch * sc, 4);

    /* Geometry anchored around cx = 166 */
    const cx = 166;
    const xL = cx - halfW;
    const xR = cx + halfW;
    const yOffset = topShift;
    const chamfer = Math.max(1.8, Math.min(5, shankW * 0.14));

    let dimTopY = 58 + yOffset;
    let yShankTop = dimTopY + headH;
    let yTipEnd = yShankTop + shankLen;
    let yTip = yTipEnd - chamfer;
    let shapeSvg = "";
    let typeTargetX = cx + headW * 0.42;
    let typeTargetY = dimTopY + headH * 0.5;
    let thTargetY = yTipEnd - shankLen * 0.35;

    const f2 = function (n) {
      return Number(n.toFixed(2));
    };

    const drawCurvedThreads = function (yStart, yEnd) {
      if (!thread) return "";
      const yMin = Math.min(yStart, yEnd);
      const yMax = Math.max(yStart, yEnd);
      if (yMax - yMin < 2) return "";
      const dip = Math.max(1.4, Math.min(3.2, shankW * 0.08));
      const slope = Math.max(0.8, Math.min(2.2, threadStep * 0.3));
      const x1 = f2(xL + 0.7);
      const x2 = f2(xR - 0.7);
      const parts = [];
      for (let y = yMin; y <= yMax - 1; y += threadStep) {
        const ya = f2(y);
        const yb = f2(y + slope);
        const yCtrl = f2((ya + yb) * 0.5 + dip);
        const dMain = "M " + x1 + " " + ya + " Q " + cx + " " + yCtrl + " " + x2 + " " + yb;
        const dSub = "M " + x1 + " " + f2(ya + 1.1) + " Q " + cx + " " + f2(yCtrl + 1.1) + " " + x2 + " " + f2(yb + 1.1);
        parts.push(
          '<path d="' + dMain + '" fill="none" stroke="' + c3 + '" stroke-width="1.6" stroke-linecap="round" opacity="0.8" />' +
          '<path d="' + dSub + '" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.45" />'
        );
      }
      return parts.join("");
    };

    const shankHighlight = function (y1, y2) {
      if (y2 - y1 < 6) return "";
      const hxLine = f2(xL + Math.max(1.8, shankW * 0.22));
      const sw = Math.max(0.9, Math.min(1.8, shankW * 0.06));
      return '<line x1="' + hxLine + '" y1="' + f2(y1) + '" x2="' + hxLine + '" y2="' + f2(y2) + '" stroke="#FFFFFF" stroke-width="' + f2(sw) + '" stroke-linecap="round" opacity="0.5" />';
    };

    const tipShadow = function (yBottom) {
      return '<ellipse cx="' + cx + '" cy="' + f2(yBottom + 4.5) + '" rx="' + f2(Math.max(5, halfW * 0.9)) + '" ry="3" fill="#0F172A" opacity="0.12" />';
    };

    const getThreadSpanFromTip = function (yBaseTop, yBaseEnd) {
      if (!thread) return null;
      const avail = Math.max(0, yBaseEnd - yBaseTop);
      if (thread === "FULL THD") return { y1: yBaseTop + 2, y2: yBaseEnd - 1 };
      if (thread === "QTR THD") return { y1: yBaseEnd - avail * 0.25, y2: yBaseEnd - 1 };
      return { y1: yBaseEnd - avail * 0.5, y2: yBaseEnd - 1 };
    };

    if (type === "ALLEN") {
      dimTopY = 58 + yOffset;
      const allenH = Math.max(10, Math.min(dNum * sc * 0.95, 58));
      const allenW = Math.min(110, Math.max(shankW + 6, dNum * 1.5 * sc));
      const aL = cx - allenW / 2;
      const aR = cx + allenW / 2;
      const yHeadTop = dimTopY;
      const yHeadBot = yHeadTop + allenH;
      yShankTop = yHeadBot;
      yTipEnd = yShankTop + shankLen;
      yTip = yTipEnd - chamfer;

      const span = getThreadSpanFromTip(yShankTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.65);
      typeTargetX = aR;
      typeTargetY = (yHeadTop + yHeadBot) * 0.5;

      const sockW = Math.max(6, shankW * 0.55);
      const sockD = Math.min(allenH * 0.58, Math.max(5, allenH * 0.48));
      const knurlInset = Math.max(2.5, allenW * 0.09);

      shapeSvg =
        tipShadow(yTipEnd) +
        '<path d="M ' + f2(xL) + ' ' + f2(yHeadBot) + ' H ' + f2(xR) + ' V ' + f2(yTip) + ' L ' + f2(xR - chamfer) + ' ' + f2(yTipEnd) + ' H ' + f2(xL + chamfer) + ' L ' + f2(xL) + ' ' + f2(yTip) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        shankHighlight(yHeadBot + 3, yTip - 3) +
        (span ? drawCurvedThreads(span.y1, span.y2) : "") +
        '<rect x="' + f2(aL) + '" y="' + f2(yHeadTop) + '" width="' + f2(allenW) + '" height="' + f2(allenH) + '" rx="2.5" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1.1" />' +
        '<line x1="' + f2(aL + knurlInset) + '" y1="' + f2(yHeadTop + 3) + '" x2="' + f2(aL + knurlInset) + '" y2="' + f2(yHeadBot - 3) + '" stroke="' + c3 + '" stroke-width="0.9" opacity="0.7" />' +
        '<line x1="' + f2(aR - knurlInset) + '" y1="' + f2(yHeadTop + 3) + '" x2="' + f2(aR - knurlInset) + '" y2="' + f2(yHeadBot - 3) + '" stroke="' + c3 + '" stroke-width="0.9" opacity="0.7" />' +
        '<path d="M ' + f2(cx - sockW / 2) + ' ' + f2(yHeadTop) + ' v ' + f2(sockD) + ' l ' + f2(sockW / 2) + ' ' + f2(Math.max(2, sockD * 0.25)) + ' l ' + f2(sockW / 2) + ' ' + f2(-Math.max(2, sockD * 0.25)) + ' v ' + f2(-sockD) + '" fill="' + c3 + '" stroke="' + cs + '" stroke-width="0.9" stroke-dasharray="3 2" opacity="0.45" />';
    } else if (type === "ANCHOR") {
      dimTopY = 58 + yOffset;
      const hookR = Math.max(12, Math.min(24, halfW + 10));
      const hookTailX = Math.min(cx + hookR + Math.max(14, shankW * 0.7), 220);
      const yBendCy = dimTopY + halfW + hookR;
      yShankTop = yBendCy;
      yTipEnd = dimTopY + headH + shankLen;
      if (yTipEnd < yShankTop + 26) yTipEnd = yShankTop + 26;
      yTip = yTipEnd - chamfer;

      const span = getThreadSpanFromTip(yShankTop + 4, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + (yTip - yShankTop) * 0.65);
      typeTargetX = hookTailX;
      typeTargetY = dimTopY + halfW;

      const hookCenterY = dimTopY + halfW;
      const hookPath = "M " + f2(hookTailX) + " " + f2(hookCenterY) + " H " + f2(cx + hookR) + " Q " + cx + " " + f2(hookCenterY) + " " + cx + " " + f2(yBendCy) + " V " + f2(yTip);

      shapeSvg =
        tipShadow(yTipEnd) +
        '<path d="' + hookPath + '" fill="none" stroke="' + cs + '" stroke-width="' + f2(shankW + 2) + '" stroke-linecap="butt" stroke-linejoin="round" />' +
        '<path d="' + hookPath + '" fill="none" stroke="url(#' + gHeadV + ')" stroke-width="' + f2(shankW) + '" stroke-linecap="butt" stroke-linejoin="round" />' +
        '<path d="M ' + f2(xL) + ' ' + f2(yBendCy) + ' H ' + f2(xR) + ' V ' + f2(yTip) + ' L ' + f2(xR - chamfer) + ' ' + f2(yTipEnd) + ' H ' + f2(xL + chamfer) + ' L ' + f2(xL) + ' ' + f2(yTip) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        '<line x1="' + f2(hookTailX) + '" y1="' + f2(dimTopY) + '" x2="' + f2(hookTailX) + '" y2="' + f2(dimTopY + shankW) + '" stroke="' + cs + '" stroke-width="1.1" />' +
        shankHighlight(yBendCy + 2, yTip - 3) +
        (span ? drawCurvedThreads(span.y1, span.y2) : "");
    } else if (type === "STUD") {
      dimTopY = 58 + yOffset;
      const yStudTopStart = dimTopY;
      const yStudTop = yStudTopStart + chamfer;
      yShankTop = yStudTopStart;
      yTipEnd = yStudTopStart + shankLen;
      yTip = yTipEnd - chamfer;

      let studThreads = "";
      if (thread === "FULL THD") {
        studThreads = drawCurvedThreads(yStudTop + 1, yTip - 1);
        thTargetY = (yStudTop + yTip) * 0.5;
      } else if (thread === "QTR THD") {
        const endSpan = Math.max(8, (yTip - yStudTop) * 0.16);
        studThreads =
          drawCurvedThreads(yStudTop + 1, yStudTop + endSpan) +
          drawCurvedThreads(yTip - endSpan, yTip - 1);
        thTargetY = yTip - endSpan * 0.5;
      } else if (thread) {
        const endSpan = Math.max(10, (yTip - yStudTop) * 0.25);
        studThreads =
          drawCurvedThreads(yStudTop + 1, yStudTop + endSpan) +
          drawCurvedThreads(yTip - endSpan, yTip - 1);
        thTargetY = yTip - endSpan * 0.5;
      }

      typeTargetX = xR;
      typeTargetY = yStudTopStart + Math.min(18, shankLen * 0.2);

      shapeSvg =
        tipShadow(yTipEnd) +
        '<path d="M ' + f2(xL + chamfer) + ' ' + f2(yStudTopStart) + ' H ' + f2(xR - chamfer) + ' L ' + f2(xR) + ' ' + f2(yStudTop) + ' V ' + f2(yTip) + ' L ' + f2(xR - chamfer) + ' ' + f2(yTipEnd) + ' H ' + f2(xL + chamfer) + ' L ' + f2(xL) + ' ' + f2(yTip) + ' V ' + f2(yStudTop) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        shankHighlight(yStudTop + 3, yTip - 3) +
        studThreads;
    } else if (type === "WEDGE ANCHOR") {
      dimTopY = 58 + yOffset;
      const yTop = dimTopY + chamfer;
      yShankTop = dimTopY;
      yTipEnd = dimTopY + shankLen;
      const clipH = Math.max(8, Math.min(32, shankLen * 0.24));
      const yClipBot = yTipEnd - Math.max(3, Math.min(chamfer + 1, shankLen * 0.14));
      const yClipTop = yClipBot - clipH;
      const nutH = Math.max(6, Math.min(20, headH * 1.1, shankLen * 0.25));
      const washH = Math.max(2, Math.min(6, nutH * 0.3));
      const minGap = Math.max(2, Math.min(6, shankLen * 0.08));
      const maxNutTop = yClipTop - nutH - washH - minGap;
      const yNutTop = Math.max(dimTopY + Math.min(chamfer + 1, shankLen * 0.12), Math.min(maxNutTop, dimTopY + Math.max(6, shankLen * 0.14)));
      const yNutBot = yNutTop + nutH;
      const yWashTop = yNutBot;

      const nutW = Math.min(110, Math.max(shankW + 10, headW));
      const washW = Math.min(114, nutW + 8);
      const clipW = Math.min(nutW, shankW + Math.max(4, shankW * 0.25));

      let topThreadEnd = yWashTop + washH + (yClipTop - (yWashTop + washH)) * 0.5;
      if (thread === "FULL THD") topThreadEnd = yClipTop - 2;
      else if (thread === "QTR THD") topThreadEnd = yWashTop + washH + (yClipTop - (yWashTop + washH)) * 0.25;

      typeTargetX = cx + clipW / 2;
      typeTargetY = (yClipTop + yClipBot) * 0.5;
      thTargetY = (yTop + topThreadEnd) * 0.5;

      shapeSvg =
        tipShadow(yTipEnd) +
        '<path d="M ' + f2(xL + chamfer) + ' ' + f2(dimTopY) + ' H ' + f2(xR - chamfer) + ' L ' + f2(xR) + ' ' + f2(yTop) + ' V ' + f2(yClipBot) + ' L ' + f2(xR + 2.5) + ' ' + f2(yTipEnd) + ' H ' + f2(xL - 2.5) + ' L ' + f2(xL) + ' ' + f2(yClipBot) + ' V ' + f2(yTop) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        shankHighlight(yTop + 3, yClipTop - 3) +
        (thread ? drawCurvedThreads(yTop + 2, topThreadEnd) : "") +
        '<rect x="' + f2(cx - nutW / 2) + '" y="' + f2(yNutTop) + '" width="' + f2(nutW) + '" height="' + f2(nutH) + '" rx="1.5" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1" />' +
        '<line x1="' + f2(cx - nutW / 4) + '" y1="' + f2(yNutTop) + '" x2="' + f2(cx - nutW / 4) + '" y2="' + f2(yNutBot) + '" stroke="' + cs + '" stroke-width="0.9" />' +
        '<line x1="' + f2(cx + nutW / 4) + '" y1="' + f2(yNutTop) + '" x2="' + f2(cx + nutW / 4) + '" y2="' + f2(yNutBot) + '" stroke="' + cs + '" stroke-width="0.9" />' +
        '<rect x="' + f2(cx - washW / 2) + '" y="' + f2(yWashTop) + '" width="' + f2(washW) + '" height="' + f2(washH) + '" rx="1" fill="url(#' + gWash + ')" stroke="' + cs + '" stroke-width="0.9" />' +
        '<rect x="' + f2(cx - clipW / 2) + '" y="' + f2(yClipTop) + '" width="' + f2(clipW) + '" height="' + f2(clipH) + '" rx="1.5" fill="url(#' + gHeadL + ')" stroke="' + cs + '" stroke-width="1" />' +
        '<line x1="' + f2(cx - clipW * 0.25) + '" y1="' + f2(yClipTop + 3) + '" x2="' + f2(cx - clipW * 0.25) + '" y2="' + f2(yClipBot - 3) + '" stroke="' + cs + '" stroke-width="0.9" />' +
        '<line x1="' + f2(cx + clipW * 0.25) + '" y1="' + f2(yClipTop + 3) + '" x2="' + f2(cx + clipW * 0.25) + '" y2="' + f2(yClipBot - 3) + '" stroke="' + cs + '" stroke-width="0.9" />';
    } else {
      /* HEX or No Type chosen yet */
      dimTopY = 58 + yOffset;
      const washH = Math.max(2, Math.min(4, headH * 0.14));
      const yHeadTop = dimTopY;
      const yHeadMainBot = yHeadTop + Math.max(6, headH - washH);
      const yHeadBot = yHeadTop + headH;
      yShankTop = yHeadBot;
      yTipEnd = yShankTop + shankLen;
      yTip = yTipEnd - chamfer;

      const span = getThreadSpanFromTip(yShankTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.65);

      const hL = cx - headW / 2;
      const hR = cx + headW / 2;
      const fW = headW / 4;
      const hRound = Math.max(2, Math.min(4.5, headH * 0.16));
      const washW = Math.min(114, headW * 0.94);

      typeTargetX = hR;
      typeTargetY = (yHeadTop + yHeadMainBot) * 0.5;

      shapeSvg =
        tipShadow(yTipEnd) +
        '<path d="M ' + f2(xL) + ' ' + f2(yHeadBot) + ' H ' + f2(xR) + ' V ' + f2(yTip) + ' L ' + f2(xR - chamfer) + ' ' + f2(yTipEnd) + ' H ' + f2(xL + chamfer) + ' L ' + f2(xL) + ' ' + f2(yTip) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        shankHighlight(yHeadBot + 3, yTip - 3) +
        (span ? drawCurvedThreads(span.y1, span.y2) : "") +
        '<path d="M ' + f2(hL) + ' ' + f2(yHeadMainBot) + ' V ' + f2(yHeadTop + hRound) + ' Q ' + f2(hL) + ' ' + f2(yHeadTop) + ' ' + f2(hL + fW) + ' ' + f2(yHeadTop) + ' V ' + f2(yHeadMainBot) + ' Z" fill="url(#' + gHeadL + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        '<path d="M ' + f2(hL + fW) + ' ' + f2(yHeadMainBot) + ' V ' + f2(yHeadTop) + ' Q ' + f2(cx) + ' ' + f2(yHeadTop - hRound * 0.65) + ' ' + f2(hR - fW) + ' ' + f2(yHeadTop) + ' V ' + f2(yHeadMainBot) + ' Z" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        '<path d="M ' + f2(hR - fW) + ' ' + f2(yHeadMainBot) + ' V ' + f2(yHeadTop) + ' Q ' + f2(hR) + ' ' + f2(yHeadTop) + ' ' + f2(hR) + ' ' + f2(yHeadTop + hRound) + ' V ' + f2(yHeadMainBot) + ' Z" fill="url(#' + gHeadR + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        '<rect x="' + f2(cx - washW / 2) + '" y="' + f2(yHeadMainBot) + '" width="' + f2(washW) + '" height="' + f2(washH) + '" rx="1" fill="url(#' + gWash + ')" stroke="' + cs + '" stroke-width="0.9" />';
    }

    /* Head view (right side, scaled radius min 14 .. max 30) */
    const hx = 304;
    const hvRadius = Math.max(14, Math.min(30, 14 + ((dNum - 4) / (42 - 4)) * 16));
    const hy = Math.round(202 + hvRadius + yOffset);
    const hvLabelY = hy - hvRadius - 12;

    const gradeTextClean = grade ? (grade.charAt(0) === "G" ? grade.slice(1) : grade) : "";
    const isDarkGradeBg = material === "HT";
    const gradeTextColor = isDarkGradeBg ? "#F8FAFC" : cs;

    let headShapeSvg = "";
    if (!type || type === "HEX") {
      headShapeSvg =
        '<polygon points="' + hexPoints(hx, hy, hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" stroke-linejoin="round" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 0.72) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.55" />';
    } else if (type === "ALLEN") {
      const allenR = f2(hvRadius * 0.92);
      const sockR = f2(Math.max(5.5, hvRadius * 0.42));
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + allenR + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(allenR * 0.8) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.5" />' +
        '<polygon points="' + hexPoints(hx, hy, sockR) + '" fill="url(#' + gSock + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />';
    } else {
      const rodR = f2(hvRadius * 0.78);
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + rodR + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(rodR * 0.74) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.55" />';
    }

    let headGradeSvg = "";
    if (gradeTextClean) {
      const gFs = gradeTextClean.length > 4 ? Math.max(7.5, Math.min(10, hvRadius * 0.42)) : Math.max(8.5, Math.min(11.5, hvRadius * 0.5));
      const gColor = (type === "ALLEN") ? "#FFFFFF" : gradeTextColor;
      headGradeSvg =
        '<text x="' + hx + '" y="' + f2(hy + gFs * 0.34) + '" text-anchor="middle" font-size="' + f2(gFs) + '" font-weight="800" fill="' + gColor + '">' +
          esc(gradeTextClean) +
        "</text>";
    }

    const headViewSvg =
      '<g class="head-view-animate">' +
        '<text x="' + hx + '" y="' + f2(hvLabelY) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">Head view</text>' +
        headShapeSvg +
        headGradeSvg +
      "</g>";

    /* Dimension & Pointer Labels (non-overlapping fixed columns) */
    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";

    const xLenArrow = 104;
    const xLeftText = 98;
    const yLenMid = Math.round((dimTopY + yTipEnd) / 2);

    const availShank = Math.max(12, yTip - yShankTop);
    let yDia = yShankTop + Math.min(34, Math.max(9, availShank * 0.3));
    if (Math.abs(yDia - yLenMid) < 18 && yShankTop + 10 <= yLenMid - 18) {
      yDia = yLenMid - 18;
    }

    const diaLabel = diameter ? ("Diameter: " + diameter) : "Diameter: ?";
    const diaColor = diameter ? reqColor : missingColor;
    const diaSvg =
      '<line x1="' + (xLeftText + 4) + '" y1="' + f2(yDia) + '" x2="' + f2(xR) + '" y2="' + f2(yDia) + '" stroke="' + diaColor + '" stroke-width="1" />' +
      '<polygon points="' + f2(xL) + "," + f2(yDia) + " " + f2(xL - 5) + "," + f2(yDia - 3) + " " + f2(xL - 5) + "," + f2(yDia + 3) + '" fill="' + diaColor + '" />' +
      '<polygon points="' + f2(xR) + "," + f2(yDia) + " " + f2(xR + 5) + "," + f2(yDia - 3) + " " + f2(xR + 5) + "," + f2(yDia + 3) + '" fill="' + diaColor + '" />' +
      '<text x="' + xLeftText + '" y="' + f2(yDia - 3) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + diaColor + '">' + esc(diaLabel) + "</text>";

    const lenLabel = length ? ("Length: " + length + " mm") : "Length: ?";
    const lenColor = length ? reqColor : missingColor;
    let yLenText = yLenMid + 4;
    if (Math.abs(yLenText - (yDia - 3)) < 16) {
      yLenText = yDia + 15;
    }
    const lenSvg =
      '<line x1="' + xLenArrow + '" y1="' + f2(dimTopY) + '" x2="' + f2(xL - 4) + '" y2="' + f2(dimTopY) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
      '<line x1="' + xLenArrow + '" y1="' + f2(yTipEnd) + '" x2="' + f2(xL - 4) + '" y2="' + f2(yTipEnd) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
      '<line x1="' + xLenArrow + '" y1="' + f2(dimTopY + 3) + '" x2="' + xLenArrow + '" y2="' + f2(yTipEnd - 3) + '" stroke="' + lenColor + '" stroke-width="1" />' +
      '<polygon points="' + xLenArrow + "," + f2(dimTopY) + " " + (xLenArrow - 3) + "," + f2(dimTopY + 6) + " " + (xLenArrow + 3) + "," + f2(dimTopY + 6) + '" fill="' + lenColor + '" />' +
      '<polygon points="' + xLenArrow + "," + f2(yTipEnd) + " " + (xLenArrow - 3) + "," + f2(yTipEnd - 6) + " " + (xLenArrow + 3) + "," + f2(yTipEnd - 6) + '" fill="' + lenColor + '" />' +
      '<text x="' + xLeftText + '" y="' + f2(yLenText) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + lenColor + '">' + esc(lenLabel) + "</text>";

    let pitchSvg = "";
    if (pitch) {
      const yPitchTarget = Math.min(yTip - 3, yShankTop + availShank * 0.72);
      const yPitchLabel = Math.max(yLenText + 16, yDia + 18, yPitchTarget + 4);
      const yPitchLine = yPitchLabel - 4;
      pitchSvg =
        '<polyline points="' + (xLeftText + 4) + "," + f2(yPitchLine) + " " + (xLeftText + 10) + "," + f2(yPitchLine) + " " + f2(xL - 1) + "," + f2(yPitchTarget) + '" fill="none" stroke="' + optColor + '" stroke-width="1" />' +
        '<circle cx="' + f2(xL - 1) + '" cy="' + f2(yPitchTarget) + '" r="2" fill="' + optColor + '" />' +
        '<text x="' + xLeftText + '" y="' + f2(yPitchLabel) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + optColor + '">Pitch: ' + esc(pitch) + "</text>";
    }

    /* Fixed right-side label column (x = 236) */
    const xLabelCol = 236;
    const rightPointer = function (yLabel, yTarget, xTarget, labelText, color) {
      const fontSize = labelText.length > 15 ? "11" : "11.5";
      return (
        '<polyline points="' + f2(xTarget) + "," + f2(yTarget) + " " + (xLabelCol - 10) + "," + f2(yLabel) + " " + (xLabelCol - 4) + "," + f2(yLabel) + '" fill="none" stroke="' + color + '" stroke-width="1" />' +
        '<circle cx="' + f2(xTarget) + '" cy="' + f2(yTarget) + '" r="2" fill="' + color + '" />' +
        '<text x="' + xLabelCol + '" y="' + f2(yLabel + 4) + '" text-anchor="start" font-size="' + fontSize + '" font-weight="700" fill="' + color + '">' + esc(labelText) + "</text>"
      );
    };

    const typeLabel = type ? ("Type: " + type) : "Type: ?";
    const typeSvg = rightPointer(66 + yOffset, typeTargetY, typeTargetX, typeLabel, type ? reqColor : missingColor);

    let materialSvg = "";
    if (material) {
      const yMat = 94 + yOffset;
      const matText = "Material: " + material;
      const matFs = matText.length > 14 ? "11" : "11.5";
      const matTargetX = (type === "ANCHOR") ? cx + halfW : xR;
      const matTargetY = Math.min(yTip - 6, yShankTop + 12);
      materialSvg =
        '<polyline points="' + f2(matTargetX) + "," + f2(matTargetY) + " " + (xLabelCol - 10) + "," + yMat + " " + (xLabelCol - 4) + "," + yMat + '" fill="none" stroke="' + optColor + '" stroke-width="1" />' +
        '<circle cx="' + f2(matTargetX) + '" cy="' + f2(matTargetY) + '" r="2" fill="' + optColor + '" />' +
        '<circle cx="' + (xLabelCol + 4) + '" cy="' + yMat + '" r="5" fill="' + c2 + '" stroke="' + cs + '" stroke-width="1" />' +
        '<text x="' + (xLabelCol + 13) + '" y="' + (yMat + 4) + '" text-anchor="start" font-size="' + matFs + '" font-weight="700" fill="' + optColor + '">' + esc(matText) + "</text>";
    }

    let gradeSvg = "";
    let threadSvg = "";
    if (type === "WEDGE ANCHOR") {
      if (thread) {
        threadSvg = rightPointer(122 + yOffset, thTargetY, xR, "Thread: " + thread, optColor);
      }
      const gradeLabel = grade ? ("Grade: " + grade) : "Grade: ?";
      gradeSvg = rightPointer(150 + yOffset, Math.min(yTip - 4, yShankTop + shankLen * 0.52), xR, gradeLabel, grade ? reqColor : missingColor);
    } else {
      const gradeLabel = grade ? ("Grade: " + grade) : "Grade: ?";
      const gradeTargetY = Math.min(yTip - 6, yShankTop + Math.max(10, shankLen * 0.25));
      gradeSvg = rightPointer(122 + yOffset, gradeTargetY, xR, gradeLabel, grade ? reqColor : missingColor);
      if (thread) {
        threadSvg = rightPointer(150 + yOffset, thTargetY, xR, "Thread: " + thread, optColor);
      }
    }

    /* Scale bar at bottom (10, 20, 50, 100 or 200 mm -> 30..100 px) */
    const scaleCandidates = [10, 20, 50, 100, 200];
    let scaleMm = 20;
    let bestDist = Infinity;
    let foundInRange = false;
    scaleCandidates.forEach(function (cand) {
      const px = cand * sc;
      if (px >= 30 && px <= 100) {
        foundInRange = true;
        const dist = Math.abs(px - 55);
        if (dist < bestDist) {
          bestDist = dist;
          scaleMm = cand;
        }
      }
    });
    if (!foundInRange) {
      scaleMm = (10 * sc > 100) ? 10 : 200;
    }
    const scalePx = Math.max(12, Math.min(140, scaleMm * sc));
    const yScale = Math.max(yTipEnd + 22, hy + hvRadius + 24);
    const xScale1 = f2(cx - scalePx / 2);
    const xScale2 = f2(cx + scalePx / 2);
    const scaleBarSvg =
      '<g class="bolt-scale-bar">' +
        '<line x1="' + xScale1 + '" y1="' + f2(yScale) + '" x2="' + xScale2 + '" y2="' + f2(yScale) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<line x1="' + xScale1 + '" y1="' + f2(yScale - 4) + '" x2="' + xScale1 + '" y2="' + f2(yScale + 4) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<line x1="' + xScale2 + '" y1="' + f2(yScale - 4) + '" x2="' + xScale2 + '" y2="' + f2(yScale + 4) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<text x="' + cx + '" y="' + f2(yScale + 14) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">' + scaleMm + " mm</text>" +
      "</g>";

    /* Bottom: For machine (only if filled, wraps cleanly below scale bar) */
    let machineSvg = "";
    let machineHeight = 0;
    if (machine) {
      const machineLines = wrapLines("For machine: " + machine, 40);
      machineHeight = machineLines.length * 16 + 8;
      machineSvg = machineLines.map(function (line, i) {
        const y = yScale + 34 + i * 16;
        return (
          '<text x="190" y="' + f2(y) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#0F3B33">' +
            esc(line) +
          "</text>"
        );
      }).join("");
    }

    const totalHeight = Math.round(yScale + 26 + machineHeight);

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Bolt technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          shapeSvg +
        "</g>" +
        headViewSvg +
        diaSvg +
        lenSvg +
        pitchSvg +
        typeSvg +
        materialSvg +
        gradeSvg +
        threadSvg +
        scaleBarSvg +
        machineSvg +
      "</svg>"
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
